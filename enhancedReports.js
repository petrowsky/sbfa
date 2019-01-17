// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.\

//purpose of this file is to add options to roster builder for fields not currently in the roster report
//including swim date.  Can get these quickly by doing an export, and matching scout namespaceURI
//


// intercept the report, pipe it out

function rawDataModifyRosterExtended(data,pageid) {
	   var startfunc;
	   var endfunc;
	   var newdata='';		
	// intercept the submit on the Build Roster page
	
	data=data.replace(/\$\('#form1', '#Page\d+'\)\.submit\(\);/,'submitRosterCapture('+pageid+')');
	
	startfunc = data.search(/<label for="medicalDates"/);		
	newdata='<label for="swimClassificationDate">Show Swim Classification Date</label>';
	newdata+='<input type="checkbox" data-theme="d" name="ShowSwimClassificationDate" id="swimClassificationDate" value="1" />';
									
	data=data.slice(0,startfunc) +newdata+data.slice(startfunc);
	
	
	return data;
}

//called by submitting on the Build Roster page
function submitRosterCapture(pageid) {
	
	
	var unitid
	if ($("input[name*=ShowSwimClassificationDate]:checked").length==1) {
		$("input[name*=ShowSwimClassificationDate]:checked").remove();
		var formPost = 'Action=Print&' + $('#form1').serialize();
		// get scout profile stuff first
		var unitPos = ["Troop Admin","Pack Admin","Crew Admin"];
		var unitArr = [];
		var evObj = {unitname:'',unitid:'',retrieved:false,admin:false};		
		$('[data-unittypeid] input[name*="ID"]:checked').parents('[data-unittypeid]').each( function () {
			evObj.unitname='';
			if($(this).text().match(/\S+ \d+/)!= null ) {
				evObj.unitname=$(this).text().match(/\S+ \d+/)[0];
			}
			evObj.unitid='';
			if($(this).children().find('[name="UnitID"]')[0].id.match(/\d+/) != null) {
				evObj.unitid=$(this).children().find('[name="UnitID"]')[0].id.match(/\d+/)[0];
			}
			evObj.admin=myPositionIs(unitPos,evObj.unitid);		
			if (arrObjContain(unitArr,'unitid',evObj.unitid) ==false) {
				unitArr.push(JSON.parse(JSON.stringify(evObj)));
			}
		});	
		
		scoutProfileObjList=[];		
		getConnectedScouts(unitArr,formPost,pageid,postRosterReport,formPost)
	
		return;
	}
	$("input[name*=ShowSwimClassificationDate]:checked").remove();
	//allow default
	$('#form1').submit();
	
	
}




function arrObjContain(arr,obKey,val) {	//tested used
	for (var x=0;x<arr.length;x++) {
	  if (arr[x].obKey == val) {
		  return true;
	  }
	}
	return false;
}
var addswimdate=false;

// updates the current page with the roster printout
// sets global swimdate so when the server response is found, we can update with new columns of data 
function postRosterReport(formData) {

	addswimdate=true;
	//var formData="Action=Print&UnitID="+unitid+"&ShowLeaders=1&ShowScouts=1&ShowParents=1&ShowParentsPhone=1&ShowPhone=1&ShowUnit=1&ShowDenPatrol=1&ShowMedicalDates=1&Title=" +encodeURIComponent(rsvpObj.title + ' '+ rsvpObj.date);
	var url = "/mobile/dashboard/reports/roster.asp?Action=Print&DenID=&PatrolID=&UnitID=";
	var dataurl=$.mobile.activePage.attr('data-url');
	$.mobile.changePage(
			url,
		{
			type: 'post',
			data: formData,
			dataUrl: dataurl,
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
	);	
}

var rosterPage='';

//not used
function captureRosterReport(formPost) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(captureRosterReport,formPost);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			// get the whole page
			//console.log(this.responseText);
			rosterpage=rawDataModifyRosterColAdd(this.responseText,pageid);
			// data is a full page of content.  Could get ANY page and replace it.
			
			//display it somewhere
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com//mobile/dashboard/reports/roster.asp?Action=Print&DenID=&PatrolID=&UnitID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errHandle(captureRosterReport,formPost);			
		if (servErrCnt > maxErr) {
			genError(unitid,'re');
		}
	};	
	
}

