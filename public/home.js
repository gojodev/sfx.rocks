function getFiles() {
    // todo: access sounds and images from firebase
    const { initializeApp, cert } = require('firebase-admin/app');
    const { getStorage } = require('firebase-admin/storage');
    var serviceAccount = require("serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: '<BUCKET_NAME>.appspot.com'
    });
}

getFiles();

function search() {
    const Fuse = require("fuse.js");
    // ! all_sounds.json will be replaced with an online databases
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

}