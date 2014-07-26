var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('shop');
var categories = db.collection('categories');

// list categories
router.get('/', function(req, res) {
	categories.find({}, function(err, categories) {
  		if( err || !categories) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(categories);
  		}  		
  	});
});

// get category
router.get('/:id', function(req, res) {
	categories.findOne({ _id : mongojs.ObjectId(req.params.id)  }, function(err, category) {
  		if( err || !category) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(category);
  		}  		
  	});
});

// create new category
router.post('/', function(req, res) {
  categories.insert(req.body, function(err, category) {
    if( err || !category) {
        res.status(404).send('Not found');
      } else {
      res.status(201).json(category);
    }
  }); 
});

// update category
router.put('/:id', function(req, res) {
  delete req.body._id;
  categories.update({ _id : mongojs.ObjectId(req.params.id) }, req.body, function(err, category) {
    if( err || !category) {
        res.status(404).send(err);
      } else {
      res.status(200).json(category);
    }
  }); 
});

// delete category
router.delete('/:id', function(req, res) {
  delete req.body._id;
  categories.remove({ _id : mongojs.ObjectId(req.params.id) }, function(err) {
    if( err) {
        res.status(404).send(err);
      } else {
      res.status(200).send();
    }
  }); 
});



module.exports = router;