//Definimos las variables que modelan el juego
let statedGame = false;
let points = 0;
let time = 0;
let flippedCards = 0;
let attempts = 0;
let card1;
let card1Value;
let card2;
let card2Value;

//Capturamos los elementos del DOM
let moves = document.getElementById("moves");
let start = document.getElementById("btn");
let end = document.getElementById("endGame")

//Iconos del tablero
let icons = ["🍌", "🍌", "🍉", "🍉", "🍍", "🍍", "🥕", "🥕", "🥥", "🥥", "🍒", "🍒", "🍓", "🍓", "🍇", "🍇"];

//Los mezclamos
let items = mix(icons);


//Acá corre el juego
function flip(id) {

    //Iniciamos el juego
    if (!statedGame) {
        startGame();
    }

    //Incrementamos las cartas mostradas
    flippedCards += 1;

    //Selección de la primera carta
    if (flippedCards === 1) {
        //Capturamos la carta que se elige 
        card1 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card1Value = items[id]
        //Mostramos el valor asignado
        card1.innerHTML = items[id]
        //Le agregamos la clase unavailable
        card1.classList.add('unavailable')
    }

    //Selección de la segunda carta
    else if (flippedCards === 2) {
        //Capturamos la carta que se elige 
        card2 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card2Value = items[id]
        //Mostramos el valor asignado
        card2.innerHTML = items[id]
        //Sumamos un intento
        attempts++;
        //Actualizamos los movimientos
        moves.innerHTML = attempts
        //Chequeamos una coincidencia
        checkMatch(card1Value, card2Value);
    }

    //Si se hacen 8 puntos, se gana
    if (points == 1) {
        youWin();
    }
}


//Cuando se inicia el juego, comienza a correr el tiempo
const startGame = () => {
    statedGame = true;
    let seconds = 1;
    let time = document.getElementById("time");
    window.setInterval(function () {
        time.textContent = seconds;
        seconds++;
    }, 1000);
}


//Recibe el array de iconos y los retorna mezclados
function mix(icons) {
    return icons.sort(() => Math.random() - 0.5);
}

function checkMatch(card1Value, card2Value) {
    //Si el valor de las dos cartas elegidas coincide
    card1Value == card2Value ? (
        //Reestablecemos flippedCards
        flippedCards = 0,
        //Incrementamos points
        points += 1,
        //Inhabilitamos su selección 
        card2.classList.add('unavailable')) :

        //Despues de un segundo
        setTimeout(() => {
            //Reestablecemos flippedCards
            flippedCards = 0;
            //Ocultamos el contenido de las tarjetas
            card1.innerHTML = "";
            card2.innerHTML = "";
            //Volvemos a habilitar la tarjeta
            card1.classList.remove('unavailable')
        }, 600)
}

function youWin() {
    Swal.fire({
        title: 'You won!',
        html: ` With ${attempts} moves
        `,
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
    })
}

