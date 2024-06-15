import { config } from "./firebase.config.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

config();

function newEntry(given_name, given_id, given_category) {
    return { name: `${given_name}`, id: `${given_id}`, category: `${given_category}` }
}

async function getCategory() {
    const storage = getStorage();
    const ref_text = ref(storage, 'category.json');
    const text_url = await getDownloadURL(ref_text);
    const response = await fetch(text_url, { mode: 'cors' });
    let text = await response.text();
    text = JSON.parse(text);
    return text;
}

function addSFX(given_name, given_id, given_category) {
    const data = getCategory()
    console.log(data)
    const jsonData = JSON.parse(data)

    let given_data = { name: `${given_name}`, id: `${given_id}`, category: `${given_category}` };

    let duplicate = false;
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