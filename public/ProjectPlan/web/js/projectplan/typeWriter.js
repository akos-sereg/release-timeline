

function typeWrite(placeholder_, message_) {
	var placeholder = document.getElementById(placeholder_);
	if (placeholder == null) {
		appendError('Placeholder not available: ' + placeholder_);
		return;
	}

	placeholder.innerHTML = '';

	type(placeholder_, message_, 0);
}

function type(placeholder_, message_, position_)
{
	var pos = position_;
	
	if (pos == message_.length+1)
	{
		return;
	}
	
	var placeholder = document.getElementById(placeholder_);
	placeholder.innerHTML = message_.substr(0, pos);
	
	pos++;
	setTimeout('type("'+placeholder_+'", "'+message_+'", '+pos+')', 30);
}