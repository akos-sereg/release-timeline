
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadEvents(eventId_) {

	$.ajax({
		type : "GET",
		url : serviceHost + "/getAllEvent"

	}).done(function(data) {
		
		var html = '';

		var monthIndex = -1;
		var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
		               'September', 'October', 'November', 'December' ];
		for (var i=0; i!=data.eventDetails.length; i++)
		{
			var eventDate = new Date(data.eventDetails[i].startDate);
			if (eventDate.getMonth() != monthIndex)
			{
				monthIndex = eventDate.getMonth();
				html += '<li data-theme="a" data-role="list-divider">'+months[monthIndex]+'</li>';
			}
			
			html += '<li><a href="#editEventPage" onClick="populateEditEventPage('+data.eventDetails[i].eventId+')">'+
						'<p><strong>'+eventDate.toString()+'</strong></p>' +
						'<h2>'+data.eventDetails[i].title+'</h2>' +
						'<p><strong>'+data.eventDetails[i].description+'</strong></p>' +
					'</a>' +
					'</li>';
		}
		
		$('#timelinePlaceholder').html(html);
	    $('#timelinePlaceholder').trigger('create');    
	    $('#timelinePlaceholder').listview('refresh');
	    
	}).fail(function(jqXHR, textStatus) {
		
	});
}