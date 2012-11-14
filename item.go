package main

import (
	// "fmt"
	// "log"
	// "strconv"
	// "strings"
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

// type ItemGroup struct {
// 	Label string `json:"label"`
// 	Items []Item `json:"items"`
// }

// func NewItem(pid string, d string, text string, link string) Item {

// 	t, err := time.Parse("_2 Jan 2006", d)
// 	if err != nil {
// 		log.Printf("Failed to parse date %s. Got error %s.\n", d, err.Error())
// 	}

// 	label := t.Format("Mon _2")

// 	return Item{
// 		Pid:       pid,
// 		Label:     label,
// 		Text:      text,
// 		Timestamp: t,
// 	}
// }

// func NewItemTs(pid string, t time.Time, text string, link string) Item {

// 	label := t.Format("Mon _2")

// 	return Item{
// 		Pid:       pid,
// 		Label:     label,
// 		Text:      text,
// 		Timestamp: t,
// 	}
// }

// func NewItemGroup(label string) ItemGroup {

// 	return ItemGroup{
// 		Label: label,
// 		Items: make([]Item, 0),
// 	}
// }

// func (i Item) Date() string {
// 	return i.Timestamp.Format("Mon Jan 2 2006")
// }

// func (i Item) Packed() string {
// 	return fmt.Sprintf("%d\t%d\t%s\t%s\t%s", i.Id, i.Timestamp.Unix(), i.Pid, i.Text, i.Link)
// }

// func UnpackItem(val string) (Item, error) {
// 	parts := strings.SplitN(val, "\t", 5)

// 	unixtime, _ := strconv.ParseInt(parts[1], 10, 64)
// 	timestamp := time.Unix(unixtime, 0)

// 	item := NewItemTs(parts[2], timestamp, parts[3], parts[4])
// 	item.Id, _ = strconv.ParseInt(parts[0], 10, 64)

// 	return item, nil
// }
