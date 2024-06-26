import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import puppeteer from 'puppeteer';
import fs from 'fs';
import { count } from "console";

//  sounds.json has more items than cateogory.json

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

// ? (backend)
async function getRef_json(refItem) {
    const url = await getDownloadURL(refItem);
    const response = await fetch(url, { mode: 'cors' });
    let data = await response.text();
    data = JSON.parse(data);
    return data;
}

// get the links from images
// ? (backend)
const benImg = ref(storage, 'images/ben.webp');
const url = await getDownloadURL(benImg);

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// will update the URLS to images (in the JSON array) from database
// ? (backend)
async function updateURLS() {
    let data = JSON.parse(fs.readFileSync('sounds.json', 'utf8'));
    let counter = 0;
    for (const cat_key in data) {
        let cat = data[cat_key];
        for (const item_key in cat) {
            data[cat_key][item_key].category = capitalise(data[cat_key][item_key].category);
            data[cat_key][item_key].name = capitalise(data[cat_key][item_key].name);

            const imgRef = ref(storage, `images/${data[cat_key][item_key].id}.webp`);
            const soundRef = ref(storage, `sounds/${data[cat_key][item_key].id}.webm`);

            data[cat_key][item_key].img_url = await getDownloadURL(imgRef);
            data[cat_key][item_key].sound_url = await getDownloadURL(soundRef);

            counter++;
            console.log(counter, " / ", 78);
        }
    }


    data = JSON.stringify(data);

    // todo upload to firebase instead of manually updating uploading it
    fs.writeFile('sounds.json', data, (err) => {
        if (err) throw err;
    })
}

// ? (backend)
async function updateCategories() {
    updateURLS();
    const soundsRef = ref(storage, 'sounds.json');
    const soundPromise = Promise.resolve(getRef_json(soundsRef));

    soundPromise.then((catPromise) => {
        let data = catPromise;

        var cats_arr = [];
        var sorted = [];
        var current;

        for (const cat_key in data) {
            let cat = data[cat_key];
            for (const item_key in cat) {
                current = data[cat_key][item_key].category;

                if (!cats_arr.includes(current)) {
                    cats_arr.push(current);
                    sorted.push([]);
                }
                let index = cats_arr.indexOf(current);
                sorted[index].push(data[cat_key][item_key]);
            }
        }

        let cats_json = {};
        for (let i = 0; i < cats_arr.length; i++) {
            cats_json[`${cats_arr[i]}`] = sorted[i];
        }

        fs.writeFile('sounds.json', JSON.stringify(cats_json), (err) => {
            if (err) throw err;
        })

        fs.writeFile('category_array.txt', cats_arr.toString(), (err) => {
            if (err) throw err;
        })
    });
}

// updateCategories();

// todo: add select new image option
async function imgScrape(queries) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const NUMBER_OF_IMAGES = 3;
        var images;
        for (const query of queries) {
            await page.goto(`https://www.google.com/search?tbm=isch&q=${query}`);

            // Scroll to the bottom of the page to load more images
            await page.evaluate(async () => {
                for (let i = 0; i < 10; i++) {
                    window.scrollBy(0, window.innerHeight);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for more images to load
                }
            });

            // Wait for images to be loaded
            await page.waitForSelector('img');

            // Extract image URLs
            images = await page.evaluate(() => {
                const imageElements = document.querySelectorAll('img');
                const urls = [];
                imageElements.forEach(img => {
                    const url = img.src;
                    if (url.startsWith('http') && !url.includes('google')) {
                        urls.push(url);
                    }
                });
                return urls.slice(0, NUMBER_OF_IMAGES);
            });
        }

        await browser.close();
        return images;

    } catch (err) {
        console.error('An error occurred:', err);
    }
}

// const urls = Promise.resolve(imgScrape(['python programming language logo']));

// urls.then((urls) => {
//     console.log(urls);
// })