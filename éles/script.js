let nRow = 12;
let nCell = 12;
let board = new Array(nRow);

for (let i = 0; i < nRow; i++) {
    board[i] = new Array(nCell).fill(null);
}

const egeszTabla = document.getElementById("map");
const ships = []

for (let i = 0; i < 7; i++) {
    ships.push({ icon: '🚀', size: 1, id: i + 1 })
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
        }
    } else {
        if (row + size > nRow) return false;
        
        for (let i = 0; i < size; i++) {
            if (board[row + i][col] !== null) return false;
        }
    }

    return true;
}

function getDistanceToNearestShip(row, col) {
    let minDistance = Infinity;
    
    for (let i = 0; i < nRow; i++) {
        for (let j = 0; j < nCell; j++) {
            if (board[i][j] !== null) {
                const distance = Math.max(Math.abs(i - row), Math.abs(j - col));
                minDistance = Math.min(minDistance, distance);
            }
        }
    }
    
    return minDistance;
}

ships.forEach(ship => {
    placeShip(ship);
});

for (let i = 0; i < nRow; i++) {
    let sor = egeszTabla.insertRow();

    for (let j = 0; j < nCell; j++) { 
        let cell = sor.insertCell();
        if (board[i][j] !== null) {
            cell.innerHTML = board[i][j].icon;
            cell.classList.add('ship','hidden');
            cell.setAttribute('data-ship-id', board[i][j].id);
            
            cell.addEventListener('click', function() {
                const shipId = this.getAttribute('data-ship-id');
                revealShip(shipId);
            });
        } else {
            cell.innerHTML = "";
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            
            cell.addEventListener('click', function() {
                if (!this.classList.contains('clicked')) {
                    const row = parseInt(this.getAttribute('data-row'));
                    const col = parseInt(this.getAttribute('data-col'));
                    const distance = getDistanceToNearestShip(row, col);
                    
                    this.innerHTML = distance;
                    this.classList.add('clicked');
                }
            });
        }
    }
}

function revealShip(shipId) {
    const counterSpan = document.getElementById("counter");
    let currentValue = parseInt(counterSpan.textContent);
    
    const shipCells = document.querySelectorAll(`[data-ship-id="${shipId}"]`);
    shipCells.forEach(cell => {
        cell.classList.remove('hidden');
        cell.classList.add('revealed','hovered');
        currentValue++;
        counterSpan.textContent = currentValue;
    });
    if (currentValue === 7){
        gameOver();
    }
}

const gameOverBox = document.getElementById("gameOver");

function gameOver(){
    gameOverBox.style.display = "flex";
}

const restartB = document.getElementById("restartBtn");
restartB.addEventListener('click', function(){
    gameOverBox.style.display = "none";
    location.reload();
})