// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.



/*
This function adds scripting and html elements to the calendar page to support
  - Adding a new invitee(s) to multiple events

						  
*/
//addinvitees
function addInviteButton(data,pageid) {

// add before the colorLegend  <div class="colorLegend">
//addscoutorange48.png
	var startfunc = data.search(/[^>]*<div[ ]+class[^=]*=[^"]*"colorLegend"/);
	var addInv = '<div style="float: right; text-align: right; "><a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="addInvitees"><div style="margin-left: 30px; position: relative; "><img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/forumsorange48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />Add Invitees</div></a></div>';
	var newdata = data.slice(0,startfunc) + addInv + '\n'+ data.slice(startfunc);

	cPage=escapeHTML(pageid);
			
			
	startfunc = newdata.indexOf("$('img.customizeIcon',");	
		
	
	var myfunc = '' + dummyfu;
	myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid));
	data = newdata.slice(0,startfunc) + myfunc + '\n'+ newdata.slice(startfunc);
	
 
	//startfunc = data.indexOf('<select name="CalendarID" id="calendarID" data-role="none" multiple="multiple">');
	startfunc=data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
    var listanchor ='<select name="EventSelectID" id="eventselectID" multiple="multiple" data-role="none"></select><select name="InviteSelectID" id="inviteselectID" multiple="multiple" data-role="none"><optgroup label="Leaders"></optgroup><optgroup label="Parents"></optgroup><optgroup label="Scouts"></optgroup></select>';	
	
	newdata = data.slice(0,startfunc) + listanchor + '\n'+ data.slice(startfunc);
	data=newdata;
 	
	
	
	//CalendarBID
	//multiple="multiple">
	
	startfunc = data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"/);
    var endfunc = data.indexOf('</select>',startfunc);
	//var endfunc = data.search('<[^/]*/select[^>]*>',startfunc);
	var selcopy = data.slice(startfunc,endfunc) + '</select>';
	
	selcopy = selcopy.replace(/alendarID/g,'alendarBID');
	selcopy = selcopy.replace('multiple="multiple"','');
	
	data =data.slice(0,startfunc) + selcopy + data.slice(startfunc);
	
return data;
}

/*
This is a dummy function; it is a conveniently easy way to define script contents
to be added to a page. THis function's contents will be used.

*/
//addinvitees
function dummyfu() {

			
			$('#addInvitees','#PageX').click(function () {
					// clicking mobiscroll freezes background
					$('#calendarBID', '#PageX').mobiscroll('show');
					return false;

			});			
			
						
			

	
			$('#eventselectID','#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				//fontsize: '12px',
				counter: true,
				label: 'Select all of the events you want to add a new Invitee to',
				showLabel: true,
				animate: 'flip',
				buttons: ['set', 'cancel', {
					text: 'Select All', handler: function (ev, inst) {
						//debugger;
						var wheelValues = inst.getValue(true, true), // Get the current wheel values with group

						value = wheelValues[0], // Current wheel value is second
						currValues = inst.getValues(); // Get the current multiple selection
						$('#eventselectID', '#PageX').find('option').each(function () {
							currValues.push($(this).attr('value'));
						});
						currValues.unshift(value);
						inst.setValue(currValues, false, 0, true);
					}
				}],
				mode: 'mixed',
				placeholder: 'choose one or more events',
				anchor: $('#addInvitees', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {saveInviteeEvents('#PageX');}, 1000);
					return false;
				},
				onCancel: function() {
					$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
					setTimeout(function () {resetCalendarIDs();}, 1000);
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller

				}
			});



		    $('#inviteselectID', '#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bottom',
				mode: 'mixed',
				showInput: false,
				counter: false,
				group: true,
				buttons: ['set', 'clear', 'cancel', {
					text: 'Select All', handler: function (ev, inst) {
						var wheelValues = inst.getValue(true, true), // Get the current wheel values with group
						groupIndex = wheelValues[0], // Group index is first
						value = wheelValues[1], // Current wheel value is second
						currValues = inst.getValues(); // Get the current multiple selection
						$('#inviteselectID', '#PageX').find('optgroup').eq(groupIndex).find('option').each(function () {
							currValues.push($(this).attr('value'));
						});
						currValues.unshift(value);
						inst.setValue(currValues, false, 0, true);
					}
				}],
				rows: 11,
				groupLabel: 'Attendees',
				onSelect: handleInviteAdd,
				onCancel: function() {
					$('#inviteselectID', '#PageX').mobiscroll('hide');
					$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
					setTimeout(function () {resetCalendarIDs();}, 1000);
					return false;
				}
		    });

		    $('#calendarBID', '#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				counter: true,
				animate: 'flip',
				buttons: ['set', 'cancel'],
				mode: 'mixed',
				placeholder: 'choose one calendars',
				anchor: $('img.customizeIcon', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {popEventList('#PageX');}, 1000);
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller
	
				}
			});
					
}


			
function popEventList(pageid) {

	$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });

	// save current settings if not already saved
	if (calLst.length == 0) {
			getCalendarIDs();
			//console.log('saved calendar setting ' + calLst);
	}
	

	var inst = $('#calendarBID').mobiscroll('getInst');		//gets the instanceof the mobiscroll object
	var values = inst.values;				//gets the values selecteed in the mobiscroll object
	
	//alert('Selected ' + values);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( popEventList,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
					

			//tells the server to change the page defaults
			//now get the data for the new setting
			getCalPage(pageid);
		}
	};
	
	var formdata ='Action=SetCalendars&CalendarID=' + values[0];

	//https://host.scoutbook.com/mobile/dashboard/calendar/default.asp
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);
	xhttp.onerror = function() {
		errHandle( popEventList,pageid,'','','','','','')
	};
	
}

