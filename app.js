var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressJwt = require('express-jwt');

var bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto');

var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var documents = require('./routes/documents');
var schemas = require('./routes/schemas');
var authentication = require("./routes/authentication");
var roles = require("./routes/roles");
var files = require("./routes/files");
var maintenance = require("./routes/maintenance");
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var SECRET = 'shhhhhhared-secret';

//app.use('/api', expressJwt({secret: SECRET}));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/login', login);

app.use('/api/users', users);
app.use('/api/documents', documents);
app.use('/api/schemas', schemas);
app.use("/api/roles", roles);
app.use("/api/files", files);
app.use("/api/maintenance", maintenance);

app.use("/authenticate", authentication);

app.all('/api/*', function(req, res) {
    res.status(404).send("not implemented yet!");
});

// catch all (needed for angular html5 mode)
app.use('/*', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
