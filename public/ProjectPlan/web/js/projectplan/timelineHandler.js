var lastLoadedEvent;

/**
 * Load event data into form
 * 
 * @param msg
 */
function refreshEventDetails(msg)
{
	lastLoadedEvent = msg;
	
	setMessage('eventDetails_errorPlaceholder', '');
	setMessage('eventDetails_successPlaceholder', '');
	
	$('#eventDetailsPlaceholderEventId').val(msg.eventId);
	$('#eventDetailsPlaceholderWorkstreamId').val(msg.workstreamId);
	$('#eventDetailsPlaceholder').val(msg.title);
	$('#eventDetailsPlaceholderClass').val(msg.classname);
	$('#eventDetailsPlaceholderStart').val(msg.startDate.substr(0, 10));
	$('#eventDetailsPlaceholderEnd').val(msg.endDate ? msg.endDate.substr(0, 10) : '');
	$('#eventDetailsPlaceholderDesc').val(msg.description);
	
	$( "#tabs" ).tabs( "option", "active", 2 );
}

/**
 * Build event instance based on form-data (Edit)
 */
function buildEventByForm() {
	
	var eventDetails = {
			"burndownChartData": {
				"release":"",
				"remainingQaTaskData":null,
				"remainingTaskData":null,
				"scopeData":null
			},
			"classname":$('#eventDetailsPlaceholderClass').val(),
			"description":$('#eventDetailsPlaceholderDesc').val(),
			"eventId":$('#eventDetailsPlaceholderEventId').val(),
			"workstreamId":$('#eventDetailsPlaceholderWorkstreamId').val(),
			"startDate":$('#eventDetailsPlaceholderStart').val(),
			"endDate":$('#eventDetailsPlaceholderEnd').val(),
			"title":$('#eventDetailsPlaceholder').val()
	};
	
	return eventDetails;
}

function resetEditForm() {
	
	setMessage('eventDetails_errorPlaceholder', '');
	setMessage('eventDetails_successPlaceholder', '');
	
	$('#eventDetailsPlaceholderEventId').val('');
	$('#eventDetailsPlaceholderWorkstreamId').val('');
	$('#eventDetailsPlaceholder').val('');
	$('#eventDetailsPlaceholderClass').val('');
	$('#eventDetailsPlaceholderStart').val('');
	$('#eventDetailsPlaceholderEnd').val('');
	$('#eventDetailsPlaceholderDesc').val('');
}

function resetCreateNewScreen() {
	
	setMessage('addEvent_errorPlaceholder', '');
	setMessage('addEvent_successPlaceholder', '');
	
	$('#eventDetailsInsPlaceholderClass').val('');
	$('#eventDetailsInsPlaceholderDesc').val('');
	$('#eventDetailsInsPlaceholderWorkstreamId').val('');
	$('#eventDetailsInsWorkstream').val('');
	$('#eventDetailsInsWorkstreamPassword').val('');
	$('#eventDetailsInsPlaceholderStart').val('');
	$('#eventDetailsInsPlaceholderEnd').val('');
	$('#eventDetailsInsPlaceholder').val('');
	
	$("#newWorkstreamScreen").hide();
}

/**
 * Build event instance (for Save)
 */
function createNewEvent() {
	
	setMessage('addEvent_errorPlaceholder', '');
	setMessage('addEvent_successPlaceholder', '');
	
	var eventDetails = {
			"burndownChartData": {
				"release":"",
				"remainingQaTaskData":null,
				"remainingTaskData":null,
				"scopeData":null
			},
			"classname":$('#eventDetailsInsPlaceholderClass').val(),
			"description":$('#eventDetailsInsPlaceholderDesc').val(),
			"workstreamId":$('#eventDetailsInsPlaceholderWorkstreamId').val(),
			"workstreamName":$('#eventDetailsInsWorkstream').val(),
			"workstreamPassword":$('#eventDetailsInsWorkstreamPassword').val(),
			"startDate":$('#eventDetailsInsPlaceholderStart').val(),
			"endDate":$('#eventDetailsInsPlaceholderEnd').val(),
			"title":$('#eventDetailsInsPlaceholder').val()
	};
	
	if (eventDetails.title == '') {
		setMessage('addEvent_errorPlaceholder', 'Title must be defined');
		return;
	}
	
	if (eventDetails.startDate == '') {
		setMessage('addEvent_errorPlaceholder', 'Start Date must be defined');
		return;
	}
	
	if (!eventDetails.startDate.match(dateFormat)) {
		setMessage('addEvent_errorPlaceholder', 'Invalid date format for Start Date, accepted format: YYYY-MM-DD');
		return;
	}
	
	if (eventDetails.endDate != '' && !eventDetails.endDate.match(dateFormat)) {
		setMessage('addEvent_errorPlaceholder', 'Invalid date format for End Date, accepted format: YYYY-MM-DD');
		return;
	}
	
	if (eventDetails.workstreamId == '') {
		setMessage('addEvent_errorPlaceholder', 'Workstream must be defined');
		return;
	}
	
	$.ajax({
		type : "POST",
		url : serviceHost + "/saveEvent",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(eventDetails)

	}).done(function(msg) {
		
		if (msg.code != 0)
		{
			setMessage('addEvent_errorPlaceholder', 'Service Error: ' + msg.message);
		}
		else
		{
			setMessage('addEvent_successPlaceholder', 'Event created');
			resetCreateNewScreen();
			
			if (eventDetails.workstreamId == -1) {
				loadWorkstreams(eventDetails.workstreamName);
				$( "#tabs" ).tabs( "option", "active", 0);
			} else {
				refreshTimeline();	
			}
		}
	}).fail(function(jqXHR, textStatus) {
		setMessage('addEvent_errorPlaceholder', 'Error: ' + textStatus);
	});
}

