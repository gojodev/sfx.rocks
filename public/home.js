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

gojodev()


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

    var [catArr, soundsJson] = await Promise.allSettled([getRef_text(catArrRef), getRef_json(soundsRef)]);
    var catArr = catArr.value.split(',');
    var soundsJson = soundsJson.value;

    var name;
    var id;
    var category;
    var img_url;
    var sound_url;

    var header_container
    var items_container;
    for (const cat_key in soundsJson) {
        let cat = soundsJson[cat_key];
        const div_header = document.createElement("div");
        const div_node = document.createTextNode(cat_key);
        div_header.appendChild(div_node);

        div_header.classList.add('cat-header', 'black-bg', 'white', 'box-shadow')
        header_container = document.getElementById('cat_header_container');
        header_container.appendChild(div_header);

        items_container = document.createElement("div");
        items_container.classList.add('black-bg', 'white', 'box-shadow', 'item-container');

        for (const item_key in cat) {
            name = cat[item_key].name;
            id = cat[item_key].id;
            category = cat[item_key].category;
            img_url = cat[item_key].img_url;
            // ? dunno why this is only the last one
            sound_url = cat[item_key].sound_url;

            const item = document.createElement("span");
            item.classList.toggle('item');
            const img = document.createElement("img");
            img.classList.add('img-style');
            img.src = img_url;
            img.id = id;
            item.appendChild(img);

            const img_desc = document.createElement('h3');
            const img_desc_node = document.createTextNode(name);
            img_desc.appendChild(img_desc_node);
            item.appendChild(img_desc);

            img.addEventListener('click', () => {
                // the sound_url variable wasn't working for some reason
                var audio = new Audio(`${cat[item_key].sound_url}`);
                audio.play();
            });

            items_container.appendChild(item);
        }
        header_container.appendChild(items_container);
    }
}

loadInfo();