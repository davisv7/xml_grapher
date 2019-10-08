const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');


//get the xml files
var files = fs.readdirSync(__dirname);
files = files.filter(function(file) {
  return file.split('.').pop()==="xml";
});


var filesPath = path.join(__dirname, files[0]);

fs.readFile(filesPath, function(err,data){
  if (!err) {
    var $ = cheerio.load(data,{
      xmlMode: true,
    });
    datapoints = $('arrRecordedDataPoints').contents();
    console.log(datapoints.length)
    for (var i = 0; i < datapoints.length; i++) {
      console.log(datapoints[i].data);
    }
  } else {
    console.log(err);
  }
});
// const $ = cheerio.load(fileContent);
// datapoints = $('arrRecordedDataPoints');
// console.log(datapoints);
