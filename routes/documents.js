var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('doc');
var schemas = db.collection('documentSchema');
var documents = db.collection('documents');

var solr = require('solr-client');
var solr_client = solr.createClient('127.0.0.1', '8983', 'tii');
solr_client.autoCommit = true;

var async = require('async');


// list users
router.get('/', function(req, res) {
	
	var schema = req.params.schema;

	documents.find({},/*{ schema: mongojs.ObjectId(req.params.schema)},*/ function(err, docs) {
  		if( err || !docs) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(docs);
  		}  		
  	});
});

// list users
router.post('/:id/search', function(req, res) {

	schemas.findOne({ _id : mongojs.ObjectId(req.params.id) }, function(err, schema) {
		if( err || !schema) {
  			res.status(500).send(err);
  		} else {

  			var fields = [];

  			schema.groups.forEach(function(group) {
  				group.fields.forEach(function(field) {
  					fields.push("{!ex=" + field.index + "}" +field.index);
  				});
  			});

  			var searchterm = req.body.searchterm || '*:*';
			var offset = (req.body.currentPage - 1) * req.body.itemsPerPage;
			var numRows = req.body.itemsPerPage;
			var orderBy = req.body.orderby || 'modified';
			var orderDir = req.body.orderdir || 'desc';	

			var sort = {};
			sort[orderBy.index] = orderDir;

  			// DixMax query
			var query = solr_client.createQuery()
							  .q(searchterm)
							  .matchFilter('schema', schema._id.toString())
							  .start(offset)
						  	  .rows(numRows)
						  	  .set('qf=text')
						  	  .set('defType=edismax')
						  	  .set('facet.sort=index')
						  	  .set('json.nl=map')
						  	  .facet({on: true, field: fields, mincount: 1})
						  	  .sort(sort);

			console.log(query);

			for (var key in req.body.filter) {			
				if (req.body.filter[key].length > 0) {	

					var encodedValues = [];

					req.body.filter[key].forEach(function(val) {
						encodedValues.push(encodeURIComponent(val));
					});


					query.set('fq={!tag=' + key + '}' + key + ":" + encodeURIComponent('(' + req.body.filter[key].join(' OR ') + ")"));	
					//query.matchFilter(key, '(' + req.body.filter[key].join(' OR ') + ")");
				}
			}

			console.log(query);

	  	  	solr_client.search(query,function(err,obj){
			   if (err) {
			   		res.status(500).json(err);
			   }else{
			   		res.status(200).json(obj);
			   }
			});
		 }  
	});	

/*		
		solrQuery.set("defType","edismax");		
		solrQuery.set("facet.sort","index");			
		solrQuery.set("qf", "text", "caseNumber");
		*/

	
});



// get schema
router.get('/:schema/:id', function(req, res) {


	async.waterfall([
	    function(callback){
	    	findSchema(req.params.schema, callback);
	    },
	    function(schema, callback){
	     	findDocument(schema, req.params.id, callback);
	    }
	], function (err, schema, document) {
	   if (err) {
	   		res.status(500).send(err);
	   } else {
	   		res.status(201).json(document);
	   }
	});
});



	/*

SolrInputDocument doc1 = new SolrInputDocument();
	     
	    doc1.addField( "id", doc.getId());
	    doc1.addField("key", doc.getKey());	
	    doc1.addField("schema", doc.getSchema());
			 	
	 	doc1.addField(MODIFIED, ISODateTimeFormat.dateTime().print(doc.getLastModified().toDateTime(DateTimeZone.UTC)));		 	
	 	
	 	// schema fields
	 	for (FieldGroup group : schema.groups()) {
			for (Field field : group.fields()) {
				
				if (field.getType() == FieldType.Text) {
					doc1.addField(field.getName() + "_t", doc.getStringValue(field.getName()));
				}
				
				if (field.getType() == FieldType.CheckBox) {
					doc1.addField(field.getName() + "_b", doc.getBooleanValue(field.getName()) ? "true" : "false");
				}
				
				if (field.getType() == FieldType.Select) {
					if (!field.isMultiple()) {
						doc1.addField(field.getName() + "_t", doc.getStringValue(field.getName()));
					} else {
						for (String val : doc.getStringValues(field.getName())) {
							doc1.addField(field.getName() + "_tm", val);
						}
					}
				}						
			}	
		}	*/		 
	


var findSchema = function(id, callback) {
	schemas.findOne({ _id : mongojs.ObjectId(id) }, function(err, schema) {
		if( err || !schema) {
  			callback(err);
  		} else {
  			callback(null, schema);
  		}
	})
};

var findDocument = function(schema, id, callback) {
	documents.findOne({ _id : mongojs.ObjectId(id) }, function(err, document) {
		if( err || !document) {
  			callback(err);
  		} else {
  			callback(null, schema, document);
  		}
	})
};

