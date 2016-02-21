$(document).ready(function (e) {
    var arrayMacros = [];
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {
        console.log(result.userMacros.length);

        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            arrayMacros.push(userMacros[i].activationPhrase);
            $("ul").append("<li><a href='#'>" + userMacros[i].activationPhrase + "</a></li>");
        }
    });
    
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
        } else {
            $("#record").text("Stop Recording");
            $("#record").addClass("recording");
            chrome.runtime.sendMessage({
                message: "start_recording"
            });
        }
    });
});

$("#button2").on("click", function (e) {
    chrome.runtime.sendMessage({
        message: "open_tab",
        newUrl: "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?launch"
    });
    //openNewTab("http://localhost/TestNuance/recordPage.html?launch");
    //console.log("pressed launch");

});
