var recording = false;
var waiting = false; //If the current macro execution is waiting on a redirect to finish

var actions = []; //The actions of the currently loaded macro, or the remaining actions to perform

var activeMacro = 0;

//Listener for redirects not caused by clicks
chrome.webNavigation.onCommitted.addListener(function (e) {
    if(e.transitionType != "auto_subframe" && e.transitionType != "generated" && e.transitionType != "reload" && e.transitionType != "link" && e.transitionType != "form_submit") {
        actions.push({
            type: "redirect",
            url: e.url
        });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "redirect_tab") {
        redirectCurrentTab(sender, request.newUrl);
    }
    else if (request.message == "open_tab") {
        openNewTab(request.newUrl);
    }
    else if (request.message == "start_recording") {
        console.log("START");
        actions = []; //Reset the actions
        recording = true;
    }
    else if (request.message == "stop_recording") {
        console.log("STOP");
        openNewTab("https://gator4158.hostgator.com/~anecdote/slooth.tech/recordPage.html?record"); //Open this page to attach a phrase to the recorded macro
        recording = false;
    }
    else if (request.message == "add_action") { //A click, redirect, form submission or other event was detected: add it to the actions list
        console.log(request.action.type);
        if (recording) {
            actions.push(request.action);
        }
    }
    else if (request.message == "is_recording") {
        sendResponse({
            rec: recording
        });
    }
    else if (request.message == "run_macro") { //Run a specific macro (specified by request.phrase)
        console.log(1234);
        load(request.phrase);
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            executeActions(actions, tabs[0]);

        });
    }
    else if (request.message == "continue_actions") {
        if (waiting) {
            waiting = false;
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                executeActions(actions, tabs[0]);
            });
        }
    }
    else if (request.message == "setPhrase") {
        store(actions, request.phrase);
    }
    else if (request.message == "loadPhrase") {
        chrome.storage.local.get({
            userMacros: []
        }, function (result) {

            var userMacros = result.userMacros;
            if (userMacros.length != 0) {

                var result = -1; //Will stay -1 if no activation phrase matches the current phrase
                for (var i = 0; i < userMacros.length; i++) {
                    if (userMacros[i].activationPhrase == request.phrase) {
                        result = i;
                        break;
                    }
                }
                if (result != -1) { //Launch the macro with matching phrase!
                    actions = userMacros[result].macros;
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function (tabs) {
                        executeActions(actions, tabs[0]);
                    });
                }
                else {
                    sendResponse({
                        error_msg: "No Macros matched activation phrase."
                    });

                }
            }
            else {
                sendResponse({
                    error_msg: "There are no macros to launch!"
                });
            }

        });
    }
});

function executeActions(acts, tab) {
    for (var i = 0; i < actions.length; i++) {
        console.log(actions[i]);
        if (actions[i].type == "redirect" && i != actions.length - 1) { //If its a redirect we need to store the remaining actions that will need to be performed after the new page has loaded
            actions = acts.slice(i + 1, actions.length);
            waiting = true;
            chrome.tabs.sendMessage(tab.id, {
                message: "execute",
                action: acts[i]
            });
            break;
        } else { //The other executes methods are in the content script. Send a message to run them
            chrome.tabs.sendMessage(tab.id, {
                message: "execute",
                action: acts[i]
            });
        }
    }
}

function redirectCurrentTab(sender, newUrl) {
    chrome.tabs.update(sender.tab.id, {
        url: newUrl
    });
}

function openNewTab(newUrl) {
    chrome.tabs.create({
        url: newUrl
    });
}

//Add a macro to the current list of macros in the local storage
function store(acts, activationPhrase) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        userMacros.push({
            "macros": acts,
            "activationPhrase": activationPhrase
        });

        chrome.storage.local.set({
            "userMacros": userMacros
        });
    });
}

//Load a macro into the variables actions and phrase
function load(phrase) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {

        var userMacros = result.userMacros;

        for(var i = 0; i < userMacros.length; i++) {
            if(userMacros[i].activationPhrase == phrase) {
                actions = userMacros[i].macros;
                break;
            }
        }
    });
}
