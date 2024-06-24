let data = [{
    "name": "Vine Boom",
    "id": "vine-boom",
    "category": "Social Media"
},
{
    "name": "Metal Pipe",
    "id": "metal-pipe",
    "category": "Sounds"
},
{
    "name": "Goofy Car Horn",
    "id": "car-horn",
    "category": "Goofy"
}]

let test = data[0];

test.url = 'some url';

data[0] = test;

console.log(data);