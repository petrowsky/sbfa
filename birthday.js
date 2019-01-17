// Copyright © 1/28/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

function addRawAddBirthdayAjax(data) {
	if(data.match(/>Create New Event</) != null) {
		// insert the import
		var startfunc = data.indexOf('>Create New Event<');
		var startfunc = data.indexOf('</ul>',startfunc);
		if (startfunc != -1) {
			
			
			var newdata = '	<li class="bday" id="bdayDivider" data-theme="d" >';						
			newdata += '    <a href="#birthdayMenu" id="thisbday" >';			//data-rel="popup" data-transition="slideup"		
			newdata += '	<div id ="loadBirthday">';
//			newdata += '		<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
//			newdata += '			<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" alt="quick entry" title="Create Scout Birthday Events" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
//			newdata += '		</div>';
			newdata += '		Create Scout Birthday Events';
			newdata += '	</div>';
			newdata += '	</a>';
			newdata += '</li>';							
			//newdata = '	<li class="csvx" id="csvDividerx" data-theme="d" >';							
						
			
			data=data.slice(0,startfunc) + newdata + data.slice(startfunc);						

		}
	}
	return data;
}

function addRawBirthday(data,pageid) {
	
			if(data.match(/\$\('\.calendar-events', '#Page\d+'\)\.trigger\('create'\)/)== null) {
			return data;
		}
	
		var startfunc = data.indexOf('<div id="footer"');
		
		var newdata = '	<div data-role="popup" id="birthdayMenu" data-theme="d" data-history="false">';
		
		newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
		newdata +=				'<li data-role="divider" data-theme="e">Choose Unit:</li>';					
		newdata +=	'			<li>';
	newdata += '						<fieldset data-role="controlgroup">';
	newdata += '							<select name="BirthdayUnitID" id="birthdayUnitID" data-theme="d" data-mini="true">';	
	newdata += '									<option value="">choose Unit...</option>';	
	newdata += '							</select>';	
	newdata += '						</fieldset>';		
		newdata +=	'			</li>';	
		newdata +=	'			<li><input type="submit" value="Create Birthday Events" data-theme="g" id="buttonBirthday" ><input type="submit" value="Remove Birthday Events" data-theme="a" id="buttonRemoveBirthday" ><input type="submit" value="Cancel" data-theme="g" id="buttonBirthdayCancel" ></li>';
		newdata +=			'</ul>';						

		
		newdata += '	</div>';				
		data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);



		
// ##this function must be executed after the ajax call

	startfunc = data.match(/\$\('\.calendar-events', '#Page\d+'\)\.trigger\('create'\)/).index;
	var myfunc = '' + bdayscr;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);	
	
	
	startfunc = data.indexOf("function showProgress");
	var myfunc = '' + bdscrpt;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);	
	
	
	return data;
}

function bdayscr () {
	
	$('#thisbday').click( function () {
		getCalUnits();
		return false;
	});	
	
}

function bdscrpt () {
	var birthdays=[];
	$('#buttonBirthday').click( function() {
		
		if($('#birthdayUnitID option:selected').val()=='') {
			alert('Select a Unit');
			return false;
		}
		var unitID='';
		if($('#birthdayUnitID option:selected').val().match(/\d+/)!= null) {
			unitID=$('#birthdayUnitID option:selected').val().match(/\d+/)[0];
		}
		var txtunit=$('#birthdayUnitID option:selected').text();
		birthdays=[];
		collectBirthdays(unitID,txtunit,birthdays,0,'');
		
		
	});
	$('#buttonRemoveBirthday').click( function() {
		if($('#birthdayUnitID option:selected').val()=='') {
			alert('Select a Unit');
			return false;
		}
		var unitID='';
		if($('#birthdayUnitID option:selected').val().match(/\d+/)!= null) {
			unitID=$('#birthdayUnitID option:selected').val().match(/\d+/)[0];
		}
		var txtunit=$('#birthdayUnitID option:selected').text();
		birthdays=[];
		links=[];
		getBDEventIDs('del');
	});
	$('#buttonBirthdayCancel').click( function() {
		$('#birthdayMenu').popup('close');
		return false;
	});	
}

