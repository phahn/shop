var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('shop');
var articles = db.collection('articles');

// list articles
router.get('/', function(req, res) {

  var query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  console.log(query);

	articles.find(query, function(err, articles) {
  		if( err || !articles) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(articles);
  		}  		
  	});
});

// get article
router.get('/:id', function(req, res) {
	articles.findOne({ _id : mongojs.ObjectId(req.params.id)  }, function(err, article) {
  		if( err || !article) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(article);
  		}  		
  	});
});

// create new article
router.post('/', function(req, res) {
  articles.insert(req.body, function(err, article) {
    if( err || !article) {
        res.status(404).send('Not found');
      } else {
      res.status(201).json(article);
    }
  }); 
});

// update article
router.put('/:id', function(req, res) {
  delete req.body._id;
  articles.update({ _id : mongojs.ObjectId(req.params.id) }, req.body, function(err, article) {
    if( err || !article) {
        res.status(404).send(err);
      } else {
      res.status(200).json(article);
    }
  }); 
});

// delete article
router.delete('/:id', function(req, res) {
  delete req.body._id;
  articles.remove({ _id : mongojs.ObjectId(req.params.id) }, function(err) {
    if( err) {
        res.status(404).send(err);
      } else {
      res.status(200).send();
    }
  }); 
});



module.exports = router;