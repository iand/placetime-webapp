package main

type Profile struct {
	Pid string
	Name string
	Bio string
	Timeline *TimelineRange
	IsFollowing bool
}