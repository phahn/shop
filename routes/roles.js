var express = require('express');
var router = express.Router();

var roles = [{ value: 'SUPER_ADMIN'}, {value:'ADMIN'}, { value:'EDITOR'}, { value: 'WEBSERVICE'}];

// list users
router.get('/', function(req, res) {
	res.json(roles);	
});

module.exports = router;