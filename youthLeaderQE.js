// Copyright © 1/28/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

//Position Name  Patrol
var leadershipLIs='';
var scoutPosList=[];
var leaderDeleteList=[];
var leaderModifyList=[];
var leaderNewList=[];

function addRawYouthLeadershipQE(data,pageid,unitID,txtunit) {
	youthLeaderQE=false;
	leaderDeleteList=[];
	leaderModifyList=[];
	leaderNewList=[];	
	
	
	// Replace heading
	var startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	var endfunct = data.indexOf('</h1>',1);				
	
	var newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh1" class="text">'+escapeHTML(txtunit)+'</a>';
	if(QEPatrol != '') {
		newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+escapeHTML(QEPatrol)+'</a>';
	}
	newdata += '           Record Multiple Scout Leadership Positions';
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;

	var startfunc = data.indexOf('<a id="goBack"',1);
	var endfunct = data.indexOf('<img src',startfunc);
	myfunc = '<a href="#" id="buttonRefresh" >';
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;	
	
	// replace content
	var startfunc = data.indexOf('<div data-role="content">');
	var endfunct = data.indexOf('</div><!-- /content -->');
	var newdata = data.slice(0,startfunc);				
	newdata += setYouthleadershipPageContent(txtunit,'Page'+escapeHTML(pageid));
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
	// replace style
	var startfunc = data.indexOf('<style type="text/css">');
	var endfunct = data.indexOf('</style>');
	var newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeleteLog								{ max-width: 400px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' .smallText		{ color: gray; margin-top: 15px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }';

	newdata += '		//#Page' + escapeHTML(pageid) +' .ui-btn { margin-top:8px;  !important}';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-input-text { font-weight:bold; padding-top:5px; padding-bottom:3.5px; margin:0; !important}';	

	newdata += '		#Page' + escapeHTML(pageid) +' .defaultDateDv input.ui-input-text	{ width: 50%; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .defaultDateDv label.ui-input-text	{ width: 50%; }\n';	
	

	
	
	
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeletePosition									{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .slider													{ float: right; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-slider											{ position: absolute; top: 2px; right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-slider-switch									{ width: 5em; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #defaultPositionLI .questionIcon					{ position: absolute; top: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #defaultPositionLI label.ui-input-text			{ margin-bottom: 0; }\n';
		
	newdata += '		#Page' + escapeHTML(pageid) +' #denLI,\n';								
	newdata += '		#Page' + escapeHTML(pageid) +' #denNumberLI,\n';							
	newdata += '		#Page' + escapeHTML(pageid) +' #patrolNameLI,\n';							
	newdata += '		#Page' + escapeHTML(pageid) +' #meritBadgesLI,\n';							
	newdata += '		#Page' + escapeHTML(pageid) +' #availabilityLI,\n';						
	newdata += '		#Page' + escapeHTML(pageid) +' #listTypeLI,\n';						
	newdata += '		#Page' + escapeHTML(pageid) +' #listTypeUnitLI				{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #listTypeDistrictLI			{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #denIDLI							{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #patrolIDLI						{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #akelaUnitNumberLI			{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #akelaUnitIDLI					{ display: none; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' img.denImage					{ position: absolute; height: 32px; top: -6px; left: -6px; }\n';	
	
	
	newdata += '	</style>';
	newdata +=  data.slice(endfunct);				
	data=newdata;				

	
	
	
	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	
	var myfunc;
	if(leadershipLIs.indexOf('<!--old-->') != -1) {
		myfunc = '' + ylscript;
	} else {
		myfunc = '' + y2script;
	}
	
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID)).replace(/txtunit=X/,'txtunit="'+escapeHTML(txtunit)+'"');
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;			
					
	//scoutPermObjList=[];
	return data;
}




		


function setYouthleadershipPageContent(txtunit,tpageid) {
var newdata;
newdata = '	<div data-role="content">';

newdata += '	<form id="leadershipForm">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';			
newdata += '			 Quick Edit Scout Leadership';
newdata += '			</li>';
			
newdata += '			<li id="scoutsLI" data-theme="d">';

newdata += '					<p class="normalText">Now you can quickly and easily update Scout Leadership Positions for the whole Pack or Troop!</p>';

newdata += '						<legend class="text-orange">';
newdata += '								<strong>Update Scout Leadership Positions:</strong>';
newdata += '						</legend>';
newdata += '			</li>';
newdata += '		</ul>';	
newdata += '		<fieldset data-role="controlgroup">';	

/*
grid b has abc
grid c has abcd
grid d has abcde
grid e has ab cd ef
*/
newdata += '					<div class="ui-grid-b ui-responsive" >'; 
newdata += '						<div class="ui-block-a">';
newdata +='            			    </div>';
newdata += '						<div class="ui-block-b">';
newdata +='            			    </div>';
newdata += '						<div class="ui-block-c">';
newdata += '							<div data-role="fieldcontain" id="defaultDateDv" data-theme="h" style="float: right";>';
newdata += '						      	<label for="defaultDate">Date Default:</label>';
newdata += '								<input type="text"  name="DefaultDate" id="defaultDate"  value="'+escapeHTML(nowDate())+'" defaultValue="'+escapeHTML(nowDate())+'" class="calendar defaultDate" >';
newdata +='            					</div>';
newdata +='            				</div>';
newdata +='            			</div>';
newdata += '					<div class="ui-grid-d ui-responsive" >';  //5 blocks
newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';	
newdata += '							Scout';
newdata +='            				</div>';

newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';	
newdata += '							Position';
newdata +='            				</div>';

newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
newdata += '							Start Date';
newdata +='            				</div>';
newdata += '						<div class="ui-block-d" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';	
newdata += '							End Date';
newdata +='            				</div>';

newdata += '						<div class="ui-block-e" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';	
newdata += '							';
newdata +='            				</div>';
//   a black  b blue c grey d white e yellow f green g red h (white no border? looks light grey w white/blk font) i blk (background with blk font) 


var style='';
for(var i=0;i<scoutPosList.length;i++){
  if(scoutPosList[i].name.match(/^ACCOUNT,/) == null) {
	
	newdata += '					<div class="ui-block-a" >';	
	newdata += '						<input readonly type="text" name="xID'+escapeHTML(scoutPosList[i].id)+'" id="xID'+escapeHTML(scoutPosList[i].id)+'" defaultValue="" value="'+escapeHTML(scoutPosList[i].name)+'" >'; 
	newdata +='            			</div>';	// end block a
	newdata += '					<div class="ui-block-b"  >';
	newdata +=  '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';  //padding:5px;
	newdata += '				        	<input type="button"  data-role="button" value="+ Add Position" data-theme="e" class="buttonAddPosition" id="buttonAddPosition'+escapeHTML(scoutPosList[i].id)+'"/>';	
	newdata += '					   </div >';
	newdata +='           			</div>';
	newdata += '					<div class="ui-block-c"  >';	
	newdata +='           			</div>';
	newdata += '					<div class="ui-block-d" >';	
	newdata +='           			</div>';
	newdata += '					<div class="ui-block-e" >';	
	newdata +='           			</div>';
	
	for(var j=0;j<scoutPosList[i].poslist.length;j++) {
	newdata += '					<div class="ui-block-a" >';	
	newdata += '						<div id="status'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" style="font-weight:bold; text-align:right; padding:10px;"></div>';								
	newdata +='           			</div>';		

	newdata += '					<div class="ui-block-b" >';	
	newdata += '						<input readonly type="text" class="lookupExistPos" name="posNameID'+escapeHTML(scoutPosList[i].id)+ '-'+j+ '" id="posNameID'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" defaultValue="" value="'+escapeHTML(scoutPosList[i].poslist[j].position)+'" data-posid="'+escapeHTML(scoutPosList[i].poslist[j].posid)+'">'; 
	newdata +='            			</div>';	// end block a		

	newdata += '					<div class="ui-block-c" >';	
	newdata += '						<input type="text" name="sdateID'+escapeHTML(scoutPosList[i].id)+ j+'" id="sdateID'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" defaultValue="'+escapeHTML(scoutPosList[i].poslist[j].startdate)+'" value="'+escapeHTML(scoutPosList[i].poslist[j].startdate)+'"  class="calendar" data-posid="'+escapeHTML(scoutPosList[i].poslist[j].posid)+'">'; //style="font-size: 12px; width: 70%;"
	newdata +='           			</div>';
	
	newdata += '					<div class="ui-block-d" >';	
	newdata += '						<input type="text" name="edateID'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" id="edateID'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" defaultValue="'+escapeHTML(scoutPosList[i].poslist[j].enddate)+'" value="'+escapeHTML(scoutPosList[i].poslist[j].enddate)+'"  class="calendar" data-posid="'+escapeHTML(scoutPosList[i].poslist[j].posid)+'">'; //style="font-size: 12px; width: 70%;"
	newdata +='           			</div>';
	newdata += '					<div class="ui-block-e" >';	
	newdata +=  '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" value="End Position" class="endToday" data-theme="c" id="buttonEndPosition'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" data-posid="'+escapeHTML(scoutPosList[i].poslist[j].posid)+'" />';	
	newdata += '					    </div >';
	newdata +=  '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" value="Delete Position" class="delPos" data-theme="g" id="buttonDeletePosition'+escapeHTML(scoutPosList[i].id)+ '-'+j+'" data-posid="'+escapeHTML(scoutPosList[i].poslist[j].posid)+'" />';	
	newdata += '					    </div >';	
	newdata +='           			</div>';
	
	}
	
	// create hidden elements
	var jk=0;
	for(k=0;k<3;k++) {
		jk=j+k;
		newdata += hiddenElement(scoutPosList[i].id +'-'+k,scoutPosList[i].id +'-'+jk,scoutPosList[i].denpatrol);
	}
	
  }
}
										
newdata += '					</div>';  // end of grid b


										
newdata += '		</fieldset>';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';
			
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a ui-responsive">';

newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';
						
			

			
newdata += '		</ul>';
newdata += '		</form>';

//var trainingIDLI='';
//                                                                                                max width 400px
newdata +=		'<div data-role="popup" id="setLeaderMenu" data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 600px;" data-overlay-theme="b">'; //data-theme="d" data-history="false"  data-dismissible="false"
newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >';  //class="ui-icon-alt"
newdata +=				'<li data-role="divider" data-theme="e">Select Position</li>';

newdata +=				'		<p class="normalText">Select the Leadership Position.</p>';
newdata +=				'		<ul data-role="listview" data-inset="true">';
newdata +=							leadershipLIs;
newdata +=				'		</ul>';
newdata +=				'<li><input type="button" value="Set Leadership" data-theme="g" id="buttonSetVal" ><input type="button" value="Cancel" data-theme="d" id="buttonSetCancel" ></li>';
newdata +=				'<li id="setValErrLI">';		
newdata +=				'</li>';			
newdata +=			'</ul>';
newdata += '		<input type="hidden" id="setPopID",value="">';
newdata +=		'</div>';


		
newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
newdata += '		<div id="errorPopupIcon"></div>';
newdata += '		<div id="errorPopupContent"></div>';
newdata += '		<div class="clearRight"></div>';

newdata += '	</div>';

newdata += '		<div id="footer" align="center">';

newdata += logoutWarningPageContent(tpageid);			
		newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';		
newdata += '	<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	
newdata += '		</div>';


return newdata;


}

function hiddenElement(kid,id,denpatrol) {
				var newdata='';

				newdata += '					<div class="ui-block-a hidden'+escapeHTML(kid)+'" style="display:none;">';	
				newdata +='           			</div>';		

				newdata += '					<div class="ui-block-b hidden'+escapeHTML(kid)+'"  style="display:none;">';	
				newdata += '						<input readonly type="text" name="posNameID'+escapeHTML(id)+'" class="lookupPos" id="posNameID'+escapeHTML(id)+'"   value="" placeholder="Select Position..." data-posid data-denpatrol="'+escapeHTML(denpatrol)+'" >'; 
				newdata +='            			</div>';		

				newdata += '					<div class="ui-block-c hidden'+escapeHTML(kid)+'"  style="display:none;">';	
				newdata += '						<input type="text" name="sdateID'+escapeHTML(id)+'" id="sdateID'+escapeHTML(id)+'" value=""  class="newpos calendar" data-posid>'; //style="font-size: 12px; width: 70%;"
				newdata +='           			</div>';
				
				newdata += '					<div class="ui-block-d hidden'+escapeHTML(kid)+'"  style="display:none;">';	
				newdata += '						<input type="text" name="edateID'+escapeHTML(id)+'" id="edateID'+escapeHTML(id)+'"  value=""  class="newpos calendar" data-posid>'; //style="font-size: 12px; width: 70%;"
				newdata +='           			</div>';
				newdata += '					<div class="ui-block-e hidden'+escapeHTML(kid)+'"  style="display:none;">';	
				newdata +=  '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
				newdata += '				        	<input type="button"  data-role="button" value="End Today" data-theme="c" class="endToday" id="buttonEndPosition'+escapeHTML(id)+'" data-posid />';	
				newdata += '					    </div >';
				newdata +=  '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
				newdata += '				        	<input type="button"  data-role="button" value="Delete Position" class="delPos" data-theme="g" id="buttonDeletePosition'+escapeHTML(id)+'" data-posid data-hiddenid="'+escapeHTML(kid)+'"/>';	
				newdata += '					    </div >';	
				newdata +='           			</div>';	
	
				return newdata;
}


function getLeadershipLIs(unitID,txtunit) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'],getLeadershipLIs,[unitID,txtunit]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			
			if(this.response.indexOf('<li data-role="fieldcontain" id="akelaUnitNumberLI">') == -1 ) {
				 $.mobile.loading('hide');
				//if(host != 'qa.') {
				//	alert('Sorry! An update to Scoutbook Membership and Positions pages has occurred.  This feature has been disabled until the developer can adjust the extension to the new methods');
				//	return false;
				//}
				
				leadershipLIs =getHTMLElement('<li data-role="fieldcontain" id="membershipsLI">','li',this.response);
				leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="positionIDLI">','li',this.response);
				leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="denLI" data-theme="d">','li',this.response);
				leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="denNumberLI" data-theme="d">','li',this.response);
				leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="patrolNameLI" data-theme="d">','li',this.response);
				leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="patrolIDLI" data-theme="d">','li',this.response);	
				getScoutPositionsFromRoster(unitID,txtunit);
				return;
				
			}
			leadershipLIs='<!--old-->\n';
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="councilIDLI">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="unitTypeIDLI">','li',this.response);	
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="unitNumberLI">','li',this.response);
			
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="akelaUnitNumberLI">','li',this.response);

			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="akelaUnitIDLI">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="positionIDLI">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="denLI" data-theme="d">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="denNumberLI" data-theme="d">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="patrolNameLI" data-theme="d">','li',this.response);
			leadershipLIs+=getHTMLElement('<li data-role="fieldcontain" id="patrolIDLI" data-theme="d">','li',this.response);
			
			

			//unitTypeID
			
			//now get the roster, build list of scouts and positions listed in roster.  From that, we go lo and slow through positions pages I think to build dates
			//On;y after we have all the data, then we change pages to show the form
			getScoutPositionsFromRoster(unitID,txtunit);
			return;
			

		}
	};
	if(scoutPermObjList.length==0) { 
		alert('You do not have permissions for any Scouts in this unit');
		return false;
	}
	
	var thisScoutID=scoutPermObjList[0].id; 
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?ScoutUserID=' + escapeHTML(thisScoutID) +'&UnitID='+escapeHTML(unitID);


	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'],getLeadershipLIs,[unitID,txtunit]);
	};		
	
}

