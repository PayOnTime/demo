function addUser() {
    //var formData = new FormData(document.getElementById("addUserForm"))
    var newUser = {
        'name': $('#addUser fieldset input#name').val(),
        'score': $('#addUser fieldset input#score').val(),
        'ontime': $('#addUser fieldset input#ontime').val(),
        'total': $('#addUser fieldset input#total').val(),
    }
    console.log("Adding new user:", newUser);

    // Clear the form inputs
    $('#addUser fieldset input').val(' ');

    // TODO send a request to the nodejs web server
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3000",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "processData": false,
        data: JSON.stringify(newUser)
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });


}

function info() {

    var newUser = {
        'cname': $('#info fieldset input#cname').val(),
    }

    var request = require("request");

    var options = {
        method: 'POST',
        url: 'http://192.168.99.100:7050/chaincode',
        headers: {
            'postman-token': 'cdcbbbf4-a02b-a0bc-2605-ee484e9ab754',
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: '{\r\n "jsonrpc": "2.0",\r\n "method": "query",\r\n "params": {\r\n   "type": 1,\r\n   "chaincodeID": {\r\n     "name": obj.message\r\n   },\r\n   "ctorMsg": {\r\n     "function": "read",\r\n     "args": [\r\n       cname\r\n     ]\r\n   },\r\n   "secureContext": "test_user0"\r\n },\r\n "id": 1\r\n}'
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });

}
;