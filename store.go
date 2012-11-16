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
	MaxInt               = int(^uint(0) >> 1)
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

func followerScore(t time.Time) float64 {
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

func suggestedProfileKey(loc string) string {
	return fmt.Sprintf("suggestedprofiles:%s", loc)
}

func (s *RedisStore) SuggestedProfiles(loc string) ([]*Profile, error) {
	rs := s.db.Command("SMEMBERS", suggestedProfileKey(loc))
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	profiles := make([]*Profile, 0)

	vals := rs.ValuesAsStrings()

	for _, pid := range vals {
		profile, err := s.Profile(pid)
		if err != nil {
			// TODO: log
		} else {

		}
		profiles = append(profiles, profile)
	}

	return profiles, nil
}

func (s *RedisStore) AddSuggestedProfile(pid string, loc string) error {
	rs := s.db.Command("SADD", suggestedProfileKey(loc), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (s *RedisStore) RemoveSuggestedProfile(pid string, loc string) error {
	rs := s.db.Command("SREM", suggestedProfileKey(loc), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

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

	rs = s.db.Command("ZRANGE", followingKey(pid), 0, MaxInt)
	if !rs.IsOK() {
		return rs.Error()
	}

	vals := rs.ValuesAsStrings()
	for _, val := range vals {
		rs = s.db.Command("ZREM", followersKey(val), pid)
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

func (s *RedisStore) Timeline(pid string, status string, ordering string, tstart time.Time, tend time.Time, limit int) ([]*FormattedItem, error) {

	scoreStart := itemScore(tstart)
	scoreEnd := itemScore(tend)

	var key string
	if status == "p" {
		key = possiblyKey(pid, ordering)
	} else {
		key = maybeKey(pid, ordering)
	}

	rs := s.db.Command("ZREVRANGEBYSCORE", key, scoreEnd, scoreStart, "LIMIT", 0, limit)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	vals := rs.ValuesAsStrings()

	itemids := make([]interface{}, len(vals))
	for index, val := range vals {
		itemids[index] = val
	}

	items := make([]*FormattedItem, 0)

	if len(itemids) > 0 {
		rs = s.db.Command("MGET", itemids...)
		if !rs.IsOK() {
			return nil, rs.Error()
		}

		item_infos := rs.ValuesAsStrings()
		for _, item_info := range item_infos {
			item := &FormattedItem{}

			_ = json.Unmarshal([]byte(item_info), item)

			if ordering == "ets" {
				item.Date = item.Ets.Format("Jan 2006")
				item.Time = item.Ets.Format("Mon _2 15:04")
			} else {
				item.Date = item.Ts.Format("Jan 2006")
				item.Time = item.Ts.Format("Mon _2 15:04")
			}

			items = append(items, item)
		}
	}
	return items, nil
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

	rs = s.db.Command("ZRANGE", followersKey(pid), 0, MaxInt)
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

func (es *RedisStore) ResetAll() error {
	rs := es.db.Command("FLUSHDB")
	if !rs.IsOK() {
		return rs.Error()
	}
	return nil
}

func (s *RedisStore) Follow(pid string, followpid string) error {
	score := followerScore(time.Now())

	rs := s.db.Command("ZADD", followingKey(pid), score, followpid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("ZADD", followersKey(followpid), score, pid)
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

	rs := s.db.Command("ZREM", followingKey(pid), followpid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("ZREM", followersKey(followpid), pid)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("ZRANGE", maybeKey(followpid, "ts"), 0, MaxInt)
	if !rs.IsOK() {
		return rs.Error()
	}

	poss_ts := possiblyKey(pid, "ts")
	poss_ets := possiblyKey(pid, "ets")
	items := rs.ValuesAsStrings()
	for _, item := range items {
		s.db.Command("ZREM", poss_ts, item)
		s.db.Command("ZREM", poss_ets, item)
	}

	return nil
}

func (s *RedisStore) Promote(pid string, id string) error {

	// TODO: abort if item is not in possibly timeline
	poss_ts := possiblyKey(pid, "ts")

	rs := s.db.Command("ZSCORE", poss_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	score_ts, _ := rs.Value().Float64()

	poss_ets := possiblyKey(pid, "ets")
	rs = s.db.Command("ZSCORE", poss_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	score_ets, _ := rs.Value().Float64()

	s.db.Command("ZREM", poss_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	s.db.Command("ZREM", poss_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	maybe_ts := maybeKey(pid, "ts")
	maybe_ets := maybeKey(pid, "ets")

	rs = s.db.Command("ZADD", maybe_ts, score_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("ZADD", maybe_ets, score_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	return nil
}

func (s *RedisStore) Demote(pid string, id string) error {

	// TODO: abort if item is not in possibly timeline
	maybe_ts := maybeKey(pid, "ts")

	rs := s.db.Command("ZSCORE", maybe_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	score_ts, _ := rs.Value().Float64()

	maybe_ets := maybeKey(pid, "ets")
	rs = s.db.Command("ZSCORE", maybe_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	score_ets, _ := rs.Value().Float64()

	s.db.Command("ZREM", maybe_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	s.db.Command("ZREM", maybe_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	// TODO: don't add them here if they were manually added by the user

	poss_ts := possiblyKey(pid, "ts")
	poss_ets := possiblyKey(pid, "ets")

	rs = s.db.Command("ZADD", poss_ts, score_ts, id)
	if !rs.IsOK() {
		return rs.Error()
	}

	rs = s.db.Command("ZADD", poss_ets, score_ets, id)
	if !rs.IsOK() {
		return rs.Error()
	}

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

func (s *RedisStore) Followers(pid string, count int, start int) ([]*Profile, error) {
	rs := s.db.Command("ZRANGE", followersKey(pid), start, start+count)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	profiles := make([]*Profile, 0)

	vals := rs.ValuesAsStrings()

	for _, pid := range vals {
		profile, err := s.Profile(pid)
		if err != nil {
			// TODO: log
		} else {

		}
		profiles = append(profiles, profile)
	}

	return profiles, nil

}

func (s *RedisStore) Following(pid string, count int, start int) ([]*Profile, error) {
	rs := s.db.Command("ZRANGE", followingKey(pid), start, start+count)
	if !rs.IsOK() {
		return nil, rs.Error()
	}

	profiles := make([]*Profile, 0)

	vals := rs.ValuesAsStrings()

	for _, pid := range vals {
		profile, err := s.Profile(pid)
		if err != nil {
			// TODO: log
		} else {

		}
		profiles = append(profiles, profile)
	}

	return profiles, nil

}
