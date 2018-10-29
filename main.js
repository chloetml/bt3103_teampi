var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var realtimeRef = db.ref("realtime");
var forecastRef = db.ref("forecast");
var user = db.ref("user");

var app = new Vue({
  el: "app",
  data: {
    hangouts: [["Jan", 4], ["Feb", 2], ["Mar", 10], ["Apr", 5], ["May", 3]]
  },
  methods: {
    printData: function() {
      console.log(this.hangouts);
    }
  }
});
