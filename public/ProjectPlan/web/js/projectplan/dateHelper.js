function formatDate(date_)
{
	if (date_ == undefined || date_ == null || isNaN(date_.getFullYear()))
	{
		return "";
	}
	
	var month = date_.getMonth()+1;
	var day = date_.getDate();
	
	return date_.getFullYear() + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
}