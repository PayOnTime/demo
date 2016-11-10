var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'PayOnTime'});
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
                "name": "c58e3996f6e7034aad8e76793cb3af368db32de4d1a305926693899db2ea48c492440bb220052f39b4b4fbc256956090b8cc0acb3e47a4b17a0d2efe038ac326"
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
        res.render('index', {title: 'PayOnTime'});
    });
    //res.send(req.body);
});



router.get('/score/:id', function (req, res, next) {
    res.render('score', {output: req.params.id});
});

router.post('/score/submit', function (req, res, next) {

var name = req.body.id;
var id;

console.log(name)

var options = { method: 'POST',
  url: 'http://192.168.99.100:7050/chaincode',
  headers: 
   { 'postman-token': '329f36c3-646f-d21e-ef54-9f0999f11d54',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'query',
     params: 
      { type: 1,
        chaincodeID: { name: 'c58e3996f6e7034aad8e76793cb3af368db32de4d1a305926693899db2ea48c492440bb220052f39b4b4fbc256956090b8cc0acb3e47a4b17a0d2efe038ac326' },
        ctorMsg: { function: 'read', args: [String(name)] },
        secureContext: 'test_user0' },
     id: 1 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  
  id = body.result.message;
  res.render('index', {userList:id});
  
});

});
module.exports = router;

/*
 setInterval(function() {
 console.log(process.env['CHAINCODE_ID']);
 }, 3000);
 */