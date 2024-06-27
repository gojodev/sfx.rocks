document.getElementById("year").innerHTML = new Date().getFullYear();


function about_me() {
    var bday = new Date("06/08/2004");
    var today = new Date();

    // To calculate the time difference of two dates 
    var time_diff = today.getTime() - bday.getTime();
    time_diff = (time_diff / 1000) / 31556952;

    let age = time_diff.toFixed(3);
    document.getElementById("founder-name").innerHTML = `Emmanuel Koledoye (~${age})`;
}

about_me();

function gojodev() {
    let gojodev = document.getElementById("gojodev");
    let emmanuel = document.getElementById("emmanuel");
    let index = 0;
    setInterval(() => {

        gojodev.classList.remove("fadeIn");
        gojodev.offsetWidth;
        gojodev.classList.add("fadeIn");

        if (index == 0) {
            emmanuel.style = "border-radius: 50%";
            emmanuel.src = "images/gojodev.webp";

            gojodev.src = "images/gojodev.webp";
            index = 1;
        }
        else {
            emmanuel.style = "border-radius: 20px";
            emmanuel.src = "images/emmanuel.webp";

            gojodev.src = "images/logo.webp";
            index = 0;
        }
    }, 2500)
}

gojodev()