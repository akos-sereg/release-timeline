var serviceRoot = "http://"+window.location.host+"/ProjectPlan";
var serviceHost = serviceRoot + "/rest/service";
var defaultWorkstreamId = 1;

function setDefaultWorkstream() {
	defaultWorkstreamId = getCookie('SelectedWorkstreamId');
	if (defaultWorkstreamId == '') {
		appendInfo('Workstream not found in Cookie, using default (WorkstreamID = 1)');
		defaultWorkstreamId = 1;
	}
	else {
		appendInfo('Using workstream found in cookie: ' + defaultWorkstreamId);
	}
}


var dateFormat = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

function getReleaseDescription(release_) {
	var re = new RegExp('.*(CRV/[0-9.]*).*');
	var m = re.exec(release_);
	if (m == null) {
		return null;
	} else {
		if (m.length > 1)
		{
			return m[1];
		}
	}
	
	return null;
}

