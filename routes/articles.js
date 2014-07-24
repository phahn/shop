var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('shop');
var articles = db.collection('articles');

// list articles
router.get('/', function(req, res) {
	articles.find({}, function(err, articles) {
  		if( err || !articles) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(articles);
  		}  		
  	});
});

// get article
router.get('/:slug', function(req, res) {
	articles.findOne({ slug: req.params.slug }, function(err, article) {
  		if( err || !article) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(article);
  		}  		
  	});
});


module.exports = router;