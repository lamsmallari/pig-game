/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

What you will learn in this lecture:

- What a state variable is, how to use it and why

*/

var scores, roundScore, activePlayer, gamePlaying;
var previousDice = 0;
var winningScore = 50;
var rollDice = new Audio("dice.mp3");
var win = new Audio("win.wav");

init();

document.getElementById("winning-score").addEventListener("change", function() {
  winningScore = document.getElementById("winning-score").value;
  init();
});

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (!gamePlaying) return;

  // 1. Random number
  rollDice.play();
  var dice = Math.floor(Math.random() * 6) + 1;
  // var dice = 6;
  console.log("player: " + (activePlayer + 1) + " - " + dice);

  // 2. Display the result
  var diceDOM = document.querySelector(".dice");
  diceDOM.style.display = "block";
  diceDOM.src = "dice-" + dice + ".png";

  // 3. Update the round score IF the rolled number was NOT a 1
  if (dice !== 1) {
    if (dice === 6) {
      previousDice++;
      if (previousDice === 2) {
        scores[activePlayer] = 0;

        // Update the main score UI
        document.querySelector("#score-" + activePlayer).textContent =
          scores[activePlayer];

        console.log(
          "reset! " + scores[activePlayer] + " " + (activePlayer + 1)
        );

        previousDice = 0;

        nextPlayer();
        return;
      }
    } else {
      previousDice = 0;
    }

    // Add score
    roundScore += dice;
    document.querySelector("#current-" + activePlayer).textContent = roundScore;
  } else {
    // Next player
    nextPlayer();
  }
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (!gamePlaying) return;

  previousDice = 0;

  // Add CURRENT score to GLOBAL score
  scores[activePlayer] += roundScore;

  // Update the UI
  document.querySelector("#score-" + activePlayer).textContent =
    scores[activePlayer];

  // Check if player won the game
  if (scores[activePlayer] >= winningScore) {
    document.querySelector("#name-" + activePlayer).textContent = "Winner!";
    document.querySelector(".dice").style.display = "none";
    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.add("winner");

    document
      .querySelector(".player-" + activePlayer + "-panel")
      .classList.remove("active");

    win.play();
    gamePlaying = false;
  } else {
    // Next player
    nextPlayer();
  }
});

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  document.querySelector(".dice").style.display = "none";
}

document.querySelector(".btn-new").addEventListener("click", init);

function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;

  document.querySelector(".dice").style.display = "none";
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
