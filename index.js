const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
var express = require('express');



// Initialize App
var app = express();


// Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');


// Route for main (only?) page
app.get('/',function(req,res){
	xmlfiles = getXMLFiles();
console.log(xmlfiles);
datasets = getListOfDatasets(xmlfiles);
	res.render('index',{
    datasets:datasets
  });
});


// Start server
var server = app.listen(1337, function(){
	var port = server.address().port;

	console.log('Your app is running on port',port);
});















//function to get list of dataset from xml files
function getListOfDatasets(xmlfiles){
  console.log(xmlfiles.length);
  datasets = [];

  for (var i =0; i< xmlfiles.length; i++){
    var filesPath = path.join(__dirname, xmlfiles[i]);
    content = fs.readFileSync(filesPath);

    var $ = cheerio.load(content,{
      xmlMode: true,
    });
    var datapoints = $('arrRecordedDataPoints').contents();
    var dataset = [];
    // console.log(datapoints.length)
    for (var j = 0; j < datapoints.length; j++) {
      // console.log(datapoints[i].data);
      dataset.push(datapoints[j].data);
    }
    datasets.push(dataset);

  }
  return datasets;
}

//function get the list xml files
function getXMLFiles(){
  var files = fs.readdirSync(__dirname);
  files = files.filter(function(file) {
    return file.split('.').pop()==="xml";
  });
  return files;
}
