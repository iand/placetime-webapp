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
	assetsDir = "./bootstrap"
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
	r.HandleFunc("/-follow", followHandler).Methods("POST")
	r.HandleFunc("/-jtl", jsonTimelineHandler).Methods("GET", "HEAD")
	r.HandleFunc("/{pid:[0-9a-zA-Z]+}", profileHandler).Methods("GET", "HEAD")

	r.PathPrefix("/-assets/").HandlerFunc(assetsHandler).Methods("GET", "HEAD")

	fmt.Print("Listening on 0.0.0.0:8081\n")
	http.Handle("/", r)
	http.ListenAndServe("0.0.0.0:8081", nil)
}

type TimelineRange struct {
	Pid    string      `json:"pid"`
	Tstart time.Time   `json:"tstart"`
	Tend   time.Time   `json:"tend"`
	Groups []ItemGroup `json:"groups"`
}

func assetsHandler(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path[9:]
	p = path.Join(assetsDir, p)
	http.ServeFile(w, r, p)
	// w.Write([]byte(p))
}

func timelineHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("templates/timeline.html", "templates/profile.html"))

	s := NewRedisStore()
	tl, err := s.TimelineRange("iand", time.Now(), time.Now().AddDate(1000, 0, 0), 5)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = templates.ExecuteTemplate(w, "timeline.html", tl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func jsonTimelineHandler(w http.ResponseWriter, r *http.Request) {

	countParam := r.FormValue("count")
	count, err := strconv.ParseInt(countParam, 10, 0)
	if err != nil {
		count = 5
	}

	var tsStart, tsEnd time.Time

	groupParam := r.FormValue("group")

	ts, err := time.Parse("Jan 2006", groupParam)
	if err != nil || groupParam == "0" {
		baseTs := time.Now()
		if count < 0 {
			baseTs = baseTs.AddDate(0, 2, 0)
		} else {
			baseTs = baseTs.AddDate(0, 2, 0)
		}

		ts, _ = time.Parse("Jan 2006", baseTs.Format("Jan 2006"))
	}

	if count < 0 {
		tsStart = ts.AddDate(-1000, 0, 0)
		tsEnd = ts.Add(-time.Second)
		count = -count
	} else {
		tsStart = ts.AddDate(0, 1, 0)
		tsEnd = ts.AddDate(1000, 0, 0)
	}

	s := NewRedisStore()
	tl, err := s.TimelineRange("iand", tsStart, tsEnd, int(count))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.Marshal(tl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(json)
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("templates/timeline.html", "templates/profile.html"))
	vars := mux.Vars(r)

	s := NewRedisStore()
	p, err := s.Profile(vars["pid"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	p.IsFollowing, err = s.IsFollowing("iand", vars["pid"])

	err = templates.ExecuteTemplate(w, "profile.html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

func followHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	s := NewRedisStore()

	isFollowing, err := s.IsFollowing("iand", pid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	if isFollowing {
		s.Unfollow("iand", pid)
	} else {
		s.Follow("iand", pid)
	}
	fmt.Fprint(w, "ACK")
}

func initHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("templates/timeline.html", "templates/profile.html"))
	s := NewRedisStore()
	s.Delete("ukfestivals")
	s.SetProfile(&Profile{Pid: "ukfestivals", Name: "UK Festivals", Bio: "Every musical festival in the UK."})
	s.Add(NewItem("ukfestivals", "22 Jul 2012", "Isle of Wight Festival, Isle of Wight, Newport - http://www.last.fm/festival/3162276+Isle+of+Wight+Festival"))
	s.Add(NewItem("ukfestivals", "24 Aug 2012", "Leeds Festival 2012, Bramham Park, Leeds - http://www.last.fm/festival/2048182+Leeds+Festival+2012"))
	s.Add(NewItem("ukfestivals", "24 Aug 2012", "Reading Festival 2012, Little John's Farm, Reading - http://www.last.fm/festival/2043239+Reading+Festival+2012"))
	s.Add(NewItem("ukfestivals", "27 Jul 2012", "Steelhouse Festival, Hafod-Y-Dafal Farm, Ebbw Vale - http://www.last.fm/festival/3271130+Steelhouse+Festival"))
	s.Add(NewItem("ukfestivals", "17 Aug 2012", "Beautiful Days 2012, Escot Park, Nr Exeter Devon - http://www.last.fm/festival/3218182+Beautiful+Days+2012"))
	s.Add(NewItem("ukfestivals", "27 Jul 2012", "Kendal Calling 2012, lowther deer park, Penrith, Cumbria - http://www.last.fm/festival/3210406+Kendal+Calling+2012"))
	s.Add(NewItem("ukfestivals", "14 Jul 2012", "Summer Breeze Festival 2012, Liddington Warren Farm, Swindon - http://www.last.fm/festival/3294945+Summer+Breeze+Festival+2012"))
	s.Add(NewItem("ukfestivals", "6 Sep 2012", "Bestival 2012, Robin Hill, Isle of Wight - http://www.last.fm/festival/2067992+Bestival+2012"))
	s.Add(NewItem("ukfestivals", "24 Aug 2012", "Solfest 2012, Tarnside Farm, Tarns, Cumbria - http://www.last.fm/festival/3236642+Solfest+2012"))
	s.Add(NewItem("ukfestivals", "19 Jul 2012", "The Secret Garden Party 2012, Abbots Ripton, Huntingdon - http://www.last.fm/festival/3186405+The+Secret+Garden+Party+2012"))
	s.Add(NewItem("ukfestivals", "31 Aug 2012", "Merthyr Rock 2012, Cyfartha Park, Merthyr Tydfil - http://www.last.fm/festival/3302416+Merthyr+Rock+2012"))
	s.Add(NewItem("ukfestivals", "1 Aug 2012", "Meltdown Festival 2012, Southbank Centre, London - http://www.last.fm/festival/3284883+Meltdown+Festival+2012"))
	s.Add(NewItem("ukfestivals", "21 Aug 2012", "Tennent's Vital 2012, Boucher Playing Fields, Belfast - http://www.last.fm/festival/3237701+Tennent%27s+Vital+2012"))
	s.Add(NewItem("ukfestivals", "3 Nov 2012", "Damnation Festival 2012, Leeds University Union, Leeds - http://www.last.fm/festival/3242700+Damnation+Festival+2012"))
	s.Add(NewItem("ukfestivals", "3 Aug 2012", "Standon Calling, Standon Lordship, Standon - http://www.last.fm/festival/3217298+Standon+Calling"))
	s.Add(NewItem("ukfestivals", "17 Aug 2012", "Summer Sundae 2012, De Montfort Hall, Leicester - http://www.last.fm/festival/3210772+Summer+Sundae+2012"))
	s.Add(NewItem("ukfestivals", "24 Aug 2012", "Forest of Galtres Festival 2012, Crayke, York - http://www.last.fm/festival/3314111+Forest+of+Galtres+Festival+2012"))
	s.Add(NewItem("ukfestivals", "3 Aug 2012", "Stockton Weekender, Riverside, Stockton-on-Tees - http://www.last.fm/festival/3228328+Stockton+Weekender"))
	s.Add(NewItem("ukfestivals", "20 Jul 2012", "Wickerman, East Kirkcarswell, Dundrennan - http://www.last.fm/festival/3317866+Wickerman"))

	s.Delete("testdata")
	s.SetProfile(&Profile{Pid: "testdata", Name: "Test Data", Bio: "Loads of future events."})
	date := time.Now()
	for i := 0; i < 2000; i++ {
		date = date.Add(79 * time.Hour)
		s.Add(NewItem("testdata", date.Format("02 Jan 2006"), fmt.Sprintf("Test data, item number %d", i)))
	}

	s.Delete("nasa")
	s.SetProfile(&Profile{Pid: "nasa", Name: "Nasa Missions", Bio: "Upcoming NASA mission information."})

	s.Add(NewItem("nasa", "26 Aug 2012", "Dawn - Leaves asteroid Vesta, heads for asteroid 1 Ceres"))
	s.Add(NewItem("nasa", "1 Sep 2012", "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury"))
	s.Add(NewItem("nasa", "1 Mar 2013", "LADEE - Launch of NASA Orbiter to the Moon"))
	s.Add(NewItem("nasa", "1 Nov 2013", "MAVEN - Launch of Mars Orbiter"))
	s.Add(NewItem("nasa", "1 May 2014", "Rosetta - ESA mission reaches Comet Churyumov-Gerasimenko"))
	s.Add(NewItem("nasa", "1 Nov 2014", "Philae - ESA Rosetta Lander touches down on Comet Churyumov-Gerasimenko"))
	s.Add(NewItem("nasa", "1 Jan 2014", "Mars Sample Return Mission - Launch of NASA sample return mission to Mars"))
	s.Add(NewItem("nasa", "1 Feb 2015", "Dawn - Goes into orbit around asteroid 1 Ceres"))
	s.Add(NewItem("nasa", "14 Jul 2015", "New Horizons - NASA mission reaches Pluto and Charon"))
	s.Add(NewItem("nasa", "1 Jan 2015", "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury"))
	s.Add(NewItem("nasa", "5 Apr 2231", "Pluto - is passed by Neptune in distance from the Sun for the next 20 years"))
	s.Add(NewItem("nasa", "1 Jan 4000000", "Pioneer 11 - NASA flyby of star Lambda Aquila"))

	s.Delete("baroness")
	s.SetProfile(&Profile{Pid: "baroness", Name: "Baroness", Bio: "Baroness are currently on tour in Europe."})

	s.Add(NewItem("baroness", "11 Nov 2012", "Moho Live Manchester, United Kingdom"))
	s.Add(NewItem("baroness", "12 Nov 2012", "Barfly, Camden London, United Kingdom"))
	s.Add(NewItem("baroness", "14 Nov 2012", "De Affaire Nijmegen, Netherlands"))
	s.Add(NewItem("baroness", "15 Nov 2012", "Dour Festival Dour, Belgium"))
	s.Add(NewItem("baroness", "17 Nov 2012", "LE TREMPLIN Beaumont, France"))
	s.Add(NewItem("baroness", "19 Nov 2012", "Kafe Antzokia Bilbao, Spain"))
	s.Add(NewItem("baroness", "20 Nov 2012", "Milhoes de Festa Barcelos, Portugal"))
	s.Add(NewItem("baroness", "21 Aug 2012", "Caracol Madrid, Spain"))
	s.Add(NewItem("baroness", "22 Aug 2012", "Estraperlo Barcelona, Spain"))
	s.Add(NewItem("baroness", "23 Aug 2012", "La Dynamo Toulouse, France"))
	s.Add(NewItem("baroness", "25 Aug 2012", "Räucherkammer Wiesbaden, Germany"))
	s.Add(NewItem("baroness", "26 Aug 2012", "Sommercasino Basel, Switzerland"))
	s.Add(NewItem("baroness", "27 Aug 2012", "Dynamo Zurich, Switzerland"))
	s.Add(NewItem("baroness", "28 Aug 2012", "Viper Theatre Florence Fi, Italy"))
	s.Add(NewItem("baroness", "30 Aug 2012", "Arena Civica Milan, Italy"))
	s.Add(NewItem("baroness", "31 Aug 2012", "Chelsea Vienna, Austria"))
	s.Add(NewItem("baroness", "01 Sep 2012", "59to1 Munich, Germany"))
	s.Add(NewItem("baroness", "03 Sep 2012", "Klub 007 Prague, Czech Republic"))
	s.Add(NewItem("baroness", "04 Sep 2012", "OFF Festival Katowice, Poland"))
	s.Add(NewItem("baroness", "05 Sep 2012", "Magnet Berlin, Germany"))
	s.Add(NewItem("baroness", "06 Sep 2012", "Logo Hamburg, Germany"))
	s.Add(NewItem("baroness", "07 Sep 2012", "Beta Copenhagen, Denmark"))
	s.Add(NewItem("baroness", "09 Sep 2012", "Oya Festival Oslo, Norway"))
	s.Add(NewItem("baroness", "12 Sep 2012", "Westcoast Bar Margate, United Kingdom"))
	s.Add(NewItem("baroness", "13 Sep 2012", "Corporation Sheffield, United Kingdom"))
	s.Add(NewItem("baroness", "14 Sep 2012", "The Fleece Bristol, United Kingdom"))
	s.Add(NewItem("baroness", "15 Sep 2012", "Talking Heads Southampton, United Kingdom"))
	s.Add(NewItem("baroness", "17 Sep 2012", "Pukkelpop Hasselt, Belgium"))
	s.Add(NewItem("baroness", "18 Sep 2012", "Highfield Festival Leipzig, Germany"))
	s.Add(NewItem("baroness", "19 Sep 2012", "Area4 Festival Lüdinghausen, Germany"))
	s.Add(NewItem("baroness", "29 Sep 2012", "House of Vans Brooklyn, NY"))
	s.Add(NewItem("baroness", "06 Oct 2012", "Hopscotch Music Festival Durham, NC"))
	s.Add(NewItem("baroness", "27 Oct 2012", "The Fest 11 Gainesville, FL"))

	s.Delete("iand")
	s.SetProfile(&Profile{Pid: "iand", Name: "Ian", Bio: "Time flows..."})

	s.Follow("iand", "baroness")
	s.Follow("iand", "ukfestivals")
	s.Follow("iand", "nasa")
	s.Follow("iand", "testdata")

	var tl TimelineRange
	err := templates.ExecuteTemplate(w, "timeline.html", tl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

func vocabRedirectHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "http://vocab.org/placetime"+r.URL.Path, http.StatusMovedPermanently)
}
