package main

import (
	"code.google.com/p/tcgl/redis"
	"fmt"
	"time"
)

const (
	FEED_DRIVEN_PROFILES = "feeddrivenprofiles"
	ITEM_ID              = "itemid"
)

type Store interface {
	ResetAll() error

	TimelineRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error)
	ItemsRange(pid string, tstart time.Time, tend time.Time, status int, limit int) (*TimelineRange, error)

	// Adds an item to a timeline
	Add(item Item) (Item, error)
	Profile(pid string) (*Profile, error)
	SetProfile(p *Profile) error

	// Deletes a profile
	Delete(pid string) error

	// Deletes the items in a profile
	DeleteItems(pid string) error

	Follow(user string, pid string) error
	Unfollow(user string, pid string) error

	IsFollowing(user string, pid string) (bool, error)

	FeedDrivenProfiles() ([]string, error)
	Followers(pid string) ([]string, error)

	Item(itemid int64) (Item, error)

	AddToItems(pid string, item Item, status int) error
	RemoveFromItems(pid string, item Item, status int) error
	CopyToItems(pid string, itemid int64) error
	Promote(pid string, itemid int64, currentstatus int) error
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

func itemsKey(pid string, status int) string {
	return fmt.Sprintf("%s:items:%d", pid, status)
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

func (s *RedisStore) ItemsRange(pid string, tstart time.Time, tend time.Time, status int, limit int) (*TimelineRange, error) {
	return s.FetchRange(itemsKey(pid, status), pid, tstart, tend, limit)
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
		item, _ := UnpackItem(val)

		timestamp := item.Timestamp

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
		tl.Groups[currentGroupIndex].Items = append(tl.Groups[currentGroupIndex].Items, item)
	}

	return &tl, nil
}

func (s *RedisStore) Add(item Item) (Item, error) {
	rs := s.db.Command("INCR", ITEM_ID)
	if !rs.IsOK() {
		return item, rs.Error()
	}

	val, _ := rs.ValueAsInt()

	item.Id = int64(val)

	rs = s.db.Command("SET", fmt.Sprintf("item:%d", item.Id), item.Packed())
	if !rs.IsOK() {
		return item, rs.Error()
	}

	s.AddToItems(item.Pid, item, 0)

	return item, nil

}

func (s *RedisStore) AddToItems(pid string, item Item, status int) error {
	rs := s.db.Command("ZADD", itemsKey(pid, status), itemScore(item.Timestamp), item.Packed())
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}

func (es *RedisStore) ResetAll() error {
	rs := es.db.Command("FLUSHDB")
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

	rs = es.db.Command("DEL", itemsKey(pid, 0))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("DEL", itemsKey(pid, 1))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = es.db.Command("DEL", itemsKey(pid, 2))
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

func (es *RedisStore) DeleteItems(pid string) error {
	rs := es.db.Command("DEL", itemsKey(pid, 0))
	if !rs.IsOK() {
		return rs.Error()
	}
	rs = es.db.Command("DEL", itemsKey(pid, 1))
	if !rs.IsOK() {
		return rs.Error()
	}
	rs = es.db.Command("DEL", itemsKey(pid, 2))
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}

func (es *RedisStore) Profile(pid string) (*Profile, error) {
	rs := es.db.Command("HMGET", profileKey(pid), "name", "bio", "feed")
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	vals := rs.ValuesAsStrings()
	p := Profile{
		Pid:  pid,
		Name: vals[0],
		Bio:  vals[1],
		Feed: vals[2],
	}

	tl, err := es.ItemsRange(pid, time.Now(), time.Now().AddDate(1000, 0, 0), 1, 5)
	if err != nil {
		return nil, err
	}

	p.Timeline = tl

	return &p, nil
}

func (s *RedisStore) FeedDrivenProfiles() ([]string, error) {
	rs := s.db.Command("SMEMBERS", FEED_DRIVEN_PROFILES)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	return rs.ValuesAsStrings(), nil
}

func (es *RedisStore) SetProfile(p *Profile) error {
	rs := es.db.Command("HMSET", profileKey(p.Pid), "name", p.Name, "bio", p.Bio, "feed", p.Feed)
	if !rs.IsOK() {
		return rs.Error()
	}

	if len(p.Feed) > 0 {
		_ = es.db.Command("SADD", FEED_DRIVEN_PROFILES, p.Pid)

	} else {
		_ = es.db.Command("SREM", FEED_DRIVEN_PROFILES, p.Pid)
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
	itemsKey := itemsKey(pid, 0)

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

	rs = es.db.Command("ZRANGEBYSCORE", itemsKey(pid, 0), "-Inf", "+Inf")
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

func (s *RedisStore) IsFollowing(user string, pid string) (bool, error) {
	rs := s.db.Command("SISMEMBER", followingKey(user), pid)
	if !rs.IsOK() {
		return false, rs.Error()
	}

	return rs.ValueAsBool()
}

func (s *RedisStore) Followers(pid string) ([]string, error) {
	rs := s.db.Command("SMEMBERS", followersKey(pid))
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	return rs.ValuesAsStrings(), nil
}

func (s *RedisStore) Item(itemid int64) (Item, error) {
	rs := s.db.Command("GET", fmt.Sprintf("item:%d", itemid))
	if !rs.IsOK() {
		return Item{}, rs.Error()
	}

	val := rs.ValueAsString()
	return UnpackItem(val)
}

func (s *RedisStore) CopyToItems(pid string, itemid int64) error {
	item, _ := s.Item(itemid)
	s.AddToItems(pid, item, 0)

	return nil
}

func (s *RedisStore) Promote(pid string, itemid int64, status int) error {
	item, _ := s.Item(itemid)
	s.RemoveFromItems(pid, item, status)
	s.AddToItems(pid, item, status+1)

	return nil
}

func (s *RedisStore) RemoveFromItems(pid string, item Item, status int) error {
	rs := s.db.Command("ZREM", itemsKey(pid, status), item.Packed())
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}
