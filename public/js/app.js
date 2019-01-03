/*
GAME RULES:
- The game has 2 players, playing in rounds.
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score.
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn.
- The player can choose to 'Hold', which means that his ROUND score gets added to his MAIN score. After that, it's the next player's turn.
- The first player to reach "Winning Score (set by default to 100)" points on MAIN score wins the game.
*/

var scores, activePlayer, gamePlaying;
var previousRoundScore = 0;
var roundScore = 0;
var winningScore = 100;
var sfxRollDice = new Audio("sfx/dice.mp3");
var sfxFail = new Audio("sfx/fail.wav");
var sfxWin = new Audio("sfx/win.wav");
sfxRollDice.volume = 0.5;
sfxFail.volume = 0.5;
sfxWin.volume = 0.7;

init();

document.querySelector(".btn-roll").addEventListener("click", rollDice);
document.querySelector(".btn-hold").addEventListener("click", playerHold);
document.querySelector("#new-game").addEventListener("click", init);
document.querySelector(".new-game-win").addEventListener("click", init);
document
  .getElementById("winning-score")
  .addEventListener("change", setWinningScore);

window.addEventListener("keydown", function(e) {
  // go to the right
  if (e.keyCode == 32) {
    document.querySelector(".btn-roll").click();
  }
  // go to the left
  if (e.keyCode == 72) {
    document.querySelector(".btn-hold").click();
  }
});

function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;

  document.querySelector(".new-game-win").style.display = "none";
  document.querySelector(".new-game-win").style.top = "120px";
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

function rollTheDiceAnimation(elem) {
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

function rollDice() {
  if (!gamePlaying) return;

  // 1. Random number
  var diceRoll1 = Math.floor(Math.random() * 6) + 1;
  var diceRoll2 = Math.floor(Math.random() * 6) + 1;

  console.log("previousRoundScore: " + previousRoundScore);

  // 2. Display the result
  var diceDOM1 = document.querySelector(".dice-1");
  var diceDOM2 = document.querySelector(".dice-2");

  document.querySelector(".dices-container").style.opacity = "1";

  diceDOM1.setAttribute("data-value", diceRoll1);
  diceDOM2.setAttribute("data-value", diceRoll2);

  rollTheDiceAnimation(diceDOM1);
  rollTheDiceAnimation(diceDOM2);

  // 3. Update the round score IF the rolled number was NOT a 1
  if (diceRoll1 !== 1 && diceRoll2 !== 1) {
    // Add score
    sfxRollDice.play();
    roundScore += diceRoll1 + diceRoll2;

    document.querySelector("#current-" + activePlayer).textContent = roundScore;

    var playerRoundScoreDOM = document.getElementById(
      "current-" + activePlayer
    );

    var playerRoundScoreObj = new CountUp(
      playerRoundScoreDOM,
      previousRoundScore,
      roundScore,
      0,
      0.5
    );

    if (!playerRoundScoreObj.error) {
      playerRoundScoreObj.start();
    } else {
      console.error(playerRoundScoreObj.error);
    }

    previousRoundScore = roundScore;

    document.querySelector(".btn-roll").setAttribute("disabled", "disabled");
    document.querySelector(".btn-hold").setAttribute("disabled", "disabled");

    setTimeout(function() {
      document.querySelector(".btn-roll").removeAttribute("disabled");
      document
        .querySelector(".btn-hold")
        .removeAttribute("disabled", "disabled");
    }, 800);

    console.log("rolled: " + (diceRoll1 + diceRoll2));
    console.log("roundScore: " + roundScore);
  } else {
    // Next player
    previousRoundScore = 0;
    sfxFail.play();

    document.querySelector(".btn-roll").setAttribute("disabled", "disabled");
    document.querySelector(".btn-hold").setAttribute("disabled", "disabled");
    setTimeout(function() {
      document.querySelector(".dices-container").style.opacity = "0";
      document.querySelector(".btn-roll").removeAttribute("disabled");
      document
        .querySelector(".btn-hold")
        .removeAttribute("disabled", "disabled");
    }, 800);

    nextPlayer();
  }
}

function playerHold() {
  if (!gamePlaying) return;

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
  }

  document.querySelector(".dices-container").style.opacity = "0";

  // Check if player won the game
  if (scores[activePlayer] >= winningScore) {
    sfxWin.play();
    document.querySelector("#name-" + activePlayer).textContent =
      "Player " + (activePlayer + 1) + " Wins!";
    document.querySelector(".dices-container").style.opacity = "0";
    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.add("winner");

    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.remove("active");

    document.querySelector(".new-game-win").style.display = "block";

    setTimeout(function() {
      document.querySelector(".new-game-win").style.top = "171px";
    }, 100);

    gamePlaying = false;
  } else {
    nextPlayer();
  }
}

function setWinningScore() {
  if (winningScore) {
    winningScore = document.getElementById("winning-score").value;
  } else {
    winningScore = 100;
  }
  init();
}