function getMyUserMembership(id,unitID) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], getMyUserMembership,[id,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			
			var leadershipLIs =getHTMLElement('<li data-role="fieldcontain" id="membershipsLI">','li',this.response);
			//reset this
			
			$('#membershipsLI').replaceWith(leadershipLIs).trigger('create').hide();
			
			
			$('#setLeaderMenu').popup('open');
			$('#membershipsLI').hide();
		}
	};		
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?ScoutUserID=' + escapeHTML(id) +'&UnitID='+escapeHTML(unitID);	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], getMyUserMembership,[id,unitID]);
	};	
}


function getScoutPositionsFromRoster(unitID,txtunit) {
	scoutPosList=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], getScoutPositionsFromRoster,[unitID,txtunit]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var evObj={};
			
			var pos='';
			var poslist=[];
			$('li[data-scoutuserid]',this.response).each( function () {
				if($('img[src*="securityapproved32.png"]',this).length > 0) {
					pos='';
					evObj={name:'',id:'',denpatrol:'',posexist:false,checked:false,poslist:[]};	
					
					
					pos=$('.positions',this).text().trim();
					if(pos != '') {
						
						evObj.denpatrol=pos.match(/[^ ]+ Den .+|.+Patrol/);
						poslist=pos.split(',');
						for(var i=0;i<poslist.length;i++) {
							poslist[i] =poslist[i].trim();
						}
					
						if(evObj.denpatrol != null) {
							evObj.denpatrol=poslist.shift();
						} else {
							evObj.denpatrol='';
						}

						if(poslist.length != 0) {
							evObj.posexist=true;
						}

					}

					evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
					evObj.id=$(this).attr('data-scoutuserid');
					
					//Lions may not hold leadership positions
					if(evObj.denpatrol.match(/Lion Den/) == null) {
						scoutPosList.push(JSON.parse(JSON.stringify(evObj)));
					}
					//console.log(denpatrol,id,name,pos,poslist);
				}
			});
			
		
		
			iterateForLeaderDates(unitID,txtunit);
			
		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], getScoutPositionsFromRoster,[unitID,txtunit]);
	}	
	
}


//if posexist = true, this scout positions are loaded if the poslist isn't empty
function iterateForLeaderDates(unitID,txtunit) {

    var scoutid='';
	for(var i=0;i< scoutPosList.length;i++) {

		if(scoutPosList[i].checked==false && scoutPosList[i].posexist==true) {
					scoutid=scoutPosList[i].id;
					break;			
		}
	
	
	}
	if(scoutid=='') {
		// Set global to modify next page
		// call for next page
		youthLeaderQE=true;
		$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID),
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
		);		
		return;
	}

	// get the posisiotns page
	var pos='';
	var posid='';
	var unit='';
	var denpatrol='';
	var dates=[];
	var combopos='';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], iterateForLeaderDates,[unitID,txtunit]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			$('a[href*="UserPositionID"]',this.response).each( function () {
				pos='';
				posid='';
				if($(this).attr('href').match(/UserPositionID=(\d+)/) != null) {
					posid=$(this).attr('href').match(/UserPositionID=(\d+)/)[1];
				}
				unit='';
				dates=[];
				startdate='';
				enddate='';
				denpatrol='';
				if($(this).attr('href').match(/mobile/) == null) {
					
						for(var i=0;i< scoutPosList.length;i++) {
							if(scoutid==scoutPosList[i].id) {
								scoutPosList[i].checked=true;
								break;
							}
						}							
					
					pos=$('.noellipsis',this).text().trim();
					combopos=pos;
					unit=$('.orangeSmall',this).text().trim();
				
				
					
					//unit might have a subunit name in it.
					if(unit.match(/^(Troop \d|Pack \d|Crew \d)/) == null) {
						denpatrol=unit.match(/(.+)(Troop |Pack |Crew )/)[1].trim();
						combopos+=' ' +denpatrol;
					}					
					
					
					if(unit.match(txtunit) == null) {
						//console.log('filter on unit here.  Position is outside of unit, ignore it');
					} else {
						dates=$('div[style*="gray"]',this).text().match(/\w\w\w \d+, \d\d\d\d/g);
						startdate=dates[0];
						if(dates.length > 1) {
							enddate=dates[1];
						}
						
						if(enddate =='') {
							//Only list open positions for now.
							if($('img[src*="securityapproved32"]',this).length!=0) {
								for(var i=0;i< scoutPosList.length;i++) {
									if(scoutid==scoutPosList[i].id) {
										scoutPosList[i].poslist.push({position:combopos,posid:posid,startdate:dateC(startdate),enddate:dateC(enddate)});
										break;
									}
								}
							}
						}

						
					}					
					
				}
			});
			

			iterateForLeaderDates(unitID,txtunit);
			
		}
	};		

	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp?ScoutUserID='+escapeHTML(scoutid)+'&UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], iterateForLeaderDates,[unitID,txtunit]);
	}	
}

function dateC(datein) {
	if (datein=='') {
		return '';
	}
	
	var monA = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var pdate=datein.match(/(\w\w\w) (\d+), (\d+)/);
	for(var i=0;i<monA.length;i++) {
		if(monA[i]==pdate[1]) {
			break;
		}
	}	
	i+=1;
	return i+'/'+pdate[2]+'/'+pdate[3];	
}

function nowDate() {
var d= new Date(Date.now());
return d.getMonth()+1 +'/'+ d.getDate() + '/'+d.getFullYear();
}

