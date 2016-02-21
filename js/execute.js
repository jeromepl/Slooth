$( document ).ready(function() {
    chrome.runtime.sendMessage({message: "flush_actions"});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "execute") {
    	console.log(request.action);
    	if (request.action.type == "redirect") {
    		redirectTo(request.action.url);
    	}
    	else if (request.action.type == "click") {
    		clickButton(request.action.element);
    	}
    	else{
    		console.log("boo");
    	}
    	//executeActions(request.macro);
    }
});

function redirectTo(url) {
	chrome.runtime.sendMessage({message: "redirect_tab", newUrl:url});
}

function clickButton(query) {
	//console.log("I want to click "+query);
	//console.log($(query).attr('id'));
	$(query)[0].click();
}

function fillField(query, text) {
	$(query).val(text);
}

function executeActions(actions) {
	for (var i = 0; i < actions.length; i++) {
		console.log(actions[i]);
		if (actions[i].type == "click") {
			clickButton(actions[i].element);
		}
		else if (actions[i].type == "redirect") {
			redirectTo(actions[i].url);
		}
	}
}