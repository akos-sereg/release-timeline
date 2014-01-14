var serviceRoot = "http://"+window.location.host+"/ProjectPlan";

var serviceHost = serviceRoot + "/rest/service";
var defaultWorkstreamId = 1;
var dateFormat = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
//var serviceHost = "http://192.168.1.78:3000/ProjectPlan/rest/service";

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
