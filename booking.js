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
    //venueType: "",
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
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
