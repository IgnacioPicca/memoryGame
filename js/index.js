//Definimos la variable a modificar
let time = 0;

// Evento click en nivel
document.addEventListener('click', (evt) => {
    let lvl = evt.target.id;
    if (evt.target.className.includes('level') && lvl != '') {
        if (lvl === "extreme") {
            time = 26;
        }
        else {
            time = 35;
        }
    }
}
);

console.log(time)


// function updateTime(level) {
//     if (lvl === "extreme") {
//         time = 26;
//     }
//     else {
//         time = 35;
//     }
//     return time;
// }

// export { time }