/*
  THis function gets a calendar page and saves the event list in it to an array	
  After getting a mobiscroll popup filles with the events, it pops it up for the user to choose events

*/
function getCalPage(pageid) {
	var lnk;
	var txt;
	var evname;
	var ttxt;
	var eventid;
	var evObj = { name : '', id : ''};
	evLst.length=0;
	eventArr.length=0;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getCalPage,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
//67
			var maxEvent=getmaxCalEvents(this.response);

			$('li[style="overflow: hidden; "]',this.response).each(function () { 
				lnk = $(this).find('a').attr("href");
				if(lnk.match(/EventID=(\d+)/) != null) {
					evObj.id =lnk.match(/EventID=(\d+)/)[1];
				}
				txt =$(this).text().split('\n');
				evObj.name='';
				for (i=0;i<txt.length;i++) {
					ttxt = txt[i].trim();
					if (ttxt != "") {
						//console.log(i,evObj.name + "##" + ttxt);
					  if(evObj.name =='') {
						//try to shorten for mobile.
						var mres=ttxt.match(/([^ ]+) ([^ ]+) - (.+)/);
						if(mres != null) {
							evObj.name=mres[1][0]+mres[2]+':'+mres[3];
						} else {
							evObj.name = ttxt;
						}
					  } else {
						evObj.name +=  " " + ttxt;
					  }
					}
				}
				//console.log('pushing ' + evObj.id + ' ' + evObj.name);
				eventArr.push(JSON.parse(JSON.stringify(evObj)));
			});
			
			
			if(maxEvent >24) {
				getMoreEvents2(25,maxEvent,pageid);
			} else {
				allEventsCaptured2(pageid);
			}
			
			
			// pop up for the user to select the events
			
			/*  9/2/17
			addEvToList();
			
			$('#eventselectID', pageid).mobiscroll('show');
			*/
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			 evLst.length=0;  // kill the remaining dates
		}
		errHandle(getCalPage,pageid,'','','','','','')
	};
	
}

function getMoreEvents2(start,maxEvent,pageid) {
	var lnk;
	var txt;
	var evname;
	var ttxt;
	var eventid;
	var evObj = { name : '', id : ''};

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getMoreEvents2,start,maxEvent,pageid,'','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			$('li[style="overflow: hidden; "]',this.response).each(function () { 
				lnk = $(this).find('a').attr("href");
				if(lnk.match(/EventID=(\d+)/)!= null) {
					evObj.id =lnk.match(/EventID=(\d+)/)[1];
				}
				txt =$(this).text().split('\n');
				evObj.name='';
				for (i=0;i<txt.length;i++) {
					ttxt = txt[i].trim();
					if (ttxt != "") {
						//console.log(i,evObj.name + "##" + ttxt);
					  if(evObj.name =='') {
						//try to shorten for mobile.
						var mres=ttxt.match(/([^ ]+) ([^ ]+) - (.+)/);
						if(mres != null) {
							evObj.name=mres[1][0]+mres[2]+':'+mres[3];
						} else {
							evObj.name = ttxt;
						}
					  } else {
						evObj.name +=  " " + ttxt;
					  }
					}
				}
				//console.log('pushing ' + evObj.id + ' ' + evObj.name);
				eventArr.push(JSON.parse(JSON.stringify(evObj)));
			});
					
					
			if(maxEvent >start+24) {
				start+=25;
				getMoreEvents2(start,maxEvent,pageid);
			} else {
				allEventsCaptured2(pageid);
			}						
				
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=SeeMoreEvents&EventIndex=' + start;
	xhttp.open("POST", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			 evLst.length=0;  // kill the remaining dates
		}
		errHandle(getMoreEvents2,start,maxEvent,pageid,'','','','')
	};
}
function allEventsCaptured2(pageid) {
			// pop up for the user to select the events
			addEvToList();
			
			$('#eventselectID', pageid).mobiscroll('show');
}


