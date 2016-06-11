var express = require('express');
var router = express.Router();
var fs = require('fs');

var global_text_array = new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/push_QA', function(req, res, next) {

	


});




router.get('/extract', function(req, res, next) {


	fs.readFile('./src_small.json', 'utf8', function (err, text) {

		//global_text_json = JSON.parse(text);
		console.log(text);
		/*
		var kaigyou = "\n";
		var regExp =  new RegExp( kaigyou, "g" ) ;
		var replaced_text = text.replace(regExp, "");
		*/
		global_text_array = JSON.parse(text);
		console.log(global_text_array);
		res.send(global_text_array);

	});
});



router.get('/extract2', function(req, res, next) {
	fs.readFile('./src_adjust.json', 'utf8', function (err, text) {

		if(err){
			console.log(err);
			res.send(err);
		}else{

			global_text_array = JSON.parse(text);
			res.send(global_text_array);
		}
	});
});




router.get('/convert2', function(req, res, next) {

	if(!global_text_array || !Array.isArray(global_text_array) || global_text_array.length == 0){
		for(var i=0; i< global_text_array.length; i++)
		res.send("data is not yet extracted");
		return;
	}
	var output_text = "{";
	for(var i=0; i< global_text_array.length; i++){
		var obj = {
			add: {
				doc: {
					id: global_text_array[i].id,
					body: global_text_array[i].Answer.body,
					title: global_text_array[i].Answer.title
				}
			}
		}
		var obj_str = JSON.stringify(obj);
		var result = obj_str.slice(1, obj_str.length-1);
		if(i!=0){
			result = "," + result;
		}
		output_text = output_text + result;
	}
	var output_text = output_text +  "}";



	fs.writeFile('output.txt', output_text , function (err) {
		if(!err){
			output_csv(req, res, next);
			return;
		}else{
			res.send("writing output failed");
		}
	});
});


function output_csv(req, res, next){

	var output_csv = "";
	for(var i=0; i< global_text_array.length; i++){
		var output_line =  '"' + global_text_array[i].Question + '",' + 
						   '"' + global_text_array[i].id  + '",' + 
						   '"4"\r\n';
		output_csv = output_csv + output_line;
	}

	fs.writeFile('output_csv.csv', output_csv , function (err) {
		if(!err){
			res.send(output_csv);
			return;
		}else{
			res.send("writing csv failed");
		}
	});

}




router.get('/convert', function(req, res, next) {

	if(!global_text_array || !Array.isArray(global_text_array) || global_text_array.length == 0){
		for(var i=0; i< global_text_array.length; i++)
		res.send("data is not yet extracted");
		return;
	}
	var output_text = "{";
	for(var i=0; i< global_text_array.length; i++){
		var obj = global_text_array[i];
		var obj_str = JSON.stringify(obj);
		output_text = output_text + obj_str;
	}
	var output_text = output_text +  "}";
	fs.writeFile('output.txt', output_text , function (err) {
	    if(err){
	    	res.send(err);
	    }else{
			res.send(output_text);
	    }
	});
});



router.get('/sss', function(req, res, next) {
  res.send('aaa');
});



module.exports = router;
