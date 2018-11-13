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
    userPassword: "",
    studName: "",
    faculty: ""
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
    evalFac: function(fac) {
      // function to evaluate faculty value
      var text = "";
      switch (fac) {
        case "BIZ":
          text = "School of Business";
          break;
        case "FoE":
          text = "Faculty of Engineering";
          break;
        case "FASS":
          text = "Faculty of Arts & Social Sciences";
          break;
        case "FoS":
          text = "Faculty of Science";
          break;
        case "SDE":
          text = "School of Design & Environment";
          break;
        case "NUSMed":
          text = "School of Medicine";
          break;
        case "SoC":
          text = "School of Computing";
          break;
        case "SPP":
          text = "School of Public Policy";
          break;
        case "FoD":
          text = "Faculty of Dentistry";
          break;
        case "MUS":
          text = "Yong Siew Toh Conservatory of Music";
          break;
        default:
          text = "Faculty";
      }
      return text;
    },
    /*
      array(['BIZ', 'FoE', 'FASS', 'FoS', 'SDE', 'SCALE', 'NUS', 'SMA', 'MDP',
          'NUSMed', 'ISS', 'RMI', 'FoL', 'SoC', 'SPP', 'NGS', 'FoD', 'SPH',
          'MUS', 'YNC', 'DUKE MS', 'TLIAP', 'TDSI'], dtype=object)
    */
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
            console.log(userSnapshot.key);
            contains = 1;
            //console.log(userSnapshot.ref());
            console.log(contains);
            //this.currUserRef = userSnapshot.key;
            this.studName = userSnapshot.child("name").val();
            this.faculty = this.evalFac(userSnapshot.child("faculty").val());
          }
        });
        //console.log(userArr);
        if (contains === 1) {
          window.location.href = "/bt3103_teampi/home.html";
        } else {
          alert("Wrong User ID or password. Please try again.");
        }
      });
    }
  }
});
