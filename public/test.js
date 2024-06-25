let arr = [
    'Social Media', 'Sounds',
    'Goofy', 'Among Us',
    'Games', 'Shows',
    'Minecraft', 'People',
    'Annoying', 'Undertale',
    'Fortnite'
];

// console.log(arr.indexOf('Goofy'));

let word = 'Goofy';

word = word.charAt(0).toUpperCase() + word.slice(1);
// console.log(word)

import fs from 'fs';

let data = JSON.parse(fs.readFileSync('sounds.json', 'utf8'));

// console.log(data[data.length - 1]);
console.log(data.length);