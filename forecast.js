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
    venueType: ""
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
    },
    formatDate: function(date) {
      var formattedDate, dS, mS;
      var d = date.getDate(); //1 to 31
      var m = date.getMonth() + 1; //1 to 12
      var y = date.getFullYear();
      if (d < 10) {
        dS = "0" + d;
      } else if (d > 9) {
        dS = "" + d;
      }
      if (m < 10) {
        mS = "0" + m;
      } else if (m > 9) {
        mS = "" + m;
      }
      formattedDate = dS + mS + y;
      return formattedDate;
    },
    byLoc: function() {
      var currRef = this.currUserRef;
      var date = $("#datepicker").datepicker("getDate");
      var venueType = this.venueType;
      console.log(date);
      console.log(venueType);
      var stringDate = this.formatDate(date);

      if (venueType === "") {
        alert("Please select a type of venue.");
      } else {
        window.location.href =
          "/bt3103_teampi/fcByLoc.html?date=" +
          stringDate +
          "&currRef=" +
          currRef +
          "&venueType=" +
          venueType +
          "";
      }
    },
    byTime: function() {
      var currRef = this.currUserRef;
      var date = $("#datepicker").datepicker("getDate");
      var venueType = this.venueType;
      console.log(date);
      console.log(venueType);
      var stringDate = this.formatDate(date);

      if (venueType === "") {
        alert("Please select a type of venue.");
      } else {
        window.location.href =
          "/bt3103_teampi/fcByTime.html?date=" +
          stringDate +
          "&currRef=" +
          currRef +
          "&venueType=" +
          venueType +
          "";
      }
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
