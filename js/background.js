var recording = false;
var waiting = false; // If the current macro execution is waiting on a redirect to finish

var actions = []; // The actions of the currently loaded macro, or the remaining actions to perform after a redirect

updateBrowserBadge(); // Update the badge initially

// Listener for redirects not caused by clicks
chrome.webNavigation.onCommitted.addListener(function (e) {
    if (recording && e.transitionType != "auto_subframe") {
        if (e.transitionType === "generated" || e.transitionType === "reload" || e.transitionType === "link" || e.transitionType === "form_submit") {
            // If the redirect was caused by a click, save the redirect in order to wait for pageLoad when executing the macro
            actions.push({ type: "event_redirect" });
            console.log("Transition: " + e.transitionType);
        } else {
            console.log("Redirect: " + e.transitionType + ", " + e.url);
            actions.push({
                type: "redirect",
                url: e.url
            });
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "start_recording":
            console.log("Start Recording");
            actions = []; // Reset the actions
            recording = true;
            updateBrowserBadge();
            break;
        case "stop_recording":
            console.log("Stop Recording");
            recording = false;
            updateBrowserBadge();
            break;
        case "add_action": // A click, redirect, form submission or other event was detected: add it to the actions list
            if (recording) {
                console.log("Add " + request.action.type + " action");
                actions.push(request.action);
            }
            break;
        case "is_recording": // Check if we are currently recording. Used by the popup
            sendResponse({
                rec: recording
            });
            break;
        case "run_macro": // Run a specific macro (specified by request.phrase)
            console.log("Launch macro " + request.phrase);
            load(request.phrase, function() {
                if (request.newTab) {
                    chrome.tabs.create({}, function(tab) {
                        executeActions(actions, tab);
                    });
                } else {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function (tabs) {
                        executeActions(actions, tabs[0]);
                    });
                }
            });
            break;
        case "remove_macro":
            console.log("Remove macro " + request.phrase);
            remove(request.phrase);
            break;
        case "continue_actions":
            if (waiting) { // The redirect has finished, we can continue running the actions
                console.log("Continue actions");
                waiting = false;
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {
                    executeActions(actions, tabs[0]);
                });
            }
            break;
        case "setPhrase": // Save the recorded actions into storage with the given phrase
            console.log("Set phrase " + request.phrase);
            store(actions, request.phrase);
            break;

    }
});

function executeActions(acts, tab) {
    for (var i = 0; i < actions.length; i++) {
        
        var actionType = actions[i].type;

        console.log("Run " + actionType + " action");
        
        if (actionType === "redirect") {
            // Redirects the current tab
            chrome.tabs.update(tab.id, {
                url: actions[i].url
            });
        }

        // If the action is redirect we need to store the remaining actions that will need to be performed after the new page has loaded
        if ((actionType === "redirect" || actionType === "event_redirect") && i !== actions.length - 1) {
            actions = acts.slice(i + 1, actions.length);
            waiting = true;
            break;
        } else { // The handlers for the other 'actionType's are in the content script. Send a message to run them
            chrome.tabs.sendMessage(tab.id, {
                message: "execute",
                action: acts[i]
            });
        }
    }
}

// Add a macro to the current list of macros in the local storage
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

// Load a macro into the variables actions and phrase
function load(phrase, callback) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {

        var userMacros = result.userMacros;
        actions = [];

        for (var i = 0; i < userMacros.length; i++) {
            if (userMacros[i].activationPhrase === phrase) {
                actions = userMacros[i].macros;
                break;
            }
        }

        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

// Delete a macro for the given phrase
function remove(phrase) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            if (userMacros[i].activationPhrase === phrase) {
                userMacros.splice(i,1);
                break;
            }
        }

        chrome.storage.local.set({
            "userMacros": userMacros
        });
    });
}

// Update the badge over the icon in the chrome menu to show a "recording" sign if we are recording
function updateBrowserBadge() {
    if (recording) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000" });
        chrome.browserAction.setBadgeText({ text: " ◉" });
        chrome.browserAction.setTitle({ title: "Slooth - Recording" });
    } else {
        chrome.browserAction.setBadgeText({ text: "" });
        chrome.browserAction.setTitle({ title: "Slooth" });
    }
}
