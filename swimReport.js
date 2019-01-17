// Copyright © 1/19/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

var scoutSwimObjList=[];


function setSwimReportPageContent(unitID,txtunit) {
	swimRpt=false;
	var newdata='';
	newdata += '		<div data-role="content" class="ui-content printcontent">';	
	newdata += '			<ul data-role="listview" data-theme="d" data-inset="true">';   //theme d white  inset means inside a border 
	newdata += '				<li>';
	newdata += '				Swim Report for ' +txtunit ;
	newdata += '				</li>';
	newdata += '				<li id="swimrptLI" data-theme="d">';
	newdata += '				  <div id="swimTable">\n';	
	newdata += '					<table style="font-weight: normal">\n';
	newdata += '						<tr><th style="border-bottom: 1px solid #ddd;">Name</th><th style="border-bottom: 1px solid #ddd;">Swim Classification</th><th style="border-bottom: 1px solid #ddd;">Swim Date</th>';	
	newdata += '						</tr>\n';	
	for(var i=0;i<scoutSwimObjList.length;i++) {
		if(scoutSwimObjList[i].name.match(/ Account$/) == null) {
		newdata += '						<tr>\n';
		newdata += '							<td style="border-bottom: 1px solid #ddd; padding:5px">\n';
		newdata += 									escapeHTML(scoutSwimObjList[i].name);
		newdata += '							</td>\n';
		newdata += '							<td style="border-bottom: 1px solid #ddd; padding:5px">\n';
		newdata += 									escapeHTML(scoutSwimObjList[i].SwimClass);
		newdata += '							</td>\n';	
		newdata += '							<td style="border-bottom: 1px solid #ddd; padding:5px">\n';
		newdata += 									escapeHTML(scoutSwimObjList[i].SwimDate);
		newdata += '							</td >\n';	
		newdata += '						</tr>\n';	
		}
		
	}
	newdata += '					</table>\n';	
	newdata += '				  </div>\n';	//	end of id=swimTable	
	newdata += '				</li>';	
	newdata += '			</ul>';	
	
	
	
	newdata += '		</div>';   //data-role content

	newdata += '		<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
	newdata += '			<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
	newdata += '			<div id="errorPopupIcon"></div>';
	newdata += '			<div id="errorPopupContent"></div>';
	newdata += '			<div class="clearRight"></div>';
	newdata += '		</div>';

	newdata += '		<div id="footer" align="center">';
	newdata += '			<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
	newdata += '			<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	newdata += '		</div>';
	
	return newdata;	
}

var swimArray=[];
function swimFromCSV(unitID) {
	scoutSwimObjList.length=0;
	var firstname;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[],swimFromCSV,[unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var evObj={name:'',id:'',SwimClass:'',SwimDate:''};
			
			var raw=this.response;
			var res=this.response.trim().split('\n');
			
			var swimArray=parseCSV(raw);		//gets array of arrays
			
			if(swimArray.length >1) {
				for(var i=1;i<swimArray.length;i++) {
					firstname=swimArray[i][1].trim();
					if(swimArray[i][1] != '' ) {
						
						if(swimArray[i][5].trim() != '') {
							firstname=swimArray[i][5].trim();
						}
						
						evObj.name=firstname + ' ' + swimArray[i][3].trim();	
						evObj.SwimClass=swimArray[i][17].trim();	
						evObj.SwimDate=swimArray[i][18].trim();
						var found=false;
						//what is the scout id?
						evObj.id=i;  //temp #
						/*
						for(var j=0;j<scoutPermObjList.length;j++) {
							// name match - in qa this won't work.  We need to get a roster and look for dob
							
							
							if(scoutPermObjList[j].name.toLowerCase() == (swimArray[i][3].trim() + ', ' + firstname).toLowerCase()  ) {
								// and compare DOBs
								if(Date.parse(scoutPermObjList[j].DOB) ==Date.parse(swimArray[i][13]) ) {
									evObj.id=scoutPermObjList[j].id;
									found=true;
									break;
								}
							}
						}
						*/
						//if(found==true) {
							scoutSwimObjList.push(JSON.parse(JSON.stringify(evObj)));	
						//}						
					}					
			
				}			
			} else {
				alert('There was a problem reading the scout data, cannot complete');
				$.mobile.loading('hide');
				return;
			}
			
			swimRpt=true;
			scoutPermObjList=[];
			$.mobile.loading('hide');
			$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
			);		
			return;	
		}
	};


	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID='+escapeHTML(unitID)+'&Action=ExportScouts';
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[],swimFromCSV,[unitID]);
	};
}