//modifies page content of a roster report print page
// if postRosterReport was called prior to this, it set the swimdate global
function rawDataModifyRosterColAdd(data,pageid) {
	
	  if (addswimdate==false) return data;
	  //addswimdate=true;
	   addswimdate=false;
	   var startfunc;
	   var endfunc;
	   var newdata='';	

	
	//console.log(data);
	//page has scripts functions that need overwriting
	
	//copy the style

	startfunc=data.search(/<style/);
	endfunc =data.search(/<\/style/);
	
	var style = data.slice(startfunc,endfunc) + '</style>';
	
	startfunc = data.search(/<body>/);	
	
	newdata+='<body>\n';
	newdata+='<div data-role="page" data-theme="d">\n';	//make background white
	newdata+='<script type="text/javascript">\n';		//overload any existing page functions
	newdata+="    function slideStop() { window.console && console.log('slideStop() reset from mobile_jsInit'); }\n";
	newdata+="    function popupAfterClosed() { window.console && console.log('popupAfterClosed() reset from mobile_jsInit'); }\n";
	newdata+="    function popupAfterOpen() { window.console && console.log('popupAfterOpen() reset from mobile_jsInit'); }\n";
	newdata+="    function enableToggle() { window.console && console.log('enableToggle() reset from mobile_jsInit'); }\n";
	newdata+="    function swapCache() { window.console && console.log('swapCache() reset from mobile_jsInit'); }\n";
	newdata+="    function offlineInit() { window.console && console.log('offlineInit() reset from mobile_jsInit'); }\n";
	newdata+="    function pageInit() { window.console && console.log('pageInit() reset from mobile_jsInit'); }\n";
	newdata+="    function pageShow() { window.console && console.log('pageShow() reset from mobile_jsInit'); }\n";
	newdata+="    function pageHide() { window.console && console.log('pageHide() reset from mobile_jsInit'); }\n";
	newdata+="    function headerInit() { window.console && console.log('headerInit() reset from mobile_jsInit'); }\n";
	newdata+='</script>\n'
	newdata+= style;	//overload the table styles

	//newdata+='<div data-role="content" data-theme="h">\n';
	
	data=data.slice(0,startfunc) +newdata + data.slice(startfunc+6);
	
	//center the title
	//find <div id="title">
	startfunc = data.search(/<div id="title">/);
	//add style  <div style="text-align:center">
	data=data.slice(0,startfunc) + '<div id="title" style="text-align:center">' + data.slice(startfunc+'<div id="title">'.length);
	
	
	// Modify the table
	
	
	startfunc = data.search(/<table id="scoutRoster"/);
	endfunc=data.indexOf('</table',startfunc);
	
	var thd=[];
	var tdr=[];
	
	loadTable(data.slice(startfunc,endfunc),thd,tdr);

	//filter the table, arrange columns
	//start by adding a column
	//find the Swim Column
	var col=findCol(thd,'Swim Class');
	
	if(col == -1) return data;

	
	tdr = insertCol(tdr,col);
	thd.splice(col,0,'Swim Date');


	var tdrFwd;
	
	// update swim date
	updateRosterRpt(tdr,col,'SwimmingClassificationDate',scoutProfileObjList);

	
	var htmltable;
	if(tdr.length==0) {
		data=data.slice(0,startfunc) + '<br><table id="scoutRoster" class="roster"><tr><th>Error creating report</th></tr>' + data.slice(endfunc);
	} else {
		htmltable=makeHtmlTable(thd,tdr);
		data=data.slice(0,startfunc) + '<br><table id="scoutRoster" class="roster">'+ htmltable + data.slice(endfunc);
	}
	

	
	//------- Leader table
	startfunc = data.search(/<table id="leaders"/);
	endfunc=data.indexOf('</table',startfunc);
	
	if(startfunc != -1) {
		//only admins have access to the profile to obtain the date
		thd=[];
		tdr=[];
		
		loadTable(data.slice(startfunc,endfunc),thd,tdr);
		var col=findCol(thd,'Swim Class');
		
		if(col == -1) return data;

		
		tdr = insertCol(tdr,col);
		thd.splice(col,0,'Swim Date');


		var tdrFwd;
		
		// update swim date
		updateRosterRpt(tdr,col,'SwimmingClassificationDate',leaderProfileObjList);


		if(tdr.length==0) {
			data=data.slice(0,startfunc) + '<br><table id="leaders" class="roster"><tr><th>Error creating report</th></tr>' + data.slice(endfunc);
		} else {	
			htmltable=makeHtmlTable(thd,tdr);
			data=data.slice(0,startfunc) + '<br><table id="leaders" class="roster">'+ htmltable + data.slice(endfunc);
		}
	}

	//---------------------
	startfunc = data.search(/<\/body/);	

	data=data.slice(0,startfunc) + '</div>' + data.slice(startfunc);
	
	data=data.replace('<link rel="stylesheet" href="/includes/mobile-concat.css" />','');
	
	rsvpObj.rsvpList.length==0;
	return data;
}

