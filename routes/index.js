var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayOnTime' });
});

router.post('/add', function(req, res, next) {

  console.log("BODY:", req.body);

  var options = {
    method: 'POST',
    url: 'http://192.168.99.100:7050/chaincode',
    headers: {
      'postman-token': 'ed05ba40-e983-6e3d-51db-4575d00f2c84',
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: '{\r\n "jsonrpc": "2.0",\r\n "method": "invoke",\r\n "params": {\r\n   "type": 1,\r\n   "chaincodeID": {\r\n     "name": obj.message\r\n   },\r\n   "ctorMsg": {\r\n     "function": "init_company",\r\n     "args": [\r\n       newUser\r\n     ]\r\n   },\r\n   "secureContext": "test_user0"\r\n },\r\n "id": 1\r\n}'
  };

  /*
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    alert(body);
    console.log(body);
  });
  */
  res.send(req.body);
});
module.exports = router;
