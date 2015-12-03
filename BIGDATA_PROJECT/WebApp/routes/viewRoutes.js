var express = require ("express");
var router = express.Router();

router.get('/', function(req, res){
	console.log("inside! ");
});

module.exports = router;