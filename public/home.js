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

// ! global ------------------------------------------------
const storage = getStorage();
async function getRef(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: 'cors' });
    let data = await response.text();
    data = JSON.parse(data);
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
// todo just gonna use one JSON (sounds.json)
function loadInfo() {
    const categoryRef = ref(storage, 'category.json');
    const soundsRef = ref(storage, 'sounds.json');
    const catInfo = Promise.resolve(getRef(categoryRef));
    catInfo.then((catInfo => {
        console.log(catInfo);
    }))

    const soundInfo = Promise.resolve(getRef(categoryRef));
    soundInfo.then((soundInfo => {

    }))
}

loadInfo();

console.log('helloworld')