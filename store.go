package main

import (
	"code.google.com/p/tcgl/redis"
	"encoding/json"
	"fmt"
	"log"
	"time"
)

const (
	FEED_DRIVEN_PROFILES = "feeddrivenprofiles"
	ITEM_ID              = "itemid"
)

func NewRedisStore() *RedisStore {
	db := redis.Connect(redis.Configuration{Database: 0})

	return &RedisStore{
		db: db,
	}
}

type RedisStore struct {
	db *redis.Database
}

func itemScore(t time.Time) float64 {
	return float64(t.Unix())
}

func profileKey(pid string) string {
	return fmt.Sprintf("%s:info", pid)
}

func possiblyKey(pid string, ordering string) string {
	return fmt.Sprintf("%s:possibly:%s", pid, ordering)
}

func maybeKey(pid string, ordering string) string {
	return fmt.Sprintf("%s:maybe:%s", pid, ordering)
}

func followingKey(pid string) string {
	return fmt.Sprintf("%s:following", pid)
}

func followersKey(pid string) string {
	return fmt.Sprintf("%s:followers", pid)
}

func itemSeqKey(pid string) string {
	return fmt.Sprintf("%s:itemseq", pid)
}

func itemKey(pid string, seq int) string {
	return fmt.Sprintf("item:%s:%d", pid, seq)
}

// DEFUNCT
func timelineKey(pid string) string {
	return fmt.Sprintf("%s:timeline", pid)
}

// DEFUNCT
func itemsKey(pid string, status int) string {
	return fmt.Sprintf("%s:items:%d", pid, status)
}

func (s *RedisStore) SuggestedProfiles(loc string) ([]*Profile, error) {
	return nil, nil
}

func (s *RedisStore) AddSuggestedProfile(pid string, loc string) error {
	return nil
}

func (s *RedisStore) RemoveSuggestedProfile(pid string, loc string) error {
	return nil
}

func (s *RedisStore) Profile(pid string) (*Profile, error) {
	rs := s.db.Command("HMGET", profileKey(pid), "name", "bio", "feedurl")
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	vals := rs.ValuesAsStrings()
	p := Profile{
		Pid:     pid,
		Name:    vals[0],
		Bio:     vals[1],
		FeedUrl: vals[2],
	}

	rs = s.db.Command("ZCARD", possiblyKey(pid, "ts"))
	if rs.IsOK() {
		p.PossiblyCount, _ = rs.ValueAsInt()
	}

	rs = s.db.Command("ZCARD", maybeKey(pid, "ts"))
	if rs.IsOK() {
		p.MaybeCount, _ = rs.ValueAsInt()
	}

	rs = s.db.Command("ZCARD", followingKey(pid))
	if rs.IsOK() {
		p.FollowingCount, _ = rs.ValueAsInt()
	}

	rs = s.db.Command("ZCARD", followersKey(pid))
	if rs.IsOK() {
		p.FollowerCount, _ = rs.ValueAsInt()
	}

	return &p, nil
}