function findCol(tbl,heading) {
   for(var i=0;i<tbl.length;i++) {
	   if(tbl[i] == heading) {
			return i;
	   }
   }
   return -1;
}

function updateRosterRpt(tdr,col,hdr,userObjList) {
	//userObjList.profileData has formpost embedded
	var firstName;
	var lastName;
	var middleName;
	var nickName;
	var name;
	var found;
	var tdrFwd;
	//var nameList=[];
	for(var i=0;i<tdr.length;i++) {
		found=false;
		//report has lastname, firstname
		tdrFwd='';
		if(tdr[i][0].toLowerCase().match(/, (.+)/) != null && tdr[i][0].toLowerCase().match(/(.+),/) != null) {
			tdrFwd=tdr[i][0].toLowerCase().match(/, (.+)/)[1] + ' ' + tdr[i][0].toLowerCase().match(/(.+),/)[1];
		}
		for(var j=0;j<userObjList.length;j++) {
			
			firstName=decodeURIComponent(getFormVal(userObjList[j].profileData,'FirstName')).replace('+',' ');
			middleName=decodeURIComponent(getFormVal(userObjList[j].profileData,'MiddleName')).replace('+',' ');
			nickName=decodeURIComponent(getFormVal(userObjList[j].profileData,'Nickname')).replace('+',' ');
			lastName=decodeURIComponent(getFormVal(userObjList[j].profileData,'LastName')).replace('+',' ');
			
			if(nickName != '' ) {
				name=nickName + ' ' + lastName;
			} else {
				name=firstName+ ' ' + lastName;
			}			
			

			// if the name matches, update col 0 with the status
			
			//nameList.push(name.toLowerCase());
			if(tdrFwd == name.toLowerCase()) {
				tdr[i][col]=decodeURIComponent(getFormVal(userObjList[j].profileData,hdr));
				//found=true;
				break;
			}

		}
		//if(found==false) {
		//	alert('no match in updateRoster for '+tdrFwd + ' ' + nameList);
		//	console.log('no match in updateRoster for '+tdrFwd + ' ' + nameList);
		//}
	}
}



// looks at scout connections to this adult, builds list of all scout ids in scoutPermObjList
// the issue now is that unitID is unit only

// If we build the list for scouts in the selected units and the parent unit of a patrol or den selected,
// remember teh desn and patrols.  Build the list for scouts at the unit level, whjen geting the acoutn for the scout, we can toss if not in a direct select unit
// and not in a selected patrol 


