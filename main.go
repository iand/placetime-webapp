package main

import (
	"code.google.com/p/gorilla/mux"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"github.com/placetime/datastore"
	"html/template"
	"io/ioutil"
	"log"
	mr "math/rand"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

var (
	assetsDir         = "./assets"
	imgDir            = "/var/opt/timescroll/img"
	templatesDir      = "./templates"
	sessionCookieName = "ptsession"
	sessionExpiry     = 86400 * 14
	doinit            = false
)

var ()

func main() {
	mr.Seed(time.Now().UTC().UnixNano())
	runtime.GOMAXPROCS(runtime.NumCPU())

	flag.StringVar(&assetsDir, "assets", "./assets", "filesystem directory in which javascript/css/image assets are found")
	flag.StringVar(&imgDir, "images", "/var/opt/timescroll/img", "filesystem directory to store fetched images")
	flag.IntVar(&sessionExpiry, "session", 86400*14, "number of seconds session cookies should be valid for")
	flag.BoolVar(&doinit, "init", false, "re-initialize database (warning: will wipe eveything)")
	flag.Parse()

	checkEnvironment()
	log.Printf("Assets directory: %s", assetsDir)
	log.Printf("Image directory: %s", imgDir)
	log.Printf("Session expiry: %d", sessionExpiry)

	if doinit {
		initData()
	}

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

	r.HandleFunc("/", timelineHandler).Methods("GET", "HEAD")

	r.HandleFunc("/timeline", timelineHandler).Methods("GET", "HEAD")
	//r.HandleFunc("/-init", initHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-admin", adminHandler).Methods("GET", "HEAD")

	r.HandleFunc("/-jsp", jsonSuggestedProfilesHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jpr", jsonProfileHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jit", jsonItemHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jtl", jsonTimelineHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jsp", jsonSuggestedProfilesHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jfollowers", jsonFollowersHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jfollowing", jsonFollowingHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jfeeds", jsonFeedsHandler).Methods("GET", "HEAD")
	r.HandleFunc("/-jflaggedprofiles", jsonFlaggedProfilesHandler).Methods("GET", "HEAD")
	//	r.HandleFunc("/{pid:[0-9a-zA-Z]+}", profileHandler).Methods("GET", "HEAD")

	r.HandleFunc("/-tfollow", followHandler).Methods("POST")
	r.HandleFunc("/-tunfollow", unfollowHandler).Methods("POST")
	r.HandleFunc("/-tadd", addHandler).Methods("POST")
	r.HandleFunc("/-tpromote", promoteHandler).Methods("POST")
	r.HandleFunc("/-tdemote", demoteHandler).Methods("POST")
	r.HandleFunc("/-taddsuggest", addSuggestHandler).Methods("POST")
	r.HandleFunc("/-tremsuggest", remSuggestHandler).Methods("POST")
	r.HandleFunc("/-taddprofile", addProfileHandler).Methods("POST")
	r.HandleFunc("/-tupdateprofile", updateProfileHandler).Methods("POST")
	r.HandleFunc("/-tremprofile", removeProfileHandler).Methods("POST")
	r.HandleFunc("/-tflagprofile", flagProfileHandler).Methods("POST")

	r.HandleFunc("/-session", sessionHandler).Methods("POST")
	r.HandleFunc("/-chksession", checkSessionHandler).Methods("GET")
	r.HandleFunc("/-twitter", twitterHandler).Methods("GET")
	r.HandleFunc("/-soauth", soauthHandler).Methods("GET")
	r.HandleFunc("/-tmpl", templatesHandler).Methods("GET")

	r.PathPrefix("/-assets/").HandlerFunc(assetsHandler).Methods("GET", "HEAD")
	r.PathPrefix("/-img/").HandlerFunc(imgHandler).Methods("GET", "HEAD")

	log.Print("Listening on 0.0.0.0:8081\n")

	server := &http.Server{
		Addr:        "0.0.0.0:8081",
		Handler:     Log(r),
		ReadTimeout: 30 * time.Second,
	}

	server.ListenAndServe()
}

func checkEnvironment() {
	f, err := os.Open(imgDir)
	if err != nil {
		log.Printf("Could not open image path %s: %s", imgDir, err.Error())
		os.Exit(1)
	}
	defer f.Close()
	fi, err := f.Stat()
	if err != nil {
		log.Printf("Could not stat image path %s: %s", imgDir, err.Error())
		os.Exit(1)
	}

	if !fi.IsDir() {
		log.Printf("Image path is not a directory %s: %s", imgDir, err.Error())
		os.Exit(1)
	}

}

func Hostname() string {
	h, _ := os.Hostname()
	if h == "ursa" {
		return "127.0.0.1:8081"
	}
	return "placetime.com"
}

func Log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)
	})
}

func ErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	log.Printf("[Error] %s (%s)", err.Error(), r.URL)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func assetsHandler(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path[9:]
	p = path.Join(assetsDir, p)
	http.ServeFile(w, r, p)
	// w.Write([]byte(p))
}

func imgHandler(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path[6:]
	p = path.Join(imgDir, p)
	http.ServeFile(w, r, p)
}

func timelineHandler(w http.ResponseWriter, r *http.Request) {
	templates := template.Must(template.ParseFiles("assets/html/timeline.html"))

	err := templates.ExecuteTemplate(w, "timeline.html", nil)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
}

func jsonTimelineHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pidParam := r.FormValue("pid")
	if pidParam != sessionPid && !isAdmin(sessionPid) {
		// TODO: allow admin to see all timelines?
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	statusParam := r.FormValue("status")

	if statusParam != "m" {
		statusParam = "p"
	}

	beforeParam := r.FormValue("before")
	before, err := strconv.ParseInt(beforeParam, 10, 0)
	if err != nil {
		before = 0
	}

	afterParam := r.FormValue("after")
	after, err := strconv.ParseInt(afterParam, 10, 0)
	if err != nil {
		after = 0
	}

	var ts time.Time

	tsParam := r.FormValue("ts")
	tsVal, err := strconv.ParseInt(tsParam, 10, 64)
	if err != nil {
		ts = time.Now()
	} else {
		ts = time.Unix(0, tsVal)
	}

	s := datastore.NewRedisStore()
	defer s.Close()
	tl, err := s.TimelineRange(pidParam, statusParam, ts, int(before), int(after))
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(tl, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)
}

func jsonItemHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	id := r.FormValue("id")

	s := datastore.NewRedisStore()
	defer s.Close()

	item, err := s.Item(id)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(item, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonSuggestedProfilesHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	loc := r.FormValue("loc")

	s := datastore.NewRedisStore()
	defer s.Close()

	plist, err := s.SuggestedProfiles(loc)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonFollowersHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

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

	s := datastore.NewRedisStore()
	defer s.Close()

	plist, err := s.Followers(pid, int(count), int(start))
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonFollowingHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

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

	s := datastore.NewRedisStore()
	defer s.Close()

	plist, err := s.Following(pid, int(count), int(start))
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(plist, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func jsonProfileHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")

	s := datastore.NewRedisStore()
	defer s.Close()

	profile, err := s.Profile(pid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(profile, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func followHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")
	if pid != sessionPid && !isAdmin(sessionPid) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	followpid := r.FormValue("followpid")
	s := datastore.NewRedisStore()
	defer s.Close()

	s.Follow(pid, followpid)
	fmt.Fprint(w, "ACK")
}

func unfollowHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")
	if pid != sessionPid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	followpid := r.FormValue("followpid")
	s := datastore.NewRedisStore()
	defer s.Close()

	s.Unfollow(pid, followpid)
	fmt.Fprint(w, "ACK")
}

func initData() {
	s := datastore.NewRedisStore()
	defer s.Close()

	log.Print("Resetting database")
	s.ResetAll()

	// s.AddProfile("ukfestivals", "sunshine", "UK Festivals", "Every musical festival in the UK.", "", "")
	// s.AddItem("ukfestivals", "22 Jul 2012", "Isle of Wight Festival, Isle of Wight, Newport", "http://www.last.fm/festival/3162276+Isle+of+Wight+Festival")
	// s.AddItem("ukfestivals", "24 Aug 2012", "Leeds Festival 2012, Bramham Park, Leeds", "http://www.last.fm/festival/2048182+Leeds+Festival+2012")
	// s.AddItem("ukfestivals", "24 Aug 2012", "Reading Festival 2012, Little John's Farm, Reading", "http://www.last.fm/festival/2043239+Reading+Festival+2012")
	// s.AddItem("ukfestivals", "27 Jul 2012", "Steelhouse Festival, Hafod-Y-Dafal Farm, Ebbw Vale", "http://www.last.fm/festival/3271130+Steelhouse+Festival")
	// s.AddItem("ukfestivals", "17 Aug 2012", "Beautiful Days 2012, Escot Park, Nr Exeter Devon", "http://www.last.fm/festival/3218182+Beautiful+Days+2012")
	// s.AddItem("ukfestivals", "27 Jul 2012", "Kendal Calling 2012, lowther deer park, Penrith, Cumbria", "http://www.last.fm/festival/3210406+Kendal+Calling+2012")
	// s.AddItem("ukfestivals", "14 Jul 2012", "Summer Breeze Festival 2012, Liddington Warren Farm, Swindon", "http://www.last.fm/festival/3294945+Summer+Breeze+Festival+2012")
	// s.AddItem("ukfestivals", "6 Sep 2012", "Bestival 2012, Robin Hill, Isle of Wight", "http://www.last.fm/festival/2067992+Bestival+2012")
	// s.AddItem("ukfestivals", "24 Aug 2012", "Solfest 2012, Tarnside Farm, Tarns, Cumbria", "http://www.last.fm/festival/3236642+Solfest+2012")
	// s.AddItem("ukfestivals", "19 Jul 2012", "The Secret Garden Party 2012, Abbots Ripton, Huntingdon", "http://www.last.fm/festival/3186405+The+Secret+Garden+Party+2012")
	// s.AddItem("ukfestivals", "31 Aug 2012", "Merthyr Rock 2012, Cyfartha Park, Merthyr Tydfil", "http://www.last.fm/festival/3302416+Merthyr+Rock+2012")
	// s.AddItem("ukfestivals", "1 Aug 2012", "Meltdown Festival 2012, Southbank Centre, London", "http://www.last.fm/festival/3284883+Meltdown+Festival+2012")
	// s.AddItem("ukfestivals", "21 Aug 2012", "Tennent's Vital 2012, Boucher Playing Fields, Belfast", "http://www.last.fm/festival/3237701+Tennent%27s+Vital+2012")
	// s.AddItem("ukfestivals", "3 Nov 2012", "Damnation Festival 2012, Leeds University Union, Leeds", "http://www.last.fm/festival/3242700+Damnation+Festival+2012")
	// s.AddItem("ukfestivals", "3 Aug 2012", "Standon Calling, Standon Lordship, Standon", "http://www.last.fm/festival/3217298+Standon+Calling")
	// s.AddItem("ukfestivals", "17 Aug 2012", "Summer Sundae 2012, De Montfort Hall, Leicester", "http://www.last.fm/festival/3210772+Summer+Sundae+2012")
	// s.AddItem("ukfestivals", "24 Aug 2012", "Forest of Galtres Festival 2012, Crayke, York", "http://www.last.fm/festival/3314111+Forest+of+Galtres+Festival+2012")
	// s.AddItem("ukfestivals", "3 Aug 2012", "Stockton Weekender, Riverside, Stockton-on-Tees", "http://www.last.fm/festival/3228328+Stockton+Weekender")
	// s.AddItem("ukfestivals", "20 Jul 2012", "Wickerman, East Kirkcarswell, Dundrennan", "http://www.last.fm/festival/3317866+Wickerman")

	// s.Delete("testdata")
	// s.SetProfile(&Profile{Pid: "testdata", Name: "Test Data", Bio: "Loads of future events."})
	// date := time.Now()
	// for i := 0; i < 2000; i++ {
	// 	date = date.Add(79 * time.Hour)
	// 	s.AddItem("testdata", date.Format("02 Jan 2006"), fmt.Sprintf("Test data, item number %d", i), fmt.Sprintf("http://example.com/%d", i)))
	// }

	log.Print("Adding profile for iand")
	s.AddProfile("@iand", "sunshine", "Ian", "Timefloes.", "", "")

	log.Print("Adding profile for daveg")
	s.AddProfile("@daveg", "sunshine", "Dave", "", "", "")

	s.AddSuggestedProfile("iand", "london")

	//s.Follow("iand", "nasa")

	log.Print("Adding profile for nasa")
	s.AddProfile("@nasa", "nasa", "Nasa Missions", "Upcoming NASA mission information.", "", "")

	log.Print("Adding items for nasa")
	s.AddItem("nasa", parseKnownTime("1 Jan 2015"), "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury", "", "", "")
	s.AddItem("nasa", parseKnownTime("26 Aug 2012"), "Dawn - Leaves asteroid Vesta, heads for asteroid 1 Ceres", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Sep 2012"), "BepiColombo - Launch of ESA and ISAS Orbiter and Lander Missions to Mercury", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Feb 2015"), "Dawn - Goes into orbit around asteroid 1 Ceres", "", "", "")
	s.AddItem("nasa", parseKnownTime("14 Jul 2015"), "New Horizons - NASA mission reaches Pluto and Charon", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Mar 2013"), "LADEE - Launch of NASA Orbiter to the Moon", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Nov 2014"), "Philae - ESA Rosetta Lander touches down on Comet Churyumov-Gerasimenko", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Nov 2013"), "MAVEN - Launch of Mars Orbiter", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 May 2014"), "Rosetta - ESA mission reaches Comet Churyumov-Gerasimenko", "", "", "")
	s.AddItem("nasa", parseKnownTime("1 Jan 2014"), "Mars Sample Return Mission - Launch of NASA sample return mission to Mars", "", "", "")
	s.AddItem("nasa", parseKnownTime("5 Apr 2231"), "Pluto - is passed by Neptune in distance from the Sun for the next 20 years", "", "", "")

	s.AddProfile("nasa", "nasa", "Nasa Missions", "Upcoming NASA mission information.", "", "")
	//http: //www.ents24.com/web/festival-tickets/T-In-The-Park-2013-2998409.html

	// s.SetProfile(&Profile{Pid: "o2shepherdsbushempire ", Name: "O2 Shepherd's Bush Empire Events", Bio: "", Feed: "http://www.o2shepherdsbushempire.co.uk/RSS"})
	// s.SetProfile(&Profile{Pid: "skiddlewc2", Name: "Skiddle WC2", Bio: "What's On in London and area", Feed: "http://www.skiddle.com/rss/events.php?c=WC2"})

	// s.AddProfile("artscouncil", "sunshine", "Action Space London Events Ltd | Arts Council", "", "http://www.artscouncil.org.uk/feeds/latest/", "")
	// s.AddProfile("soas", "sunshine", "Calendar of Events - School of Oriental and African Studies", "", "http://www.soas.ac.uk/about/events/rss-events.php?type=month&amp;format=rss2.0&amp;filter=general", "")
	// s.AddProfile("lms", "sunshine", "Calendar of Events | London Mathematical Society", "", "http://www.lms.ac.uk/rss.xml", "")
	// s.AddProfile("designmuseum", "sunshine", "Design Museum - Evening Talks and Design Lectures", "", "http://designmuseum.org/feed", "")
	// s.AddProfile("forbiddenplanet", "sunshine", "Events @ Forbidden Planet", "", "http://feeds.forbiddenplanet.com/fplatestevents", "")
	// s.AddProfile("bbk", "sunshine", "Events calendar — Birkbeck, University of London", "", "http://www.bbk.ac.uk/news/aggregator/RSS", "")
	// s.AddProfile("gold", "sunshine", "Events Calendar, Goldsmiths, University of London", "", "http://www.gold.ac.uk/apps/events/rss.php", "")
	// s.AddProfile("arts", "sunshine", "Events Listings - University of the Arts London", "", "http://newsevents.arts.ac.uk/events/feed/arts/", "")
	// s.AddProfile("fineartslondon", "sunshine", "Fine Art London Events Calendar", "", "http://www.fineartslondon.com/feed/", "")
	// s.AddProfile("flavorpill", "sunshine", "Flavorpill London Home", "", "http://feeds.feedburner.com/flavorpill/ldn", "")
	// s.AddProfile("wellcomecollection", "sunshine", "Free events in London - Wellcome Collection", "", "http://www.wellcomecollection.org/feeds/events.aspx", "")
	// s.AddProfile("indymedia", "sunshine", "Indymedia London | Events | Index", "", "http://london.indymedia.org/events.rss", "")

	log.Print("Adding profile for visitlondon")
	s.AddProfile("@visitlondon", "sunshine", "visitlondon.com", "", "", "")

	log.Print("Adding feed profile for londonsportsguide")
	s.AddProfile("londonsportsguide", "sunshine", "Football in London - visitlondon.com", "", "http://feeds.visitlondon.com/LondonSportsGuide", "@visitlondon")

	log.Print("Adding feed profile for londonartsguide")
	s.AddProfile("londonartsguide", "sunshine", "London Arts Guide - visitlondon.com", "", "http://feeds.visitlondon.com/LondonArtsGuide", "@visitlondon")

	log.Print("Adding feed profile for londondanceguide")
	s.AddProfile("londondanceguide", "sunshine", "London Dance Guide - visitlondon.com", "", "http://feeds.visitlondon.com/LondonDanceGuide", "@visitlondon")

	log.Print("Adding feed profile for o2shepherdsbushempire")
	s.AddProfile("o2shepherdsbushempire", "sunshine", "O2 Shepherd's Bush Empire | Concert Dates and Tickets", "", "http://www.o2shepherdsbushempire.co.uk/RSS", "")

	// s.AddProfile("naturelondonscience", "sunshine", "London Blog: Science Events In London This Week : London Blog", "", "http://blogs.nature.com/london/feed", "")
	// s.AddProfile("lcf", "sunshine", "London College of Fashion - News &amp; Events", "", "http://newsevents.arts.ac.uk/lcf/news/feed/arts/", "")
	// s.AddProfile("frenchcinemalondon", "sunshine", "London events | French Cinema London", "", "http://www.frenchcinemalondon.com/?feed=rss2", "")
	// s.AddProfile("londonfashionweek", "sunshine", "London Fashion Week : Events Schedule", "", "http://www.londonfashionweek.com/news_xml.aspx", "")
	// s.AddProfile("londonhistorians", "sunshine", "London Historians: Events", "", "http://londonhistorians.wordpress.com/feed/", "")
	// s.AddProfile("londonnightclubs", "sunshine", "London Nightclubs | London Clubbing Guide | Clubs in London", "", "http://skiddle.com/rss/events.php?c=WC2", "")
	// s.AddProfile("londonwarehouseevents", "sunshine", "London Warehouse Events", "", "http://londonwarehouseevents.co.uk/feed/atom/", "")
	// s.AddProfile("npg", "sunshine", "National Portrait Gallery | Face to Face blog: Events", "", "http://face2face.si.edu/my_weblog/atom.xml", "")
	// s.AddProfile("o2shepherdsbushempire", "sunshine", "O2 Shepherd's Bush Empire | Concert Dates and Tickets", "", "http://www.o2shepherdsbushempire.co.uk/RSS", "")
	// s.AddProfile("thebrickhouse", "sunshine", "The Brickhouse | Restaurant Bar, Cabaret Club, Private &amp; Corporate ...", "", "http://www.thebrickhouse.co.uk/feed/", "")
	// s.AddProfile("nhm", "sunshine", "The Natural History Museum, London events | Ecsite", "", "http://www.ecsite.eu/news_and_events/470/events.rss", "")
	// s.AddProfile("tntlondon", "sunshine", "TNT Magazine Events in London, things to do in London, London ...", "", "http://www.tntmagazine.com/london/events/rss", "")
	// s.AddProfile("royalarmouries", "sunshine", "Tower of London Events | Royal Armouries", "", "http://www.royalarmouries.org/rss/events", "")
	// s.AddProfile("uwl", "sunshine", "University of West London: events", "", "http://www.uwl.ac.uk/the_university/news/TVU_news_rss.xml", "")
	// s.AddProfile("urbanjunkieslondon", "sunshine", "Urban Junkies London", "", "http://www.urbanjunkies.com/london/feed/rss.html", "")
	// s.AddProfile("royalacademy", "sunshine", "Van Gogh's London - Events &amp; resources - The Real Van Gogh: The ...", "", "http://www.royalacademy.org.uk/events.xml", "")
	// s.AddProfile("thevintageguidetolondon", "sunshine", "vintage events London | The Vintage Guide to LondonThe Vintage ...", "", "http://www.thevintageguidetolondon.com/feed/atom/", "")
	// s.AddProfile("jewishmuseum", "sunshine", "What's on - The Jewish Museum London", "", "http://www.jewishmuseum.org.uk/rss", "")
	// s.AddProfile("architecture", "sunshine", "What's on? - Royal Institute of British Architects", "", "http://www.architecture.com/syndication.riba?feed_type=Events", "")

	log.Print("Adding follows for iand")
	s.Follow("@iand", "londonsportsguide")
	s.Follow("@iand", "londonartsguide")
	s.Follow("@iand", "londondanceguide")
	s.Follow("@iand", "o2shepherdsbushempire")
	s.Follow("@iand", "@nasa")
	s.Follow("@iand", "@daveg")

	log.Print("Adding follows for daveg")
	s.Follow("@daveg", "londonsportsguide")
	s.Follow("@daveg", "londonartsguide")
	s.Follow("@daveg", "londondanceguide")
	s.Follow("@daveg", "o2shepherdsbushempire")
	s.Follow("@daveg", "@nasa")
	s.Follow("@daveg", "@iand")

	log.Print("Initialisation complete")

}

func vocabRedirectHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "http://vocab.org/placetime"+r.URL.Path, http.StatusMovedPermanently)
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	// sessionValid, sessionPid := checkSession(w, r, false)
	// if !sessionValid {
	// 	return
	// }
	// TODO: restrict to admins

	templates := template.Must(template.ParseFiles("assets/html/admin.html"))

	err := templates.ExecuteTemplate(w, "admin.html", nil)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

}

func addHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}
	// TODO: restrict to admins

	pid := r.FormValue("pid")
	text := r.FormValue("text")
	link := r.FormValue("link")
	ets := r.FormValue("ets")
	image := r.FormValue("image")
	s := datastore.NewRedisStore()
	defer s.Close()

	etsParsed, err := time.Parse(time.RFC3339, ets)
	if err != nil {
		etsParsed, err = time.Parse("2006-01-02", ets)
		if err != nil {
			etsParsed = time.Unix(0, 0)
		}
	}

	itemid, err := s.AddItem(pid, etsParsed, text, link, image, "")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprintf(w, "ACK. (itemid=%s)", itemid)
}

func promoteHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")
	if pid != sessionPid && !isAdmin(sessionPid) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := r.FormValue("id")
	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.Promote(pid, id)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "ACK")
}

func demoteHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")
	if pid != sessionPid && !isAdmin(sessionPid) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := r.FormValue("id")
	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.Demote(pid, id)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "ACK")
}

func addSuggestHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}
	// TODO: restrict to admins

	pid := r.FormValue("pid")
	loc := r.FormValue("loc")
	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.AddSuggestedProfile(pid, loc)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "ACK")
}

func remSuggestHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}
	// TODO: restrict to admins

	pid := r.FormValue("pid")
	loc := r.FormValue("loc")
	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.RemoveSuggestedProfile(pid, loc)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "ACK")
}

func sessionHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	pwd := r.FormValue("pwd")

	s := datastore.NewRedisStore()
	defer s.Close()

	validPassword, err := s.VerifyPassword(pid, pwd)
	if err != nil || !validPassword {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	createSession(pid, w, r)
	fmt.Fprint(w, "")
}

func checkSession(w http.ResponseWriter, r *http.Request, silent bool) (bool, string) {
	var pid string
	valid := false

	cookie, err := r.Cookie(sessionCookieName)
	if err == nil {
		parts := strings.Split(cookie.Value, "|")
		if len(parts) == 2 {
			pid = parts[0]
			sessionId, err := strconv.ParseInt(parts[1], 10, 64)
			s := datastore.NewRedisStore()
			defer s.Close()

			if err == nil {
				valid, err = s.ValidSession(pid, sessionId)
				if err != nil {
					ErrorResponse(w, r, err)
					return false, ""
				}

				if valid {
					newSessionId, err := s.SessionId(pid)
					if err != nil {
						ErrorResponse(w, r, err)
						return false, ""
					}

					value := fmt.Sprintf("%s|%d", pid, newSessionId)

					cookie := http.Cookie{Name: sessionCookieName, Value: value, Path: "/", MaxAge: sessionExpiry}
					http.SetCookie(w, &cookie)
				}

			}
		}
	}

	if !silent && !valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}

	return valid, pid

}
func createSession(pid string, w http.ResponseWriter, r *http.Request) {
	s := datastore.NewRedisStore()
	defer s.Close()

	sessionId, err := s.SessionId(pid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	value := fmt.Sprintf("%s|%d", pid, sessionId)

	cookie := http.Cookie{Name: sessionCookieName, Value: value, Path: "/", MaxAge: 86400}
	http.SetCookie(w, &cookie)

}

func checkSessionHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}
}

