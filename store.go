package main

import (
	"code.google.com/p/tcgl/redis"
	"fmt"
	// "log"
	"strconv"
	"strings"

	"time"
)

type Store interface {
	TimelineRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error)
	ItemsRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error)

	// // Returns the specified version of an entity (-1 means latest, -2 means one before latest)
	// GetVersion(id string, version int) (entity *EntityVersion, exists bool)

	// Adds an item to a timeline
	Add(item Item) error
	Profile(pid string) (*Profile, error)
	SetProfile(p *Profile) error

	// // Overwrites a version of an entity
	// StoreVersion(entity *EntityVersion, version int) error

	// // Copies the previous version of an entity to make it the current version, preserving both
	// Revert(id string) error

	// // Copies the specified version of an entity to make it the current version, preserving both
	// RevertVersion(id string, version int) error

	// Deletes all versions of an entity
	Delete(pid string) error

	Follow(user string, pid string) error
	Unfollow(user string, pid string) error

	IsFollowing(user string, pid string) (bool, error)
}

func NewRedisStore() Store {
	db := redis.Connect(redis.Configuration{Database: 0})

	return &RedisStore{
		db: db,
	}
}

type RedisStore struct {
	db *redis.Database
}

func timelineKey(pid string) string {
	return fmt.Sprintf("%s:timeline", pid)
}

func itemScore(t time.Time) float64 {
	return float64(t.Unix())
}

func profileKey(pid string) string {
	return fmt.Sprintf("%s:info", pid)
}

func itemsKey(pid string) string {
	return fmt.Sprintf("%s:items", pid)
}

func followingKey(pid string) string {
	return fmt.Sprintf("%s:following", pid)
}

func followersKey(pid string) string {
	return fmt.Sprintf("%s:followers", pid)
}

func (s *RedisStore) TimelineRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {
	return s.FetchRange(timelineKey(pid), pid, tstart, tend, limit)
}

func (s *RedisStore) ItemsRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {
	return s.FetchRange(itemsKey(pid), pid, tstart, tend, limit)
}

func (s *RedisStore) FetchRange(key string, pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {
	scoreStart := itemScore(tstart)
	scoreEnd := itemScore(tend)
	rs := s.db.Command("ZRANGEBYSCORE", key, scoreStart, scoreEnd, "LIMIT", 0, limit)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	tl := TimelineRange{
		Pid:    pid,
		Tstart: tstart,
		Tend:   tend,
		Groups: make([]ItemGroup, 0),
	}

	vals := rs.ValuesAsStrings()

	currentGroup, currentGroupIndex := "", -1

	for i := len(vals) - 1; i >= 0; i-- {

		val := vals[i]
		parts := strings.SplitN(val, "\t", 3)
		if unixtime, err := strconv.ParseInt(parts[0], 10, 64); err == nil {
			timestamp := time.Unix(unixtime, 0)
			if i == len(vals)-1 {
				tl.Tstart = timestamp
			}
			if i == 0 {
				tl.Tend = timestamp
			}

			group := timestamp.Format("Jan 2006")
			if currentGroup != group {
				// start a new group
				tl.Groups = append(tl.Groups, NewItemGroup(group))
				currentGroup = group
				currentGroupIndex = len(tl.Groups) - 1
			}
			tl.Groups[currentGroupIndex].Items = append(tl.Groups[currentGroupIndex].Items, NewItemTs(parts[1], timestamp, parts[2]))
		}
	}

	return &tl, nil
}

func (s *RedisStore) Add(item Item) error {
	rs := s.db.Command("ZADD", itemsKey(item.Pid), itemScore(item.Timestamp), fmt.Sprintf("%d\t%s\t%s", item.Timestamp.Unix(), item.Pid, item.Text))
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}

func (es *RedisStore) Delete(pid string) error {
	rs := es.db.Command("DEL", timelineKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("DEL", itemsKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("DEL", profileKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("SMEMBERS", followingKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	vals := rs.ValuesAsStrings()
	for _, val := range vals {
		rs := es.db.Command("SREM", followersKey(val), pid)
		if !rs.IsOK() {
			return rs.Error()
		}
	}

	rs = es.db.Command("DEL", followingKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (es *RedisStore) Profile(pid string) (*Profile, error) {
	rs := es.db.Command("HMGET", profileKey(pid), "name", "bio")
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	vals := rs.ValuesAsStrings()
	p := Profile{
		Pid:  pid,
		Name: vals[0],
		Bio:  vals[1],
	}

	tl, err := es.ItemsRange(pid, time.Now(), time.Now().AddDate(1000, 0, 0), 5)
	if err != nil {
		return nil, err
	}

	p.Timeline = tl

	return &p, nil
}

func (es *RedisStore) SetProfile(p *Profile) error {
	rs := es.db.Command("HMSET", profileKey(p.Pid), "name", p.Name, "bio", p.Bio)
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (es *RedisStore) Follow(user string, pid string) error {

	rs := es.db.Command("SADD", followingKey(user), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("SADD", followersKey(pid), user)
	if !rs.IsOK() {
		return rs.Error()
	}

	timelineKey := timelineKey(user)
	itemsKey := itemsKey(pid)

	rs = es.db.Command("ZUNIONSTORE", timelineKey, 2, timelineKey, itemsKey, "WEIGHTS", 1.0, 1.0, "AGGREGATE", "MAX")
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (es *RedisStore) Unfollow(user string, pid string) error {

	rs := es.db.Command("SREM", followingKey(user), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("SREM", followersKey(pid), user)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("ZRANGEBYSCORE", itemsKey(pid), "-Inf", "+Inf")
	if !rs.IsOK() {
		return rs.Error()
	}

	timelineKey := timelineKey(user)
	items := rs.ValuesAsStrings()
	for _, item := range items {
		es.db.Command("ZREM", timelineKey, item)
	}
	return nil
}

func (es *RedisStore) IsFollowing(user string, pid string) (bool, error) {
	rs := es.db.Command("SISMEMBER", followingKey(user), pid)
	if !rs.IsOK() {
		return false, rs.Error()
	}

	return rs.ValueAsBool()
}
