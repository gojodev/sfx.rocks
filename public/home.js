import { config } from "./config.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

config();

function gojodev() {
    let emmanuel = document.getElementById("gojodev");
    let index = 1;
    setInterval(() => {

        emmanuel.classList.remove("fadeIn");
        emmanuel.offsetWidth;
        emmanuel.classList.add("fadeIn");

        if (index == 0) {
            emmanuel.src = "images/gojodev.webp";
            index = 1;
        }
        else {
            emmanuel.src = "images/logo.webp";
            index = 0;
        }
    }, 3500)
}

gojodev()

// ! global ------------------------------------------------
const storage = getStorage();
const categoryRef = ref(storage, 'category.json');
async function getRef() {
    const text_url = await getDownloadURL(categoryRef);
    const response = await fetch(text_url, { mode: 'cors' });
    let text = await response.text();
    text = JSON.parse(text);
    return text; // returns an array of the JSON data
}

function search(query) {
    let Fuse = require("fuse.js");

    let all_sounds = []
    let fuse = new Fuse(all_sounds, {
        keys: ['name', 'id', 'category', 'img']
    });

    let output = fuse.search(query);
    console.log(output);
}

// will be used to fill up the DOM
// todo just gonna use one JSON (sounds.json)
function loadInfo() {
    const dataInfo = Promise.resolve(getRef());
    dataInfo.then((dataInfo => {

    }))
}