//call for each item in the unitArr
function getConnectedScouts(unitArr,rosterPrintFormPost,pageid,cb,cbv1) {

	var troop;
	var unitid;
	var cont=false;
	for(var i=0;i<unitArr.length;i++) {
		if(unitArr[i].retrieved == false) {
			unitArr[i].retrieved=true;
			troop= unitArr[i].unitname;
			unitid=unitArr[i].unitid;
			cont=true;
			break;
		}
	}
	if(cont==false) {
		// retrieved all scouts
		//move on
		//we have scouts, ok to continue
		scoutProfileObjList=[];
		getCookieForProfile(unitArr,pageid,rosterPrintFormPost,cb,cbv1); // end that event string with the changepage
		return;
	}
		
		
		
	if (i==0) {	
		$.mobile.loading('show', { theme: 'a', text: 'loading...this can take several minutes for large numbers of scouts', textonly: false });
		scoutPermObjList.length=0;
	}
	var evObj = { name : '', id : '', img : ''};


		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status > 399  && this.status < 500) {
				$.mobile.loading('hide');
				alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
				return;
			}
			if (this.readyState == 4 && this.status > 499) {
				errHandle(getConnectedScouts,unitArr,rosterPrintFormPost,pageid,cb,cbv1);	//server side error - maybe next try will work
				return;
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
			
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
				//console.log('x');
					//console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
					var txtUnit=$('.orangeSmall',this)[0].textContent;
					if (txtUnit.indexOf(troop) != -1) {
						
						//this scout is in the unit of interest
						
						okToUse=true;
						
						if(okToUse==true) {
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1 || $('.permission',this)[0].textContent.indexOf('Edit Profile') != -1) {
									// The User has permission to edit this Scout's profile
								var p = $(this).parent();
								evObj.img= $('img',p).attr('src');	
								evObj.id ='';
								if($('a',this).attr('href').match(/\d+/)!=null) {
								evObj.id =  $('a',this).attr('href').match(/\d+/)[0];
								}
								evObj.name = $('a',this)[0].textContent.trim();
								//console.log(evObj.name,evObj.id);
								scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));								
							}
						}
					}
				});		
				
				setTimeout(function(){ 
					getConnectedScouts(unitArr,rosterPrintFormPost,pageid,cb,cbv1);
				},200);
				

				return;
				
			
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errHandle(getConnectedScouts,unitArr,rosterPrintFormPost,pageid,cb,cbv1);
		};
}




//get scout and leader data

// We are going to fill an object array with an object containing data for each scout in scoutPermObjList

//scoutPermObjList has a list of scouts.
// Each time called, gets next scout from list to process until none left, then returns to unit page
// For each scout, gets scout account page, then calls to get scout profile
function getCookieForProfile(unitArr,sPage,rosterPrintFormPost,cb,cbv1) {
	
	if (scoutProfileObjList.length == scoutPermObjList.length) {
		// no scouts left
		if ($("input[name*=ShowLeaders]:checked").length==1) {
			leaderProfileObjList=[];
			getLeaderRosters(unitArr,sPage,cb, cbv1)
		} else {
			cb(cbv1);
		}
		
		
		return;
	} else {
		
		var offst=scoutProfileObjList.length;
		var thisScoutID = scoutPermObjList[offst].id;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getCookieForProfile,unitArr,sPage,rosterPrintFormPost,cb,cbv1);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			getProfileAllData(thisScoutID,unitArr,sPage,rosterPrintFormPost,cb,cbv1);
		}
	};
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScoutID;

	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getCookieForProfile,unitArr,sPage,rosterPrintFormPost,cb,cbv1);
	};
}

