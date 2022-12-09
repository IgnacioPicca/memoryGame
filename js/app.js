let statedGame = false;
let match = 0;
let tiempo = sessionStorage.getItem("tiempo")
let time = JSON.parse(tiempo)
let flippedCards = 0;
let attempts = 0;
let card1;
let card1Value;
let card2;
let card2Value;
let countTime = null;
let points = 100;
let topFive = [
    { name: 'Ash', point: 95 },
    { name: 'Brock', point: 81 },
    { name: 'Jessie', point: 75 },
    { name: 'Misty', point: 46 },
    { name: 'Oak', point: 35 }
];
let imgSrc = []

let firstCardAudio = new Audio("./sounds/firstCard.wav")
let matchAudio = new Audio("./sounds/match.wav")
let noMatch = new Audio("./sounds/noMatch.wav")
let loseAudio = new Audio("./sounds/lose.wav")
let win = new Audio("./sounds/win.wav")
let music = new Audio("./sounds/music.wav")
music.volume = 0.1;

let moves = document.getElementById("moves");
let start = document.getElementById("btn");
let end = document.getElementById("endGame")
let timer = document.getElementById("time")
let cards = document.getElementsByClassName("card")
let musicOn = document.querySelector("#music-on")
let musicOff = document.querySelector("#music-off")


//Manejo de eventos

musicOff.addEventListener('click', (e) => {
    console.log("music off")
    music.play();
    e.target.style.display = "none"
    musicOn.style.display = "block"
})

musicOn.addEventListener('click', (e) => {
    console.log("music on")
    music.pause();
    e.target.style.display = "none"
    musicOff.style.display = "block"

})

document.addEventListener('click', (e) => {
    let elementId = e.target.id;
    if (e.target.className.includes('card') && elementId != '') {
        flip(elementId);
    }
}
);

document.addEventListener('click', (e) => {
    if (e.target.className.includes('topScore')) {
        showScores();
    }
}
);

//Pokemons del tablero
let pokes = [
    create(1), create(1), create(4), create(4),
    create(7), create(7), create(25), create(25),
    create(39), create(39), create(54), create(54),
    create(104), create(104), create(151), create(151)
];

async function create(id) {
    const pok = await getPoke(id)
    let src = pok.sprites.other.dream_world.front_default;
    imgSrc.push(src)
    imgSrc.sort(() => Math.random() - 0.5);
}

async function getPoke(id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await res.json()
        return data
    } catch (e) {
        console.log("Error")
    }
}

//Cuando se inicia el juego, comienza a correr el tiempo
const startGame = () => {
    music.play();
    countTime = setInterval(() => {
        time--;
        timer.innerHTML = `${time}`
        if (time <= 5) {
            timer.classList.add("red")
        }
        if (time == 0 && match != 8) {
            youLose();
        }
    }, 1000)
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
        firstCardAudio.play();
        //Capturamos la carta que se elige 
        card1 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card1Value = imgSrc[id]
        //Mostramos el valor asignado
        card1.innerHTML = `<img src="${imgSrc[id]}" alt="">`
        //Le agregamos la clase unavailable
        card1.classList.add('unavailable')
    }

    //Selección de la segunda carta
    else if (flippedCards === 2) {
        //Capturamos la carta que se elige 
        card2 = document.getElementById(id)
        //Le asignamos un valor del arreglo
        card2Value = imgSrc[id]
        //Mostramos el valor asignado
        card2.innerHTML = `<img src="${imgSrc[id]}" alt="">`
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

function checkMatch(card1Value, card2Value) {
    //Si el valor de las dos cartas elegidas coincide
    card1Value == card2Value ? (
        matchAudio.play(),
        //Reestablecemos flippedCards
        flippedCards = 0,
        //Incrementamos match
        match += 1,
        //Inhabilitamos su selección 
        card2.classList.add('unavailable')) :
        //Despues de un segundo
        setTimeout(() => {
            noMatch.play(),
                //Reestablecemos flippedCards
                flippedCards = 0;
            //Ocultamos el contenido de las tarjetas
            card1.innerHTML = "";
            card2.innerHTML = "";
            //Volvemos a habilitar la tarjeta
            card1.classList.remove('unavailable')
        }, 550)
}

function youLose() {
    music.pause();
    loseAudio.play();
    //Paramos el tiempo
    clearInterval(countTime);
    showCards();
    //Mostramos cartel de derrota y preguntamos si queremos jugar otra vez
    Swal.fire({
        title: 'Oops...',
        text: 'Nice try!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        cancelButtonText: '<a class="noLink topScore">Top scores</a>',
        allowEscapeKey: false,
        allowOutsideClick: false,
    })
}

function youWin() {
    music.pause();
    win.play();
    //Frenamos el tiempo
    clearInterval(countTime);
    //Mostramos y bloqueamos las cartas
    showCards();
    //Mostramos resumen de victoria
    Swal.fire({
        title: 'You won! </br>',
        html: `With ${attempts} moves & ${points - attempts + time} points </br></br> Do you want to save your score?`,
        width: 600,
        padding: '2em',
        color: 'rgba(34, 193, 195, 1)',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        cancelButtonText: '<a class="noLink topScore">Top scores</a>',
        allowEscapeKey: false,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            saveScore();
        }
    })
}

