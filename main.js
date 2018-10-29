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
    hangouts: user.child("0").child("hangouts")
  },
  firebase: {
    charts: {
      source: db.ref("charts"),
      // optionally bind as an object
      asObject: true
    }
  },
  methods: {
    printData: function() {
      console.log(this.hangouts);
    }
  }
});
