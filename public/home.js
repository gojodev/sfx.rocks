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

function showLoadError() {
    const header_container = document.getElementById('cat_header_container');
    header_container.textContent = '';
    const message = document.createElement('div');
    message.classList.add('cat-header', 'black-bg', 'white', 'box-shadow');
    message.textContent = "Couldn't load sounds right now. Please try again later.";
    header_container.appendChild(message);

    const searchInput = document.getElementById('target_text');
    if (searchInput) searchInput.disabled = true;
}

function setupSearch(searchIndex, categoryEntries) {
    const searchInput = document.getElementById('target_text');
    const noResults = document.getElementById('no-results');
    const headerContainer = document.getElementById('cat_header_container');
    if (!searchInput || !headerContainer) return;

    // dedicated container for search results, rendered in relevance order
    // (name matches ranked ahead of everything else, independent of category)
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('black-bg', 'white', 'box-shadow', 'item-container');
    resultsContainer.style.display = 'none';
    headerContainer.insertBefore(resultsContainer, headerContainer.firstChild);

    const fuse = new Fuse(searchIndex, {
        keys: ['name'],
        threshold: 0.2,
        ignoreLocation: true,
        minMatchCharLength: 3,
    });

    // Ranks name matches ahead of fuzzy noise: an exact word match (e.g. "car"
    // matching "Goofy Car Horn") outranks a word merely starting with the query
    // (e.g. "Carmen"), which outranks a plain substring match, which outranks a
    // fuzzy/typo-tolerant fallback for anything not caught by the above.
    function rankResults(rawQuery) {
        const query = rawQuery.trim().toLowerCase();
        const exactWord = [];
        const wordStarts = [];
        const substring = [];
        const matched = new Set();

        searchIndex.forEach((entry) => {
            const lowerName = entry.name.toLowerCase();
            const words = lowerName.split(/\s+/);

            if (words.includes(query)) {
                exactWord.push(entry);
                matched.add(entry);
            } else if (words.some((w) => w.startsWith(query))) {
                wordStarts.push(entry);
                matched.add(entry);
            } else if (lowerName.includes(query)) {
                substring.push(entry);
                matched.add(entry);
            }
        });

        const fuzzy = fuse.search(rawQuery)
            .map((result) => result.item)
            .filter((entry) => !matched.has(entry));

        return [...exactWord, ...wordStarts, ...substring, ...fuzzy];
    }

    function showCategorizedView() {
        // replay original append order to restore each category's item sequence
        searchIndex.forEach(({ itemEl, containerEl }) => {
            containerEl.appendChild(itemEl);
        });
        categoryEntries.forEach(({ headerEl, containerEl }) => {
            headerEl.style.display = '';
            containerEl.style.display = '';
        });
        resultsContainer.style.display = 'none';
        noResults.style.display = 'none';
    }

    function showResults(query) {
        const results = rankResults(query);

        categoryEntries.forEach(({ headerEl, containerEl }) => {
            headerEl.style.display = 'none';
            containerEl.style.display = 'none';
        });

        if (results.length === 0) {
            resultsContainer.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        resultsContainer.replaceChildren();
        results.forEach((entry) => {
            resultsContainer.appendChild(entry.itemEl);
        });
        resultsContainer.style.display = 'flex';
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (!query) {
            showCategorizedView();
        } else {
            showResults(query);
        }
    });
}

function setupHomeLinkScroll() {
    document.querySelectorAll('a[href="index.html"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// will be used to fill up the DOM
async function loadInfo() {
    const soundsRef = ref(storage, 'sounds.json');
    const catArrRef = ref(storage, 'category_array.txt'); // array of category names

    const [catArrResult, soundsJsonResult] = await Promise.allSettled([getRef_text(catArrRef), getRef_json(soundsRef)]);

    if (catArrResult.status !== 'fulfilled' || soundsJsonResult.status !== 'fulfilled') {
        console.error('Failed to load sound data:', catArrResult.reason, soundsJsonResult.reason);
        showLoadError();
        return;
    }

    var catArr = catArrResult.value.split(',');
    var soundsJson = soundsJsonResult.value;

    var name;
    var id;
    var category;
    var img_url;
    var sound_url;

    var header_container
    var items_container;
    const searchIndex = [];
    const categoryEntries = [];
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
        categoryEntries.push({ headerEl: div_header, containerEl: items_container });

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
            searchIndex.push({ name, itemEl: item, containerEl: items_container });
        }
        header_container.appendChild(items_container);
    }

    setupSearch(searchIndex, categoryEntries);
}

setupHomeLinkScroll();

loadInfo().catch((err) => {
    console.error('Failed to load sound data:', err);
    showLoadError();
});