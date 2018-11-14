var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var realtimeRef = db.ref("realtime");
var forecastRef = db.ref("forecast");
var user = db.ref("user");

var app = new Vue({
  el: "#app",
  data: {
    //currUserRef: "ref here",
    currUserRef: "ref here",
    date: "",
    venueType: "",
    time: ""
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
    goSearch: function() {
      var currRef = this.currUserRef;
      var date = this.date;
      var time = this.time;
      var venueType = this.venueType;
      console.log(venueType);
      if (venueType === "") {
        alert("Please select a type of venue.");
      } else {
        if (venueType === "StudyRoom") {
          window.location.href =
            "/bt3103_teampi/mapSR.html?currentLoc=" +
            currentLoc +
            "&currRef=" +
            currRef +
            "&venueType=" +
            venueType +
            "";
        } else if (venueType === "DiscRoom") {
          window.location.href =
            "/bt3103_teampi/mapDR.html?currentLoc=" +
            currentLoc +
            "&currRef=" +
            currRef +
            "&venueType=" +
            venueType +
            "";
        }
      }
    }
  }
});