/*
This function takes an array of events an populates a mobiscroll popup

*/
function addEvToList() {
  // Don't add if already populated
  if ($('#eventselectID').children().length ==0 ) {
	for (var i=0;i<eventArr.length;i++) {
		$('#eventselectID').append('<option value="' + escapeHTML(eventArr[i].id) + '"  data-ilist="1" >' + escapeHTML(eventArr[i].name) + '</option>');
	}
  }
  $.mobile.loading('hide');
}			




/* 

	This function is called when the user selects SET from the list of events popup
	starts preparing to populate an invitee list to pop up
	
	
*/

//addinvitee		
function saveInviteeEvents(fpageid) {
	//debugger;
	//alert('select Invitees');
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });

	var inst = $('#eventselectID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues('eventselectID');				//gets the values selecteed in the mobiscroll object
	if (values.length > 0) {
	    for (var i=0;i < values.length ;i++) {
			//console.log('selected ' + values[i]);				// each selected value
			if (evLst.length == 0) {
				if(parseInt(values[i]) > "100") {
					evLst.push(values[i]);
				}				// Save 1st event twice.  1st time will be used to get attendee list
			} 
				if(parseInt(values[i]) > "100") {
					evLst.push(values[i]);
				}
			
		}
		//Use first event to build popup inivitee 
		//buildInviteAdd();
		getEditEventPg();
	} else {
		alert('You must select an event to add invitees');
		// show events again
		$.mobile.loading('hide');
		$('#eventselectID', fpageid).mobiscroll('show');
	}



}	


//addinvitees
// Function looks at the current but not visible page calendar selector that is only used programmatically
function getCalendarBID() {
	var inst = $('#calendarBID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.values;				//gets the values selecteed in the mobiscroll object
	return values[0];
};
//addinvitees
// Function looks at the current and visible page and saves list of selected calendars into a public array
function getCalendarIDs() {
	var inst = $('#calendarID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object
	if (values.length > 0) {
	    for (var i=0;i<values.length;i++) {
			//console.log('selected ' + values[i]);				// each selected value
			calLst.push(values[i]);							// Save 1st event twice.  1st time will be used to get attendee list
		}
	}	
}
//addinvitees
//This function uses the public array of calendar ids saved earlier to reset the visible calendar view
function resetCalendarIDs() {
	//Sets calendarIDlist
	//if (calLst.length > 1) {
	
		var inst = $('#calendarID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
		inst.setValue(calLst,true,0,false);				//gets the values selecteed in the mobiscroll object
		//now need to update calendar based on the list
	
		submitCalendarForm();		// will hide any mobile loading
	//}
	//$.mobile.loading('hide');
	calLst.length=0;
	evLst.length=0;
}


/*--------------------------------------------------------------------------------------------------
	The following functions support adding individuals to scheduled events

*/

/*
   Used by the add invite event function from the calendar page
this function is called to retrieve the editevent page for each event selected


*/

function getEditEvent() {
	
	// what if no invitees selected
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });       
	var eventid=evLst.shift();		

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEditEvent,'','','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;


		
			var thiseventid='EventID='+eventid;
			


			//var thiseventpage =
			//if (buildInviteAdd(thiseventid) == false) {			// build invitee list once,  called on first event in list
				var calIDlst = $('#calendarID',this.response).val();
				
				var editEventPageId= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
					
				//var eventtype=$('#eventType option:selected',this.response).val();
				//$('#eventType', '#Page64174').append('<option  selected="selected"  value="Other">Other</option>');
				// have to find the value in a script
				
				var eventtype='none';
				for(var x=0;x<this.response.scripts.length;x++) {
					if(this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/) !=null) {
						eventtype=this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/)[1];
						break;
					}
				}
				getEventInvite(thiseventid,calIDlst,eventtype,editEventPageId);
				
				
			//}
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid;
	xhttp.open("GET",url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting getEditEvent " + xhttp.status);
		// On error, bail.  Set stuff to kill processing
		

		 
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs();},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEditEvent();
		},1000);	//reset 		 
		 
	};
}

