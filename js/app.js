let statedGame = false;
let match = 0;
let tiempo = sessionStorage.getItem("tiempo");
let time = JSON.parse(tiempo);
let flippedCards = 0;
let attempts = 0;
let card1;
let card1Value;
let card1Id;
let card2;
let card2Value;
let card2Id;
let countTime = null;
let points = 100;
let imgSrc = [];
let topFive = [
    { name: 'Ash', point: 95 },
    { name: 'Brock', point: 81 },
    { name: 'Jessie', point: 75 },
    { name: 'Misty', point: 46 },
    { name: 'Oak', point: 35 }
];

let firstCardAudio = new Audio("./sounds/firstCard.wav");
let matchAudio = new Audio("./sounds/match.wav");
let noMatch = new Audio("./sounds/noMatch.wav");
let loseAudio = new Audio("./sounds/lose.wav");
let win = new Audio("./sounds/win.wav");
let music = new Audio("./sounds/music.mp3");
music.volume = 0.5;

let moves = document.getElementById("moves");
let timer = document.getElementById("time");
let musicOn = document.querySelector("#music-on");
let musicOff = document.querySelector("#music-off");


musicOff.addEventListener('click', (e) => {
    music.play();
    e.target.style.display = "none";
    musicOn.style.display = "block";
});

musicOn.addEventListener('click', (e) => {
    music.pause();
    e.target.style.display = "none";
    musicOff.style.display = "block";

});

document.addEventListener('click', (e) => {
    let elementId = e.target.id;
    if (e.target.className.includes('face') && elementId != '') {
        flip(elementId);
    }
});

document.addEventListener('click', (e) => {
    if (e.target.className.includes('topScore')) {
        showScores();
    }
});

let pokes = [
    create(1), create(1), create(4), create(4),
    create(7), create(7), create(25), create(25),
    create(39), create(39), create(54), create(54),
    create(104), create(104), create(151), create(151)
];

async function create(id) {
    const pok = await getPoke(id);
    let src = pok.sprites.other.dream_world.front_default;
    imgSrc.push(src);
    imgSrc.sort(() => Math.random() - 0.5);
}

async function getPoke(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
}

const startGame = () => {
    music.play();
    countTime = setInterval(() => {
        time--;
        timer.innerHTML = `${time}`;
        if (time <= 5) {
            timer.classList.add("red");
        }
        if (time == 0 && match != 8) {
            youLose();
        }
    }, 1000)
}

function flip(id) {
    if (!statedGame) {
        startGame();
        statedGame = true;
    }

    flippedCards += 1;

    if (flippedCards === 1) {
        firstCardAudio.play();
        card1 = document.getElementById(id);
        card1.classList.add('flippedCard');
        card1Value = imgSrc[id];
        setTimeout(() => {
            card1.innerHTML = `<img src="${imgSrc[id]}" alt="">`
        }, 250)
        card1Id = id;
        card1.classList.add('unavailable');
    }

    else if (flippedCards === 2) {
        card2 = document.getElementById(id);
        card2.classList.add('flippedCard');
        card2Value = imgSrc[id];
        setTimeout(() => {
            card2.innerHTML = `<img src="${imgSrc[id]}" alt="">`
        }, 250)
        card2Id = id;
        attempts++;
        moves.innerHTML = attempts;
        checkMatch(card1Value, card1Id, card2Value, card2Id);
    }

    if (match == 8) {
        youWin();
    }
}

function checkMatch(card1Value, card1Id, card2Value, card2Id) {
    card1Value == card2Value ? (
        matchAudio.play(),
        flippedCards = 0,
        match += 1,
        card2.classList.add('unavailable')) :
        setTimeout(() => {
            noMatch.play(),
                flippedCards = 0;
            card1.classList.remove('flippedCard');
            card2.classList.remove('flippedCard');
            card1.innerHTML = `<img src="./img/pokeCard.png" alt="" class="face" id="${card1Id}">`;
            card2.innerHTML = `<img src="./img/pokeCard.png" alt="" class="face" id="${card2Id}">`;
            card1.classList.remove('unavailable');
        }, 850)
}

function youLose() {
    music.pause();
    loseAudio.play();
    clearInterval(countTime);
    showCards();
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
    });
}

function youWin() {
    music.pause();
    win.play();
    clearInterval(countTime);
    showCards();
    Swal.fire({
        title: 'You won! </br>',
        html: `With ${attempts} moves & ${points - attempts + time} points </br></br> Do you want to save your score?`,
        width: 600,
        padding: '2em',
        color: 'rgba(34, 193, 195, 1)',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: '<a class="noLink" href="https://mentalchallenge.netlify.app/">Play again</a>',
        allowEscapeKey: false,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            saveScore();
        }
    });
}

function showCards() {
    for (let i = 0; i < pokes.length; i++) {
        let card = document.getElementById(i);
        card.innerHTML = `<img src="${imgSrc[i]}" alt="">`;
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
    });
}


function showScores() {
    for (let i = 0; i < localStorage.length; i++) {
        let name = localStorage.key(i);
        let point = JSON.parse(localStorage.getItem(localStorage.key(i))).score;
        topFive.push({ name, point });
        topFive.sort(sortTopFive);

    }
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
    });
}

function sortTopFive(a, b) {
    return b.point - a.point;
}

function getPoints() {
    return points - attempts + time;
}

function setScore(user) {
    if (localStorage.length < 5) {
        localStorage.setItem(user.name, JSON.stringify(user))
    }
    else {
        for (let i = 0; i < localStorage.length; i++) {
            let usuarios = JSON.parse(localStorage.getItem(localStorage.key(i)))
            if (user.score > usuarios.score) {
                localStorage.setItem(user.name, JSON.stringify(user))
                break;
            }
        }
    }
}