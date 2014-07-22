var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('doc', ['user']);
var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var nodemailer = require("nodemailer");


// create admin user if one does not exist
db.user.findOne({ username : 'admin' }, function(err, user) {
	if( err || !user) {

		var salt = bcrypt.genSaltSync();

		var admin = {
			username : 'admin',
			email : 'phahn@eins-gmbh.de',
			roles : ['SUPER_ADMIN'],
			password : bcrypt.hashSync('admin', salt)
		};		

		db.user.insert(admin, function(err, user) {
			if( err || !user) {
	  			res.status(500).send(err);
	  		}
		});	
	} 
});

// list users
router.get('/', function(req, res) {
	
	var totalCount = 0;
	db.user.count({ username: { $regex: '^' + (req.query.q || ''), $options: 'i' }}, function(err, result) {
		totalCount = result;
	});
	db.user.find({ username: { $regex: '^' + (req.query.q || ''), $options: 'i' }}).skip(parseInt(req.query.page - 1) * (req.query.size || 10)).limit(req.query.size || 10, function(err, users) {
  		if( err || !users) {
  			res.status(404).send('Not found');
  		} else {
  			res.json({ totalItems: totalCount, results: users});
  		}  		
  	});
});

// get user
router.get('/:id', function(req, res) {
	db.user.findOne({ _id : mongojs.ObjectId(req.params.id) }, function(err, user) {
		if( err || !user) {
  			res.status(404).send('Not found');
  		} else {
  			res.json(user);
  		}  
	});

});

// delete user
router.delete('/:id', function(req, res) {
  delete req.body._id;
  db.user.remove({ _id : mongojs.ObjectId(req.params.id) }, function(err) {
    if( err) {
        res.status(500).send(err);
      } else {
      res.status(200).send("done");
    }
  }); 
});

// save user
router.post('/', function(req, res) {

	var user = {
		username : req.body.username,
		email : req.body.email,
		roles : req.body.roles
	};

	var plaintextPassword;

	if (req.body.manualPassword) {
		plaintextPassword = req.body.password;
	} else {
		plaintextPassword = generatePassword(12, false);       		
	}	

	var salt = bcrypt.genSaltSync();
    var hashedPwd = bcrypt.hashSync(plaintextPassword, salt);
	user.password = hashedPwd;

	db.user.insert(user, function(err, user) {
		if( err || !user) {
  			res.status(500).send(err);
  		} else {
  			sendMail(user.email, plaintextPassword);
			res.status(201).json(user);
		}
	});	
});

// update user
router.put('/:id', function(req, res) {
	delete req.body._id;
	db.user.update({ _id : mongojs.ObjectId(req.params.id) }, req.body, function(err, user) {
		if( err || !user) {
  			res.status(404).send(err);
  		} else {
			res.status(200).json(user);
		}
	});	
});

function sendMail(to, password) {
	
	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = nodemailer.createTransport("SMTP",{
	    host: "192.168.110.16",   		
   		port: 25	   
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: "Pascal Hahn <phahn@eins-gmbh.de>", // sender address
	    to: to, // list of receivers
	    subject: "Passwort", // Subject line
	    text: "Ihr Passwort: " + password, // plaintext body
	    /*html: "<b>Hello world ✔</b>" // html body*/
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }

	    // if you don't want to use this transport object anymore, uncomment following line
	    //smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

module.exports = router;
