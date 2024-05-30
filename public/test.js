const fs = require('fs')

const data = fs.readFileSync('category.json')

const jsonData = JSON.parse(data)

let given_name = 'testing'
let given_id = 'testing'
let given_category = 'testing'

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
}
else {
    console.log("duplicate found");
}