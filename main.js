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
    counter: 0,
    locations: ["Central Library", "Mac Commons", "Study Room 1"],
    hangouts: "",
    currUserRef: "",
    userName: "",
    userPassword: ""
  },
  methods: {
    get: function() {
      var arr = [];
      user
        .child("0")
        .child("hangouts")
        .once("value", function(openHangouts) {
          openHangouts.forEach(function(openHangouts) {
            var val = openHangouts.val();
            var temp = [openHangouts.key, openHangouts.val()];
            console.log(temp);
            arr.push([openHangouts.key, openHangouts.val()]);
          });
          console.log(arr);
        });
      this.hangouts = arr;
      return arr;
    },
    verifyUserNP: function() {
      var id = this.userName;
      var pw = this.userPassword;
      //var userArr = [];
      user.once("value", function(userSnapshot) {
        userSnapshot.forEach(function(userSnapshot) {
          var userID = userSnapshot.child("id").val();
          var pass = userSnapshot.child("password").val();
          if (userID === id && pass === pw) {
            console.log(userSnapshot.key);
            this.currUserRef = userSnapshot.key;
            window.location.href = "/bt3103_teampi/home.html";
          }
        });
        //console.log(userArr);
      });
      alert("Wrong User ID or password. Please try again.");
    }
  }
});
