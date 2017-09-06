function addMacroLi(macroName) {
    $("#macroList").append("<li class='macro'><div class='macro-name'>" + macroName + "</div><div class='remove-btn' title='Delete this macro'></div></li>");
}

/** Add an empty macro to the list to allow users to enter a name for the last recorded one */
function addMacroLiEdit() {
    $("#macroList").append("<li class='macro-edit'><input type='text' class='new-macro-name' placeholder='New macro name'><div class='save-btn' title='Save'></div><div class='cancel-btn' title='Cancel'></div></li>");
    $(".new-macro-name").focus();
}

$(document).ready(function (e) {
    chrome.storage.local.get({ // Get the macros and display them
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            addMacroLi(userMacros[i].name);
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
            
            addMacroLiEdit(); // Add an input field to allow entering a name for the new macro
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

$(document).on('click', '.save-btn', function(e) {
    saveMacro($(this).siblings('.new-macro-name').val());
});
$(document).on('keypress', '.new-macro-name', function(e) {
    if (e.which === 13) {
        saveMacro($(this).val());
    }
});

function saveMacro(macroName) {
    if (macroName) {
        chrome.runtime.sendMessage({ // Set the launch text of the last recorded macro
            message: "saveMacro",
            macroName: macroName
        });

        // Add the new macro to the list
        addMacroLi(macroName);
    }
    $('.macro-edit').remove(); // Remove the input field
}

$(document).on('click', '.cancel-btn', function(e) {
    $('.macro-edit').remove();
});

// Delete a macro
$(document).on('mousedown', '.remove-btn', function(e) {
    e.stopPropagation();
    chrome.runtime.sendMessage({
        message: "remove_macro",
        macroName: $(this).siblings('.macro-name').text()
    });
	$(this).parent().remove(); // Remove the <li> element
});

// Execute a macro
$(document).on('mousedown', '.macro', function(e) { // Need to use 'mousedown' to get middle mouse clicks
    chrome.runtime.sendMessage({
        message: "run_macro",
        newTab: e.shiftKey || e.which === 2, // Open in a new tab if shift click or middle mouse click
        macroName: $(this).find('.macro-name').text()
    });
});
