var recording = false;

var actions = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "redirect_tab") {
    	redirectCurrentTab(sender, request.newUrl);
    }
    else if (request.message == "open_tab") {
    	openNewTab(request.newUrl);
    }
    else if (request.message == "start_recording") {
    	console.log("START");
    	recording = true;
    }
    else if (request.message == "stop_recording") {
    	console.log("STOP");
    	store();
    	actions = [];
    	recording = false;
    }
    else if (request.message == "add_action") {
    	if (recording) {
    		actions.push(request.action);
    	}
    }
    else if (request.message == "is_recording") {
    	sendResponse({rec:recording});
    }
});

function redirectCurrentTab(sender, newUrl) {
	chrome.tabs.update(sender.tab.id, {url: newUrl});
}

function openNewTab(newUrl) {
	chrome.tabs.create({url: newUrl});
}


function store() {
	chrome.storage.local.set({"macros" : actions});
	chrome.storage.local.get("macros", function(items) {
		console.log(items);
	});
}
