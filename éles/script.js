let nRow = 12;
let nCell = 12;
let board = new Array(nRow);

for (let i = 0; i < nRow; i++) {
    board[i] = new Array(nCell).fill(null);
}

const egeszTabla = document.getElementById("map");

const ships = [
    { icon: '🚀', size: 1, id: 1 },
    { icon: '🚀', size: 1, id: 2 },
    { icon: '🚀', size: 1, id: 3 },
    { icon: '🚀', size: 1, id: 4 },
    { icon: '🚀', size: 1, id: 5 },
    { icon: '🚀', size: 1, id: 6 },
    { icon: '🚀', size: 1, id: 7 },
]

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

ships.forEach(ship => {
    placeShip(ship);
});

for (let i = 0; i < nRow; i++) {
    let sor = egeszTabla.insertRow();

    for (let j = 0; j < nCell; j++) { 
        let cell = sor.insertCell();
        if (board[i][j] !== null) {
            cell.innerHTML = board[i][j].icon;
            cell.classList.add('ship');
            cell.setAttribute('data-ship-id', board[i][j].id);
            
            cell.addEventListener('mouseenter', function() {
                const shipId = this.getAttribute('data-ship-id');
                highlightShip(shipId);
            });
            
            cell.addEventListener('mouseleave', function() {
                const shipId = this.getAttribute('data-ship-id');
                unhighlightShip(shipId);
            });
        } else {
            cell.innerHTML = "";
        }
    }
}

function highlightShip(shipId) {
    const shipCells = document.querySelectorAll(`[data-ship-id="${shipId}"]`);
    shipCells.forEach(cell => {
        cell.classList.add('hovered');
    });
}

function unhighlightShip(shipId) {
    const shipCells = document.querySelectorAll(`[data-ship-id="${shipId}"]`);
    shipCells.forEach(cell => {
        cell.classList.remove('hovered');
    });
}