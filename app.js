const elements = {
    moves: document.querySelector('#moves'),
    timer: document.querySelector('#time'),
    start: document.querySelector('btn'),

}

const sets = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    time: 0,

}





function gameStart() {
    //Comenzamos a contar los segundos
    startTime();
}

function startTime() {
    let seconds = 1;
    let time = document.getElementById("time");
    window.setInterval(function () {
        time.textContent = seconds;
        seconds++;
    }, 1000);
}

function countMoves() {

    let card = document.getElementsByClassName("cards");
    let moves = document.getElementById("moves");
    let contador = 0;

    card.onclick = function () {
        contador++;
        moves.textContent = contador;
    }

}

let card = document.getElementsByClassName("cards");
card.onclick = function () {
    console.log("hola")
}



