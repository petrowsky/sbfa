//undo

// this is on rank.asp  Will have links to adventures and local rank requirements
// green completed  checkboxdone
//blue approved  checkboxapproved
//gold awarded  checkboxawarded
//started	checkboxgreen


function addRawUndo(data,pageid) {

	//add link to undo
			//only if this person is an Admin
			var okshow=false;
			for(var i=0;i<myPositions.length;i++) {
				if(myPositions[i].position.match(/Pack|Troop|Crew|Ship Admin/) != null) {
					if($('a#goToUnit').text().trim() == myPositions[i].unitName) {
						//check unit
						okshow=true;
					}
				}
				//unitName: "Lions Den (4) Pack 194"}    cumbs Den 4    Pack 194
				if(myPositions[i].position.match(/Den Admin/) != null) {
					if(myPositions[i].unitName.match( $('a#goToUnit').text().trim()) != null) {
						//now to match the den
						var den=$('a#goToDenPatrol').text().trim();  //(e.g. Den 4)
						var dnum=den.match(/Den (.+)/)[1];
						if(myPositions[i].unitName.match('Den \\('+dnum+'\\)') !=null) {
							okshow=true;
						}
					//Webelos Den 2 Pack 194
					//check unit and Den
					}
				}
			
	
				if(myPositions[i].position.match(/Patrol Admin/) != null) {
					if(myPositions[i].unitName.match($('a#goToDenPatrol').text().trim() + ' Patrol ' +  $('a#goToUnit').text().trim()) != null) {
						okshow=true;
					}
				}	
			}
			if (okshow==false) {
				return data;
			}	
	
			var startfunc = data.indexOf('<li id="checkboxLegend" data-theme="d">');
			
			if (startfunc ==-1) {
				return data;
			}

			var menuopt='';
			menuopt= '<li><input type="button" value="Undo Requirements" data-theme="g" id="buttonPopUndo" >\n';

			data = data.slice(0,startfunc) + menuopt + '\n' + data.slice(startfunc);
	
			var startfunc = data.indexOf('<div id="footer"');

			newdata = '	<div data-role="popup" id="undoRequirementsPopup" data-dismissible="false" data-theme="d" data-history="false">';
			
			newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >';  //class="ui-icon-alt"
			newdata +=				'<li data-role="divider" data-theme="e">Undo or Reset Requirements:</li>';
			
			newdata +=			'			<li data-theme="d">\n';
				
			newdata +=			'				<div class="ui-grid-b ui-responsive">\n';
			newdata +=			'					<div class="ui-block-a">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose what marking you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoTypeID" id="undoTypeID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >Marked Completed</option>\n';
			newdata +=			'											<option value="2" >Marked Approved</option>		\n';									
			newdata +=			'											<option value="3" >Marked Either Completed Or Approved</option>	\n';										
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';
			newdata +=			'					</div>\n';
			newdata +=			'					<div class="ui-block-b">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose date marked you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoDateID" id="undoDateID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >All Dates</option>\n';									
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';			
			
			newdata +=			'					</div>\n';
			
			newdata +=			'					<div class="ui-block-c">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose who\'s marking you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoWhoID" id="undoWhoID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >All Persons</option>\n';									
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';			
			
			newdata +=			'					</div>\n';			
			
			
			
			
			
			newdata +=			'				</div>\n';

			newdata +=			'			</li>		\n';	
					
					
			
			newdata +=	'			<li><input type="button" value="Undo Now" data-theme="g" id="buttonUndo" ><input type="button" value="Cancel" data-theme="g" id="buttonUndoCancel" ></li>';
//			newdata +=	'			<li id="importErrRegLI">';
//			newdata +=	'			</li>';

		

			newdata +=			'</ul>';	
			
			newdata += '	</div>';				
			data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);	


			startfunc = data.indexOf("function showErrorPopup(msg)");
			var myfunc = '' + udreqfu;
			myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid)));		//.replace('unitid',escapeHTML(unitID));
			data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);



			
	return data;
}


