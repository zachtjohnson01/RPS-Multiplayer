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