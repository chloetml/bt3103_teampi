var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var realtimeRef = db.ref("realtime");
var forecastRef = db.ref("forecast");
var bookingsRef = db.ref("bookings");
var user = db.ref("user");
var $ = require("jquery");

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
    console.log(cr);
    this.currUserRef = cr;
    $("#datepicker")
      .datepicker({
        autoclose: true,
        startDate: "+0d",
        todayHighlight: true
      })
      .datepicker("update", new Date())
      .on("changeDate", () => {
        this.date = $("#datepicker").val();
      });
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
    goSearch: function() {
      var currRef = this.currUserRef;
      var date = this.date;
      var time = this.time;
      var venueType = this.venueType;
      console.log(venueType);
      if (venueType === "") {
        alert("Please select a type of venue.");
      } else {
        if (venueType === "DiscRoom") {
          console.log(date);
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
    // takes in the date and time the user wants
    bookingsAvail(userDate, userTime) {
      //var userDate = "15112018";
      //var userTime = "1400";
      var arr = [];
      bookingsRef.once("value", function(openBookings) {
        // gets the region
        openBookings.forEach(function(openBookings) {
          //console.log(openBookings.val()); //Object {Central Library: Object}
          var obj = openBookings.val();
          var key = Object.keys(obj);
          console.log(key); //["Central Library"]
          // loop through each location
          var location = "";
          var tempCount = 0; // store the # of rooms available for each loc
          var temp = {};
          key.forEach(function(loc) {
            //console.log(openBookings.child(loc).val()); //Object {DR1: Object, DR2: Object}
            var rooms = openBookings.child(loc).val();
            var roomKey = Object.keys(rooms);
            //console.log(roomKey); //["DR1", "DR2"]
            // loop through each discussion room
            roomKey.forEach(function(room) {
              var currDate = openBookings
                .child(loc)
                .child(room)
                .val();
              var storedDate = Object.keys(currDate);
              //console.log(storedDate); //["15112018"]
              // loop through each date
              storedDate.forEach(function(day) {
                var currTime = openBookings
                  .child(loc)
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
                        .child(loc)
                        .child(room)
                        .child(userDate)
                        .child(userTime)
                        .val();
                      //console.log(value); // "" or nusnetID
                      // time is free -> store data!
                      if (value == "") {
                        tempCount += 1;
                        location = loc;
                      }
                    }
                  });
                }
              });
            });
          });
          temp.location = location;
          temp.available = tempCount;
          arr.push(temp);
        });
      });
      this.bookings = arr;
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
