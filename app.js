/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his MAIN score. After that, it's the next player's turn
- The first player to reach 100 points on MAIN score wins the game

*/

var scores, activePlayer, gamePlaying;
// var lastDice = 0;
var roundScore = 0;
var winningScore = 100;
var rollDice = new Audio("dice.mp3");
var fail = new Audio("fail.wav");
var win = new Audio("win.wav");
rollDice.volume = 0.5;
fail.volume = 0.5;
win.volume = 0.7;

init();

document.getElementById("winning-score").addEventListener("change", function() {
  if (winningScore) {
    winningScore = document.getElementById("winning-score").value;
  } else {
    winningScore = 100;
  }
  init();
});

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (!gamePlaying) return;

  // 1. Random number
  var diceRoll1 = Math.floor(Math.random() * 6) + 1;
  var diceRoll2 = Math.floor(Math.random() * 6) + 1;

  console.log(
    "player: " +
      (activePlayer + 1) +
      " - rolls: " +
      diceRoll1 +
      " and " +
      diceRoll2
  );

  // 2. Display the result
  var diceDOM1 = document.querySelector(".dice-1");
  var diceDOM2 = document.querySelector(".dice-2");

  document.querySelector(".dices-container").style.opacity = "1";

  diceDOM1.setAttribute("data-value", diceRoll1);
  diceDOM2.setAttribute("data-value", diceRoll2);

  rollTheDice(diceDOM1);
  rollTheDice(diceDOM2);

  // 3. Update the round score IF the rolled number was NOT a 1
  if (diceRoll1 !== 1 && diceRoll2 !== 1) {
    // Add score
    rollDice.play();
    roundScore += diceRoll1 + diceRoll2;

    var playerRoundScoreDOM = document.querySelector(
      "#current-" + activePlayer
    );

    document.querySelector("#current-" + activePlayer).textContent = roundScore;
    // lastDice = dice;

    document.querySelector(".btn-roll").setAttribute("disabled", "disabled");
    setTimeout(function() {
      document.querySelector(".btn-roll").removeAttribute("disabled");
    }, 800);
  } else {
    // Next player
    fail.play();

    document.querySelector(".btn-roll").setAttribute("disabled", "disabled");
    setTimeout(function() {
      document.querySelector(".dices-container").style.opacity = "0";
      document.querySelector(".btn-roll").removeAttribute("disabled");
    }, 800);

    nextPlayer();
  }
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (!gamePlaying) return;
  // lastDice = 0;

  // Add CURRENT score to GLOBAL score
  // scores[activePlayer] += roundScore;

  // Update the UI
  // document.querySelector("#score-" + activePlayer).textContent =
  //   scores[activePlayer];

  if (roundScore !== 0) {
    var playerScoreDOM = document.getElementById("score-" + activePlayer);

    var mainScoreObj = new CountUp(
      playerScoreDOM,
      scores[activePlayer],
      (scores[activePlayer] += roundScore),
      0,
      0.5
    );

    if (!mainScoreObj.error) {
      mainScoreObj.start();
    } else {
      console.error(mainScoreObj.error);
    }

    // var counter = new animateCounter(
    //   scores[activePlayer],
    //   (scores[activePlayer] += roundScore),
    //   25,
    //   playerScoreDOM
    // );
    // counter.function();
  }

  document.querySelector(".dices-container").style.opacity = "0";

  // Check if player won the game
  if (scores[activePlayer] >= winningScore) {
    win.play();
    document.querySelector("#name-" + activePlayer).textContent =
      "Player " + (activePlayer + 1) + " Wins!";
    document.querySelector(".dices-container").style.opacity = "0";
    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.add("winner");

    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.remove("active");

    gamePlaying = false;
  } else {
    // Next player
    nextPlayer();
  }
});

document.querySelector("#new-game").addEventListener("click", init);

function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;

  document.querySelector(".dices-container").style.opacity = "0";
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
}

function rollTheDice(elem) {
  elem.style.transform = "none";
  var deg = 120 + Math.floor(Math.random() * 360);

  setTimeout(function() {
    elem.style.webkitTransform = "rotate(" + deg + "deg)";
    elem.style.mozTransform = "rotate(" + deg + "deg)";
    elem.style.msTransform = "rotate(" + deg + "deg)";
    elem.style.oTransform = "rotate(" + deg + "deg)";
    elem.style.transform = "rotate(" + deg + "deg)";
  }, 100);
}
