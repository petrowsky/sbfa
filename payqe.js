// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
var scoutPayVal=[];
var unitScoutId='';
function addRawPayLog(data,pageid,unitID,scoutid) 	{
// If an admin or treasurer, get an option to Close Account
	if(myPositionIs(payPos,unitID) == false ) {
		return data;
	}

	//debugger;
	var startfunc=data.match(/<\/ul>\s+<div id="comments">/).index;
	
	var newdata=data.slice(0,startfunc);

	newdata += '			<li data-theme="d">\n';
	newdata += '					<div class="normalText">\n';
	newdata += '						<a data-role="button" data-theme="g" data-inline="true" data-mini="true"  href="#" id="buttonCloseAccount">\n';
	newdata += '								Close Account\n';
	newdata += '						</a>\n';
	newdata += '					</div>\n';
	newdata += '			</li>\n';

	newdata += data.slice(startfunc);
	data=newdata;
	
	var startfunc=data.match(/function commentsInit/).index;
	var newdata=data.slice(0,startfunc);
	newdata += '	$("#buttonCloseAccount").click(function() {\n';	
	newdata += '    	procCloseAccount("'+escapeHTML(unitID)+'","'+escapeHTML(pageid)+'","'+escapeHTML(scoutid)+'");\n';
	newdata += '	});\n';	
	newdata += data.slice(startfunc);
	data=newdata;	
	
	return data;
	

}
function addRawPayQE(data,pageid,unitID) 	{		

		   // modify css to position images properly due to Chrome 57 change
	if (scoutlist != '') {
		var txtunit="Unit"
		
		if(data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)!=null) {
			txtunit= data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)[1];
		}		
		var newdata=data.replace('{ position: absolute; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }', '{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }');
		data = newdata;			   
	   
	   
	   
	   // insert scoutlist html taken from hiking log form into raw data
		newdata=data.replace('<li data-role="fieldcontain" id="paymentTypeLI">',scoutlist + '\n' + '<li data-role="fieldcontain" id="paymentTypeLI">');
		data = newdata;


		// add a transfer button if UnitPaylog Account is in scoutlist
		var isUnit=false;	
		var unitPayLogID='';
		 for(var i=0;i<scoutPermPayObjList.length;i++) {
			 
		   if(scoutPermPayObjList[i].name == 'ACCOUNT, UnitPaylog') {
			   unitPayLogID=scoutPermPayObjList[i].id;
			   isUnit=true;
				//				<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  checked="checked"  data-theme="d">
				//				<label for="paymentTypePayment">Record a Payment</label>
				
			newdata= '				<input type="radio" name="PaymentType" id="paymentTypeTransfer" value="Transfer"  checked="checked"  data-theme="d">';
				newdata+= '				<label for="paymentTypeTransfer">Credit selected Scout Account(s) (Transfer from '+txtunit+')</label>';

				newdata += '			<input type="radio" name="PaymentType" id="paymentTypeWithdraw" value="Withdrawal"   data-theme="d">';
				newdata+= '				<label for="paymentTypeWithdraw">Cash or check withdrawal from selected Scout Account(s)</label>';				
				
				
				data=data.replace(/Record a Payment/,'Deposit Scout cash or checks to selected Scout Account(s)');
				data=data.replace(/Record an Amount Due/,'Charge selected Scout Account(s) (Transfer to '+txtunit+')');
	
				
				var startfunc = data.indexOf('<input type="radio" name="PaymentType" id="paymentTypePayment"');
				data=data.slice(0,startfunc) + newdata + data.slice(startfunc);
				data=data.replace("if( $(this).val() == 'Payment')","if( $(this).val() == 'Payment' || $(this).val() == 'Transfer')");
				
				
				break;
		   }
		 }
		 if(isUnit==false) {
				data=data.replace(/Record a Payment/,'Credit selected Accounts');
				data=data.replace(/Record an Amount Due/,'Charge selected Accounts');				 
		 }
	//hide Amount from old form
	data=data.replace(/id="amountLI"/,'id="amountLI" style="display:none"');
	// replace the submit function  $('div[data-role="page"]').append(script)
		
		var startfunc = data.indexOf('function submitForm()',1);
		var endfunct = data.indexOf('function deleteLog()',1);
		var myfunc = '' + mysubmitForm;
		
		
		//Replace submitForm() on page
		myfunc= myfunc.replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		//var myfuncb =(getPaymentLogIDLI + '').replace(/\#PageX/g,'#Page' + escapeHTML(pageid));
		var myfuncb='';
		var newdata = data.slice(0,startfunc) + 'function submitForm()' + myfunc.slice(23) + '\n' + myfuncb + "\n" + data.slice(endfunct);
		data = newdata;
		
		// modify/add new functions into page for getting paymentlogIDLIs
		
		var startfunc = data.indexOf("$('[name=PaymentType]'",1);
		var endfunct = data.indexOf("$('#category'",startfunc);
		myfunc = '' + wrapper;
		myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;	

		// Replace the buttonCancel
		var startfunc = data.indexOf("$('#buttonCancel', '#Page",1);
		var endfunct = data.indexOf("$('#buttonSubmit', '#Page",1);
		myfunc = '' + lrapper;
		myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;						
			
		var startfunc = data.indexOf('<a id="goBack"',1);
		var endfunct = data.indexOf('<img src',startfunc);
		myfunc = '<a id="goBack" href="'+escapeHTML('/mobile/dashboard/admin/unit.asp?UnitID='+escapeHTML(unitID))+'" data-transition="slide" data-direction="reverse";>';
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;					
		

		if(isUnit == true) {

			//Add easy link to the unit paylog account if there is one;
			var startfunc = data.match(/<\/ul>\s+<\/form>/).index;
			var newdata = data.slice(0,startfunc) + '<li><a href="https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+unitPayLogID+'&UnitID='+unitID+'" target="_blank" >Open Unit Paylog Account in a new tab</a>\n</li>\n'  +data.slice(startfunc);
			data=newdata;
		}


	
		//add modification notice
		//startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
		//var newdata = data.slice(0,startfunc);
		//newdata += '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
		//data=newdata + data.slice(startfunc);	
	} else {

		
		data=data.replace(/\$\('#paymentsLogForm', '#Page\d+'\)\.submit\(\);/,"pylgsubmit()");
		

		var newcode='<input type="radio" name="PaymentType" id="paymentTypeNone" value="None"  checked="checked"  data-theme="d">\n';
		newcode+='<label for="paymentTypeNone">Select Transaction Type</label>\n';


		data=data.replace(/<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  checked="checked"  data-theme="d">/,newcode +'<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  data-theme="d">');


			
	}
	scoutlist='';
	data=data.replace(/Record a Payment/,'Credit this Account');
	data=data.replace(/Record an Amount Due/,'Charge this Account');	

	var newdata = '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>\n';		
	data=data.replace(/<div style="margin-top: 6px;">&copy;/,newdata+ '<div style="margin-top: 6px;">&copy;');
		
	return data;
}

