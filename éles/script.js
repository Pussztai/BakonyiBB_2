let nRow = 12;
let nCell = 12;
let board = new Array(nRow);

for (let i = 0; i < nRow; i++) {
  board[i] = new Array(nCell).fill(null);
}

const egeszTabla = document.getElementById("map");
const ships = [];

for (let i = 0; i < 7; i++) {
  ships.push({ icon: "🚀", size: 1, id: i + 1 });
}

function placeShip(ship) {
  let placed = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!placed && attempts < maxAttempts) {
    const horizontal = Math.random() < 0.5;
    const row = Math.floor(Math.random() * nRow);
    const col = Math.floor(Math.random() * nCell);

    if (canPlace(row, col, ship.size, horizontal)) {
      for (let i = 0; i < ship.size; i++) {
        if (horizontal) board[row][col + i] = { icon: ship.icon, id: ship.id };
        else board[row + i][col] = { icon: ship.icon, id: ship.id };
      }

      placed = true;
    }

    attempts++;
  }

  return placed;
}

function canPlace(row, col, size, horizontal) {
  if (horizontal) {
    if (col + size > nCell) return false;

    for (let i = 0; i < size; i++) {
      if (board[row][col + i] !== null) return false;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const r = row + dx;
          const c = col + i + dy;
          if (
            r >= 0 &&
            r < nRow &&
            c >= 0 &&
            c < nCell &&
            board[r][c] !== null
          ) {
            return false;
          }
        }
      }
    }
  } else {
    if (row + size > nRow) return false;

    for (let i = 0; i < size; i++) {
      if (board[row + i][col] !== null) return false;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const r = row + i + dx;
          const c = col + dy;
          if (
            r >= 0 &&
            r < nRow &&
            c >= 0 &&
            c < nCell &&
            board[r][c] !== null
          ) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function getDistanceToNearestShip(row, col) {
  let minDistance = Infinity;

  for (let i = 0; i < nRow; i++) {
    for (let j = 0; j < nCell; j++) {
      if (board[i][j] !== null) {
        const distance = Math.abs(i - row) + Math.abs(j - col);
        minDistance = Math.min(minDistance, distance);
      }
    }
  }

  return minDistance;
}

ships.forEach((ship) => {
  placeShip(ship);
});

const counterSpan = document.getElementById("counter");
const lepesCounter = document.getElementById("lepes");
let isChosen = false;
const warning = document.querySelector(".figyelmeztetoText");


document.getElementById("normalGame").addEventListener("click", function () {
  sessionStorage.setItem("gamemode", "normal");
  location.reload();
});

document.getElementById("timeAttack").addEventListener("click", function () {
  sessionStorage.setItem("gamemode", "time");
  location.reload();
});

let isNormalGame = false;
let isTimeAttack = false;
let gameEnded = false;
const valasztott = sessionStorage.getItem("gamemode");

if (valasztott === "normal") {
  isNormalGame = true;
  const gomb = document.getElementById("normalGame");
  gomb.classList.add("active");
  isChosen = true;
} else if (valasztott === "time") {
  isTimeAttack = true;
  const gomb = document.getElementById("timeAttack");
  gomb.classList.add("active");
  isChosen = true;
}


let remainingMoves = 20;
const BONUS_MOVES = 5;

if (isTimeAttack) {
  lepesCounter.textContent = remainingMoves;
}

for (let i = 0; i < nRow; i++) {
  let sor = egeszTabla.insertRow();

  for (let j = 0; j < nCell; j++) {
    let cell = sor.insertCell();

    if (board[i][j] !== null) {
      cell.innerHTML = board[i][j].icon;
      cell.classList.add("ship", "hidden");
      cell.setAttribute("data-ship-id", board[i][j].id);

      cell.addEventListener("click", function () {
        if (gameEnded) return;

        if (isNormalGame) {
          if (this.classList.contains("found")) return;
          let lepesValue = parseInt(lepesCounter.textContent);
          stepCounter(lepesValue);

          let currentValue = parseInt(counterSpan.textContent);
          shipCounter(currentValue);

          const shipId = this.getAttribute("data-ship-id");
          revealShip(shipId);

          this.classList.add("found");
        } else if (isTimeAttack) {
          if (this.classList.contains("found")) return;

          remainingMoves--;

          if (remainingMoves <= 0) {
            GameOver();
            return;
          }

          const shipId = this.getAttribute("data-ship-id");
          revealShip(shipId);
          this.classList.add("found");

          remainingMoves += BONUS_MOVES;
          lepesCounter.textContent = remainingMoves;

          let currentValue = parseInt(counterSpan.textContent);
          shipCounter(currentValue);
        }
      });
    } else {
      cell.innerHTML = "";
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);

      cell.addEventListener("click", function () {
        if (gameEnded) return;

        if (!this.classList.contains("clicked")) {
          const row = parseInt(this.getAttribute("data-row"));
          const col = parseInt(this.getAttribute("data-col"));
          const distance = getDistanceToNearestShip(row, col);

          if (isNormalGame) {
            let lepesValue = parseInt(lepesCounter.textContent);
            stepCounter(lepesValue);
          } else if (isTimeAttack) {
            remainingMoves--;
            lepesCounter.textContent = remainingMoves;

            if (remainingMoves <= 0) {
              GameOver();
              return;
            }
          }

          this.innerHTML = distance;
          this.classList.add("clicked");
        }
      });
    }
  }
}

function shipCounter(value) {
  if (gameEnded) return;

  value = isNaN(value) ? 0 : value + 1;
  counterSpan.textContent = value;

  if (value === 7) {
    Win();
  }
}

function stepCounter(value) {
  value++;
  lepesCounter.textContent = value;
}

function revealShip(shipId) {
  const shipCells = document.querySelectorAll(`[data-ship-id="${shipId}"]`);
  shipCells.forEach((cell) => {
    cell.classList.remove("hidden");
    cell.classList.add("revealed", "hovered");
  });
}

const gameOverBox = document.getElementById("gameOver");

function Win() {
  if (gameEnded) return;

  const heading = gameOverBox.querySelector("h2");
  if (heading) {
    heading.textContent = "Győzelem! 🎉";
  }
  gameOverBox.style.display = "flex";

  gameEnded = true;
}

function GameOver() {
  if (gameEnded) return;

  const heading = gameOverBox.querySelector("h2");
  const loseP = gameOverBox.querySelector("p");
  if (heading) {
    heading.textContent = "Vesztettél! ⏱️";
    heading.style.color = "red";
  }
  if(loseP){
    loseP.textContent = "Kifutottál a lépésekből :/"
  }
  
  gameOverBox.style.display = "flex";

  gameEnded = true;
}

const restartB = document.getElementById("restartBtn");
restartB.addEventListener("click", function () {
  gameOverBox.style.display = "none";
  sessionStorage.removeItem("gamemode");
  location.reload();
});
