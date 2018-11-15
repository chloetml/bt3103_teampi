var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var realtimeRef = db.ref("realtime");
var forecastRef = db.ref("forecast");
var bookingsRef = db.ref("bookings");
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
    faculty: "faculty here",
    myBookings: ""
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
    this.displayBookings();
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
    },
    // increments number of hangouts in region by 1
    addHangouts(region) {
      //var region = "General";
      user
        .child("0")
        .child("hangouts")
        .once("value", function(hosnapshot) {
          var x = hosnapshot.child(region).val();
          console.log(x);
          x++;
          console.log(x);
          user
            .child("0")
            .child("hangouts")
            .update({ [region]: x });
        });
    },
    // retrieve user's bookings data and store it as dictionary for display on html
    displayBookings() {
      const self = this;
      var arr = [];
      var passed = {};
      user
        .child(this.currUserRef)
        .child("bookings")
        .once("value", function(openBookings) {
          openBookings.forEach(function(openBookings) {
            // openBookings is the date
            var date = openBookings.key;
            //console.log(date); //16112018
            var formatted =
              date.slice(2, 4) +
              "/" +
              date.slice(0, 2) +
              "/" +
              date.slice(4, 8);
            var formatted = new Date(formatted);
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            if (formatted < now) {
              //passed.push(date);
              //console.log(passed);
              var loc = [];
              var obj = openBookings.val();
              var keys = Object.keys(obj);
              keys.forEach(function(time) {
                var place = openBookings.child(time).val();
                var region = place.slice(0, 3);
                loc.push(region);
              });
              passed[date] = loc;
              //console.log(passed);
            } else {
              var obj = openBookings.val();
              //console.log(obj); //Object {1300-1400: "COM1 DR4"}
              var keys = Object.keys(obj);
              //console.log(keys) // array of timings
              keys.forEach(function(time) {
                //console.log(time); // 1300-1400
                var temp = {};
                var place = openBookings.child(time).val();
                //console.log(place); // location of booking
                temp.date = date;
                temp.time = time;
                temp.location = place;
                arr.push(temp);
              });
            }
          });
          // remove bookings with date that is over
          //console.log("passed: " + passed);
          var passedKeys = Object.keys(passed);
          //console.log("yo: "+passedKeys);

          passedKeys.forEach(function(pastDate) {
            var code = passed[pastDate];
            //console.log(passed[pastDate]);
            code.forEach(function(regCode) {
              var reg = self.getRegionfromBooking(regCode);
              self.addHangouts(reg); // add to hangouts
            });
            // remove from bookings node
            user
              .child(this.currUserRef)
              .child("bookings")
              .child(pastDate)
              .remove();
          });
        });
      this.myBookings = arr;
      return arr;
    },
    // cancel bookings
    // will take in date, time, place (region + loc + room)
    cancelBooking(booking) {
      //var bplace = "COM COM1 DR2";
      var bdate = booking["date"];
      var btime = booking["time"];
      var bplace = booking["location"];
      var result = confirm("Are you sure you want to cancel this booking?");
      if (result) {
        var currRef = this.currUserRef;
        //Logic to delete the item
        var len = bplace.length;
        var room = bplace.slice(len - 3, len);
        var location = bplace.slice(4, len - 4);
        var region = this.getRegionfromBooking(bplace.slice(0, 3));
        //console.log(region);
        // remove booking from user bookings node
        user
          .child(this.currUserRef)
          .child("bookings")
          .child(bdate)
          .child(btime)
          .remove();
        // set booking for that location, date and time under bookings node as free
        bookingsRef
          .child(region)
          .child(location)
          .child(room)
          .child(bdate)
          .child(btime)
          .set("");

        window.location.href =
          "/bt3103_teampi/home.html?currRef=" + currRef + "";
      }
    },
    formatDate: function(date) {
      // take in a string date in ddmmyyyy format
      var df;
      df = date.slice(0, 2) + "/" + date.slice(2, 4) + "/" + date.slice(4, 8);
      return df;
    },
    // takes in the location code and returns the location name
    // eg: takes in GEN and returns General
    getRegionfromBooking(location) {
      //var location = "GEN";
      var text = "";
      switch (location) {
        case "ASS":
          text = "Arts and Social Sciences";
          break;
        case "BIZ":
          text = "Business";
          break;
        case "COM":
          text = "Computing";
          break;
        case "DEN":
          text = "Dentistry";
          break;
        case "SDE":
          text = "Design and Environment";
          break;
        case "ENG":
          text = "Engineering";
          break;
        case "GEN":
          text = "General";
          break;
        case "MED":
          text = "Medicine";
          break;
        case "MUS":
          text = "Music";
          break;
        case "SCI":
          text = "Science";
          break;
        //default:
        //  text = "Faculty";
      }
      //this.regionBook = text;
      //console.log(this.regionBook);
      //console.log(text);
      return text;
    }
  }
});
