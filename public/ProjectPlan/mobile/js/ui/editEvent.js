function populateEditEventPage(eventId_)
{
	$.ajax({
		type : "GET",
		url : serviceHost + "/eventDetails/" + eventId_ + "?" + Math.floor((Math.random()*100)+1)

	}).done(function(msg) {
		
		var startDate = new Date(msg.startDate);
		var endDate = new Date(msg.endDate);
		
		$('#eventId').val(msg.eventId);
		$('#workstreamId').val(msg.workstreamId);
		$('#title').val(msg.title);
		$('#description').val(msg.description);
		$('#startDate').val(formatDate(startDate));
		$('#endDate').val(formatDate(endDate));
		$('#classname').val(msg.classname);
		//$('#classname[value='+msg.classname+']').attr('selected','selected');
		
	}).fail(function(jqXHR, textStatus) {
		
	});
}

function resetEventEditor()
{
	$('#eventId').val('');
	$('#workstreamId').val('');
	$('#title').val('');
	$('#description').val('');
	$('#startDate').val(formatDate(new Date()));
	$('#endDate').val('');
	$('#classname').val('');
}

function buildEventDetails()
{
	var eventDetails = {
			"burndownChartData": {
				"release":"",
				"remainingQaTaskData":null,
				"remainingTaskData":null,
				"scopeData":null
			},
			"classname":$('#classname').val(),
			"description":$('#description').val(),
			"eventId":$('#eventId').val(),
			"workstreamId":$('#workstreamId').val(),
			"startDate":$('#startDate').val(),
			"endDate":$('#endDate').val(),
			"title":$('#title').val()
	};
	
	return eventDetails;
	
}

function deleteEvent()
{
	$('#confirmRemoveEventPopup').dialog('close');
	var eventDetails = buildEventDetails();
	
	$.ajax({
		type : "POST",
		url : serviceHost + "/deleteEvent",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(eventDetails)

	}).done(function(msg) {
		
		if (msg.code != 0)
		{
			handleDeleteEventError(msg.message);
		}
		else
		{
			$('#eventEditedPopup_header').html('Event Deleted');
			$('#eventEditedPopup_title').html('Event Deleted successfully');
			$('#eventEditedPopup_message').html('Click OK button to close this window.');
			$("#eventEditedPopup").popup('open');
		}
	}).fail(function(jqXHR, textStatus) {
		
		handleDeleteEventError(textStatus);
		
	});
}

function saveEvent()
{
	var eventDetails = buildEventDetails();
	
	$.ajax({
		type : "POST",
		url : serviceHost + "/saveEvent",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(eventDetails)

	}).done(function(msg) {
		
		if (msg.code != 0)
		{
			handleEditEventError(msg.message);
		}
		else
		{
			$('#eventEditedPopup_header').html('Event Saved');
			$('#eventEditedPopup_title').html('Event Saved successfully');
			$('#eventEditedPopup_message').html('Click OK button to close this window.');
			$("#eventEditedPopup").popup('open');
		}
	}).fail(function(jqXHR, textStatus) {
		
		handleEditEventError(textStatus);
		
	});
}

function handleEditEventError(message_)
{
	$('#eventEditedPopup_header').html('Event Not Saved');
	$('#eventEditedPopup_title').html('Event not saved');
	$('#eventEditedPopup_message').html('Event could not be saved due to an error: ' + message_);
	$("#eventEditedPopup").popup('open');
}

function handleDeleteEventError(message_)
{
	$('#eventEditedPopup_header').html('Delete Event');
	$('#eventEditedPopup_title').html('Deleting event..');
	$('#eventEditedPopup_message').html('Event could not be deleted due to an error: ' + message_);
	$("#eventEditedPopup").popup('open');
}