// gets the scout edit profile page
// It will copy all the form fields as they will be needed to post later.
// Some fields are normally activly populated on the page when it is displayed, but as it is not displayed here, those scripts don't auto populate 
// so we will do that here.  First we update the swim data, the fill in the patrol id as found elsewhere on the page.
// If the scout is an approved scout, there is a disapprove button on the page.  If the scout was approved, we will add the approved element (normally a checkbox value)
// to the field list to post.
// Finally, we need to call getBSAprofileData to get other field data normally done in the ajax call

function getProfileAllData(thisScoutID,unitArr,sPage,rosterPrintFormPost,cb,cbv1) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getProfileAllData,thisScoutID,unitArr,sPage,rosterPrintFormPost,cb,cbv1);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			var formPost=$('#editProfileForm', this.response).serialize();			

			var patrolid='';
			var pid='';
			var denid='';
			var did='';
			if ($('a[id="goToDenPatrol"]',this.response).attr('href') != undefined) {
				if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
					 patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
					 pid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=\d+/)[0];
				} 

				if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/DenID=(\d+)/) != null) {
					 denid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/DenID=(\d+)/)[1];
					 did=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/DenID=\d+/)[0];
				}
			}


			
			//is the ID a match to what we expect...
			
			//this scout could be in a patrol/den of interest
			// we are looking at teh scout's account page, so lets see if their patrol or den is one selected in the roster print
			//or a unit of interest.
			//If any patrol in a unit is specified, then scouts not in patrols of interest in that unit should be ignored.  Huh.
			if(rosterPrintFormPost.match(/DenID=|PatrolID=/) != null) {	// a patrol/den is requested
				var xid;
				xid=pid;
				if(xid=='') {
					xid=did;
				}

				if(rosterPrintFormPost.match(xid) == null || xid=='') {
					//this scout is not in a patrol of interest
					//var scoutunit=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/(UnitID=\d+)/)[0];
					//if(rosterPrintFormPost.match(scoutunit) == null) {
						//ignore this scout
						rmPermScout(thisScoutID);
						setTimeout(function(){ getCookieForProfile(unitArr,sPage,rosterPrintFormPost,cb,cbv1); }, 200);
						return;
					//}
				}
			}
			
			formPost = formPost.replace(/PatrolID=[^&]*/,'PatrolID='+patrolid);
			formPost = formPost.replace(/DenID=[^&]*/,'DenID='+denid);
					
			//if the disapprove button is present on this form, attached the approved element to formPost.  It means the Scout was approved prior and we'll keep it that way
			
			if ($('a[href="#"][id="disapproveButton"]').text() != "") {
				formPost = formPost + '&Approved=1';
			}
	
			//getBSAprofileData2 (thisScoutID,formPost,unitid,sPage,txtunit);
			
			var evObj={id: '', profileData: '', update: 0};
			evObj.id=thisScoutID;
			evObj.profileData=formPost;
			evObj.update=0;
			scoutProfileObjList.push(JSON.parse(JSON.stringify(evObj)));
			
			setTimeout(function(){ getCookieForProfile(unitArr,sPage,rosterPrintFormPost,cb,cbv1); }, 200);			
			
		}
	};

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID=&DenID=&PatrolID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getProfileAllData,thisScoutID,unitArr,sPage,rosterPrintFormPost,cb,cbv1);
	};
}

