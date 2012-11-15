package main

import (
	"code.google.com/p/gorilla/mux"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"path"
	"strconv"
	"time"
)

const (
	assetsDir = "./assets"
)

var (
// templates = template.Must(template.ParseFiles("templates/timeline.html", "templates/profile.html"))
)

func main() {
	r := mux.NewRouter()

	r.PathPrefix("/policies").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/instant").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/interval").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/geopoint").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/technical").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/uridocs").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/changes.html").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/2003").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")
	r.PathPrefix("/2008").HandlerFunc(vocabRedirectHandler).Methods("GET", "HEAD")

	r.HandleFunc("/", vocabRedirectHandler).Methods("GET", "HEAD")

	r.HandleFunc("/timeline", timelineHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-init", initHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-admin", adminHandler).Methods("GET", "HEAD")
	//	r.HandleFunc("/-refresh", refreshHandler).Methods("GET", "HEAD")
	//	r.HandleFunc("/-follow", followHandler).Methods("POST")

	r.HandleFunc("/-jsp", jsonSuggestedProfilesHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jpr", jsonProfileHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jit", jsonItemHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jtl", jsonTimelineHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jsp", jsonSuggestedProfilesHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jfollowers", jsonFollowersHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jfollowing", jsonFollowingHandler).Methods("GET", "HEAD")
	//	r.HandleFunc("/{pid:[0-9a-zA-Z]+}", profileHandler).Methods("GET", "HEAD")

	r.HandleFunc("/-tfollow", followHandler).Methods("POST")
	r.HandleFunc("/-tunfollow", unfollowHandler).Methods("POST")
	r.HandleFunc("/-tadd", addHandler).Methods("POST")
	r.HandleFunc("/-tpromote", promoteHandler).Methods("POST")
	r.HandleFunc("/-tdemote", demoteHandler).Methods("POST")
	r.HandleFunc("/-taddsuggest", addSuggestHandler).Methods("POST")
	r.HandleFunc("/-tremsuggest", remSuggestHandler).Methods("POST")

	r.PathPrefix("/-assets/").HandlerFunc(assetsHandler).Methods("GET", "HEAD")

	fmt.Print("Listening on 0.0.0.0:8081\n")
	http.Handle("/", r)
	http.ListenAndServe("0.0.0.0:8081", nil)
}

func assetsHandler(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path[9:]
	p = path.Join(assetsDir, p)
	http.ServeFile(w, r, p)
	// w.Write([]byte(p))
}

func timelineHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("templates/timeline.html"))

	err := templates.ExecuteTemplate(w, "timeline.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// func timelineFilterHandler(w http.ResponseWriter, r *http.Request) {
// 	vars := mux.Vars(r)

// 	f := vars["filter"]
// 	status, err := strconv.ParseInt(f, 10, 8)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	templates := template.Must(template.ParseFiles("templates/timeline_filter.html"))

// 	s := NewRedisStore()
// 	tl, err := s.ItemsRange("iand", time.Now(), time.Now().AddDate(1000, 0, 0), int(status), 5)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	err = templates.ExecuteTemplate(w, "timeline_filter.html", tl)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// }

func jsonTimelineHandler(w http.ResponseWriter, r *http.Request) {

	pidParam := r.FormValue("pid")
	statusParam := r.FormValue("status")

	if statusParam != "m" {
		statusParam = "p"
	}

	orderingParam := r.FormValue("ordering")
	if orderingParam != "ets" {
		orderingParam = "ts"
	}

	countParam := r.FormValue("count")
	count, err := strconv.ParseInt(countParam, 10, 0)
	if err != nil {
		count = 5
	}

	var tsStart, tsEnd time.Time

	ts := time.Now()

	if count < 0 {
		tsStart = ts.AddDate(-1000, 0, 0)
		tsEnd = ts.Add(-time.Second)
		count = -count
	} else {
		tsStart = ts.AddDate(-1000, 0, 0)
		tsEnd = ts.AddDate(1000, 0, 0)
	}

	s := NewRedisStore()
	tl, err := s.Timeline(pidParam, statusParam, orderingParam, tsStart, tsEnd, int(count))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(tl, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)
}

func jsonItemHandler(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")

	s := NewRedisStore()

	item, err := s.Item(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(item, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonSuggestedProfilesHandler(w http.ResponseWriter, r *http.Request) {
	loc := r.FormValue("loc")

	s := NewRedisStore()

	plist, err := s.SuggestedProfiles(loc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonFollowersHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")

	countParam := r.FormValue("count")
	count, err := strconv.ParseInt(countParam, 10, 0)
	if err != nil {
		count = 10
	}

	startParam := r.FormValue("start")
	start, err := strconv.ParseInt(startParam, 10, 0)
	if err != nil {
		start = 0
	}

	s := NewRedisStore()

	plist, err := s.Followers(pid, int(count), int(start))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonFollowingHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")

	countParam := r.FormValue("count")
	count, err := strconv.ParseInt(countParam, 10, 0)
	if err != nil {
		count = 10
	}

	startParam := r.FormValue("start")
	start, err := strconv.ParseInt(startParam, 10, 0)
	if err != nil {
		start = 0
	}

	s := NewRedisStore()

	plist, err := s.Following(pid, int(count), int(start))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonProfileHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")

	s := NewRedisStore()

	profile, err := s.Profile(pid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.MarshalIndent(profile, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func followHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	followpid := r.FormValue("followpid")
	s := NewRedisStore()
	s.Follow(pid, followpid)
	fmt.Fprint(w, "ACK")
}

func unfollowHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	followpid := r.FormValue("followpid")
	s := NewRedisStore()
	s.Unfollow(pid, followpid)
	fmt.Fprint(w, "ACK")
}

// func refreshHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprint(w, "ACK\n")

// 	s := NewRedisStore()
// 	profiles, _ := s.FeedDrivenProfiles()
// 	for _, pid := range profiles {
// 		fmt.Fprint(w, "\nChecking ", pid, " ")
// 		p, err := s.Profile(pid)
// 		if err != nil {
// 			fmt.Fprint(w, "no profile matches that pid")
// 			continue
// 		}

// 		fmt.Fprint(w, p.Feed, "\n")

// 		resp, err := http.Get(p.Feed)
// 		if err != nil {
// 			fmt.Fprint(w, " got http error ", err.Error())
// 			continue
// 		}
// 		defer resp.Body.Close()

// 		feed, err := NewFeed(resp.Body)
// 		if err != nil {
// 			fmt.Fprint(w, " got feed parse error ", err.Error())
// 			continue
// 		}

// 		followers, err := s.Followers(pid)
// 		if err != nil {
// 			fmt.Fprint(w, " could not get followers ", err.Error())
// 			continue
// 		}

// 		for _, fpid := range followers {
// 			s.Unfollow(fpid, pid)
// 		}

// 		s.DeleteItems(pid)
// 		for _, item := range feed.Items {
// 			fmt.Fprint(w, "\n item: ", item.Title, " (", item.Link, ") - ", item.When, " - ", item.Id)
// 			s.AddItem(pid, "22 Jul 2012", item.Title, item.Link))
// 		}

// 		for _, fpid := range followers {
// 			s.Follow(fpid, pid)
// 		}

// 	}

// }

func initHandler(w http.ResponseWriter, r *http.Request) {
	s := NewRedisStore()
	s.ResetAll()

	s.AddProfile("ukfestivals", "UK Festivals", "Every musical festival in the UK.", "")
	s.AddItem("ukfestivals", "22 Jul 2012", "Isle of Wight Festival, Isle of Wight, Newport", "http://www.last.fm/festival/3162276+Isle+of+Wight+Festival")
	s.AddItem("ukfestivals", "24 Aug 2012", "Leeds Festival 2012, Bramham Park, Leeds", "http://www.last.fm/festival/2048182+Leeds+Festival+2012")
	s.AddItem("ukfestivals", "24 Aug 2012", "Reading Festival 2012, Little John's Farm, Reading", "http://www.last.fm/festival/2043239+Reading+Festival+2012")
	s.AddItem("ukfestivals", "27 Jul 2012", "Steelhouse Festival, Hafod-Y-Dafal Farm, Ebbw Vale", "http://www.last.fm/festival/3271130+Steelhouse+Festival")
	s.AddItem("ukfestivals", "17 Aug 2012", "Beautiful Days 2012, Escot Park, Nr Exeter Devon", "http://www.last.fm/festival/3218182+Beautiful+Days+2012")
	s.AddItem("ukfestivals", "27 Jul 2012", "Kendal Calling 2012, lowther deer park, Penrith, Cumbria", "http://www.last.fm/festival/3210406+Kendal+Calling+2012")
	s.AddItem("ukfestivals", "14 Jul 2012", "Summer Breeze Festival 2012, Liddington Warren Farm, Swindon", "http://www.last.fm/festival/3294945+Summer+Breeze+Festival+2012")
	s.AddItem("ukfestivals", "6 Sep 2012", "Bestival 2012, Robin Hill, Isle of Wight", "http://www.last.fm/festival/2067992+Bestival+2012")
	s.AddItem("ukfestivals", "24 Aug 2012", "Solfest 2012, Tarnside Farm, Tarns, Cumbria", "http://www.last.fm/festival/3236642+Solfest+2012")
	s.AddItem("ukfestivals", "19 Jul 2012", "The Secret Garden Party 2012, Abbots Ripton, Huntingdon", "http://www.last.fm/festival/3186405+The+Secret+Garden+Party+2012")
	s.AddItem("ukfestivals", "31 Aug 2012", "Merthyr Rock 2012, Cyfartha Park, Merthyr Tydfil", "http://www.last.fm/festival/3302416+Merthyr+Rock+2012")
	s.AddItem("ukfestivals", "1 Aug 2012", "Meltdown Festival 2012, Southbank Centre, London", "http://www.last.fm/festival/3284883+Meltdown+Festival+2012")
	s.AddItem("ukfestivals", "21 Aug 2012", "Tennent's Vital 2012, Boucher Playing Fields, Belfast", "http://www.last.fm/festival/3237701+Tennent%27s+Vital+2012")
	s.AddItem("ukfestivals", "3 Nov 2012", "Damnation Festival 2012, Leeds University Union, Leeds", "http://www.last.fm/festival/3242700+Damnation+Festival+2012")
	s.AddItem("ukfestivals", "3 Aug 2012", "Standon Calling, Standon Lordship, Standon", "http://www.last.fm/festival/3217298+Standon+Calling")
	s.AddItem("ukfestivals", "17 Aug 2012", "Summer Sundae 2012, De Montfort Hall, Leicester", "http://www.last.fm/festival/3210772+Summer+Sundae+2012")
	s.AddItem("ukfestivals", "24 Aug 2012", "Forest of Galtres Festival 2012, Crayke, York", "http://www.last.fm/festival/3314111+Forest+of+Galtres+Festival+2012")
	s.AddItem("ukfestivals", "3 Aug 2012", "Stockton Weekender, Riverside, Stockton-on-Tees", "http://www.last.fm/festival/3228328+Stockton+Weekender")
	s.AddItem("ukfestivals", "20 Jul 2012", "Wickerman, East Kirkcarswell, Dundrennan", "http://www.last.fm/festival/3317866+Wickerman")

	// s.Delete("testdata")
	// s.SetProfile(&Profile{Pid: "testdata", Name: "Test Data", Bio: "Loads of future events."})
	// date := time.Now()
	// for i := 0; i < 2000; i++ {
	// 	date = date.Add(79 * time.Hour)
	// 	s.AddItem("testdata", date.Format("02 Jan 2006"), fmt.Sprintf("Test data, item number %d", i), fmt.Sprintf("http://example.com/%d", i)))
	// }

	s.AddProfile("iand", "Ian", "Timefloes.", "")
	s.AddSuggestedProfile("iand", "london")

	s.Follow("iand", "nasa")

	s.AddProfile("nasa", "Nasa Missions", "Upcoming NASA mission information.", "")

	s.AddItem("nasa", "26 Aug 2012", "Dawn - Leaves asteroid Vesta, heads for asteroid 1 Ceres", "")
	s.AddItem("nasa", "1 Sep 2012", "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury", "")
	s.AddItem("nasa", "1 Mar 2013", "LADEE - Launch of NASA Orbiter to the Moon", "")
	s.AddItem("nasa", "1 Nov 2013", "MAVEN - Launch of Mars Orbiter", "")
	s.AddItem("nasa", "1 May 2014", "Rosetta - ESA mission reaches Comet Churyumov-Gerasimenko", "")
	s.AddItem("nasa", "1 Nov 2014", "Philae - ESA Rosetta Lander touches down on Comet Churyumov-Gerasimenko", "")
	s.AddItem("nasa", "1 Jan 2014", "Mars Sample Return Mission - Launch of NASA sample return mission to Mars", "")
	s.AddItem("nasa", "1 Feb 2015", "Dawn - Goes into orbit around asteroid 1 Ceres", "")
	s.AddItem("nasa", "14 Jul 2015", "New Horizons - NASA mission reaches Pluto and Charon", "")
	s.AddItem("nasa", "1 Jan 2015", "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury", "")
	s.AddItem("nasa", "5 Apr 2231", "Pluto - is passed by Neptune in distance from the Sun for the next 20 years", "")

	// s.SetProfile(&Profile{Pid: "o2shepherdsbushempire ", Name: "O2 Shepherd's Bush Empire Events", Bio: "", Feed: "http://www.o2shepherdsbushempire.co.uk/RSS"})
	// s.SetProfile(&Profile{Pid: "skiddlewc2", Name: "Skiddle WC2", Bio: "What's On in London and area", Feed: "http://www.skiddle.com/rss/events.php?c=WC2"})

	// s.Delete("iand")
	// s.SetProfile(&Profile{Pid: "iand", Name: "Ian", Bio: "Time flows..."})

	// s.Follow("iand", "o2shepherdsbushempire")
	// s.Follow("iand", "skiddlewc2")
	// s.Follow("iand", "ukfestivals")
	// s.Follow("iand", "nasa")
	// // s.Follow("iand", "testdata")

	// refreshHandler(w, r)

	// s.CopyToItems("iand", 20)
	// s.CopyToItems("iand", 25)
	// s.CopyToItems("iand", 27)
	// s.CopyToItems("iand", 29)
	// s.CopyToItems("iand", 31)
	// s.CopyToItems("iand", 32)
	// s.CopyToItems("iand", 33)
	// s.CopyToItems("iand", 40)
	// s.CopyToItems("iand", 41)
	// s.CopyToItems("iand", 43)

	// s.Promote("iand", 25, 0)
	// s.Promote("iand", 32, 0)
	// s.Promote("iand", 27, 0)
	// s.Promote("iand", 27, 1)

	// var tl TimelineRange
	// err := templates.ExecuteTemplate(w, "timeline.html", tl)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// }

	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte("Initialised"))

}

func vocabRedirectHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "http://vocab.org/placetime"+r.URL.Path, http.StatusMovedPermanently)
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("templates/admin.html"))

	err := templates.ExecuteTemplate(w, "admin.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

func addHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	text := r.FormValue("text")
	link := r.FormValue("link")
	ets := r.FormValue("ets")
	s := NewRedisStore()
	itemid, err := s.AddItem(pid, ets, text, link)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "ACK. (itemid=%s)", itemid)
}

func promoteHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	id := r.FormValue("id")
	s := NewRedisStore()
	err := s.Promote(pid, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, "ACK")
}

func demoteHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	id := r.FormValue("id")
	s := NewRedisStore()
	err := s.Demote(pid, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, "ACK")
}

func addSuggestHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	loc := r.FormValue("loc")
	s := NewRedisStore()
	err := s.AddSuggestedProfile(pid, loc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, "ACK")
}

func remSuggestHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	loc := r.FormValue("loc")
	s := NewRedisStore()
	err := s.RemoveSuggestedProfile(pid, loc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, "ACK")
}