function showCards() {
    for (let i = 0; i < pokes.length; i++) {
        //Capturamos todas las cartas
        let card = document.getElementById(i);
        //Printeamos su contenido
        card.innerHTML = `<img src="${imgSrc[i]}" alt="">`
        //Bloqueamos su uso
        card.classList.add('unavailable');
    }
}

function saveScore() {
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: 'Submit your amazing name',
        input: 'text',
        confirmButtonText: 'Save',
        inputValidator: name => {
            if (!name) {
                return "Please write your name";
            } else {
                return undefined;
            }
        }
    })
        .then(resultado => {
            if (resultado.value) {
                let user = { name: resultado.value, score: getPoints() }
                setScore(user);
                playAgain();
            }
        });
}

function playAgain() {
    Swal.fire({
        title: 'Do you want to play again?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        denyButtonText: `Cancel`,
        cancelButtonText: '<a class="noLink topScore">Top scores</a>',
        allowEscapeKey: false,
        allowOutsideClick: false,
    })
}

//Mostramos los scores y los usuarios por consola
function showScores() {

    for (let i = 0; i < localStorage.length; i++) {
        let name = localStorage.key(i)
        let point = JSON.parse(localStorage.getItem(localStorage.key(i))).score
        // console.log("El usuario", name + " hizo", point + " puntos")
        topFive.push({ name, point })
        topFive.sort(sortTopFive);
        // console.log(topFive)

    }
    // sortTopFive(topFive);
    Swal.fire({
        title: '<strong>TOP FIVE</strong>',
        html:
            `<table>
        <tbody>
            <tr>
                <td class="title-td">Player</td>
                <td class="title-td">Point</td>
            </tr>
            <tr>
                <td class="user">${topFive[0].name}</td>
                <td class="point">${topFive[0].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[1].name}</td>
                <td class="point">${topFive[1].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[2].name}</td>
                <td class="point">${topFive[2].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[3].name}</td>
                <td class="point">${topFive[3].point}</td>
            </tr>
            <tr>
                <td class="user">${topFive[4].name}</td>
                <td class="point">${topFive[4].point}</td>
            </tr>
        </tbody>
    </table>
  `,
        confirmButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        allowOutsideClick: false,
        allowEscapeKey: false,
    })
}

function sortTopFive(a, b) {
    return b.point - a.point;
}

function getPoints() {
    return points - attempts + time;
}

function setScore(user) {

    //Si el localStorage no tiene 5 usuarios guardados, los ingresamos
    if (localStorage.length < 5) {
        localStorage.setItem(user.name, JSON.stringify(user))
    }
    else {
        //Iteramos el local storage
        for (let i = 0; i < localStorage.length; i++) {
            //Reservamos el nombre y el puntaje
            // let name = localStorage.key(i)
            let usuarios = JSON.parse(localStorage.getItem(localStorage.key(i)))
            //Si el puntaje del usuario nuevo es mayor al puntaje del usuario viejo
            //Guardamos en el localstorage
            if (user.score > usuarios.score) {
                localStorage.setItem(user.name, JSON.stringify(user))
                break;
            }
        }
    }
}


