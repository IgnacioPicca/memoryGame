//Capturamos los elementos que vamos a utilizar
const elements = {
    moves: document.querySelector('#moves'),
    time: document.querySelector('#time'),
    start: document.querySelector('btn'),
}

//Definimos las variables que modelan el juego
const sets = {
    gameStarted: false,
    points: 0,
    time: 0,
}

//Creamos el tablero de juego
const creatBoard = () => {

    //Elementos de las cartas
    let icons = ['🍌', '🍉', '🍍', '🥕', '🍇', '🍒', '🍌', '🍉', '🍍', '🥕', '🍇', '🍒']

    //Mezclamos con un random para que no se repita su posición
    let items = mix(icons)

    //Insertamos las cartas en el html.
    //Capturamos el tablero
    let boardGame = document.getElementById("board-game");
    //Creamos las cartas y el contenido a insertar
    let cards = `
            <div class="cards-container">
                ${items.map(item => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back" onclick="flip()">${item}</div>
                    </div>
                `).join("")}
            </div>
            <div class="setup">
                <span>Time:<span id="time">0</span></span>
                <button class="btn" onclick="startTime()">Start</button>
                <span>Moves:<span id="moves">0</span></span>
        </div>
         `
    //Insertamos las cartas en el tablero
    boardGame.innerHTML += cards;
}

//Recibe el array de iconos y los retorna mezclados
function mix(icons) {
    return icons.sort(() => Math.random() - 0.5);
}



function flip() {
    console.log("Tocaste una carta")
}



//Cuando se inicia el juego, comienza a correr el tiempo
function startTime() {
    let seconds = 1;
    let time = document.getElementById("time");
    window.setInterval(function () {
        time.textContent = seconds;
        seconds++;
    }, 1000);
}

creatBoard();