/*
Report will have leader names in it.
Look at the leader Roster for any unit the user is an Admin in to build the list of leaders.
Maybe update unitArr with Admin status

*/
var leaderProfileObjList=[];
function getLeaderRosters(unitArr,pageid,cb, cbv1) {
	var unitID;
	var cont=false;
	for(var i=0;i< unitArr.length;i++) {
		if(unitArr[i].admin == true ) {
			if(unitArr[i].retrieved == true ) {
				unitArr[i].retrieved = false;
				cont=true;
				unitID=unitArr[i].unitid;
				break;
			}
		}			
	}
	
	if (cont==false) { 
		//done retrieving rosters for leader lists to get leader ids
		// start getting leader profiles
		getLeaderProfiles(unitArr,pageid,cb, cbv1);
		return;
	}
	
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getLeaderRosters,unitArr,pageid,cb, cbv1);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	
			var evObj={id:'',name:'',unitid:'',retrieved:false,profileData:''};
			for(var i=0;i<$('a[href*="AdultUserID"]',this.response).length;i++) {
				evObj.name= $('a[href*="AdultUserID"]',this.response)[i].text.trim();
				evObj.id='';
				if($('a[href*="AdultUserID"]',this.response)[i].href.match(/AdultUserID=(\d+)/)!=null) {
					evObj.id=$('a[href*="AdultUserID"]',this.response)[i].href.match(/AdultUserID=(\d+)/)[1];
				}
				evObj.unitid=unitID;
				leaderProfileObjList.push(JSON.parse(JSON.stringify(evObj)));
				// next unit
			}
			
			setTimeout(function() { getLeaderRosters(unitArr,pageid,cb, cbv1);  },200);
			

		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getLeaderRosters,unitArr,pageid,cb, cbv1);
	};			
}


function getLeaderProfiles(unitArr,pageid,cb, cbv1) {
	var unitID;
	var adultID;
	var cont=false;
	for(var i=0;i< leaderProfileObjList.length;i++) {
		if(leaderProfileObjList[i].retrieved == false ) {
			leaderProfileObjList[i].retrieved = true;
			cont=true;
			unitID=leaderProfileObjList[i].unitid;
			adultID=leaderProfileObjList[i].id;
			break;
		}				
	}
	
	if (cont==false) { 
		//done retrieving rosters for leader lists to get leader ids
		// start getting leader profiles
		cb(cbv1);  //postRosterReport,formPost
		return;
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getLeaderProfiles,unitArr,pageid,cb, cbv1);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);		
			setTimeout(function() { getLeaderProfileForm(unitArr,unitID,adultID,i,pageid,cb, cbv1);  },100);
		}	
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/rosteredit.asp?AdultUserID='+adultID+'&UnitID='+unitID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getLeaderProfiles,unitArr,pageid,cb, cbv1);
	};		
}
	
function getLeaderProfileForm(unitArr,unitID,adultID,i,pageid,cb, cbv1) {	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getLeaderProfileForm,unitArr,unitID,adultID,i,pageid,cb, cbv1);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);		
			leaderProfileObjList[i].profileData=$('#editProfileForm',this.response).serialize();
			setTimeout(function() { getLeaderProfiles(unitArr,pageid,cb, cbv1);  },100);
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?UnitID='+unitID+'&DenID=&PatrolID=&AdultUserID='+adultID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getLeaderProfileForm,unitArr,unitID,adultID,i,pageid,cb, cbv1);
	};		
}

function rmPermScout(thisScoutID) {
	for(var i=0;i<scoutPermObjList.length;i++) {
		if (scoutPermObjList[i].id==thisScoutID) {
			//i points to list item to remove
			scoutPermObjList.splice(i,1);
			break;
		}
	}
}


function test() {
		var unitPos = ["Troop Admin","Pack Admin","Crew Admin"];
		var unitArr = [];
		var evObj = {unitname:'',unitid:'',retrieved:false,admin:false};		
		$('[data-unittypeid] input[name*="ID"]:checked').parents('[data-unittypeid]').each( function () {
			evObj.unitname=$(this).text().match(/\S+ \d+/)[0];
			evObj.unitid=$(this).children().find('[name="UnitID"]')[0].id.match(/\d+/)[0];
			evObj.admin=myPositionIs(unitPos,evObj.unitid);		
			if (arrObjContain(unitArr,'unitid',evObj.unitid) ==false) {
				unitArr.push(JSON.parse(JSON.stringify(evObj)));
			}
		});

		getLeaderRosters(unitArr,'xxx',done, 'done');
}

function done(x) {
	console.log(leaderProfileObjList);
}