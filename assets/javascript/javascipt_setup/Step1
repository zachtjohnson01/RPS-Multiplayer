 $(document).on('ready', function() {

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
    var database = firebase.database();
    var presenceRef = database.ref(".info/connected");
    var playersRef = database.ref("/playersRef");
    var turnRef = database.ref("/turn");
    var chatRef = database.ref("/chat");
    // Initialize variables
    var player;
    var otherPlayer;
    var name = {};
    var userRef;
    var wins1, wins2, losses1, losses2;

    var choices = ['rock','paper','scissors'];

    // Remove turn and chat if either player disconnects
    turnRef.onDisconnect().remove();
    chatRef.onDisconnect().remove();

    var game = {
      listeners:"",
      setPlayer:"",
      addPlayer:"",
      turnMessage:"",
      showChoice:"",
      setChoice:"",
      rotateChoice:"",
      turn1:"",
      turn2:"",
      turn3:"",
      outcome:"",
      logic:"",
      winner:"",
      choiceAnimation:""
    };

    var chat = {
      message:"",
      getMessage:"",
      sendMessage:"",
      sendDisconnect:"",
      showMessage:""
    };

})