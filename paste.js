// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function handlePaste (e) {
	var targ;
	var targel;
    var clipboardData, pastedData;


    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

	
	 targ=e.currentTarget;		//targ is just the document.  Not needed 
	 
	 //if chrome
	 //targel=e.srcElement;		// targel is the element into which the paste is being attempted
	 
	 //both chrome and ff
	 targel=e.target;
	 var currentval=$(targel).val();
	 var start=$(targel).prop('selectionStart');
	 if(start==null) {
		 //property not supported, e.g. an input email field.  In that case resume propagation and return, no filtering
		 return;
	 }
	 var end=$(targel).prop('selectionEnd');
	

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
	
	 var newdata = currentval.slice(0,start) + cleanString(pastedData) + currentval.slice(end);
	 $(targel).val(newdata);
}

function setGlobalPasteFilter() {
	document.addEventListener('paste',handlePaste);
}

