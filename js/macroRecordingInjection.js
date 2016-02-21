var confirmButton;
var msg;
var recordURL = "http://localhost/TestNuance/recordPage.html?record";
var launchURL ="http://localhost/TestNuance/recordPage.html?launch";
$(document).ready(function(){

	var url = window.location.href;
	console.log(url + " is");
	if(url==recordURL)
	{
		console.log("record");
		$("body").append("<button id=\"confirmation\">Register Macro Phrase</button>");
	}
	

	$("#confirmation").on("click",function(){
		msg = $("#textBox").text();
			if(url==recordURL){
			chrome.runtime.sendMessage({message:"setPhrase",phrase:msg});
			window.top.close();
			}
		});


	$("#textBox").bind('DOMNodeInserted DOMSubtreeModified DOMNodeRemoved', function(event) {
		console.log("test");
		if(url=launchURL){
			msg = $("#textBox").text();
			console.log(msg);
			chrome.runtime.sendMessage({message:"loadPhrase",phrase:msg});
		}
	});

});
		

