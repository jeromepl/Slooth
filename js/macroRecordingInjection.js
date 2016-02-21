var confirmButton;
var msg;
var recordURL = "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?record";
var launchURL = "https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?launch";
$(document).ready(function () {

    var url = window.location.href;
    console.log(url + " is");
    if (url == recordURL) {
        console.log("record");
        $("#record").append("<button id=\"confirmation\">Register Macro Phrase</button>");
    }


    $("#confirmation").on("click", function () {
        msg = $("#textBox").text();
        console.log(url);
        if (url == recordURL) {
            // console.log(1);
            chrome.runtime.sendMessage({
                message: "setPhrase",
                phrase: msg
            });
            window.top.close();
        }
    });


    $("#textBox").bind('DOMNodeInserted DOMSubtreeModified DOMNodeRemoved', function (event) {
        console.log("test");
        if (url == launchURL) {
            msg = $("#textBox").text();
            console.log(msg);
            chrome.runtime.sendMessage({
                message: "loadPhrase",
                phrase: msg
            });
        }
    });

});
