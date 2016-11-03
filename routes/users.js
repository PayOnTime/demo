var express = require('express');
var router = express.Router();
var request = require("request");  
var obj
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res) {
        res.send('respond with a resource');
    });

var options = { method: 'POST',
  url: 'http://192.168.99.100:7050/chaincode',
  headers: 
   { 'postman-token': '0cddaaaa-05f6-d7d9-9956-6068b232c790',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'deploy',
     params: 
      { type: 1,
        chaincodeID: { path: 'https://github.com/PayOnTime/demo/chaincode' },
        ctorMsg: { function: 'init', args: [ '123' ] },
        secureContext: 'test_user0' },
        id: 1 },
     json: true };

request(options, function (error, response, body) {
	if (error) throw new Error(error);
	obj = body
	console.log(body)
    console.log("Storing chaincode ID to process.env['CHAINCODE_ID']")
    process.env['CHAINCODE_ID'] = body.result.message;
});
module.exports = obj;
module.exports = router;