function pylgsubmit() {
	
if($('input[name="PaymentType"]:checked').val() == 'None') {
		//newcode+="		alert('Please select a transaction type');
	showErrorPopup('Please select a transaction type.');
	return;
}		
	$('#paymentsLogForm').submit();
}

function lrapper() {
	
	$('#buttonCancel', '#PageX').click(function() {
			$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=X',
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
		);	
	});
}

//payqe
	// This function is inserted as submitForm()
function mysubmitForm() {
			scoutUserID.length=0;
			scoutPayVal.length=0;
			

			if($('input[name="Description"]','#PageX').val() =='') {
				alert('Need a Description');
				$.mobile.loading('hide');
				$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
				return;
			}
			//if($('input[name="Amount"]','#PageX').val() =='') {
			//	alert('Need an amount');
			//	$.mobile.loading('hide');
			//	$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
			//	return;
			//}			

		    var err=false;
			$('input[name="ScoutUserID"]:checked','#PageX').each(function () {
				if(err==false) {
					
					if($('#aID'+ this.value ,'#PageX').val().match(/[0-9]/) == null ) {					
						alert('Selected Scout ' +$('label[for='+ $(this).attr('id') +']').text().trim() +' is missing a payment amount');
						$.mobile.loading('hide');
						$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
						err=true;
					} else {
						// check for non-numeric values
						if(isNumeric($('#aID'+ this.value ,'#PageX').val()) == true ) {				
							scoutPayVal.push($('#aID'+ this.value ,'#PageX').val());
							scoutUserID.push(this.value);
						} else {
							alert('Selected Scout ' +$('label[for='+ $(this).attr('id') +']').text().trim() +' payment amount must be numeric');
							$.mobile.loading('hide');
							$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
							err=true;
							//return;
						}
					}
				}
				//alert(this.value);
			});
			
			if(err == true) {
				return;
			}
			// reset all LI's to normal color
			$('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');			
			var UnitID=X;		
			externalSubmit('#PageX',UnitID);
}

//payqe
function externalSubmit(pageID,unitID) {
			if (scoutUserID.length == 0) {
				alert("No scouts selected");
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				return;
			}


			// verify all selected scouts have a value for payment
			
			//formpost has extra ScoutUserID data fields in it
			submitQuietPay(pageID,unitID);	
}


