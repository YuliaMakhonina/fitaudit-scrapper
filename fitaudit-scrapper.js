const stream = require('stream');
const {promisify} = require('util');
const fs = require('fs');
const got = require('got');
const cheerio = require('cheerio');

const pipeline = promisify(stream.pipeline);

// (async () => {
//     await pipeline(
//         got.stream('https://fitaudit.ru/food/abc'),
//         fs.createWriteStream('index.html')
//     );
// })();

const fruitsObject = cheerio.load(fs.readFileSync('./index.html'));
let fruits = fruitsObject('li.fimlist__item');
let fruitsDict = [];
fruits.each(function(i, elem) {
    //console.log(cheerio(elem).find('a').attr('title'))
    fruitsDict.push({'name':cheerio(elem).find('a').attr('title'), 'value':cheerio(elem).find('a').attr('href')});
});

//console.log(fruitsDict);

function delay(timeout) {
    return new Promise(
      (resolve, reject) => {
        setTimeout(
          () => resolve(),
          timeout
        );
      }
    );
  }

  function randomDelay() {
    return Math.floor(Math.random()*20000 + 10000)
  }


// fruitsDict.each(function(i,elem){
//     (async () => {
//         await delay(randomDelay());
//         await pipeline(
//             got.stream(`${elem.value}`),
//             fs.createWriteStream(`${elem.name}.html`)
//         );
//     })();
// });

async function getFruitHtml(elem) {
    const id = elem.value.split('/').pop();
    try {
        let fruitHtml = await fs.promises.readFile(`cache/${id}`);
        return fruitHtml
    }
    catch(error) {
        const response = await got(elem.value);
        await fs.promises.writeFile(`cache/${id}`, response.body);
        await delay(randomDelay());
        return response
    }
}

let fruitsParsed = [];
(async () => {
    for (const fruit of fruitsDict) {
        let nutrients = [];

        let ch = cheerio.load(await getFruitHtml(fruit));
        ch('span.him_bx__legend_text').find('a').each(function (i,elem){
            let name = cheerio(elem).attr('href').split('/').pop();
            let msr = cheerio(ch('span.him_bx__legend_text').find('span')[i]).data('fa').msr;
            nutrients.push({
                'name': name,
                'unit': msr.unit,
                'value': msr.val
            });
        });
        ch('p.pr__brick.pr__ind_c.pr__ind_c_mtop.pr__brd_b.pr__ind_endline').find('a').each(function(i,elem){
            let name = cheerio(elem).attr('href').split('/').pop();
            let msr = cheerio(ch('p.pr__brick.pr__ind_c.pr__ind_c_mtop.pr__brd_b.pr__ind_endline').find('span')[i]).data('fa').msr;
            nutrients.push({
                'name': name,
                'unit': msr.unit,
                'value': msr.val
            });
        });
        ch('tr.js__msr_cc').each(function(i, elem) {
            let name = cheerio(elem).find('a').attr('href').split('/').pop();
            let msr = cheerio(elem).data('fa').msr;
            nutrients.push({
                'name': name,
                'unit': msr.unitRu,
                'value': msr.val
            });
        });
        fruitsParsed.push({
            'name': fruit.name,
            'id': fruit.value.split('/').pop(),
            'nutrients': nutrients
        });
        console.log(fruit.name);
    }
    await fs.promises.writeFile('fruits.json', JSON.stringify(fruitsParsed, null, 2));
})();