var express = require('express');
var router = express.Router();
var request = require("request");  
var obj
/* GET users listing. */
router.get('/', function(req, res, next) {
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
    process.env['CHAINCODE_ID'] = 'c58e3996f6e7034aad8e76793cb3af368db32de4d1a305926693899db2ea48c492440bb220052f39b4b4fbc256956090b8cc0acb3e47a4b17a0d2efe038ac326';


    // TODO insert spreadsheet parsing code here

});
module.exports = obj;
module.exports = router;