function ylscript() {
	
	//<script type="text/javascript">
		//var formPost;
		var UnitID=X;

		function pageInit() {
			
			$('#buttonRefresh, #buttonRefresh1', '#PageX').click(function () {
				
				
				scoutPermObjList.length=0;
				schoolQE=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});				
			
			
			$('#councilID', '#PageX').change(function() {
				
				refreshBSAUnitDescriptionList();
				refreshPositionList('');
			});		


			$('#unitTypeID', '#PageX').change(function() {

				
				var unitType = $('#unitTypeID option:checked', '#PageX').val();

				if(unitType == '1' || unitType == '4') {
					$('#patrolNameLI', '#PageX').hide();
				} else if( unitType != '1') {
					$('#denLI', '#PageX').hide();
					$('#denNumberLI', '#PageX').hide();
				}
				refreshBSAUnitDescriptionList();
				refreshPositionList('');
			});

			$('#unitNumber, #councilID', '#PageX').change(function() {
				$('#positionID', '#PageX').trigger('change');
				refreshBSAUnitDescriptionList();
			});

			$('#akelaUnitID', '#PageX').change(function() {
			
				var unitNumber = $('option:selected', this).attr('data-unitnumber');
				if(unitNumber != 0 && unitNumber != '' && unitNumber != undefined) {
					$('#akelaUnitNumber', '#PageX').val(unitNumber);
					//$('#akelaUnitNumberLI', '#PageX').slideDown(200);
				} else {
					$('#akelaUnitNumber', '#PageX').val('');
					//$('#akelaUnitNumberLI', '#PageX').slideUp(200);
				}
				
				if($('option:selected', this).val() !='') {
						$('#positionIDLI').show();
						$('#patrolIDLI').show();
						if($('#positionID option:selected').val() != '') {
							$('#denLI').show();
							$('#denNumberLI').show();						
						}
					
				} else {
					
						$('#positionIDLI').hide();
						$('#patrolIDLI').hide();
						$('#denLI').hide();
						$('#denNumberLI').hide();			
				}
				
				
			});

			$('#positionID', '#PageX').change(function() {
				
				
				
				
				
				
				// show or hide the den info
				var positionID = $(this, '#PageX').val();
				var councilID = $('#councilID', '#PageX').val();
				var unitTypeID = $('#unitTypeID', '#PageX').val();
				var unitNumber = $('#unitNumber', '#PageX').val();
				var councilapproved = $('option:selected', '#councilID').attr('data-council-approved');

				if(councilapproved == 1 && positionID == '76') {
					showErrorPopup('Please contact the council service center if you would like to become a merit badge counselor.');
					$('#positionID', '#PageX').val('').selectmenu('refresh');
					return;
				}

				if(positionID != '76') {
					$('#meritBadgesLI, #availabilityLI, #listTypeLI, #listTypeUnitLI', '#PageX').hide();
					$('#patrolNameLI', '#PageX').show();
				}

				if(positionID == '84' || positionID == '79' || positionID == '80' || positionID == '82' || positionID == '83' || positionID == '104' || positionID == '105' || positionID == '85' || positionID == '151' || positionID == '207' || positionID == '208' ) {
					$('#patrolNameLI', '#PageX').hide();
					
					$('#denLI, #denIDLI', '#PageX').show();
					//if we know who the scout is  scoutPosList
					$('#denNumberLI', '#PageX').show();
					
					$(':radio[id^=den]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					$(':radio[id^=denID]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					if(positionID == '207' || positionID == '208') {
						$('input:radio[name=DenID]:not([data-dentype="Lion"])', '#PageX').checkboxradio('disable');
						$('#denLions', '#PageX').prop('checked', true).checkboxradio('refresh');
						$('#denTigerCubs, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '84' || positionID == '85') {
						$('input:radio[name=DenID]:not([data-dentype="Tiger"])', '#PageX').checkboxradio('disable');
						$('#denTigerCubs', '#PageX').prop('checked', true).checkboxradio('refresh');
						$('#denLions, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '79' || positionID == '80') {
						$('input:radio[name=DenID]:not([data-dentype=Wolf]):not([data-dentype=Bear])', '#PageX').checkboxradio('disable');
						$('#denLions, #denTigerCubs, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '82' || positionID == '83') {
						$('input:radio[name=DenID]:not([data-dentype=Webelos])', '#PageX').checkboxradio('disable');
						$('#denLions, #denTigerCubs, #denWolves, #denBears', '#PageX').checkboxradio('disable');
						$('#denWebelos', '#PageX').prop('checked', true).checkboxradio('refresh');
					}
				} 
				
				
					else if( unitTypeID == '2' || unitTypeID == '3') {
						$('#patrolNameLI', '#PageX').show();
					}
				
				
				else if(positionID == '95' || positionID == '1' || positionID == '2' || positionID == '152' || positionID == '86' || positionID == '87' || positionID == '159') {
					$('#patrolNameLI', '#PageX').show();
					$('#patrolIDLI', '#PageX').show();
				} 
				else {
					$('#denLI, #denIDLI, #patrolIDLI', '#PageX').hide();
					$('#denNumberLI', '#PageX').hide();
					$('#patrolNameLI', '#PageX').hide();
				}

				
				var txtunit=X;
				if(txtunit.match(/Troop/) != null ) {
						$('#patrolIDLI', '#PageX').show();
						$('#patrolNameLI', '#PageX').hide();					
				}
				
				/*
					// This Code Snippet looks unique to the page.  It shows on a Troop but not on Packages
					if(councilID == xxx && (unitTypeID == '2' || unitTypeID == '3') && unitNumber == 'yyy') {
						$('#patrolIDLI', '#PageX').show();
						$('#patrolNameLI', '#PageX').hide();
					} else if(unitTypeID == '2' || unitTypeID == '3') {
						$('#patrolIDLI', '#PageX').hide();
						$('#patrolNameLI', '#PageX').show();
					}
				*/


				if($('#setPopID').val().match(/(\d+)-/) != null) {
					var id=$('#setPopID').val().match(/(\d+)-/)[1];
					for(var i=0;i<scoutPosList.length;i++) {
						if(id==scoutPosList[i].id) {
							//set den info if empty
							
							if(scoutPosList[i].denpatrol.match(/(.+) Den/)!= null) {
								var denID='den'+ scoutPosList[i].denpatrol.match(/(.+) Den/)[1];
								var denNum=scoutPosList[i].denpatrol.match(/Den (.+)/)[1];
								if($('#denNumber').val()=='') {
									var chk=$('input[name="Den"]:checked').length;
									if(chk==0 ) {
										$('#denNumber').val(denNum);
										$('#'+denID).prop("checked",true).checkboxradio("refresh");
									}
								}
							}
							break;
						}
					}	
				}

				

			});

			
			$('.delPos').click( function () {
					//mark as delete , if this is a new line, just clear it all
				if($(this).attr('id').match(/\d+/)==null) return false;
				var id=$(this).attr('id').match(/\d+/)[0];
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
				
				//if this line is a new unsaved line, just clear it and hide it
				if($(this).attr('data-posid') =='') {
					$('#edateID'+lineID).val('');
					$('#sdateID'+lineID).val('');
					$('#posNameID'+lineID).val('');
					$('#posNameID'+lineID).removeAttr('data-denid');
					$('#posNameID'+lineID).removeAttr('data-patrolid');
					$('#posNameID'+lineID).removeAttr('data-dennumber');
					$('#posNameID'+lineID).removeAttr('data-positionid');
					if($(this).attr('data-hiddenid').match(/\d+-\d+/)==null) return false;
					var plineID=$(this).attr('data-hiddenid').match(/\d+-\d+/)[0];
					$('.hidden'+plineID).hide();
				} else {
					if($(this).attr('data-delete') == undefined) {
						$(this).attr('data-delete','delete');
						$('#status'+lineID).text('Delete Pending Update...');
						$(this).val('Undelete').button('refresh');
					} else {
						$(this).removeAttr('data-delete');
						$('#status'+lineID).text('');
						$(this).val('Delete Position').button('refresh');
					}
				}
				return false;
			});			

			$('.endToday').click( function () {
				if($(this).attr('id').match(/\d+/)==null) return false;
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;
				
				var id=$(this).attr('id').match(/\d+/)[0];
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
				$('#edateID'+lineID).val($('#defaultDate').val());
				return false;
			});					
			
			$('.lookupPos').click( function () {
				
				if($(this).attr('id').match(/\d+/)==null) return false;
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;
				
				var id=$(this).attr('id').match(/\d+/)[0];
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
					//Clear Position Data first
				
					
					// why disable if hidden
					//$('#councilID').attr('disabled',true);
					//$('#unitTypeID').attr('disabled',true);
					//$('#unitNumber').attr('readonly',true);
					
					$('#councilIDLI').hide();
					$('#unitTypeIDLI').hide();
					$('#unitNumberLI').hide();					
					
					//hide help - popups don't work inside a popup
					$('#akelaUnitIDHelpButton').hide();
					$('#positionIDHelpButton').hide();					
					$('#denNumberHelpButton').hide();						
					
					
					//$('#positionID
					$('#positionID').get(0).selectedIndex = 0;
					$('#positionID').selectmenu('refresh', true);
					
					
					$('input[name="PatrolID"]').removeAttr('checked').checkboxradio('refresh');
					$('input[name="Den"]').removeAttr('checked').checkboxradio('refresh');
					$('#denNumber').val('');

					//check data to see if anything was set before, so it can be preset
					//start with the position itself
					if($('#posNameID'+lineID).attr('data-positionid') != '') {
						var posID=$('#posNameID'+lineID).attr('data-positionid');
						if(posID != undefined) {
							$('#positionID').val(posID).selectmenu('refresh', true);
						}
					}
					//next, the den
					if($('#posNameID'+lineID).attr('data-denid') != '') {
						var denID=$('#posNameID'+lineID).attr('data-denid');
						if(denID !=undefined) {
							$('#'+denID).prop("checked",true).checkboxradio("refresh");
						}
					}

					if($('#posNameID'+lineID).attr('data-unitnumber') != '') {
						var unitNum=$('#posNameID'+lineID).attr('data-unitnumber');
						if(unitNum != undefined) {
							$('#unitNumber').val(unitNum);
						}
					}

					
					//next the den number
					if($('#posNameID'+lineID).attr('data-dennumber') != '') {
						var denNum=$('#posNameID'+lineID).attr('data-dennumber');
						if(denNum != undefined) {
							$('#denNumber').val(denNum);
						}
					}
					
					//try the patrol
					if($('#posNameID'+lineID).attr('data-patrolid') != '') {
						var patrolID=$('#posNameID'+lineID).attr('data-patrolid');
						if(patrolID != undefined) {
							$('#'+patrolID).prop("checked",true).checkboxradio("refresh");	
						}						
					}
					
					//finally, akelaid
					if($('#posNameID'+lineID).attr('data-akelaid') != '') {
						var akelaUnitID=$('#posNameID'+lineID).attr('data-akelaid');
						if(akelaUnitID != undefined && akelaUnitID != '') {
							$('#akelaUnitID').val(akelaUnitID).selectmenu('refresh', true);
						}													
					}
						
					if($('#posNameID'+lineID).attr('data-akelaunitnumber') != '') {
						var akelaUnitNumber=$('#posNameID'+lineID).attr('data-akelaunitnumber');
						if(akelaUnitNumber != undefined && akelaUnitNumber != '') {
							$('#akelaUnitNumber').val(akelaUnitNumber);
						}													
					}

					if($('#posNameID'+lineID).attr('data-unittypeid') != '') {
						var unitTypeID=$('#posNameID'+lineID).attr('data-unittypeid');
						if(unitTypeID != undefined) {
							$('#unitTypeID').val(unitTypeID).selectmenu('refresh', true);	
						}						
					}
					

					$('#patrolIDLI').hide();
					//$('#patrolNameLI', '#PageX').hide();
					$('#denLI, #denIDLI', '#PageX').hide();
					$('#denNumberLI', '#PageX').hide();	
							
						
					//if akela is selected, allow position to show, otherwise hide
					if($('#akelaUnitID option:selected').val() =='') {
						$('#positionIDLI').hide();
					} else {
						$('#positionIDLI').show();
						
						//if position is selected, show subpos as needed

						if($('#positionID option:selected').val() == '104' || $('#positionID option:selected').val()=='105') {
							$('#patrolIDLI').hide();
							//$('#patrolNameLI', '#PageX').hide();
							
							$('#denLI, #denIDLI', '#PageX').show();
							$('#denNumberLI', '#PageX').show();							
						} else if ($('#positionID option:selected').val() != '') {
							$('#patrolIDLI').show();
							//$('#patrolNameLI', '#PageX').hide();
							
							$('#denLI, #denIDLI', '#PageX').hide();
							$('#denNumberLI', '#PageX').hide();								
							
						} else {
							
							
						}						
					
					}					
					

					
					$('#setPopID').val(lineID);
					$('#setLeaderMenu').popup('open');

				
				
			});

		
			
			
			$('.buttonAddPosition').click(function () {

				// add row of data
				if($(this).attr('id').match(/\d+/)==null) return false;
				var id=$(this).attr('id').match(/\d+/)[0];
				var hid;
				
				for(j=0;j<3;j++) {
					if($('.hidden'+id+'-'+j).css('display')=='none') {
						$('.hidden'+id+'-'+j).show();
						//get the id of the hidden object
						hid=$('.hidden'+id+'-'+j);
						//set the start date to now

						$('input[name*="sdateID"]',hid).val($('#defaultDate').val());
						break;
					}
				}
			
				return false;
			});
			

			$('#dateEnded', '#PageX').change(function() {
				if($(this).val() != '') {
					$('#agreeLI', '#PageX').slideUp();
				} else {
					$('#agreeLI', '#PageX').slideDown();
				}
			});


			$('#buttonSetCancel', '#PageX').click(function () {
				
				$('#setLeaderMenu').popup('close');
				return false;
			});

			$('#buttonSetVal', '#PageX').click(function () {
			
				var lineID=$('#setPopID').val();
				
				//if akelaUnitID is not set, clear everything
				var akelaUnitID=$('#akelaUnitID option:selected').val();
				var akelaUnitNumber=$('#akelaUnitNumber').val();
				
				if(akelaUnitID == undefined || akelaUnitID=='') {
					$('#posNameID'+lineID).removeAttr('data-positionid');		
					$('#posNameID'+lineID).removeAttr('data-dennumber');
					$('#posNameID'+lineID).removeAttr('data-unitnumber');
					$('#posNameID'+lineID).removeAttr('data-denid');
					$('#posNameID'+lineID).removeAttr('data-patrolid');
					$('#posNameID'+lineID).removeAttr('data-akelaid');
					$('#posNameID'+lineID).removeAttr('data-akelaunitnumber');	
					$('#posNameID'+lineID).removeAttr('data-unittypeid');

					return false;
				}
				
				var posOpt=$('#positionID option:selected').val();
				var posTxt=$('#positionID option:selected').text().trim();
				
				//den or patrol
				var denID=$('input[name="Den"]:checked').attr('id');		//could be undefined if none selected
				var denVal=$('input[name="Den"]:checked').val();		//could be undefined if none selected
				var denNm=$('label[for="'+denID+'"]').text().trim();
				var denNum=$('#denNumber').val();
				var unitNum=$('#unitNumber').val();					
				var patrolID=$('input[name="PatrolID"]:checked').attr('id');		//could be undefined if none selected
				var patrolNm=$('label[for="'+patrolID+'"]').text().trim();

				var unitTypeID=$('#unitTypeID option:selected').val();
			
				var councilID=$('#councilID', '#PageX').val();
				//var userMembershipID= $(':radio[name=UserMembershipID]:checked', '#PageX').val()
				if(posOpt == '') {
					//nothing selected
				}

				
				
				$('#setLeaderMenu').popup('close');
				
				if(patrolID==undefined) patrolID='';
				if(denID==undefined) denID='';
				
				//set data attributes for the current line	
				$('#posNameID'+lineID).attr('data-councilid',councilID);
				$('#posNameID'+lineID).attr('data-positionid',posOpt);		
				$('#posNameID'+lineID).attr('data-dennumber',denNum);
				$('#posNameID'+lineID).attr('data-unitnumber',unitNum);
				$('#posNameID'+lineID).attr('data-denid',denID);
				$('#posNameID'+lineID).attr('data-denval',denVal);
				$('#posNameID'+lineID).attr('data-patrolid',patrolID);
				$('#posNameID'+lineID).attr('data-akelaid',akelaUnitID);
				$('#posNameID'+lineID).attr('data-akelaunitnumber',akelaUnitNumber);
				$('#posNameID'+lineID).attr('data-unittypeid',unitTypeID);

				
				//set the visual text field
				if(posOpt=='104' ||posOpt=='105') {
					//Den or Denner
					if(denID == undefined) {
						$('#posNameID'+lineID).val(posTxt);
					} else {
						if(denNum != '' &&  denNm != '') {
							$('#posNameID'+lineID).val(posTxt + ' '+ denNm + ' Den ('+denNum+')');
						} else {
							$('#posNameID'+lineID).val(posTxt);
						}
					}
				} else {
					if(patrolNm == '') {
						$('#posNameID'+lineID).val(posTxt);
					} else {
						$('#posNameID'+lineID).val(posTxt + ' ' + patrolNm + ' Patrol');
					}
				}
				
				return false;
			});			
			
			$('#buttonSubmit', '#PageX').click(function () {
				
				
				
				

				extSubmit(UnitID);
				
				
				
				
				return false;
			});
			$('#buttonCancel', '#PageX').click(function () {
				$.mobile.changePage(
						'/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID,
					{
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: true,
						reloadPage: true
					}
				);		
				return false;				
			});			
				refreshPositionList('');
			
		}

		function pageShow() {
		
			
			$('.calendar', '#PageX').each(function() {
				var id = $(this).attr('id');
				$(this).width('75%').before('<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
				$($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + id + '" value="' + $(this).val() + '" />');
			});

			$('input[id^=hidden_]:hidden', '#PageX').mobiscroll().calendar({
				theme: 'scoutbook',
				buttons: ['set', 'clear', 'cancel'],
				mode: 'scroller',
				display: 'bottom',
				controls: ['calendar', 'date'],
				closeOnSelect: true,
				rows: 7,
				onClose: function(valueText) {
					var id = $(this).attr('id');
					id = id.replace('hidden_', '');
					$('#' + id).val(valueText).trigger('change');
				}
			});
					
			$('.calendarIcon', '#PageX').on('click', function() {
				var id = $(this).next('input').attr('id');
				$('#hidden_' + id).mobiscroll('show');
			});
			
			refreshDistrictList();
			

			$('#dateEnded', '#PageX').trigger('change');
			refreshBSAUnitDescriptionList();

			
		}
		function deletePosition() {
			alert('delete');

		}

		function refreshBSAUnitDescriptionList() {
			var councilID			= $('#councilID', '#PageX').val();	
			var unitTypeID			= $('#unitTypeID', '#PageX').val();
			var unitNumber			= $('#unitNumber', '#PageX').val();

			if(councilID !=- '' && unitTypeID != '' && unitNumber != '') {
				$('#akelaUnitIDLI', '#PageX').slideDown(200);
				$('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
				$('#akelaUnitID', '#PageX').load('/mobile/includes/ajax.asp?Action=GetBSAUnitDescription&CouncilID=' + councilID + '&UnitTypeID=' + unitTypeID + '&UnitNumber=' + unitNumber, function() {
					$(this).selectmenu('refresh');	
				});
			} else {
				$('#akelaUnitIDLI', '#PageX').slideUp(200);
				$('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
			}
		}

		function refreshPositionList(selectedPositionID) {
			var councilID = $('#councilID', '#PageX').val();

			// display position list
			
				var unitTypeID = $('#unitTypeID', '#PageX').val();
			
			
			if(unitTypeID != '') {
				// clear position list first
				
					$('#positionID', '#PageX').html('<option value=""></option>');
				

				// populate position list 
				$.getJSON('/includes/ajax.asp?Action=GetPositionList&CouncilID=' + councilID + '&AdultPosition=0&UnitTypeID=' + unitTypeID + '&AdultUserID=&UnitID=X', function(data) {
					var select = $('#positionID', '#PageX'); 
					$.each(data, function(key, val){ 
						$('<option/>').attr('value', val.positionID) 
							.html(val.position) 
							.appendTo(select); 
					}); 

					// if no results then put in a phrase
					if($('#positionID option', '#PageX').size() == 1) {
						$('<option/>').attr('value', '').html('please select a unit type first').appendTo(select)
					}

					if(selectedPositionID != '') {
						$('#positionID', '#PageX').val(selectedPositionID);
					}
					// refresh the menu
					$('#positionID', '#PageX').selectmenu('refresh');
				});
			}
			$('#positionID', '#PageX').trigger('change');
		}

		function refreshDistrictList(selectedDistrictID) {
			// lookup districts based on council
			
				var councilID = $('#councilID option:selected', '#PageX').val();
			

			if(councilID != '') {
				// clear district list first
				$('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').html('');

				// populate district list 
				$.getJSON('/includes/ajax.asp?Action=GetDistrictList&CouncilID=' + councilID, function(data) {
					$.each(data, function(key, val){ 
						var checkbox = '<input type="checkbox" name="DistrictID" data-theme="d" id="districtID' + val.districtID + '" value="' + val.districtID + '" />';
						checkbox += '<label for="districtID' + val.districtID + '">' + val.districtName + '</label>';

						// insert
						$('#listTypeDistrictLI div.ui-controlgroup-controls').append(checkbox);

					}); 
					// if no results then disable District option and check council by default
					if($('input:checkbox[name=DistrictID]', '#PageX').length == 0) {
						$('#listTypeCouncil').prop('checked', true).checkboxradio('refresh');
						$('#listTypeDistrict').prop('checked', false).checkboxradio('refresh').checkboxradio('disable');
						$(':radio[name=ListType]', '#PageX').trigger('change');
					} else {
						$('#listTypeDistrict').checkboxradio('enable');	
					}

					// enhance
					$('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').trigger('create');
					// add rounded corners
					$('label:first', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-first-child');
					$('label:last', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-last-child');
				});
			}
		}

	//</script>
}


function y2script() {

		var UnitID=X;
		var gLineID;
		//  2/12 18

		function pageInit() {  
			
			$('#buttonRefresh, #buttonRefresh1', '#PageX').click(function () {
				
				
				scoutPermObjList.length=0;
				schoolQE=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});	

			$('#unitNumber, #councilID', '#PageX').change(function() {
				$('#positionID', '#PageX').trigger('change');
				refreshBSAUnitDescriptionList();
			});

			$('#akelaUnitID', '#PageX').change(function() {
				var unitNumber = $('option:selected', this).attr('data-unitnumber');
				if(unitNumber != 0 && unitNumber != '' && unitNumber != undefined) {
					$('#akelaUnitNumber', '#PageX').val(unitNumber);
					$('#akelaUnitNumberLI', '#PageX').slideDown(200);
				} else {
					$('#akelaUnitNumber', '#PageX').val('');
					$('#akelaUnitNumberLI', '#PageX').slideUp(200);
				}
			});			
			
			
			
			
			//JAL, 012918: show the Patrol radio buttons
			$('#patrolIDLI', '#PageX').show();		

			$('#positionID', '#PageX').change(function() {
			
				var denpatrol;
				if($('#posNameID'+gLineID).attr('data-patrolid') != '') {
						denpatrol=$('#posNameID'+gLineID).attr('data-denpatrol');
	
				}
							
							
							
				// show or hide the den info
				var positionID = $(this, '#PageX').val();
				var councilID = $('#councilID', '#PageX').val();
				
				//JAL, 020118: get the unitTypeID
				if ($(':radio[name=UserMembershipID]', '#PageX').is(':checked')) {
					var unitTypeID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-unittypeid');
				} else {
					var unitTypeID = $('#unitTypeID', '#PageX').val();
				}
				
				var unitNumber = $('#unitNumber', '#PageX').val();
				var councilapproved = $('option:selected', '#councilID').attr('data-council-approved');

					//JAL, 013018: enable all patrol radio buttons
					$(':radio[id^=patrolID]', '#PageX').each(function () {
						$(this).checkboxradio('enable');
					});
					
					
						//JAL, 013018: if a position ID has been selected, manage the patrol radio buttons
					if (positionID != '') {

							//JAL, 013018: determine if the assigned patrol is listed  NOT USED
							
							/*
							$(':radio[id ^= patrolID]').each(function() {
								// GF  021218 base on data attr name
								//if($(this).val() == patrolID) {
								var id=$(this).attr('id');
								if (denpatrol == '') {
									assignedPatrolListed = false;
								} else {
									if( denpatrol.indexOf($('label[for="'+id+'"]').text().trim()) == 0) {
										assignedPatrolListed = true;
									}	
								}								
							});
							*/
							
							//JAL, 013018: if Patrol Leader or Assistant Patrol Leader is selected
							if(positionID == '5' || positionID == '6') {
								
								if(denpatrol=='') {
									alert('Scout is not in a Patrol, this position is not available');
									$(this).val('').selectmenu('refresh'); 
									$('#patrolIDLI', '#PageX').hide();
									return false;			
								}
								
								$(':radio[id^=patrolID]', '#PageX').each(function() {
									// GF  021218 base on data attr name
									//if($(this).val() == xxxxx) {
									var id=$(this).attr('id');
									if( denpatrol.indexOf($('label[for="'+id+'"]').text().trim()) == 0) {
										$(this).prop('checked', true).checkboxradio('refresh');
									}
									
									else {
										$(this).prop('checked', false).checkboxradio('refresh');
										$(this).checkboxradio('disable');
									}
								});
							} 
							//JAL, 013018: if Quartermaster or Scribe is selected
							else if(positionID == '9' || positionID == '15') {
								$(':radio[id^=patrolID]', '#PageX').each(function() {
									// GF  021218 base on data attr name
									//if ($(this).val() != patrolID && $(this).val() != '') {
									var id=$(this).attr('id');
									if( denpatrol.indexOf($('label[for="'+id+'"]').text().trim()) ==-1  && $(this).val() != '') {										
										
										$(this).prop('checked', false).checkboxradio('refresh');
										$(this).checkboxradio('disable');
									}
								});
							}
							//JAL, 013118: if Troop Guide is selected
							else if(positionID == '8') {
								$(':radio[id^=patrolID]', '#PageX').each(function () {
									$(this).checkboxradio('enable');
								});
							}
							//JAL, 013118: if some other position is selected
							else if(positionID != '5' && positionID != '6' && positionID != '9' && positionID != '15' && positionID != '8') {
								$(':radio[id^=patrolID]', '#PageX').each(function () {
									if ($(this).val() == '') {
										$(this).prop('checked', true).checkboxradio('refresh');
									}
									else {
										$(this).prop('checked', false).checkboxradio('refresh');
										$(this).checkboxradio('disable');
									}
								});
							}
						

						//JAL, 013118: if Troop Guide is selected
						if(positionID == '8') {
							$(':radio[id^=patrolID]', '#PageX').each(function () {
								$(this).checkboxradio('enable');
							});
						}
						//JAL, 013118: if some other position is selected
						else if(positionID != '5' && positionID != '6' && positionID != '9' && positionID != '15' && positionID != '8') {
							$(':radio[id^=patrolID]', '#PageX').each(function () {
								if ($(this).val() == '') {
									$(this).prop('checked', true).checkboxradio('refresh');
								}
								else {
									$(this).prop('checked', false).checkboxradio('refresh');
									$(this).checkboxradio('disable');
								}
							});
						}
					} else {
						//no positionid
						$('#patrolIDLI', '#PageX').hide();

					}					
					

				if(positionID == '84' || positionID == '79' || positionID == '80' || positionID == '82' || positionID == '83' || positionID == '104' || positionID == '105' || positionID == '85' || positionID == '151' || positionID == '207' || positionID == '208' ) {
					$('#patrolNameLI', '#PageX').hide();
					

					//JAL, 020118: Do not show the radio buttons for Cub Scouts
					if (unitTypeID != '1') {
						$('#denLI, #denIDLI', '#PageX').show();
					}
					
					//if we know who the scout is  scoutPosList
					$('#denNumberLI', '#PageX').show();
					
					$(':radio[id^=den]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					$(':radio[id^=denID]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					if(positionID == '207' || positionID == '208') {
						$('input:radio[name=DenID]:not([data-dentype="Lion"])', '#PageX').checkboxradio('disable');
						$('#denLions', '#PageX').prop('checked', true).checkboxradio('refresh');
						$('#denTigerCubs, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '84' || positionID == '85') {
						$('input:radio[name=DenID]:not([data-dentype="Tiger"])', '#PageX').checkboxradio('disable');
						$('#denTigerCubs', '#PageX').prop('checked', true).checkboxradio('refresh');
						$('#denLions, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '79' || positionID == '80') {
						$('input:radio[name=DenID]:not([data-dentype=Wolf]):not([data-dentype=Bear])', '#PageX').checkboxradio('disable');
						$('#denLions, #denTigerCubs, #denWebelos', '#PageX').checkboxradio('disable');
					} else if(positionID == '82' || positionID == '83') {
						$('input:radio[name=DenID]:not([data-dentype=Webelos])', '#PageX').checkboxradio('disable');
						$('#denLions, #denTigerCubs, #denWolves, #denBears', '#PageX').checkboxradio('disable');
						$('#denWebelos', '#PageX').prop('checked', true).checkboxradio('refresh');
					}
				} 
				
				
					else if( unitTypeID == '2' || unitTypeID == '3') {
					//	$('#patrolNameLI', '#PageX').show();
					}
				
				
				else if(positionID == '95' || positionID == '1' || positionID == '2' || positionID == '152' || positionID == '86' || positionID == '87' || positionID == '159') {
					//$('#patrolNameLI', '#PageX').show();
					$('#patrolIDLI', '#PageX').show();
				} 
				else {
					$('#denLI, #denIDLI, #patrolIDLI', '#PageX').hide();
					$('#denNumberLI', '#PageX').hide();
					//$('#patrolNameLI', '#PageX').hide();
				}

				
				var txtunit=X;
				if(positionID != '') {
					if(txtunit.match(/Troop/) != null ) {
							$('#patrolIDLI', '#PageX').show();
							//$('#patrolNameLI', '#PageX').hide();					
					}
				}


				if($('#setPopID').val().match(/(\d+)-/) != null) {
					var id=$('#setPopID').val().match(/(\d+)-/)[1];
					for(var i=0;i<scoutPosList.length;i++) {
						if(id==scoutPosList[i].id) {
							//set den info if empty
							
							if(scoutPosList[i].denpatrol.match(/(.+) Den/)!= null) {
								var denID='den'+ scoutPosList[i].denpatrol.match(/(.+) Den/)[1];
								var denNum=scoutPosList[i].denpatrol.match(/Den (.+)/)[1];
								if($('#denNumber').val()=='') {
									var chk=$('input[name="Den"]:checked').length;
									if(chk==0 ) {
										$('#denNumber').val(denNum);
										$('#'+denID).prop("checked",true).checkboxradio("refresh");
									}
								}
							}
							break;
						}
					}	
				}

				

			});


			
			$('.delPos').click( function () {
					//mark as delete , if this is a new line, just clear it all
				if($(this).attr('id').match(/\d+/)==null) return false;
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;
				var id=$(this).attr('id').match(/\d+/)[0];
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
				
				//if this line is a new unsaved line, just clear it and hide it
				if($(this).attr('data-posid') =='') {
					$('#edateID'+lineID).val('');
					$('#sdateID'+lineID).val('');
					$('#posNameID'+lineID).val('');
					$('#posNameID'+lineID).removeAttr('data-denid');
					$('#posNameID'+lineID).removeAttr('data-patrolid');
					$('#posNameID'+lineID).removeAttr('data-dennumber');
					$('#posNameID'+lineID).removeAttr('data-positionid');


					if($(this).attr('data-hiddenid').match(/\d+-\d+/)==null) return false;
					
					
					var plineID=$(this).attr('data-hiddenid').match(/\d+-\d+/)[0];
					$('.hidden'+plineID).hide();
				} else {
					if($(this).attr('data-delete') == undefined) {
						$(this).attr('data-delete','delete');
						$('#status'+lineID).text('Delete Pending Update...');
						$(this).val('Undelete').button('refresh');
					} else {
						$(this).removeAttr('data-delete');
						$('#status'+lineID).text('');
						$(this).val('Delete Position').button('refresh');
					}
				}
				return false;
			});			

			$('.endToday').click( function () {
				if($(this).attr('id').match(/\d+/)==null) return false;
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;	
					
				var id=$(this).attr('id').match(/\d+/)[0];
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
				$('#edateID'+lineID).val($('#defaultDate').val());
				return false;
			});					
			
			$('.lookupPos').click( function () {
				
				if($(this).attr('id').match(/\d+/)==null) return false;
				if($(this).attr('id').match(/\d+-\d+/)==null) return false;	
				
				var id=$(this).attr('id').match(/\d+/)[0];				
				var lineID=$(this).attr('id').match(/\d+-\d+/)[0];
				gLineID=lineID;
							
				
				
				
				
					//Clear Position Data first

					//refreshPositionList();	//  2/12/18				
					
					// why disable if hidden
					//$('#councilID').attr('disabled',true);
					//$('#unitTypeID').attr('disabled',true);
					//$('#unitNumber').attr('readonly',true);
					
					$('#councilIDLI').hide();
					$('#unitTypeIDLI').hide();
					$('#unitNumberLI').hide();					
					
					//hide help - popups don't work inside a popup
					$('#akelaUnitIDHelpButton').hide();
					$('#positionIDHelpButton').hide();					
					$('#denNumberHelpButton').hide();						
					
					
					//$('#positionID
					$('#positionID').get(0).selectedIndex = 0;
					$('#positionID').selectmenu('refresh', true);
					
					
					$('input[name="PatrolID"]').removeAttr('checked').checkboxradio('refresh');
					$('input[name="Den"]').removeAttr('checked').checkboxradio('refresh');
					$('#denNumber').val('');

					//check data to see if anything was set before, so it can be preset
					//start with the position itself
					if($('#posNameID'+lineID).attr('data-positionid') != '') {
						var posID=$('#posNameID'+lineID).attr('data-positionid');
						if(posID != undefined) {
							$('#positionID').val(posID).selectmenu('refresh', true);
						}
					}
					//next, the den
					if($('#posNameID'+lineID).attr('data-denid') != '') {
						var denID=$('#posNameID'+lineID).attr('data-denid');
						if(denID !=undefined) {
							$('#'+denID).prop("checked",true).checkboxradio("refresh");
						}
					}

					if($('#posNameID'+lineID).attr('data-unitnumber') != '') {
						var unitNum=$('#posNameID'+lineID).attr('data-unitnumber');
						if(unitNum != undefined) {
							$('#unitNumber').val(unitNum);
						}
					}

					
					//next the den number
					if($('#posNameID'+lineID).attr('data-dennumber') != '') {
						var denNum=$('#posNameID'+lineID).attr('data-dennumber');
						if(denNum != undefined) {
							$('#denNumber').val(denNum);
						}
					}
					
					//try the patrol
					if($('#posNameID'+lineID).attr('data-patrolid') != '') {
						var patrolID=$('#posNameID'+lineID).attr('data-patrolid');
						if(patrolID != undefined) {
							$('#'+patrolID).prop("checked",true).checkboxradio("refresh");	
						}						
					}
					
					//finally, akelaid
					if($('#posNameID'+lineID).attr('data-akelaid') != '') {
						var akelaUnitID=$('#posNameID'+lineID).attr('data-akelaid');
						if(akelaUnitID != undefined && akelaUnitID != '') {
							$('#akelaUnitID').val(akelaUnitID).selectmenu('refresh', true);
						}													
					}
						
					if($('#posNameID'+lineID).attr('data-akelaunitnumber') != '') {
						var akelaUnitNumber=$('#posNameID'+lineID).attr('data-akelaunitnumber');
						if(akelaUnitNumber != undefined && akelaUnitNumber != '') {
							$('#akelaUnitNumber').val(akelaUnitNumber);
						}													
					}

					if($('#posNameID'+lineID).attr('data-unittypeid') != '') {
						var unitTypeID=$('#posNameID'+lineID).attr('data-unittypeid');
						if(unitTypeID != undefined) {
							$('#unitTypeID').val(unitTypeID).selectmenu('refresh', true);	
						}						
					}
					

					$('#patrolIDLI').hide();
					$('#patrolNameLI', '#PageX').hide();
					$('#denLI, #denIDLI', '#PageX').hide();
					$('#denNumberLI', '#PageX').hide();	
							
						
					//if akela is selected, allow position to show, otherwise hide
					if($('#akelaUnitID option:selected').val() =='') {
						$('#positionIDLI').hide();
					} else {
						$('#positionIDLI').show();
						
						//if position is selected, show subpos as needed

						if($('#positionID option:selected').val() == '104' || $('#positionID option:selected').val()=='105') {
							$('#patrolIDLI').hide();
							//$('#patrolNameLI', '#PageX').hide();
							
							$('#denLI, #denIDLI', '#PageX').show();
							$('#denNumberLI', '#PageX').show();							
						} else if ($('#positionID option:selected').val() != '') {
							$('#patrolIDLI').show();
							//$('#patrolNameLI', '#PageX').hide();
							
							$('#denLI, #denIDLI', '#PageX').hide();
							$('#denNumberLI', '#PageX').hide();								
							
						} else {
							
							
						}						
					
					}					
					
					
					
					
					$('#setPopID').val(lineID);
					
					//Need to get new usermembershipid for this scout.
					//ajax
					getMyUserMembership(id,UnitID);
					//$('#setLeaderMenu').popup('open');

				
				
			});

		
			
			
			$('.buttonAddPosition').click(function () {

				// add row of data
				if($(this).attr('id').match(/\d+/)==null) return false;

				var id=$(this).attr('id').match(/\d+/)[0];
				var hid;
				
				for(j=0;j<3;j++) {
					if($('.hidden'+id+'-'+j).css('display')=='none') {
						$('.hidden'+id+'-'+j).show();
						//get the id of the hidden object
						hid=$('.hidden'+id+'-'+j);
						//set the start date to now

						$('input[name*="sdateID"]',hid).val($('#defaultDate').val());
						break;
					}
				}
			
				return false;
			});
			


			$('#buttonSetCancel', '#PageX').click(function () {
				
				$('#setLeaderMenu').popup('close');
				return false;
			});

			$('#buttonSetVal', '#PageX').click(function () {
		
				var lineID=$('#setPopID').val();
				

				//if akelaUnitID is not set, clear everything
				var akelaUnitID=$('#akelaUnitID option:selected').val();
				var akelaUnitNumber=$('#akelaUnitNumber').val();
				

				
				var posOpt=$('#positionID option:selected').val();
				var posTxt=$('#positionID option:selected').text().trim();
				
				//den or patrol
				var denID=$('input[name="Den"]:checked').attr('id');		//could be undefined if none selected
				var denVal=$('input[name="Den"]:checked').val();		//could be undefined if none selected
				var denNm=$('label[for="'+denID+'"]').text().trim();
				var denNum=$('#denNumber').val();
				var unitNum=$('#unitNumber').val();					
				var patrolID=$('input[name="PatrolID"]:checked').attr('id');		//could be undefined if none selected
				var patrolNm=$('label[for="'+patrolID+'"]').text().trim();

				var unitTypeID=$('#unitTypeID option:selected').val();
			
				var councilID=$('#councilID', '#PageX').val();
				var userMembershipID= $(':radio[name=UserMembershipID]:checked', '#PageX').val();
			
				if(posOpt == '') {
					//nothing selected
				}
			
				
				$('#setLeaderMenu').popup('close');
				
				if(patrolID==undefined) patrolID='';
				if(denID==undefined) denID='';
				
				//set data attributes for the current line	
				$('#posNameID'+lineID).attr('data-councilid',councilID);
				$('#posNameID'+lineID).attr('data-positionid',posOpt);		
				$('#posNameID'+lineID).attr('data-dennumber',denNum);
				$('#posNameID'+lineID).attr('data-unitnumber',unitNum);
				$('#posNameID'+lineID).attr('data-denid',denID);
				$('#posNameID'+lineID).attr('data-denval',denVal);
				$('#posNameID'+lineID).attr('data-patrolid',patrolID);
				$('#posNameID'+lineID).attr('data-akelaid',akelaUnitID);
				$('#posNameID'+lineID).attr('data-akelaunitnumber',akelaUnitNumber);
				$('#posNameID'+lineID).attr('data-unittypeid',unitTypeID);
				$('#posNameID'+lineID).attr('data-usermembershipid',userMembershipID);
				
				//set the visual text field
				if(posOpt=='104' ||posOpt=='105') {
					//Den or Denner
					if(denID == undefined) {
						$('#posNameID'+lineID).val(posTxt);
					} else {
						if(denNum != '' &&  denNm != '') {
							$('#posNameID'+lineID).val(posTxt + ' '+ denNm + ' Den ('+denNum+')');
						} else {
							$('#posNameID'+lineID).val(posTxt);
						}
					}
				} else {
					if(patrolNm == ''  || patrolNm=='N/A') {
						$('#posNameID'+lineID).val(posTxt);
					} else {
						$('#posNameID'+lineID).val(posTxt + ' ' + patrolNm + ' Patrol');
					}
				}
				
				return false;
			});			
			
			$('#buttonSubmit', '#PageX').click(function () {
				
				
				
				

				extSubmit(UnitID);
				
				
				
				
				return false;
			});
			$('#buttonCancel', '#PageX').click(function () {
				$.mobile.changePage(
						'/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID,
					{
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: true,
						reloadPage: true
					}
				);		
				return false;				
			});			
			refreshPositionList('');
			
		}

		function pageShow() {
			
			//JAL, 012918: if a membership selection is changed, refresh the position list
			$(':radio[name=UserMembershipID]', '#PageX').change(function () {
				refreshPositionList('');
			});

			//JAL, 013118: check the first Membership radio button; trigger the change event on the Membership button
			$(':radio[id ^= userMembershipID]:first', '#PageX').prop('checked', true).checkboxradio('refresh');
			$(':radio[id ^= userMembershipID]:first', '#PageX').trigger('change');
			
			$('.calendar', '#PageX').each(function() {
				var id = $(this).attr('id');
				$(this).width('75%').before('<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
				$($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + id + '" value="' + $(this).val() + '" />');
			});

			$('input[id^=hidden_]:hidden', '#PageX').mobiscroll().calendar({
				theme: 'scoutbook',
				buttons: ['set', 'clear', 'cancel'],
				mode: 'scroller',
				display: 'bottom',
				controls: ['calendar', 'date'],
				closeOnSelect: true,
				rows: 7,
				onClose: function(valueText) {
					var id = $(this).attr('id');
					id = id.replace('hidden_', '');
					$('#' + id).val(valueText).trigger('change');
				}
			});
					
			$('.calendarIcon', '#PageX').on('click', function() {
				var id = $(this).next('input').attr('id');
				$('#hidden_' + id).mobiscroll('show');
			});


				$('#membershipControlGroup', '#PageX').controlgroup('refresh');
			

			
		}
		function deletePosition() {
			alert('delete');
		}

		function refreshBSAUnitDescriptionList() {
			var councilID			= $('#councilID', '#PageX').val();	
			var unitTypeID			= $('#unitTypeID', '#PageX').val();
			var unitNumber			= $('#unitNumber', '#PageX').val();

			if(councilID !=- '' && unitTypeID != '' && unitNumber != '') {
				$('#akelaUnitIDLI', '#PageX').slideDown(200);
				$('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
				$('#akelaUnitID', '#PageX').load('/mobile/includes/ajax.asp?Action=GetBSAUnitDescription&CouncilID=' + councilID + '&UnitTypeID=' + unitTypeID + '&UnitNumber=' + unitNumber, function() {
					$(this).selectmenu('refresh');	
				});
			} else {
				$('#akelaUnitIDLI', '#PageX').slideUp(200);
				$('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
			}
		}

		function refreshPositionList(selectedPositionID) {
			var councilID = $('#councilID', '#PageX').val();

			//JAL, 012918: set the unitTypeID, denID, patrolID if a membership is selected
			if ($(':radio[name=UserMembershipID]', '#PageX').is(':checked')) {
				var unitTypeID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-unittypeid');
				var unitID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-unitid');
				var councilID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-councilid');
				var akelaUnitID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-akelaunitid');
				var unitNumber = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-unitnumber');

				//JAL, 013118: Show/hide the Patrol radio buttons
				if (unitTypeID == 2 || unitTypeID == 3) {
					//Remove the Patrol radio buttons
					$('#patrolIDFieldSet', '#PageX').remove();

					$('#patrolIDFieldSet', '#PageX').controlgroup('refresh');

					//Call GetPatrolList and repopulate the Patrol radio buttons
					$.getJSON('/includes/ajax.asp?Action=GetPatrolList&CouncilID=' + councilID + '&UnitNumber=' + unitNumber + '&AkelaUnitID=' + akelaUnitID + '&UnitID=' + unitID, function (data) {
						var controlGroup = '<fieldset data-role="controlgroup" id="patrolIDFieldSet"><legend>Patrol:</legend><label for="patrolID">N/A</label><input type="radio" name="PatrolID" id="patrolID" value="" data-theme="d" />';

						$.each(data, function (key, val) {
							controlGroup = controlGroup + '<label for="patrolID' + val.patrolID + '">' + val.patrolName + '</label>';
							controlGroup = controlGroup + '<input type="radio" name="PatrolID" id="patrolID' + val.patrolID + '" value="' + val.patrolID + '" data-theme="d" />';
						});

						controlGroup = controlGroup + '</fieldset>';

						$('#patrolIDLI div', '#PageX').html(controlGroup);
						$(':radio[id^=patrolID]', '#PageX').trigger('create').checkboxradio();
						$('#patrolIDFieldSet', '#PageX').trigger('create').controlgroup();

						//Show the Patrol radio button control
						$('#patrolIDLI', '#PageX').show();
						//console.log('refreshed positions');
					});
				}
				else {
					$('#patrolIDLI', '#PageX').hide();
				}
			}
			else {
				// display position list
				
					var unitTypeID = $(':radio[name=UserMembershipID]', '#PageX').attr('data-unittypeid');
				
			}

			if(unitTypeID != '') {
				// clear position list first
				
					$('#positionID', '#PageX').html('<option value=""></option>');
				

				// populate position list 
				$.getJSON('/includes/ajax.asp?Action=GetPositionList&CouncilID=' + councilID + '&AdultPosition=0&UnitTypeID=' + unitTypeID + '&AdultUserID=&UnitID='+UnitID, function(data) {
					var select = $('#positionID', '#PageX'); 
					$.each(data, function(key, val){ 
						$('<option/>').attr('value', val.positionID) 
							.html(val.position) 
							.appendTo(select); 
					}); 

					// if no results then put in a phrase
					if($('#positionID option', '#PageX').size() == 1) {
						$('<option/>').attr('value', '').html('please select a unit type first').appendTo(select)
					}

					if(selectedPositionID != '') {
						$('#positionID', '#PageX').val(selectedPositionID);
					}
					// refresh the menu
					$('#positionID', '#PageX').selectmenu('refresh');
				});
			}
			$('#positionID', '#PageX').trigger('change');
		}

		function refreshDistrictList(selectedDistrictID) {
			// lookup districts based on council
			
				var councilID = $('#councilID option:selected', '#PageX').val();
			

			if(councilID != '') {
				// clear district list first
				$('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').html('');

				// populate district list 
				$.getJSON('/includes/ajax.asp?Action=GetDistrictList&CouncilID=' + councilID, function(data) {
					$.each(data, function(key, val){ 
						var checkbox = '<input type="checkbox" name="DistrictID" data-theme="d" id="districtID' + val.districtID + '" value="' + val.districtID + '" />';
						checkbox += '<label for="districtID' + val.districtID + '">' + val.districtName + '</label>';

						// insert
						$('#listTypeDistrictLI div.ui-controlgroup-controls').append(checkbox);

					}); 
					// if no results then disable District option and check council by default
					if($('input:checkbox[name=DistrictID]', '#PageX').length == 0) {
						$('#listTypeCouncil').prop('checked', true).checkboxradio('refresh');
						$('#listTypeDistrict').prop('checked', false).checkboxradio('refresh').checkboxradio('disable');
						$(':radio[name=ListType]', '#PageX').trigger('change');
					} else {
						$('#listTypeDistrict').checkboxradio('enable');	
					}

					// enhance
					$('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').trigger('create');
					// add rounded corners
					$('label:first', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-first-child');
					$('label:last', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-last-child');
				});
			}
		}

	//</script>
}



// what is changing?
// for existing lines, check if marked for delete.  If so, flag
// else
//   compare sdate and edates to defaults. If different, this is a change
//   dates must be proper format
//   edate must be after sdate
// Are lines updated?

// Any new lines - look for data-attributes, only pay attention if position is set
// dates must be proper format
// edate must be after sdate
				
// 18 and 21 LNT and Venture PL must have end dates				
				
function extSubmit(unitID) {

	var err='';

	$('input[name*="sdateID"]').each( function () {
		if($(this).val() != '') {
			if($(this).val().match(/\d[\d]*\/\d[\d]*\/\d\d\d\d/) == null) {
				if(err =='') {
					err = 'Invalid start date format (must be dd/mm/yyyy)) ';
				}
				err += $(this).val() + ' ';
			} else {

				if(new Date($(this).val()) == 'Invalid Date') {
					if(err =='') {
						err = 'Invalid start date format (must be dd/mm/yyyy)) ';
					}
					err += $(this).val() + ' ';
				}				
			}
		}
	});

	var oerr=err;
	err='';

	$('input[name*="edateID"]').each( function () {
		if($(this).val() != '') {
			if($(this).val().match(/\d[\d]*\/\d[\d]*\/\d\d\d\d/) == null) {
				if(err =='') {
					err = 'Invalid end date format (must be dd/mm/yyyy) ';
				}
				err += $(this).val() + ' ';
			} else {
				if(new Date($(this).val()) == 'Invalid Date') {
					if(err =='') {
						err = 'Invalid start date format (must be dd/mm/yyyy)) ';
					}

					err += $(this).val() + ' ';
				}				
			}
				
		}
	});

	oerr += err;

	if (oerr != '') {
		alert(oerr);
		return false;
	}

	
	
	
	
	
	var id='';
	err='';
//can't have an end date without a start date
	$('input[name*="edateID"]').each( function () {
		if($(this).val() != '') {
		
			if($(this).attr('id').match(/\d+-\d+/)!=null) {		
				id=$(this).attr('id').match(/\d+-\d+/)[0];
				if($('#sdateID'+id).val() =='') {
					err = 'If an end date is specified, there must be an associated start date';
				}
			}
		}
	});


	if(err !='') {
		alert(err);
		return false;
	}
	
//end date must occur after a start date

	$('input[name*="edateID"]').each( function () {
		if($(this).val() != '') {
			if($(this).attr('id').match(/\d+-\d+/)!=null) {	
				id=$(this).attr('id').match(/\d+-\d+/)[0];
				var edt=new Date($(this).val());
				var sdt=new Date($('#sdateID'+id).val());
				if(sdt>edt) {
					err = 'End dates must not be before start dates';
				}
			}
		}
	});

	if(err !='') {
		alert(err);
		return false;
	}
	
	//finally, dates must be before today
	$('input[name*="edateID"]').each( function () {
		if($(this).val() != '') {
			if($(this).attr('id').match(/\d+-\d+/)!=null) {	
				id=$(this).attr('id').match(/\d+-\d+/)[0];
				var edt=new Date($(this).val());
				var sdt=new Date(Date.now());
				if(edt>sdt) {
					err = 'Dates must not be after today';
				}
			}
		}
	});
	$('input[name*="sdateID"]').each( function () {
		if($(this).val() != '') {
			if($(this).attr('id').match(/\d+-\d+/)!=null) {	
				id=$(this).attr('id').match(/\d+-\d+/)[0];
				var edt=new Date($(this).val());
				var sdt=new Date(Date.now());
				if(edt>sdt) {
					err = 'Dates must not be after today';
				}
			}
		}
	});
	if(err !='') {
		alert(err);
		return false;
	}	

	//one more. Any new position must have a start date
	$('input[name*="posNameID"][data-positionid]').each( function () {
		if($(this).attr('id').match(/\d+-\d+/)!=null) {	
			id			=$(this).attr('id').match(/\d+-\d+/)[0];
			if($('#sdateID'+id).val() =='') {
				err ='Any newly added positions must have a start date';
			}
		}
		
	});		

	if(err !='') {
		alert(err);
		return false;
	}	
	
	//data-posid is the id of the link to an existing leader position 
	//data-positionid is the option value for a new position
	


	var scoutID='';
	var posid='';
	var sdate='';
	var edate='';
	
	//build list of positions to be deleted
	$('input[data-delete="delete"]').each( function () {
		if($(this).attr('id').match(/buttonDeletePosition(\d+)/)!=null) {	
			scoutID	=$(this).attr('id').match(/buttonDeletePosition(\d+)/)[1];
			posid	=$(this).attr('data-posid');
			leaderDeleteList.push({scoutid: scoutID,posid:posid});	
		}
	});


	// get a list of modified positions.  Careful not to put new positions here
	$('input[name*="sdateID"][defaultvalue]:not(".newpos")').each( function () {
		if($(this).attr('id').match(/\d+-\d+/)!=null) {	
			id=$(this).attr('id').match(/\d+-\d+/)[0];
			if($(this).val() != $(this).attr('defaultvalue')  ||  $('#edateID'+id).val() !=  $('#edateID'+id).attr('defaultvalue') ) {	
				scoutID	=$(this).attr('id').match(/sdateID(\d+)/)[1];
				posid	=$(this).attr('data-posid');
				sdate=$(this).val();
				edate=$('#edateID'+id).val();
				leaderModifyList.push({scoutid: scoutID, posid:posid, startdate:sdate, enddate:edate});
			} 
		}
	});

	//get a list of new positions
	var posLnk='';
	var denID='';
	var denVal='';
	var patrolID='';
	var denNum='';
	var akelaUnitID='';
	var unitTypeID='';
	var unitNumber='';
	var akelaUnitNumber=''
	var councilID='';
	var UserMembershipID='';
	$('input[name*="posNameID"][data-positionid]').each( function () {
		if($(this).attr('id').match(/\d+-\d+/)!=null && $(this).attr('id').match(/posNameID(\d+)/)!= null) {	
		id			=$(this).attr('id').match(/\d+-\d+/)[0];
		scoutID		=$(this).attr('id').match(/posNameID(\d+)/)[1];
		posLnk		=$(this).attr('data-positionid');
		denID		=$(this).attr('data-denid');
		denVal		=$(this).attr('data-denval');
		patrolID	=$(this).attr('data-patrolid');
		denNum		=$(this).attr('data-dennumber');
		edate		=$('#edateID'+id).val();
		sdate		=$('#sdateID'+id).val();
		akelaUnitID		=$(this).attr('data-akelaid');
		UserMembershipID=$(this).attr('data-usermembershipid');
		
		unitTypeID=$(this).attr('data-unittypeid');				//UnitTypeID:1				xx
		unitNumber=$(this).attr('data-unitnumber');				//UnitNumber:194				xx
		akelaUnitNumber=$(this).attr('data-akelaunitnumber');	//AkelaUnitNumber:0194		xx
		councilID=$(this).attr('data-councilid');
		if(denVal==undefined) denVal='';
		if(denID==undefined) denID='';
		if(patrolID==undefined) patrolID='';
		if(denNum==undefined) denNum='';
		
		
		if((posLnk == 18 || posLnk==21) && edate=='') {
			alert('Leave No Trace and Venture Patrol Leader are discontinued positions, and show for legacy purposes.  An End Date is required for these positions');
			err='true';
		}
		leaderNewList.push({scoutid: scoutID, posLnk:posLnk, startdate:sdate, enddate:edate, denID:denID, denVal:denVal,denNum:denNum, patrolID:patrolID, akelaUnitID:akelaUnitID,unitTypeID:unitTypeID,unitNumber:unitNumber, akelaUnitNumber:akelaUnitNumber,councilID:councilID,userMembershipID:UserMembershipID} );
		}
	});

	if(err !='') {
		return false;
	}
	//iterate through lists
	//ghbmnnjooekpmoecnnnilnnbdlolhkhi
	
	youthLeaderDeletePosGet(unitID,0);
}	
				
/*

Saving a new position with a patrol

https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=xxx&AdultUserID=&UnitID=xxxx&DenID=&PatrolID=
Post
old
Action=Submit&CouncilID=xxx&UnitTypeID=2&UnitNumber=xxx&AkelaUnitNumber=xxx&AkelaUnitID=xxxx&PositionID=xxx&DenNumber=&PatrolName=&PatrolID=xxx&Available=1&ListType=Council&UnitList=&DateStarted=01%2F20%2F2018&DateEnded=&Notes=
new
Action=Submit&UserMembershipID=xxxx&PositionID=xx&DenNumber=&PatrolName=&PatrolID=xxxx&Available=1&ListType=Council&UnitList=&DateStarted=02%2F08%2F2018&DateEnded=&Notes=&Approved=1




Remove a position - two steps.  Go to the page, 
						/mobile/dashboard/admin/position.asp?UserPositionID=xxx&ScoutUserID=xxx&UnitID=xxx
Need the pageid of the above page
Then
https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID=xxxx&ScoutUserID=xxx&AdultUserID=&PageID=Page99218&UnitID=xxx&_=15166526
                        /mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID=xxx&ScoutUserID=xxx&AdultUserID=&PageID=Page99218&UnitID=xx

GET
Action:DeletePosition
UserPositionID:xxx
ScoutUserID:xxx
AdultUserID:
PageID:Page99218
UnitID:xxx
_:1516652699530




modify a position

https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=xxxx8&ScoutUserID=xxxx&AdultUserID=&UnitID=xxxx&DenID=&PatrolID=
Post
Action:Submit
DateStarted:1/20/2018
DateEnded:1/21/2018
Notes:


*/


//iterate until all delete psositon are gone
function youthLeaderDeletePosGet(unitID,ptr) {

	if(leaderDeleteList.length==ptr) {
		youthLeaderModifyPosPost(unitID,0)
		return;
	}

	var posID=leaderDeleteList[ptr].posid;
	var scoutID=leaderDeleteList[ptr].scoutid;
	//var patrolID==leaderDeleteList[ptr].??;
	//ptr +=1;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], youthLeaderDeletePosGet,[unitID,ptr]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
				//get the pageid
				var pageID='';
				if($('div[data-role="page"]',this.response).attr('id').match(/\d+/) != null) {
					pageID=$('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
				}
				//now call to make the change
				youthLeaderDeletePosSet(unitID,ptr,pageID);
			}
	};		
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID='+posID+'&ScoutUserID='+scoutID+'&UnitID='+unitID;
	
	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], youthLeaderDeletePosGet,[unitID,ptr]); 
	};		
	
}

function youthLeaderDeletePosSet(unitID,ptr,pageID) {

	var posID=leaderDeleteList[ptr].posid;
	var scoutID=leaderDeleteList[ptr].scoutid;

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], youthLeaderDeletePosSet,[unitID,ptr,pageID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
				ptr+=1;
				//next
				youthLeaderDeletePosGet(unitID,ptr);
			}
	};		

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID='+posID+'&ScoutUserID='+scoutID+'&AdultUserID=&PageID=Page'+pageID+'&UnitID='+unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], youthLeaderDeletePosSet,[unitID,ptr,pageID]);
	};		
	
}




function youthLeaderModifyPosPost(unitID,ptr) {

	if(leaderModifyList.length==ptr) {
		youthLeaderNewPosPost(unitID,0)
		return;
	}
	//{scoutid: scoutID, posid:posid, startdate:sdate, enddate:edate}
	var scoutID=leaderModifyList[ptr].scoutid;
	var posID=leaderModifyList[ptr].posid;
    var startdate=encodeURIComponent(filldate(leaderModifyList[ptr].startdate));
	var enddate=encodeURIComponent(filldate(leaderModifyList[ptr].enddate));

	
	var formPost='Action=Submit&DateStarted='+startdate+'&DateEnded='+enddate+'&Notes=&Approved=1';
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], youthLeaderModifyPosPost,[unitID,ptr]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
				ptr+=1;
				youthLeaderModifyPosPost(unitID,ptr);
			}
	};		
	
// New includes denid and patrolid... are they needed?

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID='+posID+'&ScoutUserID='+scoutID+'&AdultUserID=&UnitID='+unitID+'&DenID=&PatrolID=';

	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], youthLeaderModifyPosPost,[unitID,ptr]);
	};		
	
}


/*
https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=xxxx&AdultUserID=&UnitID=xxx&DenID=&PatrolID=
Action:Submit
CouncilID:xxx
UnitTypeID:1				xx
UnitNumber:xxx				xx
AkelaUnitNumber:xxx		xx
AkelaUnitID:xxx
PositionID:xx
Den:wolves
DenNumber:x
PatrolName:
Available:x
ListType:Council
UnitList:
DateStarted:01/22/2018
DateEnded:
Notes:
*/



function youthLeaderNewPosPost(unitID,ptr) {
	if(leaderNewList.length==ptr) {
		youthLeaderDone(unitID);
		return;
	}	
	
	var scoutID=leaderNewList[ptr].scoutid;
	var posid=leaderNewList[ptr].posLnk;
    var startdate=encodeURIComponent(filldate(leaderNewList[ptr].startdate));
	var enddate=encodeURIComponent(filldate(leaderNewList[ptr].enddate));

	var unitTypeID=leaderNewList[ptr].unitTypeID;
	var unitNumber=leaderNewList[ptr].unitNumber;
	var akelaUnitNumber=leaderNewList[ptr].akelaUnitNumber;
	var councilID=leaderNewList[ptr].councilID;
	var akelaUnitID=leaderNewList[ptr].akelaUnitID;
	var denID=leaderNewList[ptr].denID;
	var denVal=leaderNewList[ptr].denVal;
	var denNum=leaderNewList[ptr].denNum;	
	var userMembershipID=leaderNewList[ptr].userMembershipID;

	
	var patrolID='';
	if(leaderNewList[ptr].patrolID.match(/\d+/) != null) {
		patrolID=leaderNewList[ptr].patrolID.match(/\d+/)[0];
	}
	var denpatrol;
	if(unitTypeID=='1') denVal='&Den='+denVal;
	if(unitTypeID=='2') patrolID='&PatrolID='+patrolID;
    //{scoutid: scoutID, posLnk:posLnk, startdate:sdate, enddate:edate, denID:denID, denNum:denNum, patrolID:patrolID, akelaUnitID:akelaUnitID,unitTypeID:unitTypeID,unitNumber:unitNumber, akelaUnitNumber:akelaUnitNumber} 
	//			 'Action=Submit&CouncilID=271&          UnitTypeID=2&             UnitNumber=194&           AkelaUnitNumber=0194&               AkelaUnitID=266221&         PositionID=5&                      DenNumber=&          PatrolName=&PatrolID=21975&Available=1&ListType=Council&UnitList=&DateStarted=01%2F22%2F2018&DateEnded=&Notes=
	//old
	if(leaderNewList[ptr].userMembershipID==undefined) {
		var formPost='Action=Submit&CouncilID='+escapeHTML(councilID)+'&UnitTypeID='+escapeHTML(unitTypeID)+'&UnitNumber='+escapeHTML(unitNumber)+'&AkelaUnitNumber='+escapeHTML(akelaUnitNumber)+'&AkelaUnitID='+escapeHTML(akelaUnitID)+'&PositionID='+posid+denVal+'&DenNumber='+escapeHTML(denNum)+'&PatrolName='+escapeHTML(patrolID)+'&Available=1&ListType=Council&UnitList=&DateStarted='+escapeHTML(startdate)+'&DateEnded='+escapeHTML(enddate)+'&Notes=';
	} else {
	//new
		var formPost='Action=Submit&UserMembershipID='+ escapeHTML(userMembershipID) +'&PositionID='+posid+denVal+'&DenNumber='+escapeHTML(denNum)+'&PatrolName=&PatrolID='+escapeHTML(patrolID)+'&Available=1&ListType=Council&UnitList=&DateStarted='+escapeHTML(startdate)+'&DateEnded='+escapeHTML(enddate)+'&Notes=&Approved=1';
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[unitID,'Youth Leadership'], youthLeaderNewPosPost,[unitID,ptr]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
				ptr+=1;
			
				youthLeaderNewPosPost(unitID,ptr);
			}
	};		
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID='+scoutID+'&AdultUserID=&UnitID='+unitID+'&DenID=&PatrolID=';

	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[unitID,'Youth Leadership'], youthLeaderNewPosPost,[unitID,ptr]);
	};	
	
	
}






function filldate(d) {
	if(d=='') return '';
	var bup=d.match(/(\d+)\/(\d+)\/(\d+)/);
	if(bup[1].length==1) {bup[1]= '0'+ bup[1]}
	if(bup[2].length==1) {bup[2]= '0'+ bup[2]}	
	return bup[1]+'/'+bup[2]+'/'+bup[3];
}

//codeBlock(data,'if(councilID ==')
//returns simple code snippet
/*
function ifCodeBlock(data,snipStart) {
	var si=data.indexOf(snipStart);
	if (si==-1) {
		return '';
	}
    //look for a close brace after the open {
	var clb =data.indexOf('}',si);
	// check for an else in the next text after whiteSpace
	var els = data.indexOf('else',clb);
	
	if(els==-1) {
		// no else statement
	} else {
		//look for next closing brace after open {
		clb =data.indexOf('}',els);
	}
	
	return data.slice(si,clb+1);
	
}




*/	
	
	
function youthLeaderDone(unitID) {

		$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
		);	
}	
	
	
function unEscapeHTML(str) { 
	var strr = str+'';
	 return strr.replace(/&amp;|&quot;|&#39;|&lt;|&gt;/g, (m) => unEscapeHTML.replacements[m]); //[&"'<>]
}
unEscapeHTML.replacements = {  "&amp;" :"&", "&quot;": '"',  "&#39;":"'", "&lt;":"<", "&gt;":">" };
