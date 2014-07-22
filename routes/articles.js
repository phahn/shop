var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json([ { name : 'bla' }, { name : 'blubb'}]);
});

module.exports = router;