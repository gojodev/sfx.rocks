import { config } from "./firebase.config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

config();

async function getCategory() {
    console.log("getting files...");
    const storage = getStorage();

    const ref_text = ref(storage, 'category.json');
    const text_url = await getDownloadURL(ref_text);
    const response = await fetch(text_url, { mode: 'cors' });
    let text = await response.text();
    text = JSON.parse(text);
    console.log(text);
    console.log("done");

    // return text;
}

getCategory();


// todo: access sounds and images from firebase
async function getSoundsAndImages() {

}

function search() {
    const Fuse = require("fuse.js");
    // ! all_sounds.json will be replaced with a link to a .json file online
    const fuse = new Fuse(all_sounds, {
        keys: ['name', 'id', 'category']
    });

    let output = fuse.search('Goofy Car Horn');
    console.log(output);
}

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
            emmanuel.src = "images/sfx_rocks.webp";
            index = 0;
        }
    }, 3500)
}

// ? DOM
// gojodev()

// todo: allow the users to submit sounds through the website
function submit() {

}

// todo: generate show all the sounds and their images
function show_sounds() {
    // loop through all media and sounds
}