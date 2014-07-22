var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('doc', ['user']);
var bcrypt = require('bcrypt-nodejs');

var jwt = require('jsonwebtoken');

var SECRET = 'shhhhhhared-secret';

router.post('/', function (req, res) {

  // find user
  db.user.findOne({ username : req.body.username }, function(err, user) {
    if( err || !user) {
         res.status(401).send('Wrong user');         
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) {
            res.status(401).send('Wrong password'); 
          } else {
           var token = jwt.sign(user, SECRET, { expiresInMinutes: 60*5 });
            res.status(200).json({ token: token });
          }
        });
      }  
  });
});

  

module.exports = router;