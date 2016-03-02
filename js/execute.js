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

function clickButton(query) {
    var jqEl = $(query);
    jqEl.click();
    if(jqEl[0].localName == "a")
        jqEl[0].click();
    else if(jqEl[0].localName == "input" && jqEl.attr("type") == "submit") {
        jqEl.closest("form")[0].submit(); //Submit the form
    }
}

function fillField(query, text) { //TODO
    //http://stackoverflow.com/questions/4158847/is-there-a-way-to-simulate-key-presses-or-a-click-with-javascript
    $(query).val(text);
}
