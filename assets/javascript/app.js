  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCrGuhSfbSnWjzB_fFREpbgTqqAVMjisZM",
    authDomain: "rock-paper-scissors-4878f.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-4878f.firebaseio.com",
    projectId: "rock-paper-scissors-4878f",
    storageBucket: "rock-paper-scissors-4878f.appspot.com",
    messagingSenderId: "225941536805"
  };
  firebase.initializeApp(config);

//Create a variable to reference the database

var database = firebase.database();

// Store connections in variable
var connectionsRef = database.ref("/connections");

// '.info/connected' is boolean value provided by Firebase
// updates when client's connection state changes
var connectedRef = database.ref(".info/connected");

// Store players in variable
var playersList = database.ref("/playersList");




// When the client's connection state changes...
connectedRef.on("value", function(snap){
  
  // If they are connected..
  if (snap.val()) {
    var playersCount = 0;
    playersCount ++;
    console.log(playersCount);
    
    
    // Add user to connections list
    var con = connectionsRef.push(`player${playersCount}`);
    
    // Remove user form the connection list when they disconnect
    con.onDisconnect().remove();
  }
});

// database.ref().on("value", function(snapshot) {

// });

// $(".rock_p1").on("click", function() {
//   database.ref().set( {
//     playerMove: "rock"
//   });
//   console.log("rock");
// });






























// const messaging = firebase.messaging();
// messaging.requestPermission()
// .then(function() {
//   console.log('Have permission');
//   return messaging.getToken();
// })
// .then(function(token) {
//   console.log(token);
// })
// .catch(function(err) {
//   console.log('Error occured');
// })




// console.log(config.databaseURL);



// var amOnline = new Firebase(`https://${config.databaseURL}.firebaseio.com/.info/connected`);
// var userRef = new Firebase(`https://${config.databaseURL}.firebaseio.com/presence/${userId}`);
// amOnline.on('value', function(snapshot) {
//   if (snapshot.val()) {
//     userRef.onDisconnect().remove();
//     userRef.set(true);
//   }
// });