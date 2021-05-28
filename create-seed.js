const fs = require('fs');

const foods = require('./fruits.json')

fs.writeFileSync('seed.json', JSON.stringify(
    foods.map(f => ({
            name: f.name,
            calories: parseFloat(f.nutrients.find(n => n.name === 'energy')?.value) || 0,
            proteins: parseFloat(f.nutrients.find(n => n.name === 'protein')?.value) || 0,
            fats: parseFloat(f.nutrients.find(n => n.name === 'fat')?.value) || 0,
            sugar: parseFloat(f.nutrients.find(n => n.name === 'sugars')?.value) || 0,
            fiber: parseFloat(f.nutrients.find(n => n.name === 'fiber')?.value) || 0,
            carbs: parseFloat(f.nutrients.find(n => n.name === 'carbohydrate')?.value) || 0,
            system: true,
            user_id: null
        })
    ), null, 2)
)
