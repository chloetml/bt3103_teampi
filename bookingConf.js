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
    loc: "",
    startTime: "",
    endTime: ""
  },
  mounted: function() {
    var ref = this;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cr = url.searchParams.get("currRef");
    var startTime = url.searchParams.get("time");
    var date = formatDate(url.searchParams.get("date"));
    var loc = url.searchParams.get("loc");
    console.log(cr);
    this.currUserRef = cr;
    this.date = date;
    this.startTime = startTime;
    this.endTime = this.calcET(startTime);
    this.loc = loc;
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
    calcET: function(st) {
      // end time is 1hour after starttime
      var et;
      var num;
      if (st.slice(0, 2) === "09") {
        et = "1000";
      } else {
        num = parseInt(st.slice(0, 2), 10) + 1;
        et = "" + num + "00";
      }
      return et;
    },
    formatDate: function(date) {
      // take in a string date in ddmmyyyy format
      var df;
      df = date.slice(0, 2) + "/" + date.slice(2, 4) + "/" + date.slice(4, 8);
      return df;
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
