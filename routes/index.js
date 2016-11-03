var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'PayOnTime'});
});

router.post('/add', function (req, res, next) {

    console.log("BODY:", req.body);

    var args = [];
    for (var key in req.body) {
        args.push('' + req.body[key])
    }

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
        res.send(body);
    });
    //res.send(req.body);
});
module.exports = router;

/*
 setInterval(function() {
 console.log(process.env['CHAINCODE_ID']);
 }, 3000);
 */