func (s *RedisStore) AddProfile(pid string, pname string, bio string, feedurl string) error {
	rs := s.db.Command("HMSET", profileKey(pid), "name", pname, "bio", bio, "feedurl", feedurl)
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (s *RedisStore) RemoveProfile(pid string) error {
	rs := s.db.Command("DEL", possiblyKey(pid, "ts"))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("DEL", possiblyKey(pid, "ets"))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("DEL", maybeKey(pid, "ts"))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("DEL", maybeKey(pid, "ets"))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("DEL", profileKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("SMEMBERS", followingKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	vals := rs.ValuesAsStrings()
	for _, val := range vals {
		rs = s.db.Command("SREM", followersKey(val), pid)
		if !rs.IsOK() {
			return rs.Error()
		}
	}

	rs = s.db.Command("DEL", followingKey(pid))
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (s *RedisStore) Timeline(pid string, status string, ordering string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {

	scoreStart := itemScore(tstart)
	scoreEnd := itemScore(tend)

	var key string
	if status == "p" {
		key = possiblyKey(pid, ordering)
	} else {
		key = maybeKey(pid, ordering)
	}

	rs := s.db.Command("ZRANGEBYSCORE", key, scoreStart, scoreEnd, "LIMIT", 0, limit)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	vals := rs.ValuesAsStrings()

	itemids := make([]interface{}, len(vals))
	for index, val := range vals {
		itemids[index] = val
	}

	tl := TimelineRange{
		Pid:    pid,
		Tstart: tstart,
		Tend:   tend,
		Items:  make([]*Item, 0),
	}

	if len(itemids) > 0 {
		rs = s.db.Command("MGET", itemids...)
		if !rs.IsOK() {
			return nil, rs.Error()
		}

		item_infos := rs.ValuesAsStrings()
		for _, item_info := range item_infos {
			item := &Item{}

			_ = json.Unmarshal([]byte(item_info), item)
			tl.Items = append(tl.Items, item)
		}
	}
	return &tl, nil
}

func (s *RedisStore) Item(id string) (*Item, error) {

	rs := s.db.Command("GET", id)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	item := &Item{}
	_ = json.Unmarshal([]byte(rs.Value()), item)

	return item, nil
}

func (s *RedisStore) AddItem(pid string, etstext string, text string, link string) (string, error) {

	ets, err := time.Parse("_2 Jan 2006", etstext)
	if err != nil {
		log.Printf("Failed to parse date %s. Got error %s.\n", etstext, err.Error())
	}

	ts := time.Now()

	rs := s.db.Command("INCR", itemSeqKey(pid))
	if !rs.IsOK() {
		return "", rs.Error()
	}

	seq, _ := rs.ValueAsInt()

	itemid := itemKey(pid, seq)

	item := &Item{

		Id:   itemid,
		Text: text,
		Link: link,
		Pid:  pid,
		Ts:   ts,
		Ets:  ets,
	}

	json, err := json.Marshal(item)
	if err != nil {
		return itemid, err
	}

	rs = s.db.Command("SET", itemid, json)
	if !rs.IsOK() {
		return "", rs.Error()
	}

	rs = s.db.Command("ZADD", maybeKey(pid, "ts"), itemScore(ts), itemid)
	if !rs.IsOK() {
		return itemid, rs.Error()
	}

	rs = s.db.Command("ZADD", maybeKey(pid, "ets"), itemScore(ets), itemid)
	if !rs.IsOK() {
		return itemid, rs.Error()
	}

	rs = s.db.Command("SMEMBERS", followersKey(pid))
	if !rs.IsOK() {
		return itemid, rs.Error()
	}

	for _, followerpid := range rs.ValuesAsStrings() {
		rs = s.db.Command("ZADD", possiblyKey(followerpid, "ts"), itemScore(ts), itemid)
		if !rs.IsOK() {
			return itemid, rs.Error()
		}

		rs = s.db.Command("ZADD", possiblyKey(followerpid, "ets"), itemScore(ets), itemid)
		if !rs.IsOK() {
			return itemid, rs.Error()
		}
	}

	return itemid, nil
}

// func (s *RedisStore) TimelineRange(pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {
// 	return s.FetchRange(timelineKey(pid), pid, tstart, tend, limit)
// }

// func (s *RedisStore) ItemsRange(pid string, tstart time.Time, tend time.Time, status int, limit int) (*TimelineRange, error) {
// 	return s.FetchRange(itemsKey(pid, status), pid, tstart, tend, limit)
// }

// func (s *RedisStore) FetchRange(key string, pid string, tstart time.Time, tend time.Time, limit int) (*TimelineRange, error) {
// 	scoreStart := itemScore(tstart)
// 	scoreEnd := itemScore(tend)
// 	rs := s.db.Command("ZRANGEBYSCORE", key, scoreStart, scoreEnd, "LIMIT", 0, limit)
// 	if !rs.IsOK() {
// 		return nil, rs.Error()
// 	}

// 	tl := TimelineRange{
// 		Pid:    pid,
// 		Tstart: tstart,
// 		Tend:   tend,
// 		Groups: make([]ItemGroup, 0),
// 	}

// 	vals := rs.ValuesAsStrings()

// 	currentGroup, currentGroupIndex := "", -1

// 	for i := len(vals) - 1; i >= 0; i-- {

// 		val := vals[i]
// 		item, _ := UnpackItem(val)

// 		timestamp := item.Timestamp

// 		if i == len(vals)-1 {
// 			tl.Tstart = timestamp
// 		}
// 		if i == 0 {
// 			tl.Tend = timestamp
// 		}

// 		group := timestamp.Format("Jan 2006")
// 		if currentGroup != group {
// 			// start a new group
// 			tl.Groups = append(tl.Groups, NewItemGroup(group))
// 			currentGroup = group
// 			currentGroupIndex = len(tl.Groups) - 1
// 		}
// 		tl.Groups[currentGroupIndex].Items = append(tl.Groups[currentGroupIndex].Items, item)
// 	}

// 	return &tl, nil
// }

// func (s *RedisStore) Add(item Item) (Item, error) {
// 	rs := s.db.Command("INCR", ITEM_ID)
// 	if !rs.IsOK() {
// 		return item, rs.Error()
// 	}

// 	val, _ := rs.ValueAsInt()

// 	item.Id = int64(val)

// 	rs = s.db.Command("SET", fmt.Sprintf("item:%d", item.Id), item.Packed())
// 	if !rs.IsOK() {
// 		return item, rs.Error()
// 	}

// 	s.AddToItems(item.Pid, item, 0)

// 	return item, nil

// }

// func (s *RedisStore) AddToItems(pid string, item Item, status int) error {
// 	rs := s.db.Command("ZADD", itemsKey(pid, status), itemScore(item.Timestamp), item.Packed())
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}
// 	return nil
// }

func (es *RedisStore) ResetAll() error {
	rs := es.db.Command("FLUSHDB")
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}

// func (es *RedisStore) DeleteItems(pid string) error {
// 	rs := es.db.Command("DEL", itemsKey(pid, 0))
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}
// 	rs = es.db.Command("DEL", itemsKey(pid, 1))
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}
// 	rs = es.db.Command("DEL", itemsKey(pid, 2))
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}
// 	return nil
// }

// func (s *RedisStore) FeedDrivenProfiles() ([]string, error) {
// 	rs := s.db.Command("SMEMBERS", FEED_DRIVEN_PROFILES)
// 	if !rs.IsOK() {
// 		return nil, rs.Error()
// 	}

// 	return rs.ValuesAsStrings(), nil
// }

// func (es *RedisStore) SetProfile(p *Profile) error {
// 	rs := es.db.Command("HMSET", profileKey(p.Pid), "name", p.Name, "bio", p.Bio, "feed", p.Feed)
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}

