var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'demosecret', resave: true, saveUninitialized: true}));

// Attach a bag to the request to store stuff
app.use(function(req, res, next) {
    // Create a bag for passing information back to the client
    req.bag = {};
    req.session.count = req.session.count + 1;
    req.bag.session = req.session;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

// Blockchain setup
var enrollOptions = {
    method: 'POST',
    url: 'http://192.168.99.100:7050/registrar',
    json: {enrollId: 'test_user0', enrollSecret: 'MS9qrN8hFjlE'}
};

request(enrollOptions, function (error, response, body) {
    if (error) throw new Error(error);

    console.log('Enrollment response:', body);


    var deployOptions = {
        method: 'POST',
        url: 'http://192.168.99.100:7050/chaincode',
        json: {
            jsonrpc: '2.0',
            method: 'deploy',
            params: {
                type: 1,
                chaincodeID: {path: 'https://github.com/PayOnTime/demo/chaincode'},
                ctorMsg: {function: 'init', args: ['123']},
                secureContext: 'test_user0'
            },
            id: 1
        }
    };

    request(deployOptions, function (error, response, body) {
        if (error) throw new Error(error);
        process.env['CHAINCODE_ID'] = body.result.message;
        console.log('Deploy response:', body);
        // TODO insert spreadsheet parsing code here

    });
});


