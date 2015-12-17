var express = require ("express");
var router = express.Router();

router.get('/', function(req, res){
	console.log("inside! ");
	return res.render('index', {});
});

// router.get('/:id',function(req,res){
// 	return res.render('index1',{});
// });

module.exports = router;