//payqe
function submitPayForm(id,pageID) {			
			var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + id + '&UnitID=' + unitID + '&PaymentLogID=';
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'script',
				data: formPost,
				error: function (xhr, status, error) {
					$.mobile.loading('hide');
					showErrorPopup('We could not save the log.  Please try again.');
				},
				complete: function() {
					$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				}
			});
}
//payqe
function submitQuietPay(pageID,unitID) {
	var scoutid = scoutUserID.shift();
	var payVal=scoutPayVal.shift();
	
	var formPost = $('#paymentsLogForm', pageID).serialize();	
	
	//update the value
	
	formPost=tokenVal(formPost,'Amount',payVal);
	
	//remove any scoutuser
	//The form was built based on one Scout's ID.  Paylog IDs on that form are for that scout.  
	//So we need to do some lookups.  For page scout, payid checked, get payid text,  find matching payid texts for current scout and get the new payid
	//For the scout that this form was checked
	

	formPost=formPost.replace(/ScoutUserID=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=&/g,'');	
	formPost=formPost.replace(/aIDAll=\d+&/g,'');	
	formPost=formPost.replace(/aIDAll+=&/g,'');
	
		var paytxt='';
		var payid='';	
	var pidscoutid=getToken(formPost,'ApplyPaymentLogID');  //should have an id_scoutid value and format
	
	if(pidscoutid == '' || pidscoutid==null) {
		
	} else {

		var pid=pidscoutid.match(/[^_]+/)[0];
		var itemScout=pidscoutid.match(/_(.+)/)[1];
		
		

		for(var i=0;i<payObj.paymentLogIDList.length;i++) {
			if (payObj.paymentLogIDList[i].slice(17)==pid) {
				if(payObj.paymentLogScoutList[i]==itemScout) {
					paytxt=payObj.paymentLogTxtList[i];
					break;
				}
			}
		}
		

		
		for(var i=0;i<payObj.paymentLogIDList.length;i++) {
			if(paytxt==payObj.paymentLogTxtList[i]) {
				if(payObj.paymentLogScoutList[i]==scoutid) {
					//want just teh value portion
					payid=payObj.paymentLogIDList[i].slice(17);
				}
			}
		}


	}

	formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);

	if (formPost.indexOf('PaymentType=Transfer') != -1) {
			formPost=formPost.replace(/PaymentType=Transfer/,'PaymentType=Payment');
	}	

	if (formPost.indexOf('PaymentType=Withdrawal') != -1) {
			formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Charge');
	}		
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],submitQuietPay,[pageID,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//if result contains 'Saved!' then it is good
			if (this.response.indexOf('Saved!') == -1 ) {
				alert('Something went wrong.  Aborting. URL='+url+'formPost=' + formPost);
				scoutUserID.length=0;  // kill the remaining dates
				
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				payError(unitID);
				return;
			}
			
			if(unitScoutId != '') {
				setTimeout(function(){ updateUnitAccount(pageID,unitID,scoutid,payVal,false,''); }, 200);
				return;
			} 
			
			if (scoutUserID.length == 0) {
				//done.  Change back to unit page
				changepageurl('/mobile/dashboard/admin/unit.asp?UnitID='+unitID);
				return;
			}
			

		    setTimeout(function(){ submitQuietPay(pageID,unitID); }, 200);
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],submitQuietPay,[pageID,unitID]);
	};
}


/*
payment to unassigned

PaymentType:Payment
LogDate:11/24/2017
Description:test payment
Amount:1
TransactionID:
Category:Dues
CategoryOther:
ApplyPaymentLogID:
CalendarEventID:
PaymentDueDate:
Notes:

payment to a specific
https://www.scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=xx&UnitID=xx&PaymentLogID=
PaymentType:Payment
LogDate:11/24/2017
Description:test again
Amount:1
TransactionID:
Category:Dues
CategoryOther:
ApplyPaymentLogID:428470
CalendarEventID:
PaymentDueDate:
Notes:


Charge
https://www.scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=xx&UnitID=xx&PaymentLogID=
PaymentType:Charge
LogDate:11/24/2017
Description:test again
Amount:1
TransactionID:
Category:Dues
CategoryOther:
CalendarEventID:
PaymentDueDate:
Notes:



//On a payment, record both a payment and a charge

//On a charge, record only a payment

//on a transfer, record only a charge

//on a withdrawal, record a payment and a charge

*/
//updates the Unit Account paylog
function updateUnitAccount(pageID,unitID,scoutid,payVal,cb,payid) {
	//debugger;
	var scoutname='';
	// modify
	var formPost = $('#paymentsLogForm', pageID).serialize();	
	//remove any scoutuser
	formPost=formPost.replace(/ScoutUserID=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=&/g,'');	
	formPost=formPost.replace(/aIDAll=\d+&/g,'');	
	formPost=formPost.replace(/aIDAll+=&/g,'');	
	//update the value
	
	formPost=tokenVal(formPost,'Amount',payVal);	
	
	if (formPost.indexOf('PaymentType=Transfer') != -1) {
		formPost=formPost.replace(/PaymentType=Transfer/,'PaymentType=Charge');	//simple case
		//formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
		formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
		cb=false;
	} else {
		if (formPost.indexOf('PaymentType=Payment') != -1) {
			//this one is complex.
			//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
			if(cb==true) {
				cb=false;	
				formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To
				//if none exists, add it
				if(formPost.indexOf('ApplyPaymentLogID') == -1) {
					formPost += '&ApplyPaymentLogID=' + payid;
				}
			} else {
				cb=true;	
				formPost=formPost.replace(/PaymentType=Payment/,'PaymentType=Charge');
				formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
			}
		} else {
			if (formPost.indexOf('PaymentType=Charge') != -1) {
				// scout had a payment, need to convert to charge
				formPost=formPost.replace(/PaymentType=Charge/,'PaymentType=Payment');
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');
			} else {
				//type is Withdrawal
				//first time thru should be a charge
				//2nd time thru should be a payment
				//this one is complex.
				//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
				if(cb==true) {
					cb=false;
					formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Payment');					
					formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To
					//if none exists, add it
					if(formPost.indexOf('ApplyPaymentLogID') == -1) {
						formPost += '&ApplyPaymentLogID=' + payid;
					}
				} else {
					cb=true;	
					formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Charge');
					formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
					formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
				}
				
				
			}
		}
	}
	
	//check for complex payment

	/*
	if (formPost.indexOf('PaymentType=Payment') != -1) {
		formPost=formPost.replace(/PaymentType=Payment/,'PaymentType=Charge');
		//formPost=formPost.replace(/ApplyPaymentLogID=\d+_\d+&/,'');
		formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
	} else {
		formPost=formPost.replace(/PaymentType=Charge/,'PaymentType=Payment');
		formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
	}
	*/
	
	//update the description with the scout name
	var descript=getToken(formPost,'Description');
	for(var i=0;i<scoutPermPayObjList.length;i++) {
		if (scoutPermPayObjList[i].id == scoutid) {
			descript += encodeURIComponent(' for ' +scoutPermPayObjList[i].name.replace(/[^,]+/,scoutPermPayObjList[i].name[0])).replace(/%20/g,'+');
			formPost=tokenVal(formPost,'Description',descript)
			break;
		}
	}	 

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],updateUnitAccount,[pageID,unitID,scoutid,payVal,cb,payid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//if result contains 'Saved!' then it is good
			if (this.response.indexOf('Saved!') == -1 ) {
				alert('Something went wrong.  Aborting. URL='+url+'formPost=' + formPost);
				scoutUserID.length=0;  // kill the remaining
				
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				payError(unitID);
				return;
			}
			
			
			//unitScoutId 
			
			if(cb==true) {
				// get the new Apply Payment To id
				
				setTimeout(function(){ getNewPayID(pageID,unitID,scoutid,payVal,true,descript); }, 200);
				return;
			}

			
			if (scoutUserID.length == 0) {
				//done.  Change back to unit page
				unitScoutId='';
				changepageurl('/mobile/dashboard/admin/unit.asp?UnitID='+unitID);
				return;
			}
			

		    setTimeout(function(){ submitQuietPay(pageID,unitID); }, 200);
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + unitScoutId + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],updateUnitAccount,[pageID,unitID,scoutid,payVal,cb,payid]);
	};	
}