func addProfileHandler(w http.ResponseWriter, r *http.Request) {
	pid := r.FormValue("pid")
	pwd := r.FormValue("pwd")
	name := r.FormValue("pname")
	feedurl := r.FormValue("feedurl")
	bio := r.FormValue("bio")
	parentpid := r.FormValue("parentpid")

	var err error
	if pwd == "" {
		pwd, err = RandomString(18)
		if err != nil {
			log.Printf("Could not generate password: %s", err.Error())
			ErrorResponse(w, r, err)
			return
		}
	}

	s := datastore.NewRedisStore()
	defer s.Close()

	err = s.AddProfile(pid, pwd, name, bio, feedurl, parentpid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	sessionValid, _ := checkSession(w, r, true)
	if !sessionValid {
		createSession(pid, w, r)
	}
	fmt.Fprint(w, "")
}

func updateProfileHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")
	name := r.FormValue("pname")
	feedurl := r.FormValue("feedurl")
	bio := r.FormValue("bio")
	parentpid := r.FormValue("parentpid")

	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.UpdateProfile(pid, name, bio, feedurl, parentpid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "")
}

func removeProfileHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	if !isAdmin(sessionPid) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	pid := r.FormValue("pid")

	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.RemoveProfile(pid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "")
}

func flagProfileHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}
	pid := r.FormValue("pid")
	if pid == "" {
		ErrorResponse(w, r, errors.New("Missing required parameter 'pid'"))
		return

	}
	s := datastore.NewRedisStore()
	defer s.Close()

	err := s.FlagProfile(pid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	fmt.Fprint(w, "")
}

