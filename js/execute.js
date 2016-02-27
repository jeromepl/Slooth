$(document).ready(function () {
    //If this page was loaded from a redirect caused by a macro execution, tell the background script to continue the macro execution
    chrome.runtime.sendMessage({
        message: "continue_actions"
    });
});

//This listener is waiting for the background script to tell it what actions to do
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "execute") {
        if (request.action.type == "redirect") {
            redirectTo(request.action.url);
        } else if (request.action.type == "click") {
            clickButton(request.action.element);
        } else {
            console.log("Oops, this action is not yet supported");
        }
    }
});

//Redirects the current tab
function redirectTo(url) {
    chrome.runtime.sendMessage({
        message: "redirect_tab",
        newUrl: url
    });
}

function clickButton(query) { //TODO, fix query
    $(query).click();
}

function fillField(query, text) { //TODO
    $(query).val(text);
}