// 	if len(p.Feed) > 0 {
// 		_ = es.db.Command("SADD", FEED_DRIVEN_PROFILES, p.Pid)

// 	} else {
// 		_ = es.db.Command("SREM", FEED_DRIVEN_PROFILES, p.Pid)
// 	}

// 	return nil
// }

func (s *RedisStore) Follow(pid string, followpid string) error {

	rs := s.db.Command("SADD", followingKey(pid), followpid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("SADD", followersKey(followpid), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	poss_ts := possiblyKey(pid, "ts")
	maybe_ts := maybeKey(followpid, "ts")

	rs = s.db.Command("ZUNIONSTORE", poss_ts, 2, poss_ts, maybe_ts, "WEIGHTS", 1.0, 1.0, "AGGREGATE", "MAX")
	if !rs.IsOK() {
		return rs.Error()
	}

	poss_ets := possiblyKey(pid, "ets")
	maybe_ets := maybeKey(followpid, "ets")

	rs = s.db.Command("ZUNIONSTORE", poss_ets, 2, poss_ets, maybe_ets, "WEIGHTS", 1.0, 1.0, "AGGREGATE", "MAX")
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (s *RedisStore) Unfollow(pid string, followpid string) error {

	rs := s.db.Command("SREM", followingKey(pid), followpid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("SREM", followersKey(followpid), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	// TODO
	// rs = es.db.Command("ZRANGEBYSCORE", itemsKey(pid, 0), "-Inf", "+Inf")
	// if !rs.IsOK() {
	// 	return rs.Error()
	// }

	// timelineKey := timelineKey(user)
	// items := rs.ValuesAsStrings()
	// for _, item := range items {
	// 	es.db.Command("ZREM", timelineKey, item)
	// }
	return nil
}

// func (s *RedisStore) IsFollowing(user string, pid string) (bool, error) {
// 	rs := s.db.Command("SISMEMBER", followingKey(user), pid)
// 	if !rs.IsOK() {
// 		return false, rs.Error()
// 	}

// 	return rs.ValueAsBool()
// }

// func (s *RedisStore) Followers(pid string) ([]string, error) {
// 	rs := s.db.Command("SMEMBERS", followersKey(pid))
// 	if !rs.IsOK() {
// 		return nil, rs.Error()
// 	}

// 	return rs.ValuesAsStrings(), nil
// }

// func (s *RedisStore) Item(itemid int64) (Item, error) {
// 	rs := s.db.Command("GET", fmt.Sprintf("item:%d", itemid))
// 	if !rs.IsOK() {
// 		return Item{}, rs.Error()
// 	}

// 	val := rs.ValueAsString()
// 	return UnpackItem(val)
// }

// func (s *RedisStore) CopyToItems(pid string, itemid int64) error {
// 	item, _ := s.Item(itemid)
// 	s.AddToItems(pid, item, 0)

// 	return nil
// }

// func (s *RedisStore) Promote(pid string, itemid int64, status int) error {
// 	item, _ := s.Item(itemid)
// 	s.RemoveFromItems(pid, item, status)
// 	s.AddToItems(pid, item, status+1)

// 	return nil
// }

// func (s *RedisStore) RemoveFromItems(pid string, item Item, status int) error {
// 	rs := s.db.Command("ZREM", itemsKey(pid, status), item.Packed())
// 	if !rs.IsOK() {
// 		return rs.Error()
// 	}
// 	return nil
// }
