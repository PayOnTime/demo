var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'PayOnTime'});
});

router.post('/', function (req, res, next) {

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

router.post('/', function (req, res, next) {

var request = require("request");

var options = { method: 'POST',
  url: 'http://192.168.99.100:7050/chaincode',
  headers: 
   { 'postman-token': 'ea6b98c0-4636-a3cf-2542-193f903b02c1',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'query',
     params: 
      { type: 1,
        chaincodeID: { name: 'c58e3996f6e7034aad8e76793cb3af368db32de4d1a305926693899db2ea48c492440bb220052f39b4b4fbc256956090b8cc0acb3e47a4b17a0d2efe038ac326' },
        ctorMsg: { function: 'read', args: [ 'abc' ] },
        secureContext: 'test_user0' },
     id: 1 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

});

module.exports = router;

/*
 setInterval(function() {
 console.log(process.env['CHAINCODE_ID']);
 }, 3000);
 */