function udreqfu () {
				//var pageASP='awardrequirement';
				//var pageASP='adventurerequirement';
			
			$('#buttonPopUndo','#PageX').click(function () {
				//update the lists

				procUndo();
				$('#undoRequirementsPopup','#PageX').popup('open');
			});
			
			$('#buttonUndoCancel', '#PageX').click(function () {
				$('#undoRequirementsPopup','#PageX').popup('close');
			});
			
			$('#buttonUndo', '#PageX').click(function () {
				//check selections

				if($('#undoWhoID option:selected').text() == 'choose one...' || $('#undoTypeID option:selected').text() == 'choose one...' ||$('#undoDateID option:selected').text() == 'choose one...') {
					alert('Please select your options');
					return false;
				} else {
					
					if( $('#undoTypeID option:selected').val() ==  3 || $('#undoTypeID option:selected').val() ==  2) {
						var tres=confirm('You opted to remove APPROVED items!!  Are you SURE you want to continue? Press OK to continue and Cancel to quit');
						if(tres == false) {
							return false;
						}
					}
					removeMarkedDates();
				}
				
			});			
}

function procUndo() {
	var pageASP;
if(document.URL.match('adventure.asp') != null) {
	pageASP='adventurerequirement';
}

if(document.URL.match('meritbadge.asp') != null) {

	pageASP='meritbadgerequirement';
}

if(document.URL.match('award.asp') != null) {

	pageASP='awardrequirement';
}
var whoMarkList=[];
var dateMarkList=[];
var whoMarkList=[];
var dateMarkList=[];

$('a[href*="'+pageASP+'.asp?"]').each( function () {
	if($('img[src*="checkboxapproved"]',this).length != 0) {
		//console.log($(this).attr('href'));
		var parTr=$(this).parentsUntil('table','tr');
		if(parTr.length!=0) {
	

			if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
				pushUnique(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1]);
				pushUnique(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1]);
			}
			if( $('.dateCompleted[id*="LA-"]',parTr) != null) {
				pushUnique(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1]);
				pushUnique(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1]);
			}
		}
			
	}
	
	if($('img[src*="checkboxdone"]',this).length != 0) {
		//console.log($(this).attr('href'));
		var parTr=$(this).parentsUntil('table','tr');
		if(parTr.length!=0) {
			if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
				pushUnique(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1]);
				pushUnique(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1]);
			}
		}
	}	
	
	
});

//update the options now

if($('#undoDateID option').size() < 3) {
	for(var i=0;i<dateMarkList.length;i++) {
		$('#undoDateID').append('<option value="'+(i+1)+'">'+dateMarkList[i]+'</option>');
	}
}
if($('#undoWhoID option').size() < 3) {
	for(var i=0;i<whoMarkList.length;i++) {
		$('#undoWhoID').append('<option value="'+(i+1)+'">'+whoMarkList[i]+'</option>');
	}
}

}

function removeMarkedDates() {
var removeReqList=[];

var	url='';
var	dateComplete='';
var	whoComplete='';
var	dateApproved='';
var	whoApproved='';
var pageASP='';

var li='';
var typeComplete='';
if(document.URL.match('adventure.asp') != null) {
	typeComplete='AdventureCompleted';
	li='adventureCompletedLI';
	pageASP='adventurerequirement';
}

if(document.URL.match('meritbadge.asp') != null) {
	typeComplete='MBCompleted';
	li='mbCompletedLI';
	pageASP='meritbadgerequirement';
}

if(document.URL.match('award.asp') != null) {
	typeComplete='AwardEarned';
	li='awardCompletedLI';
	pageASP='awardrequirement';
}

if($('#'+li).find('.dateCompleted').length > 0) {
	// need to clear the completion date in the adventure if any options to remove completion dates are selected

	// current url
	url=document.URL.match(/scoutbook\.com(.+)/)[1];
	var formData='Action='+typeComplete+'&DateCompleted=';
	removeReqList.push({url:url,formData:formData,email:'',who:$('#undoWhoID option:selected').text(),dates:$('#undoDateID option:selected').text(),undone:false});	
}

//{url:'',

	$('a[href*="'+pageASP+'.asp?"]').each( function () {
		url='';
		dateComplete='';
		whoComplete='';
		dateApproved='';
		whoApproved='';
		if($('img[src*="checkboxapproved"]',this).length != 0) {
			url=$(this).attr('href');
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1];
					dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1];
					
				}
				if( $('.dateCompleted[id*="LA-"]',parTr) != null) {
					whoApproved=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1];
					dateApproved=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1];
					
				}
				determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList);
			}
				
		}
		
		if($('img[src*="checkboxdone"]',this).length != 0) {
			url=$(this).attr('href');
			//console.log($(this).attr('href'));
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1];
					dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/d on (\S+ \d+, \d\d\d\d)/)[1];
					determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList);
				}
			}
		}	
		



		
	});	
	
	postUndos(removeReqList);

	
	
}


function determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList) {
		var dID = $('#undoDateID option:selected').text();
		var wID=$('#undoWhoID option:selected').text();
		var email=false;
		var formData='';
		
		if ($('#undoTypeID option:selected').val() ==  3) {									//user selects Completed and Approved
			if (whoApproved != '')	{														//exists
				if ((dID ==dateApproved && dID==dateComplete) || dID=='All Dates') {		//user selected Date Matches (dateApproved AND dateComplete) OR ALL Dates selected
					if ((wID==whoApproved && wID==whoComplete) || wID=='All Persons')	{	//user selected name matches (whoApproved AND whoComplete) OR ALL names selected
						formData='Action=SubmitDateCompleted&DateCompleted=';				//remove date
						email=true;															//add to email list
					} else if (wID==whoApproved  || wID=='All Persons') {					//selected name matches whoApproved OR selected name = ALL
						formData='Action=SubmitDateCompleted&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));		//clear approved checkbox
						email=true;															//add to email list
					}  																		// else maybe the name matches on completed but do nothing because can't remove approval
				} else if (dID==dateApproved || dID=='All Dates') {							//selected Date Matches dateApproved OR selected date = ALL
					formData='Action=SubmitDateCompleted&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));			//clear approved checkbox
					email=true;																//add to email list
				}
			} else {	// this req isn't marked approved, only completed
				if ((wID==whoComplete || wID=='All Persons') && (dID==dateComplete || dID=='All Dates' )) {	//(selected name matches whoComplete OR selected name = ALL) AND (selected date matches dateComplete OR selected date = ALL)
					formData='Action=SubmitDateCompleted&DateCompleted=';					//remove date
				}				
			} //endif
		} else if ($('#undoTypeID option:selected').val() ==  2) {							//user selected approved
			if (whoApproved != '')	{														//whoApproved exists
				if ((wID==whoApproved ||wID=='All Persons') &&(dID==dateApproved ||dID=='All Dates')) {		//(selected name matches whoApproved OR selected name = ALL) AND (selected date matches dateApproved OR selected date = ALL)
					formData='Action=SubmitDateCompleted&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));			//clear approved checkbox
					email=true;																//add to email list
				}
			}
		} else if ($('#undoTypeID option:selected').val() ==  1) {							//user selects completed
		    if (whoApproved == '') {														// only clear completes if not approved
				if ((wID==whoComplete ||wID=='All Persons') &&( dID==dateComplete ||dID=='All Dates')) {	//(selected name matches whoComplete OR selected name = ALL) AND (selected date matches dateComplete OR selected date = ALL)
					formData='Action=SubmitDateCompleted&DateCompleted=';					//remove date
				}
			}
		}
	
		//if an award, change DateCompleted to DateEarned

		if(document.URL.match('award.asp') != null) {
			formData=formData.replace(/DateCompleted/g,'DateEarned');
		}
		
		removeReqList.push({url:url,formData:formData,email:email,who:wID,dates:dID,undone:false});	
	
}


function postUndos(removeReqList) {
	var url='';
	for (var i=0;i<removeReqList.length;i++) {
		if(removeReqList[i].undone==false) {
			url=removeReqList[i].url;
			break;
		}
	}
	if(url=='') {
		$('#undoRequirementsPopup','#PageX').popup('close');
		url=document.URL.match(/scoutbook\.com(.+)/)[1];
		//reload current page
				$.mobile.loading('hide'); // go to
				$.mobile.changePage(
						url,
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);				
		// tally up the email stuff to send
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
			errHandle(postUndos,removeReqList);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			removeReqList[i].undone=true;

			postUndos(removeReqList)
			
		}
	};
	
	
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(removeReqList[i].formData);
			
	xhttp.onerror = function() {
		errHandle(postUndos,removeReqList);
		if (servErrCnt > maxErr) {
			//closeConMgr(unitID,'','');
			alert('Error Processing');
		}
	};	
		
	
}


function mm_dd_yyyy(dtin) {
	var d = new Date(dtin);	
    return d.getMonth()+1 +'/'+ d.getDate() + '/'+d.getFullYear();	
}
	