func twitterHandler(w http.ResponseWriter, r *http.Request) {

	callback := fmt.Sprintf("http://%s/-soauth", Hostname())

	token, tokenSecret, callbackConfirmed, err := GetTwitterRequestToken(callback)
	log.Printf("token: %s\n", token)
	log.Printf("tokenSecret: %s\n", tokenSecret)
	log.Printf("callbackConfirmed: %s\n", callbackConfirmed)

	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("https://api.twitter.com/oauth/authenticate?oauth_token=%s", token), http.StatusFound)

}
func soauthHandler(w http.ResponseWriter, r *http.Request) {
	oauth_token := r.FormValue("oauth_token")
	oauth_verifier := r.FormValue("oauth_verifier")
	log.Printf("oauth_token: %s\n", oauth_token)
	log.Printf("oauth_verifier: %s\n", oauth_verifier)

	token, tokenSecret, userid, screenName, err := GetTwitterAccessToken(oauth_token, oauth_verifier)

	log.Printf("token: %s\n", token)
	log.Printf("tokenSecret: %s\n", tokenSecret)
	log.Printf("userid: %s\n", userid)
	log.Printf("screenName: %s\n", screenName)

	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	screenName = fmt.Sprintf("@%s", screenName)

	s := datastore.NewRedisStore()
	defer s.Close()

	exists, err := s.ProfileExists(screenName)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	if !exists {
		pwd, err := RandomString(18)
		if err != nil {
			log.Printf("Could not generate password: %s", err.Error())
			ErrorResponse(w, r, err)
			return
		}

		err = s.AddProfile(screenName, pwd, screenName, "", "", "")
		if err != nil {
			ErrorResponse(w, r, err)
			return
		}
	}

	createSession(screenName, w, r)
	http.Redirect(w, r, "/timeline", http.StatusFound)

}