function getCalUnits() {

	//check to see if the options are already populated
	if($('#birthdayUnitID option[value*="UnitID"]').length > 0) {

		$('#birthdayMenu').popup('open');
		return;
	}
	$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });	


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getCalUnits,'','','','','','','');	//server side error - maybe next try will work
			return;
		}			
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			$('#calendarID option[value*="UnitID"]',this.response).each( function () {
				//console.log($(this).val(),$(this).text());
				$('#birthdayUnitID').append('<option value="'+$(this).val()+'" >'+$(this).text()+'</option>');	
			});
			$.mobile.loading('hide');
			$('#birthdayMenu').popup('open');
			return false;
		}
	};		

	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
			errHandle(getCalUnits,'','','','','','','');
	}		
}



var fileObjs=[];

function collectBirthdays(unitID,txtunit,birthdays,preset,presetval) {
	//in the roster
 //switch roster view to get DOB
// get options	
$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });
    fileObjs=[];
	links=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(collectBirthdays,unitID,txtunit,birthdays,preset,presetval,'','');	//server side error - maybe next try will work
			return;
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var settings=$('#customizeScoutRosterForm', this.response).serialize();
			
			//&SortScoutRoster=LastName
			presetval='';
			if(settings.indexOf('SortScoutRoster=LastName') == -1 && preset==0) {
				presetval=settings; //'SortScoutRoster='+ settings.match(/SortScoutRoster=(Age|FirstName)/)[1])
				settings=settings.replace('SortScoutRoster=FirstName','SortScoutRoster=LastName').replace('SortScoutRoster=Age','SortScoutRoster=LastName');
			}
			if(settings.indexOf('ShowDOB') == -1 && preset==0) {
				settings=settings.replace('CustomizeScoutRoster','CustomizeScoutRoster&ShowDOB=1');
				if(presetval !='') {
					presetval=settings;
				}
			}
			
			if(presetval !='') {
				ShowDOBBefore(unitID,txtunit,birthdays,1,presetval,settings);
				return;				
			}
			
			var evObj={};
			
			var pos='';
			var poslist=[];
			$('li[data-scoutuserid]',this.response).each( function () {
				pos='';

				evObj={name:'',id:'',denpatrol:'',dob:'',scheduled:false,nextDate:''};	
				evObj.dob='';
				if($(this).text().match(/\d+\/\d+\/\d+/) != null ) {
					evObj.dob=$(this).text().match(/\d+\/\d+\/\d+/)[0];
				}
				
				pos= localDataFilter($('.positions',this).text().trim(),'','local')
				if(pos != '') {
					evObj.denpatrol=pos.match(/[^ ]+ Den .+|.+Patrol/);
					poslist=pos.split(',');

					if(evObj.denpatrol != null) {
						evObj.denpatrol=poslist.shift();
					}
					
						
					evObj.name=localDataFilter($('a[href*="account\.asp\?ScoutUserID"]',this).text().trim(),'','local');
					namesplit=evObj.name.split(',');
					if(namesplit.length>1) {
						evObj.name=namesplit[1].trim() + ' ' + namesplit[0].trim()[0]+'.';
					}
					
					evObj.id=$(this).attr('data-scoutuserid');

					birthdays.push(JSON.parse(JSON.stringify(evObj)));
				}

			});

			
			if(preset==1) {
				//change the settings back
					//settings=settings.replace('CustomizeScoutRoster&ShowDOB=1','CustomizeScoutRoster');
					settings=presetval;
					ShowDOBBefore(unitID,txtunit,birthdays,0,'',settings);			
			} else {
				//txtunit=$('a[id="goToUnit"]',this.response).text();
				scheduleBirthdays(birthdays,txtunit);
			}

		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(collectBirthdays,unitID,txtunit,birthdays,preset,presetval,'','');
	}		
}


