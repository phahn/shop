var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log("index");
  res.sendfile('./public/index.html');
});

module.exports = router;
