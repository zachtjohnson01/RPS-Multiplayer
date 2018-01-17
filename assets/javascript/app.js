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
  var presenceNumRef = database.ref("/presenceNum");
  var playersRef = database.ref("/playersRef");
  var turnRef = database.ref("/turn");
  var chatRef = database.ref("/chat");
  var results = database.ref("/results");
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
      console.log('listeners function firing');
      presenceRef.on('value', function(snapshot){
        if (snapshot.val()) {
          var con = presenceNumRef.push(true);
          con.onDisconnect().remove();
        }
      });
      presenceNumRef.on('value', function(snapshot){
        $('#watchers').text(snapshot.numChildren());
      })
      database.ref().on('value', function(snapshot) {
        var turnVal = snapshot.child('turn').val();
        if (turnVal !== null && player == undefined) {
          console.log("Only 2 players allowed.")
        }
      });
      $('#submit-name').one('click', function() {
        console.log('-----SUBMIT BUTTON SELECTED------')
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
        var wins = childSnapshot.val().wins;
        var losses = childSnapshot.val().losses;
        var $wins = $('<h6>').text('Wins: ' + wins);
        var $losses = $('<h6>').text('Losses: ' + losses);
        $wins.addClass('pull-left');
        $losses.addClass('pull-right');
        $('.score' + key).append($wins).append($losses).append('<br><br>');
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
          $('.choices1').empty();
          $('.results').empty();
          $('.choices2').empty();
          game.turn1();
        } else if (turnNum == 2) {
          game.turn2();
        } else if (turnNum == 3) {
          game.turn3();
        }
      });
      playersRef.child(1).on('child_changed', function(childSnapshot) {
        if (childSnapshot.key == 'wins') {
          wins1 = childSnapshot.val();
        } else if (childSnapshot.key == 'losses') {
          losses1 = childSnapshot.val();
        };
        if (wins1 !== undefined) {
          $('.score1 .pull-left').text('Wins: ' + wins1);
          $('.score1 .pull-right').text('Losses: ' + losses1);
        }
      });
      playersRef.child(2).on('child_changed', function(childSnapshot) {
        if (childSnapshot.key == 'wins') {
          wins2 = childSnapshot.val();
          console.log(wins2);
        } else if (childSnapshot.key == 'losses') {
          losses2 = childSnapshot.val();
        };
        $('.score2 .pull-left').text('Wins: ' + wins2);
        $('.score2 .pull-right').text('Losses: ' + losses2);
      })
    },
    setPlayer: function() {
      console.log('setPlayer function firing');
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
      console.log('addPlayer function firing');
      var playerName = $("#name-input").val();
      var name_form = $("#name-form");
      var name_panel = $(".name-panel>span");
      name_panel.empty();
      name_panel.text("Instructions");
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
      console.log('turnMessage function firing');
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
      console.log('showChoice function firing');
      for (i in choices) {
        var $i = $('<img>');
        $i.addClass('img-responsive ' + choices[i] + '_p1');
        $i.attr('data-choice', choices[i]);
        $i.attr('alt', choices[i]);
        $i.attr('src','assets/images/' + choices[i] + '.gif');
        $('.choices' + player).append(`<div class='${choices[i]}-container tablecell'>`);
        $(`.${choices[i]}-container`).append($i);
      };
      $(document).one('click', 'img', game.setChoice);
    },
    setChoice: function() {
      console.log('setChoice function firing');
      var selection = $(this).attr('data-choice');
      userRef.update({
        'choice': selection
      });
      var $i = $("<img>");
      $i.addClass('img-responsive ' + selection + '_p1')
      $i.attr('data-choice', selection);
      $i.attr('alt', selection);
      $i.attr('src','assets/images/' + selection + '.gif');
      $('.choices' + player).empty().append(`<div class='${choices[i]}-container tablecell'>`);
      $(`.${choices[i]}-container`).append($i);
      turnRef.once('value', function(snapshot) {
        var turnNum = snapshot.val();
        turnNum++;
        turnRef.set(turnNum);
      })

    },
    rotateChoice:"",
    turn1: function() {
      console.log('turn1 function firing');
      game.turnMessage(1);
      if (player == 1) {
        game.showChoice();
      }
    },
    turn2: function() {
      console.log('turn2 function firing');
      game.turnMessage(2);
      if (player == 2) {
        game.showChoice();
      }
    },
    turn3: function() {
      console.log('turn3 function firing');
      game.turnMessage(3);
      game.outcome();
    },
    outcome: function() {
      console.log('outcome function firing');
      playersRef.once('value', function(snapshot) {
        console.log(snapshot.val());
        var snap1 = snapshot.val()[1];
        console.log('snap1: ' + snap1);
        var snap2 = snapshot.val()[2];
        console.log('snap2: ' + snap2);
        choice1 = snap1.choice;
        console.log('choice1: ' + choice1);
        wins1 = snap1.wins;
        losses1 = snap1.losses;
        choice2 = snap2.choice;
        wins2 = snap2.wins;
        losses2 = snap2.losses;
        var textChoice = otherPlayer == 1 ? choice1:choice2;
        var $i = $('<img>');
        $i.addClass(textChoice + '_p1');
        $i.attr('data-choice', textChoice);
        $i.attr('alt', textChoice);
        $i.attr('src', 'assets/images/' + textChoice + '.gif');
        $('.choices' + otherPlayer).append($i);
        game.choiceAnimation();
      })
    },
    logic: function() {
      console.log('logic function firing');
      if (choice1 == choice2) {
        game.winner(0);
      } else if (choice1 == 'rock') {
        if (choice2 == 'paper') {
          game.winner(2);
        } else if (choice2 == 'scissors') {
          game.winner(1);
        }
      } else if (choice1 == 'paper') {
        if (choice2 == 'rock') {
          game.winner(1);
        } else if (choice2 == 'scissors') {
          game.winner(2);
        }
      } else if (choice1 == 'scissors') {
        if (choice2 == 'rock') {
          game.winner(2);
        } else if (choice2 == 'paper') {
          game.winner(1);
        }
      }
    },
    winner: function(playerNum) {
      console.log('winner function firing');
      var results;
      if (playerNum == 0) {
        results = 'Tie!';
      } else {
        results = name[playerNum] + ' Wins!';
        if (playerNum == 1)  {
          wins = wins1;
          losses = losses2;
        } else {
          wins = wins2;
          losses = losses1;
        };
        wins++;
        losses++;
        // showResults(results);
        var otherPlayerNum = playerNum == 1 ? 2:1;
        $('.choices' + otherPlayerNum + ' > img').css('opacity','0.5');
        window.setTimeout(function() {
          playersRef.child(playerNum).update({
            'wins': wins
          });
          playersRef.child(otherPlayerNum).update({
            'losses': losses
          });
        }, 500);
      }
      window.setTimeout(function() {
        console.log('CSS Animation Step 1');
        $('.results').text(results).css('z-index','1');
      }, 500);
      window.setTimeout(function() {
        console.log('CSS Animation Step 2');
        turnRef.set(1);
        $('.results').text('').css('z-index','-1');
      }, 2000);
    },
    // showResults:function(results){
    //   $('.results').text(results).css('z-index','1');
    // },
    choiceAnimation:function() {
      console.log('choiceAnimation function firing');
      var $choice1 = $('.choices1 > img');
      var $choice2 = $('.choices2 > img');
      $choice1.addClass('animation-choice1');
      $choice1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
        $choice1.addClass('choice1-end');
      });
      $choice2.addClass('animation-choice2');
      $choice2.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
        $choice2.addClass('choice2-end');
        game.logic();
      });
    }
  };

  game.listeners();

  var chat = {
    message:"",
    getMessage:"",
    sendMessage: function() {
      $('.message_submit').on('click', function(event) {
        event.preventDefault();
        var message = $('.message_input').val();
        chatRef.push(message);
        $('.message_input').val('');
      });
      chat.showMessage();
    },
    sendDisconnect:"",
    showMessage: function() {
      chatRef.on('child_added', function(childSnapshot, prevChildKey) {
        var message_list = childSnapshot.val();
        $('.message_body').append(message_list + '<br>')
      });
    },
  };

  chat.sendMessage();
})