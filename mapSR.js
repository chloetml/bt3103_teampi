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
    venueType: "",
    vacancy: 0,
    rec: 0,
    rec_vacancy: 0,
    discAvailable: [],
    allDiscAvailable: []
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
    this.recommendStudy(cl);
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
    },

    //vacant: finds the number of vacant seats in realtime for a given region and location
    vacant: function(region, location) {
      var temp = 0;
      realtimeRef
        .child(region)
        .child(location)
        .child("study rooms")
        .child("total")
        .once("value", function(snap) {
          temp = snap.val();
          //console.log(temp);
          //console.log(snap.val());
        });

      realtimeRef
        .child(region)
        .child(location)
        .child("study rooms")
        .child("in use")
        .once("value", function(snap) {
          temp = temp - snap.val();
          //console.log(snap.val());
          console.log(temp);
        });
      console.log("temp");
      //console.log(await temp);
      this.vacancy = temp;
      return temp;
    },

    // recommend study rooms
    //Finds the place with the greatest number of vacant slots in a given region
    recommendStudy: function(region) {
      var locations = [];
      realtimeRef.child(region).once("value", function(snap) {
        //console.log(snap.val());
        locations = snap.val();
      });
      var max = 0;
      var most = [];
      var location;
      for (location in locations) {
        //console.log(location);
        var num = this.vacant(region, location);
        console.log(num);
        if (num > max) {
          max = num;
          most = [];
          most.push(location);
        }
        //else if (num == max){
        //most.push(location);
        //}
      }
      console.log(most);
      console.log(max);
      this.rec = most;
      this.rec_vacancy = max;
    },

    // takes in a region name
    // find the next nearest region that has discussion rooms available
    nearestDiscRegion: function(currRegion) {
      var text = "";
      switch (currRegion) {
        case "Arts and Social Sciences":
          text = "General"; // or computing?
          break;
        case "Business":
          text = "Business";
          break;
        case "Computing":
          text = "Computing";
          break;
        case "Dentistry":
          text = "Science"; // or medicine?
          break;
        case "Design and Environment":
          text = "General";
          break;
        case "Engineering":
          text = "General";
          break;
        case "General":
          text = "General";
          break;
        case "Medicine":
          text = "Medicine";
          break;
        case "Music":
          text = "General";
          break;
        case "Science":
          text = "Science";
          break;
        default:
          text = "General";
      }
      //console.log(text);
      return text;
    },

    // takes in a region name, currTime
    // find the number of disc room available
    // assumes each region only has one location
    discAvail: function(region, location, time) {
      //var region = "Computing";
      //var time = "1400";
      var finalNum;
      var discRooms = [];
      var available = [];
      realtimeRef
        .child(region)
        .child(location)
        .once("value", function(snap) {
          discRooms = snap.val();
          //location = Object.keys(obj);
        });
      for (var disc in discRooms) {
        realtimeRef
          .child(region)
          .child(location)
          .child(disc)
          .child(time)
          .once("value", function(snap) {
            if (snap.val() === "") {
              available.push(disc);
              console.log(available);
            }
          });
      }
      this.discAvailable = available;
      return available;
    },

    // recommendation algo for discussion rooms
    recomDisc: function(region, time) {
      region = this.nearestDiscRegion(region);
      var locations;
      var avail = [];

      rtDiscRef.child(region).once("value", function(snap) {
        locations = snap.val();
      });

      for (var location in locations) {
        var temp = this.discAvail(region, location, time);
        avail.push({ [location]: temp });
      }
      this.allDiscAvailable = avail;
      console.log(this.allDiscAvailable);
      return avail;
    }
  }
});
