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
    bookings: "" // places that are available to show on html so user can choose which location they want
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
    formatTime: function(hour, merid) {
      //formatting time to 24h format
      var hNum;
      var h = "0";
      var time = "";
      if (merid === "AM") {
        //morning time: 9AM -11AM
        if (hour === 9) {
          h = h + hour;
        } else {
          // hour can be 10 or 11
          time = hour + "00";
        }
      } else if (merid === "PM") {
        //time can be 12, 1, 2...10PM
        if (hour === 12) {
          time = hour + "00";
        } else {
          hNum = hour + 12;
          time = hNum + "00";
        }
      }
      return time;
    },
    formatDate: function(date) {
      var formattedDate, dS, mS;
      var d = date.getDate(); //1 to 31
      var m = date.getMonth() + 1; //1 to 12
      var y = date.getFullYear();
      if (0 < d < 10) {
        dS = "0" + d;
      } else if (d > 9) {
        dS = "" + d;
      }
      if (0 < m < 10) {
        mS = "0" + m;
      } else if (m > 9) {
        mS = "" + m;
      }
      formattedDate = dS + mS + y;
      return formattedDate;
    },
    goSearch: function() {
      var currRef = this.currUserRef;
      var date = $("#datepicker").datepicker("getDate");
      var hours = $("#tp").data("timepicker").hour;
      //console.log(hours); //returns single digit
      var meridian = $("#tp").data("timepicker").meridian;
      var time = this.formatTime(hours, meridian);
      var venueType = this.venueType;
      console.log(date);
      console.log(venueType);
      var stringDate = this.formatDate(date);

      if (venueType === "") {
        alert("Please select a type of venue.");
      } else {
        if (venueType === "DiscRoom") {
          console.log(stringDate);
          console.log(time);
          /*
          window.location.href =
            "/bt3103_teampi/mapDR.html?date=" +
            date +
            "&currRef=" +
            currRef +
            "&time=" +
            time +
            "";
            */
        }
      }
    },
    // adds number of available disc rooms for booking to this.bookings
    // used for showing how many rooms each location is avail to book
    bookingsAvail(userDate, userTime) {
      //var userDate = "13112018";
      //var userTime = "1400";
      var arr = [];
      bookingsRef.once("value", function(openBookings) {
        // gets the region
        openBookings.forEach(function(openBookings) {
          console.log(openBookings.val()); //Object {Central Library: Object}
          var obj = openBookings.val();
          var key = Object.keys(obj);
          console.log("location key " + key); //["Central Library"]
          // loop through each location
          var location = "";
          var tempCount = 0; // store the # of rooms available for each loc
          var temp = {};
          //key.forEach(function (loc) {
          //console.log(openBookings.child(loc).val()); //Object {DR1: Object, DR2: Object}
          var rooms = openBookings.child(key).val();
          var roomKey = Object.keys(rooms);
          //console.log(roomKey); //["DR1", "DR2"]
          // loop through each discussion room
          roomKey.forEach(function(room) {
            var currDate = openBookings
              .child(key)
              .child(room)
              .val();
            var storedDate = Object.keys(currDate);
            //console.log(storedDate); //["15112018"]
            // loop through each date
            storedDate.forEach(function(day) {
              var currTime = openBookings
                .child(key)
                .child(room)
                .child(day)
                .val();
              var currTimeKey = Object.keys(currTime);
              //console.log(currTimeKey); //["1500", "1600"]
              //console.log(day); //15112018
              //console.log(typeof day); // string
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
                      location = key;
                      console.log("the key: " + key);
                    }
                  }
                });
              }
            });
          });
          if (location != "") {
            temp.location = location[0];
            temp.available = tempCount;
            arr.push(temp);
          }
        });
      });
      //});
      this.bookings = arr;
    },
    // to be used when user makes a booking
    // takes in the user, date, time, location of booking
    makeBooking: function (bdate, btime, bloc) {
      var bdate = "15112018";
      var btime = "1400";
      var bloc = "Central Library";
      var bregion = this.regionLoc; // gets region from getRegionfromLoc function
      var self = this;
      //console.log(this.regionLoc);
      var availRoom = [];
      var temp = {};
      // retrieve available room from bloc
      bookingsRef
        .child(bregion)
        .child(bloc)
        .once("value", function (snapshot) {
          var obj = snapshot.val();
          var rooms = Object.keys(obj);
          rooms.forEach(function (something) {
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
          userRef
            .child("0")
            .child("bookings")
            .child(bdate)
            .update({ [btime]: region + " " + bloc + " " + temp['free'] });
        });
    },
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
