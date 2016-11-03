function addUser() {
	var newUser = {
        'name': $('#addUser fieldset input#name').val(),
        'score': $('#addUser fieldset input#score').val(),
        'ontime': $('#addUser fieldset input#ontime').val(),
        'total': $('#addUser fieldset input#total').val(),
        }
        // Clear the form inputs
		$('#addUser fieldset input').val(' ');
		alert('sucess')

	var request = require("request");

	var options = { method: 'POST',
		url: 'http://192.168.99.100:7050/chaincode',
		headers: 
		{ 'postman-token': 'd43c9cd6-a5c3-770c-91e9-fb8c6d257524',
		  'cache-control': 'no-cache',
		  'content-type': 'application/json' },
		body: 
		{ jsonrpc: '2.0',
		  method: 'invoke',
		params: 
        { type: 1,
        chaincodeID: { name: obj.message },
        ctorMsg: 
        { function: 'init_company',
        args: [ 'name', 'score', 'ontime', 'total' ] },
        secureContext: 'test_user0' },
		id: 1 },
        json: true };

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

	console.log(body);
});

};

