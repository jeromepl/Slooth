var recording = false;

var actions = [];

function startRecording() {
    recording = true;
}

function stopRecording() {
    recording = false;
    store();
    actions = [];
}

$(document).on('click', function(e) {
    if(recording) {
    	actions.push({
    		type: "click",
    		element: getQuery(e.target)
    	});
    }
});

//Detect URL change
$(document).on('ready', function(e) {
    if(recording) {
    	actions.push({
    		type: "redirect",
    		url: window.location.href,
    	});
    }
});

$(document).on('blur', function(e) {
    if(recording) {
        actions.push({
        	type: "text",
        	text: $(e.target).text()
        });
    }
});

$(document).on('submit', function(e) {
    if(recording) {
        //Similar to click on submit button?
    	
    }
});

function store() {
	chrome.storage.local.get("macros", function(items) {
		console.log(items);
	});
	chrome.storage.local.set({"macros" : actions});
}
