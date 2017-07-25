function addMacroLi(phrase) {
    $("#macroList").append("<li class='macro'><div class='phrase'>" + phrase + "</div><img class='removeButton' src='letter-x.png'></li>");
}

$(document).ready(function (e) {
    chrome.storage.local.get({ // Get the macros and display them
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            addMacroLi(userMacros[i].activationPhrase);
        }
    });
    
    // Ask the background script if a macro is being recorded at the moment
    chrome.runtime.sendMessage({ message: "is_recording" }, function(response) {
        if (!response.rec) {
            $("#record").text("Record New Macro");
            $("#record").removeClass("recording");
        }
        else {
            $("#record").text("Stop Recording");
            $("#record").addClass("recording");
        }
    });
});

// Start/Stop recording
$('#record').on('click', function (e) {
    chrome.runtime.sendMessage({
        message: "is_recording"
    }, function (response) {
        if (response.rec) {
            $("#record").text("Record New Macro");
            $("#record").removeClass("recording");
            chrome.runtime.sendMessage({
                message: "stop_recording"
            });
            
            // TODO rename phrase throughout code to something like macroTitle
            
            var phrase = prompt("Enter a name for this macro:");
            
            chrome.runtime.sendMessage({ // Set the launch text of the last recorded macro
                message: "setPhrase",
                phrase: phrase
            });
            
            // Add the new macro to the list
            addMacroLi(phrase);
        }
        else {
            $("#record").text("Stop Recording");
            $("#record").addClass("recording");
            chrome.runtime.sendMessage({
                message: "start_recording"
            });
        }
    });
});

// Execute a macro
$(document).on('click', '.macro', function(e) {
    chrome.runtime.sendMessage({
        message: "run_macro",
        phrase: $(this).find('.phrase').text()
    });
});

// Delete a macro
$(document).on('click', '.removeButton', function(e) {
    e.stopPropagation();
    chrome.runtime.sendMessage({
        message: "remove_macro",
        phrase: $(this).siblings('.phrase').text()
    });
	$(this).parent().remove(); // Remove the <li> element
});
