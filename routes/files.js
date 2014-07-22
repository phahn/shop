var express = require('express');
var router = express.Router();

var formidable = require('formidable'),
    util = require('util');

// upload file
router.post('/', function(req, res) {

	var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
    	res.status(200).json(files);
      //res.writeHead(200, {'content-type': 'text/plain'});
      //res.write('received upload:\n\n');
      //res.end(util.inspect({fields: fields, files: files}));
    });

	
});

module.exports = router;