function ShowDOBBefore(unitID,txtunit,birthdays,preset,presetval,settings) {
	var txtunit;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( ShowDOBBefore,unitID,txtunit,birthdays,preset,presetval,settings,'');	//server side error - maybe next try will work
			return;
		}		
	
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if(preset==1) {
				collectBirthdays(unitID,txtunit,birthdays,1,presetval);
				//getScoutSubUnits(unitID,subUnitScouts,1)
			} else {
				txtunit=$('a[id="goToUnit"]',this.response).text();
				scheduleBirthdays(birthdays,txtunit);
			}
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(settings);
			
	xhttp.onerror = function() {
		errHandle( ShowDOBBefore,unitID,txtunit,birthdays,preset,presetval,settings,'')
	};	
}

function scheduleBirthdays(birthdays,txtunit) {
// 
var dnow=new Date(Date.now());
var yr=dnow.getFullYear();
var nyr=yr+1;
var dob;
var evType='';

	if(txtunit.match(/Troop|Pack/) != null) {
		evType='Other';
	} else {
		evType='Open House';
	}
	
	fileObjs['csvdata'] =[];


	for(var i=0;i<birthdays.length;i++) {
		
		dob=birthdays[i].dob.match(/\d+\/\d+\//)[0] + yr;
		//was birthday before today this year?
		if(dateDiff(dob,dnow)<0) {
			//yes
			dob=birthdays[i].dob.match(/\d+\/\d+\//)[0] + nyr;
		}
		birthdays[i].nextDate=dob;
//	var cols = ["Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders"];		
		fileObjs.csvdata.push([txtunit,evType,'Birthday: '+ birthdays[i].name,'',dob,'12:00 AM',dob,'12:00 AM','off','off','off','off','off','Scout Birthday','']);
		
	}
	
   getBDEventIDs('');
	
}





function getBDEventIDs(cb) {
	// This function is called t retrieve event list.  Matches each stDateFromArchive to find associated EventID
    var eventName;
    var lnkobj ={id: '', date: '',name:''};
	

	
	//push this if older than now
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( getBDEventIDs,cb,'','','','','','');	//server side error - maybe next try will work
			return;
		}	
		if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
				servErrCnt=0;
			//populate eventArray
			var maxEvent=getmaxCalEvents(this.response);
			var lnk=this.responseXML.getElementsByTagName('a');
			
			var i;
			for (i = 0; i < lnk.length; i++) {
				hrf = lnk[i].href.match(/EventID=\d+/);
					
				if (hrf != null ) {

					lnkobj.id=hrf[0];
					lnkobj.date=lnk[i].getElementsByClassName('tinyText')[0].innerText;

					lnkobj.name=lnk[i].innerText.trim();  // event name is embedded
				   links.push(JSON.parse(JSON.stringify(lnkobj)));
					
				 }
			}

			
			
			if(maxEvent >24) {
				getMoreBDEvents(25,maxEvent,cb);
			} else {
				allBDEventsCaptured(cb);
			}
			
			
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle( getBDEventIDs,cb,'','','','','','')
	};
		
}

function getMoreBDEvents(start,maxEvent,cb) {
    var eventName;
    var lnkobj ={id: '', date: '',name:''};
	

	
	//push this if older than now
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getMoreBDEvents,start,maxEvent,cb,'','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
			//populate eventArray

			var lnk=this.responseXML.getElementsByTagName('a');
			
			var i;
			for (i = 0; i < lnk.length; i++) {
				hrf = lnk[i].href.match(/EventID=\d+/);
					
				if (hrf != null ) {

					lnkobj.id=hrf[0];
					lnkobj.date=lnk[i].getElementsByClassName('tinyText')[0].innerText;
					lnkobj.name=lnk[i].innerText.trim();  // event name is embedded
				   //links.push(lnkobj);		6/15/2017
				   links.push(JSON.parse(JSON.stringify(lnkobj)));
				}
			}
			//Get the current page data as it could be in the past
			
			
			if(maxEvent >start+24) {
				start+=25;
				getMoreBDEvents(start,maxEvent,cb);
			} else {
				allBDEventsCaptured(cb);
			}	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=SeeMoreEvents&EventIndex=' + start;
	
	xhttp.open("POST", url, true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getMoreBDEvents,start,maxEvent,cb,'','','','')
	};
}

