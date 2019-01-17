// Copyright © 1/28/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
/*
		
		
*/

function addRawMyConnection(data,thisurl,pageid){

	if(data.indexOf('mb permission') ==-1) {
		return data;
	}

	var buttondata=delcons(data);
	var insertpt=data.indexOf('</li>',data.indexOf('Connections:'));
	data=data.slice(0,insertpt) + buttondata + data.slice(insertpt);	
	
	//add button code

	var startfunc=data.indexOf("$('a.removeConnection");
	var myfunc = '' + rcscript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
    data = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);	
	return data;
}

//https://d3hdyt7ugiz6do.cloudfront.net/images/icons/notconnected100.png
//https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkboxapproved48.png

function delcons(data) {
	var newdata='';
	newdata+='				<div style=" text-align: right; " >'; //class="addDenPatrol"  float: left;
	newdata+='					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonDelCons">';
	newdata+='						<div style="margin-left: 30px;  ">'; //position: relative;
	newdata+='							<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/notconnected100.png" style="width: 24px;" />'; //style="position: absolute; width: 24px; left: -30px; top: -4px; "
	newdata+='							<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkboxapproved48.png" style="width: 24px;" />'; //style="position: absolute; width: 24px; left: -30px; top: -4px; "
	newdata+='							Show Merit Badge OK to Disconnect Status';
	newdata+='						</div>';
	newdata+='					</a>';
	newdata+='				</div>';
	newdata+='				<div class="clearRight"></div>';

	return newdata;	
}

function rcscript() {
	$('#buttonDelCons').click( function () {
		showDelCons();		
	});
}


function showDelCons() {
	$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });
	var userchildren=[];
	var units=[];
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[],  showDelCons,[]);
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			$('a[href*="account.asp?ScoutUserID="]',this.response).each( function () {
				if($(this).attr('href').match(/ScoutUserID=(\d+)/)!=null) {
					userchildren.push($(this).attr('href').match(/ScoutUserID=(\d+)/)[1]);
				}
			});
			
		
			if(userchildren.length==0) {
				//go to my positions to see what units I am a leader in
				mypositionunits(units);
			} else {
				//go to scout accounts to see what units they are in
				getchildunits(userchildren,units);
			}
			
		}
	};
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[],  showDelCons,[]);
	};		
}

function getchildunits(userchildren,units) {
	
	
	if(userchildren.length==0) {
		//go to my positions to see what units I am a leader in
		mypositionunits(units);
		return;
	}
	var id;
	var found=false;
	var scoutid=userchildren[0];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[],  getchildunits,[userchildren,units]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			$('input[name="UnitID"]',this.response).each( function () {
				id=$(this).attr('id');
				pushUnique(units,$('label[for="'+id+'"]',this).text());		//2/2 added this
				found=true;
			});
			
			if(found==false) {
				pushUnique(units,$('#goToUnit',this.response).text());		// 2/2 added this.response
			}
			userchildren.shift();
			getchildunits(userchildren,units);
			
		}
	};		
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID='+scoutid;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[],  getchildunits,[userchildren,units])
	};	
}

function mypositionunits(units) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[],  mypositionunits,[units]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
		
			$('a[href*="position.asp?UserPositionID="]',this.response).each(function () {
				var rtxt=$(this).text().trim();
				if(rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/)  == null) {
					if($(this).attr('href').match(/UnitID=(\d+)/) != null) {
						pushUnique(units,$('.orangeSmall',this).text().trim());
					}
				}
			});	
			
			//Have units
			mbScoutsNotMyUnit(units);
		}
	};
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp?UnitID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[],  mypositionunits,[units]);
	};	
}

function mbScoutsNotMyUnit(units) {
	
	//We are ON the page, no need to ajax to it
	var parDiv;
	var thisscout;
	var mbid;
	var mbtxt;
	var mbScouts=[];
	var mblist=[];
	$('a[href*="ScoutUserID="]').each( function () {
		if($(this).attr('href').match(/ScoutUserID=(\d+)/)!=null) {
		thisscout=$(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
		parDiv=$(this).parent();
		mblist=[];
		if($('.orangeSmall',parDiv).text().trim()!='') {
			if(testUnique(units,$('.orangeSmall',parDiv).text().trim())==false) {
				//not in unit
				$('div.mb.permission',parDiv).each(function () {
					//save this scout, need to go to scouts account to find status
					mbid=$(this).attr('data-meritbadgeid')
					mbtxt=$(this).text().trim();
					mblist.push({mbid:mbid,mbtxt:mbtxt});
				});
				if(mblist.length != 0) {
					mbScouts.push({id:thisscout,mbopen:false,checked:false,mblist:mblist});
				}
			}
		} else {

			parDiv=$(this).parent();
			$('div[style*="margin-top"]',parDiv).append('<div class="permission floatRight" style="margin-top: 3px; margin-right: -5px;"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/notconnected100.png"  style="width: 16px;"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png"  style="width: 16px;">Membership Terminated</div>');
		
			
		}
		}
	});
		
	// iterate through these scout accounts
			
	iterateMBScouts(mbScouts);
}


function iterateMBScouts(mbScouts) {
	var scoutid='';
	for(var i=0;i<mbScouts.length;i++) {
		if(mbScouts.checked == false) {
			scoutid=mbScouts.id;
			break;
		}
	}
	if(scoutid=='') {
		//done checking mb status for scouts, now markup page
		mbScoutPagemarkup(mbScouts);
		return;
	}
	var keep=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[],  iterateMBScouts,[mbScouts]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			for(var i=0;i<mbScouts.length;i++) {
				if(mbScouts[i].id==scoutid) {
					keep=false;
					for(var j=0; j<mbScouts[i].mblist.length;j++) {
						//$('a[href*="MeritbadgeID='+mbScouts[i].mblist[j].mbid+'"]',this.response).each
						$('a[href*="MeritbadgeID="]',this.response).each( function () {
							// if there is a progress circle, don't kill the connection
							if($('.progressCircle',this).length != 0) {
								keep=true;
							}
						});		
					}
					mbScouts[i].mbopen=true;
					mbScouts[i].checked=true;
					break;
				}
			}
			
			iterateMBScouts(mbScouts);

		}
	};
		
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID='+scoutid;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[],  iterateMBScouts,[mbScouts]);
	};	
}
//https://d3hdyt7ugiz6do.cloudfront.net/images/icons/notconnected100.png
//https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkboxapproved48.png

function mbScoutPagemarkup(mbScouts) {
	var parDiv;

	for(var i=0;i<mbScouts.length;i++) {
		if(mbScouts[i].mbopen==false) {
			//append
			parDiv=$('a[href*="ScoutUserID='+mbScouts[i].id+'"]').parent();
			$('div[style*="margin-top"]',parDiv).append('<div class="permission floatRight" style="margin-top: 3px; margin-right: -5px;"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/notconnected100.png"  style="width: 16px;"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkboxapproved48.png"  style="width: 16px;">OK to Disconnect</div>');
		}
	}
	$.mobile.loading('hide');
}
//floatRight" style="margin-top: 3px; margin-right: -5px;"