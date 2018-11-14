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
  mounted: function() {
    var ref = this;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cr = url.searchParams.get("currRef");
    var name, fac;
    console.log(cr);
    this.currUserRef = cr;
    user.child(cr).once("value", function(userSnapshot) {
      name = userSnapshot.child("name").val();
      fac = userSnapshot.child("faculty").val();
      console.log(name);
      console.log(fac);
      ref.studName = name;
      ref.faculty = ref.evalFac(fac);
    });
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
    get: function() {
      var currRef = this.currUserRef;
      var arr = [];
      user
        .child(currRef)
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
    }
  }
});
