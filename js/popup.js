$(document).ready(function (e) {
    var arrayMacros = [];
    chrome.storage.local.get({ //Get the macros and display them
        userMacros: []
    }, function (result) {
        console.log(result.userMacros.length);

        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            arrayMacros.push(userMacros[i].activationPhrase);
            $("ul").append("<li><a href='#'>" + userMacros[i].activationPhrase + "</a></li>");
        }
    });
    
    //Ask the background script if a macro is being recorded at the moment
    chrome.runtime.sendMessage({message: "is_recording"}, function(response) {
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

//Start/Stop recording
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

//Open the microphone page to launch a macro
$("#launch-macro").on("click", function (e) {
    chrome.runtime.sendMessage({
        message: "open_tab",
        newUrl: "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?launch"
    });
});
