# PayOnTime Chaincode
This is where we will develop our chaincode for this demo.

### REST API Deployment

These instructions assume that you are developing on a local Hyperledger network which was created using the documentation located [here](https://hub.docker.com/r/ibmblockchain/fabric-peer/)

#### 1. Enroll a user ID

Connect to the `/registrar` endpoint on one of your peers and make a post with the body below:

```
{
  "enrollId": "test_user0",
  "enrollSecret": "MS9qrN8hFjlE"
}
```

#### 2. Deploy the chaincode

Send a POST request to the `/chaincode` endpoint of the same peer that you made the `/registrar` request to.  Use the following url as the `path` in the deploy request:

```
https://github.com/PayOnTime/demo/chaincode
```

Your request body will look like this:

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

#### 3. Query the chaincode

If successful, the response to the deploy request will look something like this:

```
{
  "jsonrpc": "2.0",
  "result": {
    "status": "OK",
    "message": "98fc78271bd23b8154ba5cf4b3c8524b826d31f70dcc494613969ed31164b01934f2e160c869736850e94a10a892cfe5d009b91fbea539e4e866258e92d4a00e"
  },
  "id": 1
}
```

Take the long hash from that response and feed it into the body of your query request:

```
{
 "jsonrpc": "2.0",
 "method": "query",
 "params": {
   "type": 1,
   "chaincodeID": {
     "name": "98fc78271bd23b8154ba5cf4b3c8524b826d31f70dcc494613969ed31164b01934f2e160c869736850e94a10a892cfe5d009b91fbea539e4e866258e92d4a00e"
   },
   "ctorMsg": {
     "function": "read",
     "args": [
       "abc"
     ]
   },
   "secureContext": "test_user0"
 },
 "id": 1
}
```

The response will look like this:

```
{
  "jsonrpc": "2.0",
  "result": {
    "status": "OK",
    "message": "123"
  },
  "id": 1
}
```