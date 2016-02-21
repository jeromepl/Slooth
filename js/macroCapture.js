

$(document).on('click', function(e) {
    chrome.runtime.sendMessage({message: "add_action", action: {
		type: "click",
		element: getQuery(e.target)
	}});
});


//Detect URL change
$(document).on('ready', function(e) {
    chrome.runtime.sendMessage({message: "add_action", action: {
		type: "redirect",
		url: window.location.href,
	}});
});

window.addEventListener('beforeunload', function(event) {
    console.log(window.location.href);
    //console.log(event);
    //chrome.runtime.sendMessage({message: "add_action", action: {
		//type: "redirect",
		//url: window.location.href,
	//}});
});

$(document).on('blur', function(e) {
    chrome.runtime.sendMessage({message: "add_action", action: {
    	type: "text",
    	text: $(e.target).text()
	}});
});

$(document).on('submit', function(e) {
    if(recording) {
        //Similar to click on submit button?
    	
    }
});
