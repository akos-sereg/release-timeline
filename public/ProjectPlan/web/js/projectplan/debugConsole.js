
function appendInfo(message_)
{
	var debugConsole = document.getElementById('debugConsolePlaceholder');
	debugConsole.innerHTML += '<span style="color: #009900;">' + message_ + "</span><br/>";
	debugConsole.scrollTop = debugConsole.scrollHeight;
}

function appendError(message_)
{
	var debugConsole = document.getElementById('debugConsolePlaceholder');
	debugConsole.innerHTML += '<span style="color: #ff0000;">' + message_ + "</span><br/>";
	debugConsole.scrollTop = debugConsole.scrollHeight;
}

function appendWarning(message_)
{
	var debugConsole = document.getElementById('debugConsolePlaceholder');
	debugConsole.innerHTML += '<span style="color: #F96A16;">' + message_ + "</span><br/>";
	debugConsole.scrollTop = debugConsole.scrollHeight;
}


function appendStatus(message_)
{
	var debugConsole = document.getElementById('debugConsolePlaceholder');
	debugConsole.innerHTML += '<span style="color: #FEE525;">' + message_ + "</span><br/>";
	debugConsole.scrollTop = debugConsole.scrollHeight;
}