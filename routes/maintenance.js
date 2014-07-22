var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('doc');
var schemas = db.collection('documentSchema');
var documents = db.collection('documents');

var solr = require('solr-client');
var solr_client = solr.createClient('127.0.0.1', '8983', 'tii');
solr_client.autoCommit = true;

function indexDocument(doc, schema) {

	var solrdoc = {
		id : doc._id.toString(),
		schema : schema._id.toString()
	}

schema.groups.forEach(function(group) {
    group.fields.forEach(function(field) {
      if (field.type === 'Reference') {
        solrdoc[field.index] = doc.values[field.name][field.referenceField];
      } else {
        solrdoc[field.index] = doc.values[field.name];
      }
    })
  });

	solr_client.add(solrdoc,function(err,obj){
		 if(err){
      console.log(err);
   }else{
      console.log(obj);
   }});
}


// list users
router.post('/buildIndex', function(req, res) {

	// delete all documents
	solr_client.delete('id','*', function(err,obj) {
   		if(err) {
   			console.log(err);
   		} else {
   			// find all schemas
   			schemas.find({}, function(err, schemas) {
   				schemas.forEach(function(schema) {
           
   					documents.find({ schema: schema._id}, function(err, docs) {
  						if( err || !docs) {
  							//res.status(404).send('Not found');
  						} else {
  							docs.forEach(function(doc) {
                  console.log(doc);
  								indexDocument(doc, schema);
  							});
  						}  		
  					});
   				});
			});
   		}

   		res.status(200).send("ok");
	});

	
	});	


module.exports = router;
