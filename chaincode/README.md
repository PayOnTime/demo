# PayOnTime Chaincode
This is where we will develop our chaincode for this demo.

### REST API Deployment
When deploying this chaincode using the REST API, use the following url as the `path` in the deploy request:

```
https://github.com/PayOnTime/demo/chaincode
```

Your deploy body will look something like this:

```json
{
 "jsonrpc": "2.0",
 "method": "deploy",
 "params": {
   "type": 1,
   "chaincodeID": {
     "path": "https://github.com/PayOnTime/demo/chaincode"
   },
   "ctorMsg": {
     "function": "init",
     "args": [
       "123"
     ]
   },
   "secureContext": "test_user0"
 },
 "id": 1
}
```