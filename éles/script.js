let nrow = 12;
let ncell = 12;

let board = new Array(nrow);
for(let i = 0;i<nrow;i++){
    board[i] = new Array(ncell).fill(null);
}


const egeszTabla = document.getElementById("map");
for(let i = 0;i<nrow;i++){
    let sor = egeszTabla.insertRow();
    for(let j = 0;j<ncell;j++){
        let cell = sor.insertCell();
        cell.innerHTML = board[i][j] === null ? "ures":board[i][j];
    }
}
// for(let i = 0;i<ujsor;i++){
//     ujsor = document.getElementById("map").insertRow(i);
//     t[i] = new Array(ncell);
//     for(let j = 0;j<ncell;j++){
//         t[i][j] = newrow.insertCell(j);
//         t[i][j].id = i*ncell+j;
//         t[i][j].onclick = function(){myStep(this);};
//         t[i][j].style.width = "50px";
//         t[i][j].style.heigth = "50px";
//         t[i][j].style.color = "#fcfcfc";
//         t[i][j].style.background = "#ff3333";
//         t[i][j].innerHtml = parseInt(t[i][j].id)+1;
//     }
// }