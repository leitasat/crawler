import Crawler from './crawler';
import Parser from './parser';
import fs = require('fs');

let entryUrl = process.argv[2];
if (entryUrl.substr(0,4) != 'http') {
  console.log('Please provide an URL with protocol');
  process.exit();
}

const crawler = new Crawler(entryUrl);
let results: any[] = [];
let file = fs.openSync('results.json','w');
fs.appendFileSync(file,'[');

function exec() {
  let url = crawler.dequeueUrl();
  if (url) {
    const parser = new Parser(url as string);
    parser.parse()
      .then((parseResults) => {
        parseResults[0].map(crawler.enqueueUrl.bind(crawler));
        results.push(parseResults[1]);
        fs.appendFileSync(file,JSON.stringify(parseResults[1]) + ",\n");
        exec();
      })
      .catch(exec)
  } else {
    fs.appendFileSync(file,']');
    console.log(results);
  }
}

exec();
