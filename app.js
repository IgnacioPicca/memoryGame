//Definimos las variables que modelan el juego
let statedGame = false;
let match = 0;
let time = 25;
let flippedCards = 0;
let attempts = 0;
let card1;
let card1Value;
let card2;
let card2Value;
let countTime = null;
let points = 100;

//Capturamos los elementos del DOM
let moves = document.getElementById("moves");
let start = document.getElementById("btn");
let end = document.getElementById("endGame")
let timer = document.getElementById("time")

//Iconos del tablero
let icons = ["🍌", "🍌", "🍉", "🍉", "🍍", "🍍", "🥕", "🥕", "🥥", "🥥", "🍒", "🍒", "🍓", "🍓", "🍇", "🍇"];

//Los mezclamos
let items = mix(icons);



function resetGame() {
    items = mix(icons);
}




//Acá corre el juego
function flip(id) {

    //Iniciamos el juego
    if (!statedGame) {
        startGame();
        statedGame = true;
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
    if (match == 8) {
        youWin();
    }
}

//Cuando se inicia el juego, comienza a correr el tiempo
const startGame = () => {
    countTime = setInterval(() => {
        time--;
        timer.innerHTML = `${time}`
        if (time == 0 && match != 8) {
            clearInterval(countTime);
            Swal.fire({
                title: 'Oops...',
                text: 'Nt burrito!',
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Play again'
            }).then((result) => {
                if (result.isConfirmed) {
                    resetGame();
                }
            })
        }
    }, 1000)
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
        //Incrementamos match
        match += 1,
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
    clearInterval(countTime);
    Swal.fire({
        title: 'You won!',
        html: ` With ${attempts} moves`,
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
    })

}