function getEditEventPg() {
	
	// what if no invitees selected
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });       
	var eventid=evLst[0];		

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEditEventPg,'','','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			var editEventPageId= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
			buildInviteAdd(editEventPageId);

				

		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid;
	xhttp.open("GET",url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting getEditEvent " + xhttp.status);
		// On error, bail.  Set stuff to kill processing
		

		 
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs();},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEditEventPg();
		},1000);	//reset 		 
		 
	};
}

/*
This func checks to see if an invitee list has been constructed

If it has, simply returns false (list already built)


This function GETs an editevent Action=UpdateAttendeeGroupOptions
for the currently selected Calendar ID

The result contains all the leader, scout, and parent names that may be presented to the user to select from
THe result is modified for this page, inserted into the page, then the popup displayed for the user to select

*/

//function buildInviteAdd2(pageid,eventtype) 
function buildInviteAdd(pageid) {
//var pageid=0;
var eventtype='none';

	var eventid=evLst.shift();	

	if ($('#inviteselectID optgroup[label="Leaders"]').children().length + $('#inviteselectID optgroup[label="Parents"]').children().length + $('#inviteselectID optgroup[label="Scouts"]').children().length !=0) {
		//  Already built a list
		//alert('Error...');
		return false;
	}
	
	
 	var calID = getCalendarBID();
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(buildInviteAdd,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			// response is javascript
			//Now we build and display the list. 
			// Remove references to selected
			var resp = this.responseText.replace(/selected=\"selected\"/g,'');
			resp = resp.replace(/#attendees/g,'#inviteselectID');
			resp=resp.replace(/#Page\d+/g,'#Page' +escapeHTML(cPage));
			//also replace the PageID

		
			var lin=resp.split('\n');
			var res;
			for(var i=0;i<lin.length;i++) {
				//console.log('lin['+i+']='+lin[i]);
				           //match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+append\('([^']+)/)
				res=lin[i].match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+append\('([^']+)/);
				if(res != undefined) {
					//console.log('append match='+res.length);
					if( res.length == 4) {
						//console.log('append.match $('+lin[i][1] +','+lin[i][2]+').append('+lin[i][3]+');');
						//res[3] looks like '<option value="LeaderuserID1234">lastname, Firstname</option>'.match(/\"([^\"]+)/)
						var val = res[3].match(/\"([^\"]+)/);
						var name=res[3].match(/>([^<]+)/);
						if(name == null) {
							$.mobile.loading('hide');
							alert('Error: invitee name list not found');  //page not found etc.  This is unrecoverable
							return;
						} else {
						
							if(name[1].slice(0,8) != "ACCOUNT,") {
								if(name[1] != "SCOUT, Removed") {
									$(res[1],res[2]).append('<option value="'+escapeHTML(val[1])+'">'+escapeHTML(name[1])+'</option>');
								}
							}
						}
						//$(res[1],res[2]).append(res[3]);
					}
				}
				
				res=lin[i].match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+remove/);
					if(res != null) {
					//console.log('remove match='+res.length);
					if(res.length == 3){
						$(res[1],res[2]).remove();
					}
				}
				
			}

			//was an eval ( resp );					// Builds the list

			
			$.mobile.loading('hide');
			$('#inviteselectID','#Page' + cPage).mobiscroll('show');
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid + '&PageID=Page'+pageid + '&Action=UpdateAttendeeGroupOptions&CalendarID=' + calID + '&EventType=' + eventtype;
	xhttp.open("GET", url, true);
	//xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting " + xhttp.status);
		// On error, bail.  Set stuff to kill processing


		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			 setTimeout(function () {resetCalendarIDs();},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			buildInviteAdd(pageid);
		},1000);	//reset 		 
	};
}

/*
THis func called when user selects additional invitees from the popup list. 
If users are selected, it will carry on 

*/
function handleInviteAdd() {
	
	if (testInviteIDs() == false) {
		//alert('No invitees selected');
		// TODO if quitting restore calendar
		//return;
	}
	//alert('Finsihed selecting invitees');
	$('#inviteselectID').mobiscroll('hide');
	getEditEvent();
}

