/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

var companyIndexStr = "_marbleindex" //name for the key/value that will store a list of all known companies
//var openTradesStr = "_opentrades"				//name for the key/value that will store all open trades

type Company struct {
	Name   string `json:"name"` //the fieldtags are needed to keep case from bouncing around
	Score  int    `json:"score"`
	Ontime int    `json:"ontime"`
	Total  int    `json:"total"`
}

/*type Description struct{
	Color string `json:"color"`
	Size int `json:"size"`
}

type AnOpenTrade struct{
	User string `json:"user"`					//user who created the open trade order
	Timestamp int64 `json:"timestamp"`			//utc timestamp of creation
	Want Description  `json:"want"`				//description of desired marble
	Willing []Description `json:"willing"`		//array of marbles willing to trade away
}

type AllTrades struct{
	OpenTrades []AnOpenTrade `json:"open_trades"`
}
*/
// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// ============================================================================================================================
// Init - reset all the things
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	var Aval int
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	// Initialize the chaincode
	Aval, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Expecting integer value for asset holding")
	}

	// Write the state to the ledger
	err = stub.PutState("abc", []byte(strconv.Itoa(Aval))) //making a test var "abc", I find it handy to read/write to it right away to test the network
	if err != nil {
		return nil, err
	}

	var empty []string
	jsonAsBytes, _ := json.Marshal(empty) //marshal an emtpy array of strings to clear the index
	err = stub.PutState(companyIndexStr, jsonAsBytes)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" { //initialize the chaincode state, used as reset
		return t.Init(stub, "init", args)
	} else if function == "write" { //writes a value to the chaincode state
		return t.Write(stub, args)
	} else if function == "init_company" { //create a new marble
		return t.init_company(stub, args)
	} else if function == "newPayment" { //change owner of a marble
		return t.newPayment(stub, args)
	}
	fmt.Println("invoke did not find func: " + function) //error

	return nil, errors.New("Received unknown function invocation")
}

// ============================================================================================================================
// Query - Our entry point for Queries
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "read" { //read a variable
		return t.read(stub, args)
	}
	fmt.Println("query did not find func: " + function) //error

	return nil, errors.New("Received unknown function query")
}

// ============================================================================================================================
// Read - read a variable from chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the var to query")
	}

	name = args[0]
	fmt.Println("reading state of: " + name)
	valAsbytes, err := stub.GetState(name) //get the var from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + name + "\"}"
		return nil, errors.New(jsonResp)
	}
	fmt.Println("read value: " + string(valAsbytes))

	return valAsbytes, nil //send it onward
}

// ============================================================================================================================
// Delete - remove a key/value pair from state
// ============================================================================================================================
func (t *SimpleChaincode) Delete(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	name := args[0]
	err := stub.DelState(name) //remove the key from chaincode state
	if err != nil {
		return nil, errors.New("Failed to delete state")
	}

	//get the marble index --> company
	companyAsBytes, err := stub.GetState(companyIndexStr)
	if err != nil {
		return nil, errors.New("Failed to get company index")
	}
	var companyIndex []string
	json.Unmarshal(companyAsBytes, &companyIndex) //un stringify it aka JSON.parse()

	//remove marble from index
	for i, val := range companyIndex {
		fmt.Println(strconv.Itoa(i) + " - looking at " + val + " for " + name)
		if val == name { //find the correct company
			fmt.Println("found company")
			companyIndex = append(companyIndex[:i], companyIndex[i+1:]...) //remove it
			for x := range companyIndex {                                  //debug prints...
				fmt.Println(string(x) + " - " + companyIndex[x])
			}
			break
		}
	}
	jsonAsBytes, _ := json.Marshal(companyIndex) //save new index
	err = stub.PutState(companyIndexStr, jsonAsBytes)
	return nil, nil
}

