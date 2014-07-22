var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');
var generatePassword = require('password-generator');
var nodemailer = require("nodemailer");

router.post('/sendPassword', function(req, res) {
	
	plaintextPassword = generatePassword(12, false); 		
	
	var salt = bcrypt.genSaltSync();
    var hashedPwd = bcrypt.hashSync(plaintextPassword, salt);
	
	sendMail('hahnpascal@gmail.com', plaintextPassword);
	res.status(200).json( { status : "ok" });
});

function sendMail(to, password) {
	
	var transporter = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
	        user: 'hahnpascal@gmail.com',
	        pass: 'dricdipnvvgxohwz'
	    }
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: "Pascal Hahn <hahnpascal@gmail.com>", // sender address
	    to: to, // list of receivers
	    subject: "Passwort", // Subject line
	    text: "Ihr Passwort: " + password, // plaintext body
	    /*html: "<b>Hello world ✔</b>" // html body*/
	}

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, response){
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
