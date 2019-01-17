// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America

//modifies https://www.scoutbook.com/mobile/dashboard/reports/reportbuilder.asp?

function rawDataModifyReportBuilder(data,pageid,dataurl) {
	
//add checkbox to check all or uncheck all MBs.  On submit, remove input option.
    if(dataurl.match(/UnitTypeID=2/) != null ) {
		data=showAllMeritBadges(data,pageid,dataurl);
	}
	
	if(dataurl.match(/UnitTypeID=1/) != null ) {
		data=showAllAdventures(data,pageid,dataurl);
	}
return data;

}

function showAllMeritBadges(data,pageid,dataurl) {
	var newdata;
	var startfunc;
	var divHead;	
	
	//Add Select All Checkbox
	divHead='<label for="showMeritBadges">Merit Badges</label>';
	newdata= '												<div class="meritbadge options indent1" data-parent="showMeritBadges" >\n';
	newdata+='													<input type="checkbox" name="ShowAllMeritBadges" id="showAllMeritBadges" data-theme="d" value="1"  />\n';
	newdata+='													<label for="showAllMeritBadges">\n';
	newdata+='														<div>\n';
	newdata+='															Select All Merit badges\n';
	newdata+='														</div>\n';
	newdata+='													</label>\n';
	newdata+='												</div>\n';
	

	startfunc=data.indexOf(divHead);
	data=data.slice(0,startfunc) + divHead + newdata + data.slice(startfunc+divHead.length);


	//remove the new input option we inserted before the form is submitted
	startfunc=data.indexOf("setTimeout('submitForm()', 2000);");
	newdata="formPost=formPost.replace('&ShowAllMeritBadges=1','');\n";
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);
						

	//Add event handling for clicking on the new show all MB input checkbox

	newdata="$('#showAllMeritBadges', '#Page"+pageid+"').click(function () {";
	newdata+="	if ($(this).is(':checked')) {";
	newdata+="		$('input[name=MeritBadgeID]', '#Page"+pageid+"').prop('checked',true)." + 'checkboxradio("refresh");';
	newdata+="	} else {";
	newdata+="		$('input[name=MeritBadgeID]', '#Page"+pageid+"').prop('checked',false)." + 'checkboxradio("refresh");';		
	newdata+="	}";
	newdata+="});";
	
	startfunc=data.indexOf("$('#showMeritBadges'");
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);	
	return data;
}



function showAllAdventures(data,pageid,dataurl) {
	var newdata;
	var startfunc;
	var divHead;
	var idlist=[14,8,9,10,11,12];
	//Add Select All Checkboxes
	for(var i = 0;i<idlist.length;i++) {
		divHead='<div id="rankID'+ idlist[i]+'Adventures" class="adventure indent2" data-parent="rankID'+ idlist[i]+'Options"  style="display: none; " >';
		startfunc=data.indexOf(divHead);
		if(startfunc != -1) {
			newdata='			<input type="checkbox" name="ShowAdventureID'+ idlist[i]+'" id="rankID'+ idlist[i]+'checkall" data-theme="d" value="1"  />';
			newdata+= '		<label for="rankID'+ idlist[i]+'checkall">Select All Adventures</label>';
			data=data.slice(0,startfunc) + divHead + newdata + data.slice(startfunc+divHead.length);
		}
	}	

	//remove the new input option we inserted before the form is submitted
	startfunc=data.indexOf("setTimeout('submitForm()', 2000);");
	newdata="formPost=formPost.replace(/&ShowAdventureID\\d+=1/g,'');\n";
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);	
	
	
	//Add event handling for clicking on the new show all Adventures checkboxes
	newdata='';
	for(var i = 0;i<idlist.length;i++) {
		newdata+="$('#rankID"+ idlist[i]+"checkall', '#Page"+pageid+"').click(function () {\n";

		newdata+="	if ($(this).is(':checked')) {\n";
		newdata+="		$('input[id*="+'"'+"rankID"+ idlist[i]+"adventure"+'"'+"]', '#Page"+pageid+"').prop('checked',true)." + 'checkboxradio("refresh");\n';
		newdata+="	} else {\n";
		newdata+="		$('input[id*="+'"'+"rankID"+ idlist[i]+"adventure"+'"'+"]', '#Page"+pageid+"').prop('checked',false)." + 'checkboxradio("refresh");\n';
		newdata+="	}\n";
		newdata+="});\n";
	}
	startfunc=data.indexOf("$('#showMeritBadges'");
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);	
	
	
	
	
	return data;
}
