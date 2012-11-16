package main

import (
	"time"
)

type TimelineRange struct {
	Pid    string    `json:"pid"`
	PName  string    `json:"pname,omitempty"`
	Tstart time.Time `json:"tstart"`
	Tend   time.Time `json:"tend"`
	Items  []*Item   `json:"items"`
}

type Item struct {
	Id    string    `json:"id"`
	Ts    time.Time `json:"ts"`
	Ets   time.Time `json:"ets"`
	Pid   string    `json:"pid"`
	PName string    `json:"pname,omitempty"`
	Text  string    `json:"text"`
	Link  string    `json:"link"`
	Media string    `json:"media"`
}

type FormattedItem struct {
	Id    string    `json:"id"`
	Ts    time.Time `json:"ts"`
	Ets   time.Time `json:"ets"`
	Pid   string    `json:"pid"`
	PName string    `json:"pname,omitempty"`
	Text  string    `json:"text"`
	Link  string    `json:"link"`
	Media string    `json:"media"`
	Date  string    `json:"date"`
	Time  string    `json:"time"`
}
