//
//function loadBurndownChart(release_) {
//
//	// TODO: DebugConsole.appendInfo()
//	appendInfo('Fetching burndown chart data for "'+release_+'"');
//	
//	$.ajax({
//		type : "GET",
//		url : serviceHost + "/burndownChart/" + release_.replace('/', '_')
//
//	}).done(function(msg) {
//		
//		var scopeData = [];
//		var remainingData = [];
//		var remainingQaData = [];
//		
//		// Extract Scope Data
//		for (var i=0; i!=msg.scopeData.entry.length; i++)
//		{
//			scopeData.push([msg.scopeData.entry[i].key, msg.scopeData.entry[i].value]);
//		}
//		
//		// Extract remaining dev task 
//		for (var i=0; i!=msg.remainingTaskData.entry.length; i++)
//		{
//			remainingData.push([msg.remainingTaskData.entry[i].key, msg.remainingTaskData.entry[i].value]);
//		}
//		
//		// Extract remaining qa task 
//		for (var i=0; i!=msg.remainingQaTaskData.entry.length; i++)
//		{
//			remainingQaData.push([msg.remainingQaTaskData.entry[i].key, msg.remainingQaTaskData.entry[i].value]);
//		}
//		
//		appendInfo('JSON data for burndown chart received, refreshing chart');
//		refreshBurndownChart('Burndown chart for "' + msg.release + '"', remainingData, remainingQaData, scopeData);
//		
//	}).fail(function(jqXHR, textStatus) {
//		appendError('Fetching burndown chart data failed: ' + textStatus);
//	});
//}

function refreshBurndownChart(chartTitle, remainingData, remainingQaData, scopeData) {
	
	$.plot($("#burndownChartPlaceholder"), [ {
		label : 'Dev outstanding',
		data : remainingData,
		lines : {
			show : true,
			fill : true
		}
	}, {
		label : 'Scope',
		data : scopeData,
		lines : {
			show : true,
			fill : false
		}
	}, {
		label : 'QA outstanding',
		data : remainingQaData,
		lines : {
			show : true,
			fill : true
		}
	} ]);
	
	var burndownChartTitle = document.getElementById('burndownChartTitle');
	burndownChartTitle.innerHTML = chartTitle;
}

function resetBurndownChart()
{
	var remainingData = [ [0, 0] [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]];
	var scopeData = [ [0, 0] [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]];
	var remainingQaData = [ [0, 0] [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]];
	refreshBurndownChart('Burndown chart data not available', remainingData, remainingQaData, scopeData);	
}