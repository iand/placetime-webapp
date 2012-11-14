package main

import (
	"time"
)

type Profile struct {
	Pid            string    `json:"pid"`
	Name           string    `json:"pname,omitempty"`
	Bio            string    `json:"bio,omitempty"`
	Joined         time.Time `json:"joined"`
	PossiblyCount  int       `json:"pcount"`
	MaybeCount     int       `json:"mcount"`
	FollowerCount  int       `json:"followercount"`
	FollowingCount int       `json:"followingcount"`
	FeedUrl        string    `json:"feedurl,omitempty"`
}
