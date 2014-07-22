var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('doc');
var schemas = db.collection('documentSchema');

// list schemas
router.get('/', function(req, res) {

	var totalCount = 0;
	schemas.count({ name: { $regex: '^' + (req.query.q || ''), $options: 'i' }}, function(err, result) {
		totalCount = result;
	});
	schemas.find({ name: { $regex: '^' + (req.query.q || ''), $options: 'i' }}).skip(parseInt(req.query.page - 1) * (req.query.size || 10)).limit(req.query.size || 10, function(err, schemas) {
  		if( err || !schemas) {
  			res.status(404).send('Not found');
  		} else {
  			res.json({ totalItems: totalCount, results: schemas});
  		}  		
  	});
});

// get schema
router.get('/:id', function(req, res) {

	schemas.findOne({ _id : mongojs.ObjectId(req.params.id) }, function(err, schema) {
		if( err || !schema) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(schema);
  		}  
	});

	//res.status(404).send('Not found');

});

// create new schema
router.post('/', function(req, res) {
  schemas.insert(req.body, function(err, schema) {
    if( err || !schema) {
        res.status(404).send('Not found');
      } else {
      res.status(201).json(schema);
    }
  }); 
});

// update schema
router.put('/:id', function(req, res) {
  delete req.body._id;
  schemas.update({ _id : mongojs.ObjectId(req.params.id) }, req.body, function(err, schema) {
    if( err || !schema) {
        res.status(404).send(err);
      } else {
      res.status(200).json(schema);
    }
  }); 
});

// delete schema
router.delete('/:id', function(req, res) {
  delete req.body._id;
  schemas.remove({ _id : mongojs.ObjectId(req.params.id) }, function(err) {
    if( err) {
        res.status(404).send(err);
      } else {
      res.status(200).send("done");
    }
  }); 
});

module.exports = router;
