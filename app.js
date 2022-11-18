function gameStart() {
    let seconds = 0;
    let time = document.getElementById("time");
    window.setInterval(function () {
        time.innerHTML = seconds;
        seconds++;
    }, 1000);
}

