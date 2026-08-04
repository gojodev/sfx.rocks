document.getElementById("year").textContent = new Date().getFullYear();


function about_me() {
    var bday = new Date("06/08/2004");
    var today = new Date();

    // To calculate the time difference of two dates 
    var time_diff = today.getTime() - bday.getTime();
    time_diff = (time_diff / 1000) / 31556952;

    let age = time_diff.toFixed(3);
    document.getElementById("founder-name").textContent = `Emmanuel Koledoye (~${age})`;
}

about_me();

function gojodev() {
    let gojodev = document.getElementById("gojodev");
    let index = 0;
    setInterval(() => {

        gojodev.classList.remove("fadeIn");
        gojodev.offsetWidth;
        gojodev.classList.add("fadeIn");

        if (index == 0) {
            gojodev.src = "images/gojodev.webp";
            index = 1;
        }
        else {
            gojodev.src = "images/logo.webp";
            index = 0;
        }
    }, 2500)
}

gojodev()