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
      var contains = 0;
      var id = this.userName;
      var pw = this.userPassword;
      //var userArr = [];
      user.once("value", function(userSnapshot) {
        userSnapshot.forEach(function(userSnapshot) {
          var userID = userSnapshot.child("id").val();
          var pass = userSnapshot.child("password").val();
          if (userID === id && pass === pw) {
            contains = 1;
            console.log(userSnapshot.ref());
            console.log(contains);
            if (contains === 1) {
              window.location.href = "/bt3103_teampi/home.html";
            } else {
              alert("Wrong User ID or password. Please try again.");
            }
            //this.currUserRef = userSnapshot.key;
          }
        });
        //console.log(userArr);
      });
    }
  }
});