function getNewPayID (pageID,unitID,scoutid,payVal,rFlag,newdescript) {
	var formPost = $('#paymentsLogForm', pageID).serialize();
	var descript=getToken(formPost,'Description');  //uri encoded
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],getNewPayID,[pageID,unitID,scoutid,payVal,rFlag,newdescript]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			/* Search for the paymentlog data.  
				If the list is empty, add them all
				 PaymentLogIDList
				If the list is not empty, subtract items that are not in this scouts list
			*/
					
			//var idlist =$('#applyPaymentLogIDLI > fieldset > input',this.response);
			var idlist =$('input[name="ApplyPaymentLogID"]',this.response);
			var id;
			var idnum;
			var sel;
		
		
		   //console.log(scoutid,payVal,rFlag,newdescript);
		   //debugger;
		
		    var txtlist=[];
		    for (var i=0;i < idlist.length;i++) {
			   id=idlist[i].id;
			   idnum=idlist[i].value;
			   if(newdescript == encodeURIComponent($('label[for="'+id+'"]',this.response)[0].textContent).replace(/%20/g,'+')) {
					break;
			   }
			   idnum='';
		    }
		
			 setTimeout(function(){ updateUnitAccount(pageID,unitID,scoutid,payVal,rFlag,idnum); }, 200);
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + unitScoutId + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],getNewPayID,[pageID,unitID,scoutid,payVal,rFlag,newdescript]);	
	};

}
//payqe
//return true if position in posLst array is found in myPositions arrya and unitIDs match
function myPositionIs(posLst,unitID) {
	for(var x=0;x<posLst.length;x++) {
		for(var y=0;y<myPositions.length;y++) {
			if (unitID == myPositions[y].unitID) {
				if(posLst[x] == myPositions[y].position ) {
					return true;
				}
			}
		
		}
	}
	return false;
}
//payqe
function fixPayFormPost() {
	// Removes RecurEvent=off&RepeatType=Days&RepeatEveryType=&OccurrencesType
	formPost = formPost.replace(/&ScoutUserID=[^&]*/,'');
	formPost = formPost.replace(/ScoutUserID=[^&]*/,'');

	//if it starts with an & remove it
	if (formPost.slice(0,1) == '&') {
	  formPost = formPost.slice(1);
	}
	
}


