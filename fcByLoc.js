var db = firebase
  .initializeApp({
    databaseURL: "https://space-czar.firebaseio.com/"
  })
  .database();

var forecastRef = db.ref("forecast");

var app = new Vue({
  el: "#app",
  data: {
    currUserRef: "ref here",
    regionLoc: "",
    allregions: [],
    allLocations: [],
    dailyOccupancy: 0,
    occupancy: 0,
    opening: 0,
    closing: 0
  },
  mounted: function() {
    var ref = this;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var cr = url.searchParams.get("currRef");
    console.log(cr);
    this.currUserRef = cr;
    this.get_regions();
    this.get_locations();
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

    get_regions: async function() {
      var regions = [];
      var temp;
      await forecastRef.once("value", function(snap) {
        temp = snap.val();
      });
      for (var region in temp) {
        regions.push(region);
      }
      this.allregions = regions;
      console.log(this.allregions);
      return regions;
    },

    get_locations: async function() {
      var locations = [];
      var temp;
      await this.get_regions();
      var size = this.allregions.length;
      for (var i = 0; i < size; i++) {
        var region = this.allregions[i];
        await forecastRef.child(region).once("value", function(snap) {
          temp = snap.val();
        });
        for (var reg in temp) {
          locations.push(reg);
        }
      }
      this.allLocations = locations;
      console.log(this.allLocations);
      return locations;
    },

    //find the general occupancy rate for a given day
    forecast_day: async function(region, location, date) {
      var open = await this.operatingHours(region, location, "open");
      var close = await this.operatingHours(region, location, "close");
      var total = 0;
      var formatedDate = await this.formatDate(date);
      for (var t = open; t <= close; t = t + 100) {
        //console.log(t);
        var num = await this.forecast(region, location, date, t);
        total = total + num;
      }
      //console.log(total);
      //console.log(total/(close - open)*100);
      this.dailyOccupancy = Math.floor((total / (close - open)) * 100);
      //return this.dailyOccupancy;
    },

    //forecasting model: the model takes in a string location and region,
    //and a date object
    forecast: async function(region, location, date, time) {
      var i;
      var total = 0;
      //var time = await this.formatTime(date); //time derived from date object
      for (i = 0; i < 4; i = i + 1) {
        var tempDate = new Date();
        await tempDate.setDate((await date.getDate()) - 7 * i);
        console.log("tempDate: " + tempDate);
        var formatedDate = await this.formatDate(tempDate);
        console.log(formatedDate);
        var num = await this.occupied(region, location, formatedDate, time);
        console.log(num[0]);
        total = total + num[0];
        //console.log(total)
      }
      total = Math.floor(total / 3);
      //console.log(total);
      this.occupancy = total; //occupancy is used for displaying the return value on
      return total; //html, since the function return a promise object
    },

    // takes in a string location and
    // a string region and
    // a string parameter called end (accepted values: open/close)
    // for retrieval of opening/closing hours
    operatingHours: async function(region, location, end) {
      var temp = [];
      await forecastRef
        .child(region)
        .child(location)
        .child(end)
        .once("value", function(snap) {
          temp.push(snap.val());
          //console.log(snap.val());
          //console.log(temp);
        });
      if (end === "open") {
        this.opening = temp[0];
      } else if (end === "close") {
        this.closing = temp[0];
      }
      console.log(temp[0]);
      return temp[0];
    },

    //formatDate: takes in date objects and converts them into required
    //string format for storing into firebase
    formatDate: function(date) {
      //date = new Date();
      //date.setDate(date.getDate() - 7);
      var format_date =
        date.getDate().toString() +
        (date.getMonth() + 1).toString() +
        date.getFullYear().toString();
      return format_date;
    },

    //occupied: finds the no. of occupants in a given location, time and date
    //formatDate: the date has been formated in the required form. Pass a date
    //object through formatDate before using this
    occupied: async function(region, location, formatDate, time) {
      //uncommment below when testing
      //location = "Central Library";
      //formatDate = 13112018;
      //time = 2100;
      //console.log("occupied now")
      var temp = [];
      await forecastRef
        .child(region)
        .child(location)
        .child("study rooms")
        .child("Data")
        .child(formatDate)
        .child(time)
        .once("value", function(snap) {
          temp.push(snap.val());
          //console.log(snap.val());
          console.log(temp);
        });
      //console.log("temp");
      //console.log(temp);
      return temp;
    },

    // takes in the location and returns the region loc is in
    getRegionfromLoc: function(location) {
      //return new Promise(function(resolve, reject){
      //var location = "Central Library";
      var self = this;
      //var final;
      realtimeRef.once("value", function(snapshot) {
        var obj = snapshot.val();
        var reg = Object.keys(obj);
        //console.log(reg);
        var theOne;
        reg.forEach(function(reg) {
          var obj = snapshot.child(reg).val();
          //console.log(obj);
          //var loc = Object.keys(obj);
          //console.log(obj.hasOwnProperty(location));
          if (obj.hasOwnProperty(location)) {
            //console.log("THIS IS THE ONE "+region);
            theOne = reg;
            //self.region = region;
            //console.log(this.region);
            //return region;
          }
        });
        //console.log(theOne);
        self.regionLoc = theOne;
        //final = theOne
        //console.log(final);
        //console.log(self.region);
        return theOne;
      });
      //console.log(final.key);
      //})
    }
  }
});
