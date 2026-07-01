document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelectorAll(".button");
  const reset_btn = document.querySelector("#reset-btn");
  const undo_btn = document.querySelector("#undo-btn");
  const redo_btn = document.querySelector("#redo-btn");
  const win_btn = document.querySelector("#win-btn");

  const turnText = document.querySelector("h2");

  const oScoreEl = document.querySelector("#o-score");
  const xScoreEl = document.querySelector("#x-score");
  const drawScoreEl = document.querySelector("#draw-score");
  const totalGamesEl = document.querySelector("#total-games");
  const lastWinnerEl = document.querySelector("#last-winner");

  let isOTurn = true;
  let gameEnded = false;

  let history = [];
  let redoStack = [];

  let oScore = 0;
  let xScore = 0;
  let drawScore = 0;
  let totalGames = 0;

  const winArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // FOR MOVE
  btn.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (button.innerText !== "" || gameEnded) return;

      const player = isOTurn ? "O" : "X";

      button.innerText = player;
      button.disabled = true;

      // change color on click
      if (player === "O") {
        button.style.backgroundColor = "#782B4E";
        button.style.color = "#95b8d1";
      } else {
        button.style.backgroundColor = "#223558";
        button.style.color = "#d6eadf";
      }

      history.push({ index, player });
      redoStack = [];

      isOTurn = !isOTurn;
      turnText.innerText = `${isOTurn ? "O" : "X"} TURN`;

      checkWinner();
    });
  });

  // FOR UNDO
  undo_btn.addEventListener("click", () => {
    if (history.length === 0 || gameEnded) return;

    const lastMove = history.pop();
    redoStack.push(lastMove);

    btn[lastMove.index].innerText = "";
    btn[lastMove.index].style.backgroundColor = "";
    btn[lastMove.index].style.color = "";
    btn[lastMove.index].disabled = false;

    isOTurn = lastMove.player === "O";
    turnText.innerText = `${isOTurn ? "O" : "X"} TURN`;
  });

  // FOR REDO
  redo_btn.addEventListener("click", () => {
    if (redoStack.length === 0 || gameEnded) return;

    const move = redoStack.pop();

    btn[move.index].innerText = move.player;
    btn[move.index].disabled = true;

    // Restore colors
    if (move.player === "O") {
      btn[move.index].style.backgroundColor = "#782B4E";
      btn[move.index].style.color = "#95b8d1";
    } else {
      btn[move.index].style.backgroundColor = "#223558";
      btn[move.index].style.color = "#d6eadf";
    }

    history.push(move);

    isOTurn = move.player === "O" ? false : true;
    turnText.innerText = `${isOTurn ? "O" : "X"} TURN`;

    checkWinner();
  });

  // FOR RESET
  function resetGame() {
    btn.forEach((button) => {
      button.innerText = "";
      button.disabled = false;

      // reset colors back to default
      button.style.backgroundColor = "";
      button.style.color = "";
    });

    history = [];
    redoStack = [];
    isOTurn = true;
    gameEnded = false;

    turnText.innerText = "🎮 O TURN";
  }

  reset_btn.addEventListener("click", resetGame);

  // FOR CHECK WIN / DRAW
  function checkWinner() {
    let winner = null;
    let winningPattern = null;

    for (let pattern of winArray) {
      const [a, b, c] = pattern;

      let p1 = btn[a].innerText;
      let p2 = btn[b].innerText;
      let p3 = btn[c].innerText;

      if (p1 !== "" && p1 === p2 && p2 === p3) {
        winner = p1;
        winningPattern = pattern;
        break;
      }
    }

    // WIN
    if (winner) {
      if (winner) {
        gameEnded = true;

        const [a, b, c] = winningPattern;

        btn[a].style.backgroundColor = "#00391d";
        btn[b].style.backgroundColor = "#00391d";
        btn[c].style.backgroundColor = "#00391d";
        turnText.innerText = `👑 Player ${winner} Wins!`;
      }

      updateScore(winner);

      btn.forEach((b) => (b.disabled = true));

      setTimeout(() => {
        turnText.innerText = "🔄 Next Game Starting...";
      }, 2500);

      setTimeout(() => {
        resetGame();
      }, 5000);

      return;
    }

    // DRAW
    let isDraw = true;
    btn.forEach((b) => {
      if (b.innerText === "") isDraw = false;
    });

    if (isDraw && !gameEnded) {
      gameEnded = true;
      turnText.innerText = "🤝 It's a Draw!";

      updateScore("draw");

      btn.forEach((b) => (b.disabled = true));

      setTimeout(() => {
        turnText.innerText = "🔄 Next Game Starting...";
      }, 2500);

      setTimeout(() => {
        resetGame();
      }, 5000);
    }
  }

  // FOR SCORE UPDATE
  function updateScore(result) {
    totalGames++;

    if (result === "O") {
      oScore++;
      lastWinnerEl.innerText = "Player O 🏆";
    } else if (result === "X") {
      xScore++;
      lastWinnerEl.innerText = "Player X 🏆";
    } else {
      drawScore++;
      lastWinnerEl.innerText = "Match Draw 🤝";
    }

    oScoreEl.innerText = oScore;
    xScoreEl.innerText = xScore;
    drawScoreEl.innerText = drawScore;
    totalGamesEl.innerText = totalGames;
  }

  // FOR OVERALL WINNER
  win_btn.addEventListener("click", function () {
    if (oScore === 0 && xScore === 0 && drawScore === 0) {
      lastWinnerEl.innerText = "No Games Played Yet";
      return;
    }

    if (oScore > xScore) {
      lastWinnerEl.innerText = `🏆 Overall Winner: Player O (${oScore})`;
    } else if (xScore > oScore) {
      lastWinnerEl.innerText = `🏆 Overall Winner: Player X (${xScore})`;
    } else {
      lastWinnerEl.innerText = `🤝 Overall Result: Tie`;
    }
  });
});
