import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Fuse from 'fuse.js';

function config() {
    const firebaseConfig = {
        apiKey: "AIzaSyA77HYtVdsJD_SdwDgdVWvGDeDA1IIquKY",
        authDomain: "sfx-rocks.firebaseapp.com",
        projectId: "sfx-rocks",
        storageBucket: "sfx-rocks.appspot.com",
        messagingSenderId: "221320269920",
        appId: "1:221320269920:web:0804ed9dfe08c466677305",
        measurementId: "G-V506HKS3NE"
    };

    initializeApp(firebaseConfig);
}

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

// gojodev()


const storage = getStorage(); // ! global
async function getRef_json(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: 'cors' });
    let data = await response.text();
    data = JSON.parse(data);
    return data;
}

async function getRef_text(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: 'cors' });
    let data = await response.text();
    return data;
}

function search(query) {
    let all_sounds = []
    let fuse = new Fuse(all_sounds, {
        keys: ['name', 'id', 'category', 'img']
    });

    let output = fuse.search(query);
    console.log(output);
}

// will be used to fill up the DOM
async function loadInfo() {
    const soundsRef = ref(storage, 'sounds.json');
    const catArrRef = ref(storage, 'category_array.txt'); // array of category names

    let [catArr, catJson, soundsJson] = await Promise.allSettled([getRef_text(catArrRef), getRef_json(soundsRef)]);
    // todo sort alphabeti later
    catArr = catArr.value.split(',');
    soundsJson = soundsJson.value;
    // console.log(catArr);
    // console.log(soundJson);

    let name;
    let id;
    let category;
    let img_url;
    let sound_url;
    for (const cat_key in catJson) {
        let cat = catJson[cat_key];
        console.log(cat_key);
        for (const item_key in cat) {
            name = cat[item_key].name;
            id = cat[item_key].id;
            category = cat[item_key].category;
            img_url = cat[item_key].img_url;
            sound_url = cat[item_key].sound_url;
            // const div = document.createElement("div");
            // const div_node = document.createTextNode(`Name: ${catJson[key].name}`);
            // div.appendChild(div_node);

            // const img = document.createElement("img");
            // const img_node = document.createTextNode()
        }
    }
}

loadInfo();