//payqe
function payError(unitid,reset) {
	$.mobile.loading('hide');
	alert('Error posting Payment data, discontinuing updates.  Not all Scouts Selected are updated');
	if(reset==true) {
		scoutUserID.length=0;
		//$('#buttonCancel, #buttonSubmit', sPage).button('enable');  //no need to reset, changing page anyway
	}
		//$(':input', sPage +' #swimmingForm').attr('disabled', false);
	$.mobile.changePage(
			'/mobile/dashboard/admin/unit.asp?UnitID=' + unitid,
		{
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
	);	
}



//payqe
function procPayQuickEntryItemNew(unitID,denID,patrolID) {
	var utype;
	var patrolScouts=[];
	var DenPatrolName='';
	if (patrolID != '' || denID != '') {
	  utype="denpatrol";
		DenPatrolName=$('Title').text();
	  
		$('li[data-scoutuserid]').each(function () {
			patrolScouts.push($(this).attr('data-scoutuserid'));
		});	  
	  
	} else {
		utype="unit";
	}
	QEPatrol=DenPatrolName.replace(' Patrol','').replace(' Den','');
	QEPatrolID=patrolID;
	$.mobile.loading('show', { theme: 'a', text: 'loading...', textonly: false });
	var evObj = { name : '', id : '', img : ''};

	//
	
	if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
		var troop =$('title').text();	//unit page
	} else {
		var troop =$('#goToUnit').text();	//denpatrol page
	}
	
	
	//alert(troop);
	// need to get my connections to build scout list of scouts that user has Full Control capability for
	var unitID = $('base')[0].href.match(/\d+/)[0];
	
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,payError,[unitID,true],procPayQuickEntryItemNew,[unitID,denID,patrolID]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
				
				//console.log(this);	
				scoutPermPayObjList.length=0;				
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
				//console.log('x');
					//console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
					var txtUnit=localDataFilter ($('.orangeSmall',this)[0].textContent,'','local');
					if (txtUnit.indexOf(troop) != -1) {
						
						//this scout is in the unit of interest
						
						//now can we determine if scout is in patrol of interest.  Also look to see if it is a UnitPaylog Account Scout
						var okToUse=false;
						if(patrolScouts.length != 0) {
							for(var i=0; i< patrolScouts.length;i++) {
								if(patrolScouts[i]==$('a',this).attr('href').match(/\d+/)[0]) {
									okToUse=true;
									break;
								}
							}
						
						} else {
							okToUse=true;
						}
						
						if(okToUse==true || $('a',this)[0].textContent== 'ACCOUNT, UnitPaylog') {
							
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1 ) {
									// The User has Full Control permission for this Scout
								var p = $(this).parent();
								evObj.img= $('img',p).attr('src');	
								evObj.id =  $('a',this).attr('href').match(/\d+/)[0];
								evObj.name =  localDataFilter ($('a',this)[0].textContent.trim(),'','local');
								//console.log(evObj.name,evObj.id);
								scoutPermPayObjList.push(JSON.parse(JSON.stringify(evObj)));
							//	console.log(scoutid + ' ' + scoutname);	
								//set flags for change page
								
								
							}
						}
					}
				});		

				// build scoutlist based on scoutPermPayObjList
				if(scoutPermPayObjList.length==0) {
					alert('You do not have Full Control permissions for any Scouts');
					genError();
				} else {
				buildHtmlScoutlist();

				   payObj={paymentLogIDList: [],paymentLogTxtList:[],paymentLogScoutList:[], masterscout:''};
				   payObj.masterscout=evObj.id;
				   
				   
				changepageurl('/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + evObj.id + '&UnitID=' + unitID );
				$(document).one('pagebeforeshow',function() {
					modifyPayLogPage('');
				});			
				}
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,payError,[unitID,true],procPayQuickEntryItemNew,[unitID,denID,patrolID]);
		};
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//payqe
function buildHtmlScoutlist() {
 scoutlist =  '<li id="scoutsLI" data-theme="d">\n';
 scoutlist+=  '						<p class="normalText">Now you can quickly and easily enter payment logs for the entire troop or pack!.</p>\n';

// scoutlist+=  '							<fieldset data-role="controlgroup">\n';
 scoutlist+=  '								<legend class="text-orange">\n';
 scoutlist+=  '									<strong>Choose Scout(s):</strong>\n';
 scoutlist+=  '								</legend>\n';
 
 
 scoutlist += '								<div class="ui-grid-a ui-responsive">';
 scoutlist += '									<div class="ui-block-a" >Scout</div>';  
 scoutlist += '									<div class="ui-block-b">Amount</div>';	   


 scoutlist += '									<div class="ui-block-a" style="height:46px;">';	//line-height:45px;font-size: 16px;
 scoutlist+=  '														<input type="checkbox" data-theme="d" name="allUserID" id="AllUserID" value="All">\n';
 scoutlist+=  '														<label for="AllUserID" >\n';
 scoutlist+=  '															<div style="margin-left: 40px; ">\n';
 scoutlist+=  '																Select All\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '														</label>\n';
 scoutlist +='            						 	</div>';
 
 scoutlist += '										<div class="ui-block-b" style="height:46px;">';
 scoutlist += '										   <input type="text"  name="aIDAll" id="AllaID" value=""  class="ui-input-text " placeholder="Value to apply to all..">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
 scoutlist +='            						 	</div>'; 
 
 
 unitScoutId='';
 for(var i=0;i<scoutPermPayObjList.length;i++) {
   if(scoutPermPayObjList[i].name == 'ACCOUNT, UnitPaylog') {
	   // do not add to list to select
	   unitScoutId=scoutPermPayObjList[i].id;
   } else {
	   	   
	   
	   

 scoutlist += '									<div class="ui-block-a" style="height:46px;">';	//line-height:45px;font-size: 16px;
 scoutlist+=  '														<input type="checkbox" data-theme="d" name="ScoutUserID" id="scoutUserID'+escapeHTML(scoutPermPayObjList[i].id)+'" value="'+escapeHTML(scoutPermPayObjList[i].id)+'">\n';
 scoutlist+=  '														<label for="scoutUserID'+escapeHTML(scoutPermPayObjList[i].id)+'" >\n';
 scoutlist+=  '															<div style="float: left; width: 30px; ">\n';
 scoutlist+=  '																<img src="'+escapeHTML(scoutPermPayObjList[i].img)+'" class="imageSmall" />\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '															<div style="margin-left: 40px; ">\n';
 scoutlist+=  '																'+escapeHTML(scoutPermPayObjList[i].name)+'\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '														</label>\n';
		scoutlist +='            						 	</div>';
		
		scoutlist += '										<div class="ui-block-b" style="height:46px;">';
		scoutlist += '										   <input type="text" style="height:43px;" name="aID'+escapeHTML(scoutPermPayObjList[i].id)+'" id="aID'+escapeHTML(scoutPermPayObjList[i].id)  + '" value=""  class="ui-input-text ">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
		scoutlist +='            						 	</div>';
   }
 }

		scoutlist +='            			</div>'; 
 //scoutlist+=  '							</fieldset>\n';
 scoutlist+=  '				</li>\n';
 
 
 
}
//payqe
function getPayLogPage(scoutID,unitID,scoutlist,utype) {
	//$('#footer').append('<a href="/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&amp;' + unitID +'" data-role="button" data-icon="add" data-theme="g" data-inline="true" data-mini="true" id="addButton" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-icon-left ui-btn-up-g" style="hidden"></a>');
    //var bname = 'addMyButton' + utype;
	//$('#footer').append('<a href="/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&amp;UnitID=' + unitID +'"   id="' + bname + '"    style="hidden"></a>');
	//$('#' + bname).trigger('click');
	
	changepageurl('/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&UnitID=' + unitID );
	$(document).one('pagebeforeshow',function() {
		modifyPayLogPage(scoutlist);
	});
}