type TemplateMap map[string]string

func packageTemplates() (*TemplateMap, error) {
	filenames, err := filepath.Glob(fmt.Sprintf("%s/*.html", templatesDir))

	if err != nil {
		return nil, err
	}

	templateMap := make(TemplateMap, 0)

	for _, filename := range filenames {
		b, err := ioutil.ReadFile(filename)
		if err != nil {
			return nil, err
		}

		templateMap[filename[len(templatesDir)-1:len(filename)-5]] = string(b)
	}

	return &templateMap, nil
}

func templatesHandler(w http.ResponseWriter, r *http.Request) {
	tm, err := packageTemplates()

	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(tm, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")

	w.Write([]byte(fmt.Sprintf("window.templates=%s;", json)))

}

func jsonFeedsHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, _ := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	pid := r.FormValue("pid")

	s := datastore.NewRedisStore()
	defer s.Close()

	flist, err := s.Feeds(pid)
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(flist, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)

}

func isAdmin(pid string) bool {
	// TODO look up in database
	if pid == "iand" || pid == "daveg" {
		return true
	}

	return false
}

func parseKnownTime(t string) time.Time {
	ret, _ := time.Parse("_2 Jan 2006", t)
	return ret
}

func randomString(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	en := base64.URLEncoding
	d := make([]byte, en.EncodedLen(len(b)))
	en.Encode(d, b)
	return string(d)
}

func jsonFlaggedProfilesHandler(w http.ResponseWriter, r *http.Request) {
	sessionValid, sessionPid := checkSession(w, r, false)
	if !sessionValid {
		return
	}

	if !isAdmin(sessionPid) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	startParam := r.FormValue("start")
	start, err := strconv.ParseInt(startParam, 10, 0)
	if err != nil {
		start = 0
	}

	countParam := r.FormValue("count")
	count, err := strconv.ParseInt(countParam, 10, 0)
	if err != nil {
		count = 10
	}

	s := datastore.NewRedisStore()
	defer s.Close()
	profiles, err := s.FlaggedProfiles(int(start), int(count))
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}

	json, err := json.MarshalIndent(profiles, "", "  ")
	if err != nil {
		ErrorResponse(w, r, err)
		return
	}
	w.Header().Set("Content-Type", "application/javascript")
	w.Write(json)
}
