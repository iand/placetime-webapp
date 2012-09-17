package main

import (
	"log"
	"time"
)

type Item struct {
	Timestamp time.Time `json:"ts"`
	Pid       string    `json:"pid"`
	Label     string    `json:"label"`
	Text      string    `json:"text"`
}

type ItemGroup struct {
	Label string `json:"label"`
	Items []Item `json:"items"`
}

func NewItem(pid string, d string, text string) Item {

	t, err := time.Parse("_2 Jan 2006", d)
	if err != nil {
		log.Printf("Failed to parse date %s. Got error %s.\n", d, err.Error())
	}

	label := t.Format("Mon _2")

	return Item{
		Pid:       pid,
		Label:     label,
		Text:      text,
		Timestamp: t,
	}
}

func NewItemTs(pid string, t time.Time, text string) Item {

	label := t.Format("Mon _2")

	return Item{
		Pid:       pid,
		Label:     label,
		Text:      text,
		Timestamp: t,
	}
}

func NewItemGroup(label string) ItemGroup {

	return ItemGroup{
		Label: label,
		Items: make([]Item, 0),
	}
}

func (i Item) Date() string {
	return i.Timestamp.Format("Mon Jan 2 2006")
}