//payqe
function modifyPayLogPage(scoutlist) {
	//Change the title of the page
	$('#goToDenPatrol').remove();
	$('#account').remove();

	//Change title to say Multiple Payments Log
	
	$('title').text('Multiple Payments Log');
	//$('h1.ui-title span:last')[0].textContent = $('h1.ui-title span:last')[0].textContent.replace('Payments','Multiple Payments');
	document.getElementById("goToUnit").nextSibling.nodeValue='Multiple';

	
	//Change the page description
	$('#scoutsLI > div > p.normalText.ui-li-desc').text('Now you can quickly and easily enter payment logs for the entire troop or pack!');
	
	//$('input[name="PaymentType"][value="Charge"]').trigger('click').trigger('click');
	$('#paymentTypeCharge').trigger('click').trigger('click');
	
	$('#calendarEventIDLI, #paymentDueDateLI').slideDown();

	// close
	$('#applyPaymentLogIDLI, #transactionIDLI').slideUp();
	
}


//payqe
/* Changed page event. this function is never called directly
   rather it is used as sort of a protoype to insert the embedded event handler into the page
*/
function xwrapper() {$('[name=PaymentType]', '#PageX').change(function() {
				
				if( $(this).val() == 'Payment') {
					pregetPaymentLogIDLI('#PageX');
				} else {
					// open
					$('#calendarEventIDLI, #paymentDueDateLI', '#PageX').slideDown();

					// close
					$('#applyPaymentLogIDLI, #transactionIDLI', '#PageX').slideUp();
				}
});}

//payqe		 
function wrapper() {
	
					$('#paymentTypePayment', '#PageX').change(function(handle) {
					    var UnitID=X;
						pregetPaymentLogIDLI('#PageX',handle,UnitID);
	
					});

					$('#paymentTypeTransfer', '#PageX').change(function(handle) {
					    var UnitID=X;
						pregetPaymentLogIDLI('#PageX',handle,UnitID);
	
					});					
					
					$('[name=ScoutUserID]', '#PageX').change(function(handle) {
						var UnitID=X;
						testScoutUncheck('#PageX',handle,UnitID);
	
					});
				    $('#paymentTypeCharge', '#PageX').change(function() {
						// open
						$('#calendarEventIDLI, #paymentDueDateLI', '#PageX').slideDown();

						// close
						$('#applyPaymentLogIDLI, #transactionIDLI', '#PageX').slideUp();
				
					});

					$('#AllUserID', '#PageX').click(function () {
						
						if ($(this).is(':checked')) {
							
							$('input[id*=scoutUserID]', '#PageX').prop('checked',true).checkboxradio("refresh");
						} else {
							
							$('input[id*="scoutUserID"]', '#PageX').prop('checked',false).checkboxradio("refresh");
						}
					});	


					$('input[id=AllaID]', '#PageX' ).bind( "change", function(event, ui) {
						if($('input[id=AllaID]', '#PageX' ).val().match(/[^0-9]/) == null || $('input[id=AllaID]', '#PageX' ).val()=='') {
							$('input[id*=aID]', '#PageX' ).val($(this).val());
						} else {
							alert('Amount must be a positive number');
						}
					});
					
					
}

//payqe
function testScoutUncheck(pageId,handle,unitID) {

if ($('input[name="ScoutUserID"]:checked',pageId)[0] == null && $('[name="PaymentType"]:checked').val() == "Payment") {
	alert('You unselected a scout.  A scout must be selected for the Payment option.  Changing transaction type to Charge');
	$('#paymentTypeCharge').trigger('click');
} else {
	// if a scout has been added or removed with the payment option selected, need to readjust the list
	if ($('[name="PaymentType"]:checked').val() == "Payment") {
		pregetPaymentLogIDLI(pageId,handle,unitID);
	}
}

}
/*
	Begins the process of rebuilding the PaymentLogIDLI element
	which began as elements for an individual scout but needs to
	be modified to have only common elements betwee multiple scouts

*/	

//payqe
function pregetPaymentLogIDLI(pageId,handle,unitID) {
					//allow only if scouts are selected.  
					
					if ($('input[name="ScoutUserID"]:checked',pageId)[0] == null) {
						
							handle.preventDefault();
							handle.stopImmediatePropagation();
							handle.stopPropagation();
							if (warned == false) {
								warned=true;
								alert('You must select scouts prior to choosing Payment');
							} else {
								warned = false;
							}
							$('#paymentTypeCharge', pageId).checked=false;
							$('#paymentTypePayment', pageId).checked=true;
							 setTimeout(function(){ resetPayType(); }, 200);
						return false;
						
					}
					
					// Now need to loop through each selected scout to find common payment choices
					// to build the list in #applyPaymentLogIDLI
					
					// Temp disable submit button
					// show spinner

					$('#buttonSubmit', pageId).button('disable');
					
					$.mobile.loading('show', { theme: 'a', text: 'loading Apply Payment To choices...', textonly: false });
					
					scoutUserID.length=0;
					$('input[name="ScoutUserID"]:checked',pageId).each(function () {
						scoutUserID.push(this.value);					
					});					

					payObj.paymentLogIDList.length=0;
					payObj.paymentLogTxtList.length=0;
					payObj.paymentLogScoutList.length=0;
					// and clear the existing selection choices
					$('#applyPaymentLogIDLI > fieldset > .ui-controlgroup-controls > .ui-radio').remove();	
					getPaymentLogIDLI(pageId,unitID);

}

