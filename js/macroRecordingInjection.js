var confirmButton;
var msg;
var recordURL = "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?record";
var launchURL = "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?launch";
$(document).ready(function () {

    var url = window.location.href;
    if (url == recordURL) {
        $("#record").append("<button id=\"confirmation\">Register Macro Phrase</button>");
    }


    $("#confirmation").on("click", function () {
        msg = $("#textBox").text(); //The text returned by Nuance
        console.log(url);
        if (url == recordURL) {
            chrome.runtime.sendMessage({ //Set the launch text of the last recorded macro
                message: "setPhrase",
                phrase: msg
            });
            window.top.close(); //Close the tab
        }
    });


    $("#textBox").bind('DOMNodeInserted DOMSubtreeModified DOMNodeRemoved', function (event) {
        if (url == launchURL) {
            msg = $("#textBox").text(); //The text returned by Nuance
            chrome.runtime.sendMessage({ //Launch the macro if there is one corresponding to this text
                message: "loadPhrase",
                phrase: msg
            });
            //No need to close the tab, the macro actions will simply redirect it to some other url
        }
    });

});
