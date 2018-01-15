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
    listeners: function() {
      database.ref().on('value', function(snapshot) {
        var turnVal = snapshot.child('turn').val();
        if (turnVal !== null && player == undefined) {
          console.log("Only 2 players allowed.")
        }
      });
      $('#submit-name').one('click', function() {
        game.setPlayer();
        return false
      });
      playersRef.on('child_added', function(childSnapshot) {
        var key = childSnapshot.key;
        name[key] = childSnapshot.val().name;
        var player_title = $('.p' + key + '_name');
        player_title.empty();
        var $h1 = $('<h2>').text(name[key]);
        player_title.append($h1);
      });
      playersRef.on('child_removed', function(childSnapshot) {
        var key = childSnapshot.key;
        var player_title = $('.p' + key + '_name');
        player_title.empty();
        var $h1 = $('<h2>').text('Waiting for Player ' + key + ' to Join');
        player_title.append($h1);
      });
      turnRef.on('value', function(snapshot) {
        var turnNum = snapshot.val();
        if (turnNum == 1) {
          game.turn1();
        } else if (turnNum == 2) {
          game.turn2();
        } else if (turnNum == 3) {
          game.turn3();
        }
      })
    },
    setPlayer: function() {
      database.ref().once('value', function(snapshot) {
        var playerObj = snapshot.child('playersRef');
        var num = playerObj.numChildren();
        if (num == 0) {
          player = 1;
          game.addPlayer(player);
        } else if (num == 1 && playerObj.val()[2] !== undefined) {
          player = 1;
          game.addPlayer(player);
          turnRef.set(1);
        } else if (num == 1) {
          player = 2;
          game.addPlayer(player);
          turnRef.set(1);
        }
      })
    },
    addPlayer: function(count) {
      var playerName = $("#name-input").val();
      var name_form = $("#name-form");
      var name_panel = $(".name-panel");
      name_panel.empty();
      name_panel.html("<h6>Instructions</h6>");
      name_form.empty();
      name_form.html("<h4>Time to Play</h4>");
      userRef = playersRef.child(count);
      userRef.onDisconnect().remove();
      userRef.set({
        'name': playerName,
        'wins': 0,
        'losses': 0
      })
    },
    turnMessage: function(playTurn) {
      otherPlayer = player == 1 ? 2:1;
      if (playTurn == player) {
        $('h4').text("It's Your Turn!");
      } else if (playTurn == otherPlayer) {
        $('h4').text("Waiting for " + name[otherPlayer] + " to choose.");
      } else {
        $('h4').text('');
      }
    },
    showChoice: function() {
      for (i in choices) {
        var $i = $('<img>');
        $i.attr('class','img-responsive img-thumbnail pull-left ' + choices[i] + '_p1');
        $i.attr('data-choice', choices[i]);
        $i.attr('alt', choices[i]);
        $i.attr('src','assets/images/' + choices[i] + '.gif');
        $('.choices' + player).append($i);
      };
      $(document).one('click', 'img', game.setChoice);
    },
    setChoice: function() {
      var selection = $(this).attr('data-choice');
      userRef.update({
        'choice': selection
      });
      var $i = $("<img>");
      $i.attr('class', 'img-responsive img-thumbnail pull-left ' + selection + '_p1')
      $i.attr('data-choice', selection);
      $i.attr('alt', selection);
      $i.attr('src','assets/images/' + selection + '.gif');
      $('.choices' + player).empty().append($i);
      turnRef.once('value', function(snapshot) {
        var turnNum = snapshot.val();
        turnNum++;
        turnRef.set(turnNum);
      })

    },
    rotateChoice:"",
    turn1: function() {
      game.turnMessage(1);
      if (player == 1) {
        game.showChoice();
      }
    },
    turn2: function() {
      game.turnMessage(2);
      if (player == 2) {
        game.showChoice();
      }
    },
    turn3: function() {
      game.turnMessage(3);
      game.outcome();
    },
    outcome: function() {
      playersRef.once('value', function(snapshot) {
        var snap1 = snapshot.val()[1];
        var snap2 = snapshot.val()[2];
        choice1 = snap1.choice;
        wins1 = snap1.wins;
        losses1 = snap1.losses;
        choice2 = snap2.choice;
        wins2 = snap2.wins;
        losses2 = snap2.losses;
        var textChoice = otherPlayer == 1 ? choice1:choice2;
        var $i = $('<img>');
        // LEFT OFF HERE-------------------------------------------------------------
      })
    },
    logic:"",
    winner:"",
    choiceAnimation:""
  };

  game.listeners();

  var chat = {
    message:"",
    getMessage:"",
    sendMessage:"",
    sendDisconnect:"",
    showMessage:""
  };
})