function gameStart() {
    //Comenzamos a contar los segundos
    startTime();
}

function startTime() {
    let seconds = 0;
    let time = document.getElementById("time");
    window.setInterval(function () {
        time.innerHTML = seconds;
        seconds++;
    }, 1000);
}

function flipCard() {
    let aux = 1;
    let moves = document.getElementsByClassName("moves");
    moves.innerHTML = aux;
}