$("#button2").on("click", function(e) {
	
	chrome.runtime.sendMessage({message:"is_recording"}, function(response) {
		if (response.rec) {
			chrome.runtime.sendMessage({message: "stop_recording"});
		}
		else {
			chrome.runtime.sendMessage({message: "start_recording"});
		}
	});
	
});
