$('#record').on('click', function(e) {
    chrome.runtime.sendMessage({message:"is_recording"}, function(response) {
		if (response.rec) {
            $("#record").text("Record New Macro");
            $("#record").removeClass("recording");
			chrome.runtime.sendMessage({message: "stop_recording"});
		}
		else {
            $("#record").text("Stop Recording");
            $("#record").addClass("recording");
			chrome.runtime.sendMessage({message: "start_recording"});
		}
	});
});

$("#button2").on("click", function(e) {
	chrome.runtime.sendMessage({message:"run_macro"});
});
