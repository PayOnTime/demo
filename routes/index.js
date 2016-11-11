var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {

    //Placeholder for real data
    if (!req.session.company)
        req.session.company = {};

    console.log('bag:', req.session);
    res.render('index', {title: 'PayOnTime', bag: req.session});
});

router.get('/addUser', function (req, res, next) {
    res.render('index', {title: 'PayOnTime'});
});

router.post('/addUser', function (req, res, next) {

    var args = [];
    for (var key in req.body) {
        args.push('' + req.body[key])
    }

    console.log("BODY:", req.body);

    var body = {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
            "type": 1,
            "chaincodeID": {
                "name": process.env['CHAINCODE_ID']
            },
            "ctorMsg": {
                "function": "init_company",
                "args": args
            },
            "secureContext": "test_user0"
        },
        "id": 1
    };

    var options = {
        method: 'POST',
        url: 'http://192.168.99.100:7050/chaincode',
        json: body
    };


    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);

        // Give the chaincode time to finish
        setTimeout(function () {
            res.redirect('/score/' + args[0])
        }, 2000);

    });
    //res.send(req.body);
});

router.post('/pay', function (req, res, next) {

    var args = [];
    for (var key in req.body) {
        args.push('' + req.body[key])
    }

    console.log("BODY:", req.body);

    var body = {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
            "type": 1,
            "chaincodeID": {
                "name": process.env['CHAINCODE_ID']
            },
            "ctorMsg": {
                "function": "newPayment",
                "args": args
            },
            "secureContext": "test_user0"
        },
        "id": 1
    };

    var options = {
        method: 'POST',
        url: 'http://192.168.99.100:7050/chaincode',
        json: body
    };


    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        res.redirect('score/' + args[0]);
    });
});


router.get('/score/:id', function (req, res, next) {

    var options = {
        method: 'POST',
        url: 'http://192.168.99.100:7050/chaincode',
        json: {
            jsonrpc: '2.0',
            method: 'query',
            params: {
                type: 1,
                chaincodeID: {name: process.env['CHAINCODE_ID']},
                ctorMsg: {function: 'read', args: [String(req.params.id)]},
                secureContext: 'test_user0'
            },
            id: 1
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log('Queried chaincode and got:', body);
        req.session.company = JSON.parse(body.result.message);

        res.redirect('/');
    });
});

router.post('/score/submit', function (req, res, next) {

    var name = req.body.id;

    res.redirect('/score/' + name);
});
module.exports = router;
