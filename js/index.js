let time = 0;

document.addEventListener('click', (evt) => {
    let lvl = evt.target.id;
    if (evt.target.className.includes('level') && lvl != '') {
        lvl === "extreme" ? time = 36 : time = 46
    }
    const tiempoString = JSON.stringify(time);
    sessionStorage.setItem("tiempo", tiempoString)
}
);

const btn = document.querySelector('#btn')
btn.addEventListener("click", () => {
    time == 0 ? Swal.fire('Please choose a level') : location.href = "./game.html";
}
);

