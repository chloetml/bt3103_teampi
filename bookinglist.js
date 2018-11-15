var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var realtimeRef = db.ref("realtime");
var forecastRef = db.ref("forecast");
var bookingsRef = db.ref("bookings");
var user = db.ref("user");
//var $ = require("jquery");

var app = new Vue({
  el: "#app",
  data: {
    //currUserRef: "ref here",
    currUserRef: "ref here",
    date: "",
    venueType: "",
    time: "",
    bookings: "", // places that are available to show on html so user can choose which location they want
    regionLoc: ""
  },
  mounted: function() {
    var ref = this;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cr = url.searchParams.get("currRef");
    var time = url.searchParams.get("time");
    var date = url.searchParams.get("date");
    console.log(cr);
    this.currUserRef = cr;
    this.date = date;
    this.time = time;
    this.bookingsAvail(date, time); //call the function to update bookings node
    console.log(this.bookings);
  },
  methods: {
    goRT: function() {
      var currRef = this.currUserRef;
      window.location.href =
        "/bt3103_teampi/realtime.html?currRef=" + currRef + "";
    },
    goFC: function() {
      var currRef = this.currUserRef;
      window.location.href =
        "/bt3103_teampi/forecast.html?currRef=" + currRef + "";
    },
    goBK: function() {
      var currRef = this.currUserRef;
      window.location.href =
        "/bt3103_teampi/booking.html?currRef=" + currRef + "";
    },
    goHome: function() {
      var currRef = this.currUserRef;
      window.location.href = "/bt3103_teampi/home.html?currRef=" + currRef + "";
    },

    // adds number of available disc rooms for booking to this.bookings
    // used for showing how many rooms each location is avail to book
    bookingsAvail: function(userDate, userTime) {
      //var userDate = "16112018";
      //var userTime = "1000";
      var arr = [];
      bookingsRef.once("value", function(openBookings) {
        // gets the region
        openBookings.forEach(function(openBookings) {
          //console.log(openBookings.val()); //Object {Central Library: Object}
          var obj = openBookings.val();
          var key = Object.keys(obj);
          //console.log("location key " + key); //["Central Library"]
          // loop through each location
          var location = key;
          var tempCount = 0; // store the # of rooms available for each loc
          var temp = {};
          //key.forEach(function (loc) {
          //console.log(openBookings.child(loc).val()); //Object {DR1: Object, DR2: Object}
          var rooms = openBookings.child(key).val();
          var roomKey = Object.keys(rooms);
          //console.log("roomKey " + roomKey); //["DR1", "DR2"]
          //console.log("length: " + roomKey.length);
          // loop through each discussion room
          roomKey.forEach(function(room) {
            var currDate = openBookings
              .child(key)
              .child(room)
              .val();
            var storedDate = Object.keys(currDate);
            //console.log(storedDate); //["15112018"]
            // if date node does not exist
            if (!storedDate.includes(userDate)) {
              tempCount = roomKey.length;
            } else {
              // loop through each date
              storedDate.forEach(function(day) {
                //console.log(day);
                var currTime = openBookings
                  .child(key)
                  .child(room)
                  .child(day)
                  .val();
                var currTimeKey = Object.keys(currTime);
                //console.log(currTimeKey); //["1500", "1600"]
                //console.log(day); //15112018
                //console.log(typeof day); // string
                // if current time does not exist as a node
                //if (!(userTime in currTimeKey)){}
                if (day == userDate) {
                  // if user wants this date, loop through the diff times of this date
                  // check that for the time the user wants, the number of rooms available
                  /*
                  if (!(userTime in currTimeKey)) {
                    // if that time is free
                    // store the data!
                    tempCount += 1;
                    location = loc;
                  } */
                  // to use if each hour is stored, those without bookings are stored as ""
                  currTimeKey.forEach(function(time) {
                    if (time == userTime) {
                      var value = openBookings
                        .child(key)
                        .child(room)
                        .child(userDate)
                        .child(userTime)
                        .val();
                      //console.log(value); // "" or nusnetID
                      // time is free -> store data!
                      if (value == "") {
                        tempCount += 1;
                        //location = key;
                        //console.log("the key: " + key)
                      } //console.log("the key: " + key + ", count: " + tempCount);
                    }
                  });
                }
              });
            }
          });
          //console.log(location);
          if (tempCount != 0) {
            temp.location = location[0];
            temp.available = tempCount;
            arr.push(temp);
          }
        });
      });
      //});
      this.bookings = arr;
    },
    //takes in the location and returns the region loc is in
    getRegionfromLoc: function(location) {
      //return new Promise(function(resolve, reject){
      //var location = "Central Library";
      var self = this;
      //var final;
      realtimeRef.once("value", function(snapshot) {
        var obj = snapshot.val();
        var reg = Object.keys(obj);
        //console.log(reg);
        var theOne;
        reg.forEach(function(regSnap) {
          var obj2 = snapshot.child(regSnap).val();
          //console.log(obj);
          //var loc = Object.keys(obj);
          //console.log(obj.hasOwnProperty(location));
          if (obj2.hasOwnProperty(location)) {
            //console.log("THIS IS THE ONE "+region);
            theOne = regSnap;
            //self.region = region;
            //console.log(this.region);
            //return region;
          }
        });
        //console.log(theOne);
        self.regionLoc = theOne;
        //final = theOne
        //console.log(final);
        //console.log(self.region);
        return theOne;
      });
      //console.log(final.key);
      //})
    },
    // takes in the location name and returns the location code
    // eg: takes in General and returns GEN
    getRegionCode: function(region) {
      //var region = "General";
      var text = "";
      switch (region) {
        case "Arts and Social Sciences":
          text = "ASS";
          break;
        case "Business":
          text = "BIZ";
          break;
        case "Computing":
          text = "COM";
          break;
        case "Dentistry":
          text = "DEN";
          break;
        case "Design and Environment":
          text = "SDE";
          break;
        case "Engineering":
          text = "ENG";
          break;
        case "General":
          text = "GEN";
          break;
        case "Medicine":
          text = "MED";
          break;
        case "Music":
          text = "MUS";
          break;
        case "Science":
          text = "SCI";
          break;
        default:
          text = "Faculty";
      }
      //this.regionBook = text;
      //console.log(text);
      return text;
    },
    // to be used when user makes a booking
    // takes in the user, date, time, location of booking
    makeBooking: function(bdate, btime, bloc) {
      //ar bdate = "15112018";
      //var btime = "1400";
      //var bloc = "Central Library";
      var self = this;
      //await self.getRegionfromLoc(bloc);
      var bregion = self.getRegionfromLoc(bloc);
      //var bregion = this.regionLoc; // gets region from getRegionfromLoc function
      console.log(bregion);
      console.log(this.regionLoc);
      var availRoom = [];
      var temp = {};
      // retrieve available room from bloc
      bookingsRef
        .child(bregion)
        .child(bloc)
        .once("value", function(snapshot) {
          var obj = snapshot.val();
          var rooms = Object.keys(obj);
          rooms.forEach(function(something) {
            var user = snapshot
              .child(something)
              .child(bdate)
              .child(btime)
              .val();
            //console.log(something); // returns the loc node
            // post to bookings node if room is free at that time
            if (user === "") {
              //availRoom.push(something);
              temp.free = something;
              //console.log(availRoom);
              bookingsRef
                .child(bregion)
                .child(bloc)
                .child(something)
                .child(bdate)
                .update({
                  [btime]: "" // get userID and put here
                  //this.userName
                });
            }
          });
          availRoom.push(temp);
          self.myBookings = availRoom; //{ "free": "DR1" }
          //console.log(self.myBookings); // [Object]
          // get region for booking
          var region = self.getRegionCode(bregion);
          // post to user node
          user
            .child("0")
            .child("bookings")
            .child(bdate)
            .update({ [btime]: region + " " + bloc + " " + temp["free"] });
        });
    },
    book: function(booking) {
      var currRef = this.currUserRef;
      var loc = booking["location"];
      console.log(loc);
      var time = this.time;
      var date = this.date;
      this.makeBooking(date, time, loc);

      window.location.href =
        "/bt3103_teampi/bookingConf.html?date=" +
        date +
        "&currRef=" +
        currRef +
        "&time=" +
        time +
        "&loc=" +
        loc +
        "";
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