// ============================================================================================================================
// Write - write variable into chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) Write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, value string // Entities
	var err error
	fmt.Println("running write()")

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the variable and value to set")
	}

	name = args[0] //rename for funsies
	value = args[1]
	err = stub.PutState(name, []byte(value)) //write the variable into the chaincode state
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func (t *SimpleChaincode) newPayment(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	fmt.Println("Running newPayment with args: " + strings.Join(args, ","))

	/*
		1: Name of company
		2: true: on time, false: late
	*/
	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}
	company := args[0]
	ontime, err := strconv.ParseBool(args[1])

	//check if company already exists
	companyAsBytes, err := stub.GetState(company)
	if err != nil {
		return nil, errors.New("Failed to get company name")
	}
	res := Company{}
	json.Unmarshal(companyAsBytes, &res)
	if res.Name == company {
		fmt.Println("Found company " + company)
		fmt.Println(res)

		res.Total++

		if ontime {
			res.Ontime++
		}

		jsonAsBytes, _ := json.Marshal(res)
		err = stub.PutState(company, jsonAsBytes) //rewrite the company
		if err != nil {
			return nil, err
		}

		fmt.Println("- updated company in newPayment")
		return nil, nil
	}

	return nil, errors.New("Failed to update company")
}

// ============================================================================================================================
// Init Marble - create a new marble, store into chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) init_company(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	fmt.Println("Running init_company with args: " + strings.Join(args, ","))

	var err error
	/*Name string `json:"name"`					//the fieldtags are needed to keep case from bouncing around
	Score int `json:"score"`
	Ontime int `json:"Ontime"`
	Total int `json:"Total"`*/

	//   0       1       2     3
	// "Name", "Score, "Ontime", "Total"
	if len(args) != 4 {
		return nil, errors.New("Incorrect number of arguments. Expecting 4")
	}

	//input sanitation
	fmt.Println("- start init company")
	if len(args[0]) <= 0 {
		return nil, errors.New("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return nil, errors.New("2nd argument must be a non-empty int")
	}
	if len(args[2]) <= 0 {
		return nil, errors.New("3rd argument must be a non-empty int")
	}
	if len(args[3]) <= 0 {
		return nil, errors.New("4th argument must be a non-empty int")
	}

	//   0       1       2     3
	// "Name", "Score, "Ontime", "Total"
	// QUESTION -- Is it ok to have multiple err in each of the strconv types to capture possible errors? or should these be err1, err2, etc
	name := args[0]
	score, err := strconv.Atoi(args[1])
	Ontime, err := strconv.Atoi(args[2])
	Total, err := strconv.Atoi(args[3])
	if err != nil {
		return nil, errors.New("this argument must be a numeric string")
	}

	//check if company already exists
	companyAsBytes, err := stub.GetState(name)
	if err != nil {
		return nil, errors.New("Failed to get company name")
	}
	res := Company{}
	json.Unmarshal(companyAsBytes, &res)
	if res.Name == name {
		fmt.Println("This company arleady exists: " + name)
		fmt.Println(res)
		return nil, errors.New("This company arleady exists") //all stop a marble by this name exists
	}

	//   0       1       2     3
	// "Name", "Score, "Ontime", "Total"
	//build the company json string manually
	str := `{"name": "` + name + `", "score": ` + strconv.Itoa(score) + `, "ontime": ` + strconv.Itoa(Ontime) + `, "total": ` + strconv.Itoa(Total) + `}`
	fmt.Println("Company: " + str)
	err = stub.PutState(name, []byte(str)) //store company with id as key
	if err != nil {
		return nil, err
	}

	//get the company index
	// Had to change err to err1 as when building, received error "no new vairables on left side of :="
	companyAsBytes, err1 := stub.GetState(companyIndexStr)
	if err1 != nil {
		return nil, errors.New("Failed to get company index")
	}
	var companyIndex []string
	json.Unmarshal(companyAsBytes, &companyIndex) //un stringify it aka JSON.parse()

	//append
	companyIndex = append(companyIndex, name) //add company name to index list
	fmt.Println("! company index: ", companyIndex)
	jsonAsBytes, _ := json.Marshal(companyIndex)
	err = stub.PutState(companyIndexStr, jsonAsBytes) //store name of marble

	fmt.Println("- end init company")
	return nil, nil
}

// ============================================================================================================================
// Make Timestamp - create a timestamp in ms
// ============================================================================================================================
func makeTimestamp() int64 {
	return time.Now().UnixNano() / (int64(time.Millisecond) / int64(time.Nanosecond))
}
