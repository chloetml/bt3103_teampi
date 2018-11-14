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
    currUserRef: "ref here",
    userName: "",
    userPassword: "",
    studName: "name here",
    faculty: "faculty here"
  },
  methods: {
    verifyUserNP: function() {
      var ref = this;
      var contains = 0;
      var id = this.userName;
      var pw = this.userPassword;
      var name;
      var fac;
      var currRef;
      //var userArr = [];
      user.once("value", function(userSnapshot) {
        userSnapshot.forEach(function(userSnapshot) {
          var userID = userSnapshot.child("id").val();
          var pass = userSnapshot.child("password").val();
          if (userID === id && pass === pw) {
            console.log(userSnapshot.key);
            contains = 1;
            //console.log(userSnapshot.ref());
            console.log(contains);
            currRef = userSnapshot.key;
            name = userSnapshot.child("name").val();
            fac = userSnapshot.child("faculty").val();
            console.log(name);
            console.log(fac);
            //console.log(ref.studName);
            //ref.studName = name;
            //console.log(ref.studName);
            //ref.faculty = ref.evalFac(fac);
            ref.currUserRef = currRef;
          }
        });

        if (contains === 1) {
          //alert("Success");
          window.location.href =
            "/bt3103_teampi/home.html?currRef=" + currRef + "";
        } else {
          alert("Wrong User ID or password. Please try again.");
        }
      });
    }
  }
});
