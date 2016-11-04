/**
 * Created by davery on 11/3/2016.
 */
var xlsx = require('xlsx');


var workbook = xlsx.readFile('test.xlsx');

console.log(workbook.SheetNames);

var first_sheet_name = workbook.SheetNames[0];
var address_of_cell = 'A1';

/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];

/* Find desired cell */
var desired_cell = worksheet[address_of_cell];

/* Get the value */
var desired_value = desired_cell.v;

console.log(desired_value);

worksheet = workbook.Sheets['Sheet2'];
console.log(worksheet['A1'].v)