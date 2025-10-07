let nRow = 12;
let nCell = 12;
let board = new Array(nRow);

for (let i = 0; i < nRow; i++) {
    board[i] = new Array(nCell).fill(null);
}

const egeszTabla = document.getElementById("map");

for (let i = 0; i < nRow; i++) {
    let sor = egeszTabla.insertRow();

    for (let j = 0; j < nCell; j++) { 
        let cell = sor.insertCell();
        cell.innerHTML = board[i][j] === null ? "" : board[i][j];
    }
}