//payqe
function resetPayType() {
	// clickback trigger
	$('#paymentTypeCharge').trigger('click');
	
	$('#calendarEventIDLI, #paymentDueDateLI').slideDown();

	// close
	$('#applyPaymentLogIDLI, #transactionIDLI').slideUp();		
}

/*
	Iterates through the global scoutUserID array to gather payment IDs

*/
		//new func to be added
//payqe
function getPaymentLogIDLI(pageId,unitID) {
			
	var goodlogid = [];
	var goodlogtxt =[];
	var goodlogscout =[];		
	if (scoutUserID.length == 0) {
		// Got them all, build the list and show it
		addPayDiv();
		
		// open
		$('#applyPaymentLogIDLI, #transactionIDLI', pageId).slideDown();

		// close
		$('#calendarEventIDLI, #paymentDueDateLI', pageId).slideUp();

		$('#buttonSubmit', pageId).button('enable');	
		$.mobile.loading('hide');
		return;
	}
	var scoutid = scoutUserID.shift();

		
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],getPaymentLogIDLI,[pageId,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			/* Search for the paymentlog data.  
				If the list is empty, add them all
				 PaymentLogIDList
				If the list is not empty, subtract items that are not in this scouts list
			*/
					
			//var idlist =$('#applyPaymentLogIDLI > fieldset > input',this.response);
			var idlist =$('input[name="ApplyPaymentLogID"]',this.response);
			var id;
			var idtxt;
			var sel;
		
		    var txtlist=[];
		    for (var i=0;i < idlist.length;i++) {
			   id=idlist[i].id;
			   //if(id=='unassigned') {
				//	txtlist.push('unassigned');
				//} else {
				   txtlist.push($('label[for="'+id+'"]',this.response)[0].textContent);
				//}
		    }
		   
		   //try changing from == 0 to >= 0 so it runs all the time
			if (payObj.paymentLogIDList.length >= 0) {
//debugger;
				//get the list for just this scout
				for (var i=0;i < idlist.length;i++) {
					id=idlist[i].id;
					//idtxt=$('#applyPaymentLogIDLI > fieldset > label[for="'+ id + '"]',this.response).text();
					//if(id=='unassigned') {
					//	idtxt='unassigned';
					//} else {
						idtxt=$('label[for="'+id+'"]',this.response)[0].textContent;
					//}
					//debugger;
					payObj.paymentLogIDList.push(id);
					payObj.paymentLogTxtList.push(idtxt);
					payObj.paymentLogScoutList.push(scoutid);
		
				}	
				
			} else {
				//add for next scout, when common texts found
				for (var j = 0;j < payObj.paymentLogIDList.length; j++) {
					keepid=false;
					for (var i = 0; i < idlist.length; i++) {
						//if( payObj.paymentLogIDList[j]  == idlist[i].id) {
						if( payObj.paymentLogTxtList[j]  == txtlist[i]) {
							//this ID can stay
							goodlogid.push(payObj.paymentLogIDList[j]);
							goodlogtxt.push(payObj.paymentLogTxtList[j]);
							goodlogscout.push(payObj.paymentLogScoutList[j]);
							
						}
					}	
				}
				payObj.paymentLogIDList = goodlogid.slice(0);
				payObj.paymentLogTxtList = goodlogtxt.slice(0);
				payObj.paymentLogScoutList = goodlogscout.slice(0);
			}
			
			 setTimeout(function(){ getPaymentLogIDLI(pageId,unitID); }, 200);
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],getPaymentLogIDLI,[pageId,unitID]);
	};
}


/*
	Appends the ApplyPaymentLog IDs to the list
*/
//payqe	
function addPayDiv() {


	// there is no way to avoid dynamically setting these values.

		var found;
		var idplus='';
		var val='';
		var txtlistused=[];
		for	(var i=0;i<payObj.paymentLogIDList.length;i++) {
			found=false;
			for( var j=0;j<txtlistused.length;j++) {
				if(payObj.paymentLogTxtList[i] == txtlistused[j]) {
					found=true;
					break;
				}
			}
			if (found==false) {
					txtlistused.push(payObj.paymentLogTxtList[i]);

					idplus=payObj.paymentLogIDList[i]+'_'+payObj.paymentLogScoutList[i];
					if(idplus.indexOf('applyPaymentLogID') ==-1) {
						idplus='applyPaymentLogID'+idplus;
					}
					val=idplus.slice(17);
			//alert(' modify submitform()  Find the id in formPost, then replace it with the proper one. add only for unique texts.  Later, when user selects, we need to identify the proper scoutid payment idfor this');
			
			
					$('#applyPaymentLogIDLI > fieldset > .ui-controlgroup-controls').append(
						'<div class="ui-radio"><input type="radio" name="ApplyPaymentLogID" id="' + escapeHTML(idplus) + '" value="' + escapeHTML(val) + '" data-theme="d"><label for="' +escapeHTML(idplus) + '" data-corners="true" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="radio-off" data-theme="d" data-mini="false" class="ui-radio-off ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-first-child ui-btn-up-d">' +escapeHTML(payObj.paymentLogTxtList[i]) +'</label></div>'
					).trigger('create');
				
			}			
		}					
}	
	
