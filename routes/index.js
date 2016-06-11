var express = require('express');
var router = express.Router();
var fs = require('fs');

var global_text_array = new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.get('/initial', function(req, res, next) {
	fs.readFile('./src_data.json', 'utf8', function (err, text) {
		if(err){
			console.log(err);
			res.send(err);
		}else{
			global_text_array = JSON.parse(text);
			res.send(global_text_array);
		}
	});
});




router.post('/push_QA', function(req, res, next) {

	if(!global_text_array || !Array.isArray(global_text_array) || global_text_array.length == 0){
		res.send("not yet initialized");
		return;
	}
	if(!req.body.quetion || !req.body.answer_title || !req.body.answer_body){
		res.send("data is not sufficient");
		return;
	}
	push_data_to_global_text_array(req, res, next, req.body.quetion, req.body.answer_title,req.body.answer_body );
	store_data_to_src_file()
});


function push_data_to_global_text_array(req, res, next, quetion_val , answer_title_val , answer_body_val){

	var obj = {
		Question: quetion_val,
		Answer: {
			body: answer_body_val,
			title: answer_title_val
		}
	}
	global_text_array.push(obj);
	res.send(obj)
}

function store_data_to_src_file(){
	var data_array = new Array();
	for(var i=0; i< global_text_array.length; i++){
		var obj = {
			Question: global_text_array[i].Question,
			Answer: global_text_array[i].Answer,
			id: i
		}
		data_array.push(obj);
	}
	var text_data = JSON.stringify(data_array);

	fs.writeFile('src_data.json', text_data , function (err) {
		if(!err){
			console.log(err)
			return;
		}else{
			console.log("succeed to save dta in src_data.json")
		}
	});


}



router.get('/output', function(req, res, next) {

	if(!global_text_array || !Array.isArray(global_text_array) || global_text_array.length == 0){
		res.send("data is not yet extracted");
		return;
	}
	var output_text = "{";
	for(var i=0; i< global_text_array.length; i++){
		var obj = {
			add: {
				doc: {
					id: i,
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
						   '"' + i  + '",' + 
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


/*

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
*/


router.get('/sss', function(req, res, next) {
  res.send('aaa');
});



module.exports = router;
