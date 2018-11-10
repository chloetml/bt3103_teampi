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
    users: "",
    currUser: "",
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
      var userArr = [];
      user.once("value", function(userSnapshot) {
        userSnapshot.forEach(function(userSnapshot) {
          var userID = userSnapshot.child("id").val();
          var pass = userSnapshot.child("password").val();
          var userIP = [userID, pass];
          //console.log(userIP);
          userArr.push(userIP);
        });
        //console.log(userArr);
      });
      this.users = userArr;
      console.log(this.users[0][0] === id);
      console.log(this.users[0][1] === pw);
      for (var i = 0; i < this.users.length; i++) {
        // This if statement depends on the format of your array
        if (this.users[i][0] === id && this.users[i][1] === pw) {
          this.currUser = id;
          window.location.href = "/bt3103_teampi/home.html";
        }
      }
      alert("Wrong User ID or password. Please try again.");
    }
  }
});