function deleteEvent() {
	
	setMessage('eventDetails_errorPlaceholder', '');
	setMessage('eventDetails_successPlaceholder', '');
	
	var eventDetails = buildEventByForm();
	if (eventDetails.eventId == '') {
		setMessage('eventDetails_errorPlaceholder', 'Event is not defined');
		return;
	}
	
	$.ajax({
		type : "POST",
		url : serviceHost + "/deleteEvent",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(eventDetails)

	}).done(function(msg) {
		
		if (msg.code != 0)
		{
			setMessage('eventDetails_errorPlaceholder', 'Service Error: ' + msg.message);
		}
		else
		{
			setMessage('eventDetails_successPlaceholder', 'Event has been deleted');
			resetEditForm();
			refreshTimeline();
		}
	}).fail(function(jqXHR, textStatus) {
		setMessage('eventDetails_errorPlaceholder', 'Error: ' + textStatus);
	});
}

function saveEvent()
{
	setMessage('eventDetails_errorPlaceholder', '');
	setMessage('eventDetails_successPlaceholder', '');
	
	var eventDetails = buildEventByForm();
	
	if (eventDetails.eventId == '') {
		setMessage('eventDetails_errorPlaceholder', 'Event is not defined');
		return;
	}
	
	if (eventDetails.title == '') {
		setMessage('eventDetails_errorPlaceholder', 'Title must be defined');
		return;
	}
	
	if (eventDetails.startDate == '') {
		setMessage('eventDetails_errorPlaceholder', 'Start Date must be defined');
		return;
	}
	
	if (!eventDetails.startDate.match(dateFormat)) {
		setMessage('eventDetails_errorPlaceholder', 'Invalid date format for Start Date, accepted format: YYYY-MM-DD');
		return;
	}
	
	if (eventDetails.endDate != '' && !eventDetails.endDate.match(dateFormat)) {
		setMessage('eventDetails_errorPlaceholder', 'Invalid date format for End Date, accepted format: YYYY-MM-DD');
		return;
	}
	
	if (eventDetails.workstreamId == '') {
		setMessage('eventDetails_errorPlaceholder', 'Workstream must be defined');
		return;
	}
	
	$.ajax({
		type : "POST",
		url : serviceHost + "/saveEvent",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(eventDetails)

	}).done(function(msg) {
		
		if (msg.code != 0)
		{
			setMessage('eventDetails_errorPlaceholder', 'Service Error: ' + msg.message);
		}
		else
		{
			setMessage('eventDetails_successPlaceholder', 'Event details have been updated');
			refreshTimeline();
		}
	}).fail(function(jqXHR, textStatus) {
		
		setMessage('eventDetails_errorPlaceholder', 'Error: ' + textStatus);
		
	});
}

function resetEventDetails()
{
	refreshEventDetails({description : ''});
}

function loadEventDetails(eventId_) {

	// TODO: DebugConsole.appendInfo()
	appendInfo('Fetching event details for event "'+eventId_+'"');
	
	$.ajax({
		type : "GET",
		url : serviceHost + "/eventDetails/" + eventId_ + "?" + Math.floor((Math.random()*100)+1)

	}).done(function(msg) {
		
		refreshEventDetails(msg);
		appendInfo('JSON data for event details received, refreshing content');
		
	}).fail(function(jqXHR, textStatus) {
		appendError('Fetching event details failed: ' + textStatus);
	});
}


function loadWorkstreams(workstreamNameToLoad) {

	appendInfo('Fetching available Workstreams');
	
	$.ajax({
		type : "GET",
		url : serviceHost + "/getAllWorkstream?" + Math.floor((Math.random()*100)+1)

	}).done(function(msg) {
		
		// Populate Workstream Dropdown lists
		var options = [];
		for (var i = 0; i < msg.workstream.length; i++) {
	        options.push('<option value="',
	        	msg.workstream[i].workstreamId, 
	        	'" '+ ((workstreamNameToLoad != null && workstreamNameToLoad == msg.workstream[i].name) ? 'SELECTED' : '' ) +'>',
	        	msg.workstream[i].name, '</option>');
	    }
	    $("#workstream").html(options.join(''));
	    
	    $("#eventDetailsInsPlaceholderWorkstreamId").html(options.join('') + '<option value="-1">Create new workstream</option>');
	    
		appendInfo('JSON data (Workstreams) received, refreshing screen');
		
		if (workstreamNameToLoad != null) {
			refreshTimeline();
		}
		
	}).fail(function(jqXHR, textStatus) {
		appendError('Fetching workstreams failed: ' + textStatus);
	});
}

function displayNewWorkstreamScreen() {
	var workstreamId = $("#eventDetailsInsPlaceholderWorkstreamId").val();
	
	if (workstreamId == -1) {
		$("#newWorkstreamScreen").show();
	} 
	else {
		$("#newWorkstreamScreen").hide();
	}
}

function setMessage(placeholder, message) {
	
	$('#'+placeholder).hide();
	$('#'+placeholder).html(message);
	
	if (message != '' && message != null) {
		$('#'+placeholder).show("slide");
	} 
}
