import { config } from "./firebase.config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// const fs = require('fs')
import { fs } from "fs";

config();

async function getCategory() {
    const storage = getStorage();
    const ref_text = ref(storage, 'category.json');
    const text_url = await getDownloadURL(ref_text);
    const response = await fetch(text_url, { mode: 'cors' });
    let text = await response.text();
    text = JSON.parse(text);
    return text;
}

// ? will be used for when users can add sounds 
function addSfx(given_name, given_id, given_category) {
    // todo change this to be an online link instead of a local file
    // const data = fs.readFileSync('category.json')
    const data = getCategory()
    const jsonData = JSON.parse(data)

    let given_data = { name: `${given_name}`, id: `${given_id}`, category: `${given_category}` }

    var duplicate = false;
    for (let i = 0; i < jsonData.length; i++) {
        let obj = jsonData[i];

        if (given_data.id == obj.id) {
            duplicate = true
            break;
        }
    }

    if (duplicate == false) {
        jsonData.push(given_data)
        const jsonString = JSON.stringify(jsonData)
        fs.writeFileSync('category.json', jsonString, 'utf-8')
        console.log("new item added")
        return jsonData
    }
    else {
        console.log("duplicate found");
        return {}
    }
}

addSfx('test', 'test', 'test')

function search() {
    const Fuse = require("fuse.js");
    // ! all_sounds.json will be replaced with a link to a .json file online
    const all_sounds = []
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
            emmanuel.src = "images/logo.webp";
            index = 0;
        }
    }, 3500)
}

gojodev()

// todo: generate show all the sounds and their images
function show_sounds() {
    // loop through all media and sounds
}