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
    formatTime: function(hour, merid) {
      //formatting time to 24h format
      var hNum;
      var h;
      var time;
      if (merid === "AM") {
        //morning time: 9AM -11AM
        if (hour === 9) {
          h = "0" + hour;
          time = h + "00";
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
        dS = d;
      }
      if (0 < m < 10) {
        mS = "0" + m;
      } else if (m > 9) {
        mS = m;
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
    }
  }
});

/*
then when you call that function you will get { "location": "Central Library", "available": 1 }
<button @click="bookingsAvail">Bookings Avail</button> Display
          bookings available
          <li v-for="booking in bookings">{{ booking }}</li>
*/