/* This function called after a GET EditEvent
   
   
   It uses the Calendar IDs from the editEvent page response (responseText)
   and performs a GET editEvent with Action=UpdateAttendeeGroupOptions
   
   The result of this GET has the invitees for the current event.
   With that information, it calls postModifiedInvite to update the event with additoinal invitees (See that function)
   
*/
function getEventInvite(eventid,calIDlst,eventtype,editEventPageId) {


	var calstr='';
	for (i=0;i<calIDlst.length;i++) {
		calstr=calstr + 'CalendarID=' + calIDlst[i] + '&';
	}
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEventInvite,eventid,calIDlst,eventtype,editEventPageId,'','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			// THis response contains the current invitee list, as text javascript
			//selected="selected"  value="LeaderUserID999999">
	
//filter out ACCOUNT and SCOUT, Removed
			
					var datasplit=this.responseText.split('\n');
					var newdata='';
					for (var i=0;i<datasplit.length;i++) {
						if(datasplit[i].indexOf(">ACCOUNT, ") == -1) {
							if(datasplit[i].indexOf(">SCOUT, Removed") == -1) {
							  newdata = newdata + datasplit[i] + '\n';
							}
						}
					}
							

			postModifiedInvite(eventid,calstr,eventtype,editEventPageId,newdata);
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?'+eventid + '&PageID=Page' + editEventPageId + '&Action=UpdateAttendeeGroupOptions&' + calstr + 'EventType=' + eventtype;
	xhttp.open("GET", url, true);
	//xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting " + xhttp.status);
		// On error, bail.  Set stuff to kill processing

		 
		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			setTimeout(function () {resetCalendarIDs();},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEventInvite(eventid,calIDlst,eventtype,editEventPageId);
		},1000);	//reset 		 
		 
		 
		 
		 
	};
	
	
	
}	

/* this function used by the add invitees to events fromt he calendar page
   Given an editevent page with all of the current invitees, and a list of
   new invitees, build the formdata for a post with both setSeconds
   
   then post it to Scoutbook

*/

function postModifiedInvite (eventid,calstr,eventtype,editEventPageId,responseText) {
	
	var leaderLst=rematchx('selected\\"  value=\\"(LeaderUserID\\d+)','g',responseText,1);
	var parentLst=rematchx('selected\\"  value=\\"(ParentUserID\\d+)','g',responseText,1);
	var scoutLst=rematchx('selected\\"  value=\\"(ScoutUserID\\d+)','g',responseText,1);
	var inviteLst = getInviteIDs();
	
	//post, with this formdata
	var formdata ='PageID=Page'+editEventPageId;

	for (var i=0;i<leaderLst.length;i++) {
		formdata = formdata + "&Attendees=" + leaderLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Leader/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}	
	for (var i=0;i<parentLst.length;i++) {
		formdata = formdata + "&Attendees=" + parentLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Parent/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}		
	for (var i=0;i<scoutLst.length;i++) {
		formdata = formdata + "&Attendees=" + scoutLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Scout/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}	

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( postModifiedInvite,eventid,calstr,eventtype,editEventPageId,responseText,'','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			
			if (evLst.length == 0 ) {
			  //alert('DONE TODO Cleanup')
			  $.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			   setTimeout(function () {resetCalendarIDs();},200);	
			} else {
			   setTimeout(function(){ getEditEvent(); }, 200);		// Next event 
			}
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?'+ eventid + '&Action=UpdateAttendeesLI&' + calstr + 'EventType=' + eventtype;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);
	
	xhttp.onerror =function() {
		//window.console &&console.log("request error in postModifiedInvite" + xhttp.status);


		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			 setTimeout(function () {resetCalendarIDs();},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			postModifiedInvite (eventid,calstr,eventtype,editEventPageId,responseText);
		},1000);	//reset 
	 
	};	
}

// function checks if invitees are selected

function testInviteIDs() {
	var inst = $('#inviteselectID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object
    if (values.length != 0) {
		return true;
	}
	return false;
};

// function returns list of invitees selected
function getInviteIDs() {
	var inst = $('#inviteselectID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object

	return values.slice(0);
};


// function returns array of matches, for the xth match per regexp call

function rematchx(patt,glob,srchstr,x) {
	if (glob === undefined) {
          glob='';
    } 
	var y =parseInt(x);
	var re = new RegExp(patt,glob);
	var res;
	var arr=[];
	var id;
	do {
		res = re.exec(srchstr);
		if (res != undefined) {
			id=res[y];
		  arr.push(id);
		}
	}
	while (res != undefined);
	return arr.slice(0);
	
}


