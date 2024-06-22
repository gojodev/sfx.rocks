import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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

import Scraper from 'images-scraper';
import puppeteer from 'puppeteer';

async function getLink() {
    const browser = await puppeteer.launch({ headless: true });
    const google = new Scraper({
        puppeteer: {
            browser: browser,
        },
        safe: false // not in safe search 😈
    });

    let queries = ['python', 'javascript', 'java'];

    let results = [];
    for (const query of queries) {
        try {
            const result = await google.scrape(query, 1);
            results.push({ query, images: result });
        } catch (error) {
            console.error(`Error fetching images for ${query}:`, error);
            results.push({ query, images: [] });
        }
    }

    await browser.close();
    console.log('results', results);
}

getLink();


function getImages() {
    const dataPromise = Promise.resolve(getCategory());

    dataPromise.then((dataPromise) => {
        let data = JSON.parse(JSON.stringify(dataPromise))
        let length = data.length
        console.log(data[length - 3].id);
        console.log(data[length - 2].id);
        console.log(data[length - 1].id);
    });
}

// getImages();