var insertDocument = function(req, schema, callback) {

	console.log(req);

	var mongoDocument = {
		schema: schema._id,
		modified: new Date(),
		modifiedBy: req.user.username,
		created: new Date(),
		createdBy: req.user.username,
		values : {}
	};


	schema.groups.forEach(function(group) {
		group.fields.forEach(function(field) {
			if (field.type === 'Reference') {
				mongoDocument.values[field.name] = {
					_id : req.body.values[field.name]._id
				};
				mongoDocument.values[field.name][field.referenceField] = req.body.values[field.name][field.referenceField];
			} else {
				mongoDocument.values[field.name] = req.body.values[field.name];
			}
		})
	});

	
  	// set key
  	documents.insert(mongoDocument, function(err, document) {
    	if( err || !document) {
        	callback(err);
      	} else {
      		callback(null, schema, document);
       }
  	}); 	
};

var updateDocument = function(req, schema, callback) {

	documents.findOne({ _id : mongojs.ObjectId(req.body._id) }, function(err, document) {
		if( err || !document) {
  			callback(err);
  		} else {

  			var mongoDocument = {
				schema: schema._id,
				modified: new Date(),
				modifiedBy: req.user.username,
				created: document.created,
				createdBy: document.createdBy,
				values : {}
			};

			schema.groups.forEach(function(group) {
				group.fields.forEach(function(field) {
					mongoDocument.values[field.name] = req.body.values[field.name];
				})
			});
			
		  	documents.update({ _id : mongojs.ObjectId(req.body._id) }, mongoDocument, function(err) {
		    	if(err) {
		        	callback(err);
		      	} else {
		      		callback(null, schema);
		       }
		  	});   			
  		}
	});  		
};

var indexDocument = function(document, schema, callback) {
	var solrdoc = {
		id : document._id.toString(),
		schema : schema._id.toString()
	}

	schema.groups.forEach(function(group) {
		group.fields.forEach(function(field) {
			if (field.type === 'Reference') {
				solrdoc[field.index] = document.values[field.name][field.referenceField];
			} else {
				solrdoc[field.index] = document.values[field.name];
			}
		})
	});

	solr_client.add(solrdoc,function(err,obj){
		 if(err){
      callback(err);
   } else{
      callback(null, schema, document);
   }});
};

// create new document
router.post('/:schema', function(req, res) {

	async.waterfall([
	    function(callback){
	    	findSchema(req.params.schema, callback);
	    },
	    function(schema, callback){
	     	insertDocument(req, schema, callback);
	    },  function(schema, document, callback){
	    	indexDocument(document, schema, callback);
		}
	], function (err, schema, document) {
	   if (err) {
	   		res.status(500).send(err);
	   } else {
	   		res.status(201).json(document);
	   }
	});
});

// update schema
router.put('/:schema/:id', function(req, res) {

	var id = req.body._id;

	async.waterfall([
	    function(callback){
	    	findSchema(req.params.schema, callback);
	    },
	    function(schema, callback){
	     	updateDocument(req, schema, callback);
	    },  function(schema, callback){
	    	findDocument(schema, id, callback);
		}, function(schema, document, callback) {
			indexDocument(document, schema, callback);
		}
	], function (err, schema, document) {
	   if (err) {
	   		res.status(500).send(err);
	   } else {
	   		res.status(201).json(document);
	   }
	});

/*

  delete req.body._id;

  schemas.findOne({ _id : mongojs.ObjectId(req.params.schema) }, function(err, schema) {


		if( err || !schema) {
  			res.status(500).send(err);
  		} else {


  		

		  documents.update({ _id : mongojs.ObjectId(req.params.id) }, req.body, function(err) {
		    if( err) {
		        res.status(404).send(err);
		      } else {


		      	documents.findOne({ _id : mongojs.ObjectId(req.params.id) }, function(err, doc) {
		      		if (err) {
		      			return res.status(500).send(err);
		      		} else {
			      		indexDocument(doc, schema);
			      		res.status(200).json(doc);
			      	}
		      	});


		      	
		    }
		  }); 
		}
	});*/
});

var removeDocument = function(id, callback) {
	 documents.remove({ _id : mongojs.ObjectId(id) }, function(err) {
    	if(err) {
        	callback(err);
      	} else {
      		console.log("removed document with id " + id + " from database");
      		callback(null);
       }
  	}); 	
};

var removeFromIndex = function(id, callback) {
	solr_client.deleteByID(id, function(err, obj) {
  		if (err) {
  			callback(err);
  		} else {
  			console.log("removed document with id " + id + " from index");
  			callback(null);
  		}
  	});
};


// delete schema
router.delete('/:schema/:id', function(req, res) {

	console.log("removing document");

	async.waterfall([
	    function(callback){
	    	findSchema(req.params.schema, callback);
	    },
	    function(schema, callback){
	     	removeDocument(req.params.id, callback);
	    },  function(callback){
	    	removeFromIndex(req.params.id, callback);
		}
	], function (err) {
	   if (err) {
	   		res.status(500).send(err);
	   } else {
	   		res.status(200).send("ok");
	   }
	});
});


module.exports = router;
