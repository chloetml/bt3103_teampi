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
    currLoc: "",
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
    goSearch: function() {
      var currRef = this.currUserRef;
      var currentLoc = this.currLoc;
      var venueType = this.venueType;
      if (venueType === "" || currentLoc === "") {
        alert("Please select an input.");
      } else {
        if (venueType === "Study Rooms") {
          window.location.href =
            "/bt3103_teampi/mapSR.html?currentLoc=" +
            currentLoc +
            "&currRef=" +
            currRef +
            "";
        } else if (venueType === "Discussion Rooms") {
          window.location.href =
            "/bt3103_teampi/mapDR.html?currentLoc=" +
            currentLoc +
            "&currRef=" +
            currRef +
            "";
        }
      }
    }
  }
});
