$(document).on('click', function (e) { //TODO, fix query and this should work
    /*chrome.runtime.sendMessage({
        message: "add_action",
        action: {
            type: "click",
            element: getQuery(e.target)
        }
    });*/
});


//Detect URL change
$(document).on('ready', function (e) {
    chrome.runtime.sendMessage({
        message: "add_action",
        action: {
            type: "redirect",
            url: window.location.href,
        }
    });
});

window.addEventListener('beforeunload', function (event) { //TODO could maybe be used to differentiate click from redirect?
    console.log(window.location.href);
    //console.log(event);
    //chrome.runtime.sendMessage({message: "add_action", action: {
    //type: "redirect",
    //url: window.location.href,
    //}});
});

$(document).on('blur', function (e) { //TODO not working
    chrome.runtime.sendMessage({
        message: "add_action",
        action: {
            type: "text",
            text: $(e.target).text()
        }
    });
});

$('form').on('submit', function (e) {
});
