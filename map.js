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
    currUserRef: "ref here",
    currLoc: "",
    venueType: ""
  },
  mounted: function() {
    var ref = this;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cr = url.searchParams.get("currRef");
    var cl = url.searchParams.get("currentLoc");
    var vt = url.searchParams.get("venueType");
    console.log(cr);
    console.log(cl);
    console.log(vt);
    this.currUserRef = cr;
    this.currLoc = cl;
    this.venueType = vt;
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