function errHandle(cbfunc,cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8) {
		if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			cbfunc(cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8);
		},1000);	//reset 	
}

//arg1 cb func on max error
//arg2 cb func lt max error
//args3...  args for cb func lt max err
function errClHandle() {
	var argumentsArray = Array.prototype.slice.apply(arguments);
	if (servErrCnt > maxErr) {
		 $.mobile.loading('hide');
		alert('Halted due to excessive Server errors');
		servErrCnt=0;
		if(argumentsArray[0] != '') {
			window[argumentsArray[0].name]();
		}
		return;
	}
	servErrCnt++;
	
	//setTimeout(function() {
	if(argumentsArray.length > 0) {
		window[argumentsArray[1].name].apply(null,argumentsArray.slice(1));
	}
	//},1000);	//reset 	
}

//arg1 cb func on max error
// arg2 is array of args for func in arg1
//arg3 cb func lt max error
//args4...  args for cb func lt max err
function errGenHandle() {
	var argumentsArray = Array.prototype.slice.apply(arguments);
	if (servErrCnt > maxErr) {
		 $.mobile.loading('hide');
		alert('Halted due to excessive Server errors');
		servErrCnt=0;
		if(argumentsArray.length > 0) {
			if(argumentsArray[0] != '') {
				window[argumentsArray[0].name].apply(null,argumentsArray[1]);
			}
		}
		return;
	}
	servErrCnt++;
	
	//setTimeout(function() {
		window[argumentsArray[2].name].apply(null,argumentsArray[3]);
	//},1000);	//reset 	
}


function allBDEventsCaptured(cb) {
	var found=false;
	var name='';
	var d1;
	var d2;

	//debugger;
	if(cb=='') {
	for(i=0;i<links.length;i++){
		for(var j=0;j<fileObjs.csvdata.length;j++) {
			name=fileObjs.csvdata[j][2];
			
			if(links[i].name.indexOf(name) != -1) {
				//console.log(fileObjs.csvdata[j], 'previously scheduled');

				if(links[i].date.match(/[^,]+, \d\d\d\d/) != null) {
					d1=new Date(links[i].date.match(/[^,]+, \d\d\d\d/)[0]);

					d2=new Date(fileObjs.csvdata[j][4]);
					if(d1.getDate() == d2.getDate() && d1.getMonth()==d2.getMonth()) {
						// remove this filobjs row as ignore
						//console.log(fileObjs.csvdata[j], 'previously scheduled');
						fileObjs.csvdata.splice(j,1);
						break;
					}
				}
			}
		}
	}
	
	// check for current id in this list
	//console.log(links);
	
	if(fileObjs.csvdata.length==0) {
		 $.mobile.loading('hide');
	};
	
	
		NewEvent();
	} else {
		delBdayEvents();
	}
}

function delBdayEvents() {
	var links2=[];
// remove any links not meeting Birthday criteria	
	for(i=0;i<links.length;i++){
			if(links[i].name.indexOf($('#birthdayUnitID option:selected').text() + ' - Birthday:') != -1) {	
				links2.push(links.slice(i,i+1)[0]);
			}
	}
	links=[];
	for(i=0;i<links2.length;i++){
		links.push(links2.slice(i,i+1)[0]);
	}
		adeleteNextEvent();	
}



function adeleteNextEvent() {
	
	if(links.length==0) {
		$('#birthdayMenu').popup('close');
		 $.mobile.loading('hide');
		return;
	}
	
	var cEventID=links.shift().id;
	

	var xhttp = new XMLHttpRequest();
	formPost = '';
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(adeleteNextEvent,'','','','','','','');	//server side error - maybe next try will work
			return;
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			// keep going un til none left
			
			 adeleteNextEvent();
		}
	};

	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + cEventID +"&Action=DeleteEvent";
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(adeleteNextEvent,'','','','','','','');	//server side error - maybe next try will work
	};
}