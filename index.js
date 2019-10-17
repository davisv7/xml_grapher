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
// console.log(xmlfiles);
	res.render('index',{
    filenames:xmlfiles
  });
});

app.get('/:filename',function(req,res){
	xmlfiles = getXMLFiles();
	datasets = getListOfDatasets(xmlfiles);
	var filename = req.params.filename;
	var result = datasets.filter(obj => {
		return obj.name == filename
	})[0]
	// console.log(result);
	res.render('file',{
    dataset:result
  });
});

// Start server
var server = app.listen(1337, function(){
	var port = server.address().port;

	console.log('Your app is running on port',port);
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).render('index',{
	    filenames:xmlfiles
	  });
})











// datasets =[{
// name: "xmlfile1",
// data: [0,...,0]
//}
//]


//function to get list of dataset from xml files
function getListOfDatasets(xmlfiles){
  // console.log(xmlfiles.length);
  datasets = [];
  for (var i =0; i< xmlfiles.length; i++){
    var filesPath = path.join(__dirname, xmlfiles[i]);
    content = fs.readFileSync(filesPath);

    var $ = cheerio.load(content,{
      xmlMode: true,
    });
    var datapoints = $('arrRecordedDataPoints').contents();
    var dataset = {};
		var data = [];
    // console.log(datapoints.length)
    for (var j = 0; j < datapoints.length; j++) {
      // console.log(datapoints[i].data);
			if (datapoints[j].data != 0){
				data.push(datapoints[j].data);
			}
    }
		dataset.data = data;
		dataset.name = xmlfiles[i];
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
