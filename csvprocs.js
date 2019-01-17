// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

/* function is injected.  Parses a line of csv data
 based on http://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript
 These two functions to be injected onto the page
*/


function rowparse(row){
  var insideQuote = false,
      entries = [],
      entry = [];
  row.split('').forEach(function (character) {
    if(character === '"') {
      insideQuote = !insideQuote;
    } else {
      if(character == "," && !insideQuote) {
        entries.push(entry.join(''));
        entry = [];
      } else {
        entry.push(character);
      }
    }
  });
  entries.push(entry.join(''));
  return entries;
}

var injrowparse= rowparse;

/* function is injected. Splits a CSV file into lines to be parsed, returns parsed file

Issue - embedded newlines or linefeeds



*/


function parseCSV(data) {
	data=cleanString(data);	// gets rid of excel junk chars
	var fres=[];
	

	var endline='\n';
	if(data.indexOf('\r\n') != -1) {
		endline='\r\n';		//windows
	} else {
		if(data.indexOf('\r') != -1) {
			endline='\r';		//windows	
		}		
	}
	
	data.split(endline).forEach(function (row) {
	  if(rowparse(row) != "") {
		fres.push(rowparse(row));
	  }

	});
   return fres;
}

var injparse= parseCSV;

