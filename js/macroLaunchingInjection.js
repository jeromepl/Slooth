var msg;
var approvedURL = "http://localhost/TestNuance/recordPage.html?launch";
$(document).ready(function(){

	var url = window.location.href;
	if(url==approvedURL)
	{
		$("body").append("<button id=\"confirmation\">Register Macro Phrase</button>");
	}

	$("#confirmation").on("click",function(){
		msg = $("#textBox").text();
		chrome.runtime.sendMessage({message:"loadPhrase",phrase:msg});

	});
});