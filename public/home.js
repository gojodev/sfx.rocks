import { config } from "./firebase.config.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

// ! global
const storage = getStorage();
const categoryRef = ref(storage, 'category.json');
const testCatRef = ref(storage, 'testCat.json');
async function getCategory() {
    const text_url = await getDownloadURL(categoryRef);
    const response = await fetch(text_url, { mode: 'cors' });
    let text = await response.text();
    text = JSON.parse(text);
    return text; // returns an array of the JSON data
}

async function addSFX(given_name, given_id, given_category) {
    const dataPromise = Promise.resolve(getCategory());

    dataPromise.then((dataPromise) => {
        let data = JSON.parse(JSON.stringify(dataPromise))
        let given_data = { name: `${given_name}`, id: `${given_id}`, category: `${given_category}` };

        let duplicate = false;
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];

            if (given_data.id == obj.id) {
                duplicate = true
                break;
            }
        }

        if (duplicate == false) {
            data.push(given_data)
            console.log(data)
            let test;

            // todo upload updated JSON to firebase storage
            uploadBytes(testCatRef, data);
        }
        else {
            console.log(`Didn't add : ${JSON.stringify(given_data)} \nas ID: "${given_data.id}" already exists`)
        }
    })
}

addSFX('test', 'test', 'test')
// addSFX('Eat', 'eat', 'Minecraft')


function search(query) {
    let Fuse = require("fuse.js");

    let all_sounds = []
    let fuse = new Fuse(all_sounds, {
        keys: ['name', 'id', 'category']
    });

    let output = fuse.search(query);
    console.log(output);
}