function procCloseAccount(unitID,pageid,scoutid) {
	//need to find RemovedScout ID
	// get the balance from this page
	/*
	var amt=$('.total').text().replace('$','');
	var due=false;
	if(amt.match(/-/) != null) {
		amt.replace('-','');
		due=true;
	}
	*/

	var name= $('a[href*="account.asp?ScoutUserID="]').text();
	var firstname=name.slice(0,name.length-3);
	var lastname=name.slice(name.length-2);
	
	//fill up an array with transactions
	var payArray=[];
	var dt='';
	var descript='';
	var notes='';
	var tamt='';
	var type='';
	$('a[href*="PaymentLogID="]').each( function () {
		dt=$('div[style*="font-size: 11"]',this).text();
		descript=$('.noellipsis',this).text();
		notes=$('div[style*="margin"]',this).text();
		tamt=$('span',this).text();
		type='Charge';
		if(tamt.match(/-/) == null) {
			type='Payment';
		}
		tamt=tamt.slice(2);
		payArray.push(['',firstname,lastname,type,dt,descript,tamt,'','',notes,scoutid]);
	});
	



	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'PB'], procCloseAccount,[unitID,pageid,scoutid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var name;
			var id='';

			$('li[data-scoutuserid]',this.response).each( function () {

				if($('img[src*="securityapproved32.png"]',this).length > 0) {
					name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();	

					if(name=="Account, RemovedScout" || name=="RemovedScout Account") {
						id=$(this).attr('data-scoutuserid');
					}
					//If the name has a , in it assume last name first
				}
			});
			zeroScoutAccount(unitID,scoutid,id,0,payArray);
		}
	}		
	

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'PB'], procCloseAccount,[unitID,pageid,scoutid]);
	}	
	//find the removed scout id, if any
	//zeroScoutAccount(unitID,scoutid,removedscoutid,0,payArray);
}

function zeroScoutAccount(unitID,scoutid,removedscoutid,transCnt,payArray) {

if(removedscoutid=='') {
	zeroScoutBal(unitID,scoutid);
	return;	
}

var cnt=0;
var thisTransCnt=0;
for(var i=0;i< payArray.length;i++) {
	if(payArray[i][10] == scoutid) {
		if(cnt == transCnt) {
		   thisTransCnt=i;
		}
		cnt +=1;
	}
}
if (cnt == transCnt) {
	//alert('done, now zero out scoutid account');
	zeroScoutBal(unitID,scoutid);
	return;
}


//0: (10) ["BSA Member ID", "First Name", "Last Name", "Payment Type", "Date", "Description", "Amount", "Transaction ID", "Category", "Notes"]

	var formPost = 'PaymentType='+payArray[thisTransCnt][3]+'&LogDate='+encodeURIComponent(payArray[thisTransCnt][4])+'&Description='+encodeURIComponent(payArray[thisTransCnt][1] + ' ' + payArray[thisTransCnt][2][0] + ' ' + payArray[thisTransCnt][5])+'&Amount='+encodeURIComponent(payArray[thisTransCnt][6].replace('-',''))+'&TransactionID='+encodeURIComponent(payArray[thisTransCnt][7])+'&Category='+encodeURIComponent(payArray[thisTransCnt][8])+'&CategoryOther=&CalendarEventID=&PaymentDueDate=&Notes='+encodeURIComponent(payArray[thisTransCnt][9]);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'PB'], zeroScoutAccount,[unitID,scoutid,removedscoutid,transCnt,payArray]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	

			transCnt += 1;
			setTimeout(function(){ zeroScoutAccount(unitID,scoutid,removedscoutid,transCnt,payArray);}, 200);	
			

		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + removedscoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,genError,[unitID,'PB'],zeroScoutAccount,[unitID,scoutid,removedscoutid,transCnt,payArray]);
	};
			
}

function zeroScoutBal(unitID,scoutid) {


	/*
	var amt='';
	for(var i =0;i<payTotals.length;i++) {
		if(payTotals[i].scoutid==scoutid) {
			amt=round(payTotals[i].amt,2);
			break;
		}
	}
	*/

	// get the balance from this page
	var amt=$('.total').text().replace('$','');
	var due=false;
	if(amt.match(/-/) != null) {
		amt.replace('-','');
		due=true;
	}


if(parseInt(amt)==0) {
		showLog(unitID,scoutid);
		return;
}

var payType='Payment';
if(parseInt(amt) > 0) {
	payType='Charge';
} else {
	amt= amt*(-1);
}
	// find the balance of the scout
	var formPost = 'PaymentType='+payType+'&LogDate='+encodeURIComponent(nowDate())+'&Description='+encodeURIComponent('Closing this Scout Account, Transactions and outstanding balance copied to RemovedScout')+'&Amount='+encodeURIComponent(amt)+'&TransactionID=&Category=&CategoryOther=&CalendarEventID=&PaymentDueDate=&Notes=';

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'PB'], zeroScoutBal,[unitID,scoutid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			showLog(unitID,scoutid);
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,genError,[unitID,'PB'],zeroScoutBal,[unitID,scoutid]);
	};	
	
	
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function showLog(unitID,scoutid) {
			$.mobile.changePage(
				'/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+scoutid+'&UnitID='+unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			});	
}