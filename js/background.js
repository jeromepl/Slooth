var recording = false;
var waiting = false; // If the current macro execution is waiting on a redirect to finish

var actions = []; // The actions of the currently loaded macro, or the remaining actions to perform after a redirect
var executingTabID; // The Chrome tab ID of the tab in which the macro is being executed

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
        case "run_macro": // Run a specific macro (specified by request.macroName)
            console.log("Launch macro " + request.macroName);
            load(request.macroName, function() {
                if (request.newTab) {
                    chrome.tabs.create({}, function(tab) {
                        executingTabID = tab.id;
                        executeActions(executingTabID);
                    });
                } else {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function (tabs) {
                        executingTabID = tabs[0].id;
                        executeActions(executingTabID);
                    });
                }
            });
            break;
        case "remove_macro":
            console.log("Remove macro " + request.macroName);
            remove(request.macroName);
            break;
        case "continue_actions":
            if (waiting) { // The redirect has finished, we can continue running the actions
                console.log("Continue actions");
                waiting = false;
                executeActions(executingTabID);
            }
            break;
        case "saveMacro": // Save the recorded actions into storage with the given name in request.macroName
            console.log("Saving macro with name " + request.macroName);
            store(actions, request.macroName);
            break;

    }
});

function executeActions(tabID) {
    for (var i = 0; i < actions.length; i++) {
        
        var actionType = actions[i].type;

        console.log("Run " + actionType + " action");
        
        if (actionType === "redirect") {
            // Redirects the current tab
            chrome.tabs.update(tabID, {
                url: actions[i].url
            });
        }

        // If the action is redirect we need to store the remaining actions that will need to be performed after the new page has loaded
        if ((actionType === "redirect" || actionType === "event_redirect") && i !== actions.length - 1) {
            actions = actions.slice(i + 1, actions.length);
            waiting = true;
            break;
        } else { // The handlers for the other 'actionType's are in the content script. Send a message to run them
            chrome.tabs.sendMessage(tabID, {
                message: "execute",
                action: actions[i]
            });
        }
    }
}

// Add a macro to the current list of macros in the local storage
function store(macroActions, macroName) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        userMacros.push({
            "actions": macroActions,
            "name": macroName
        });

        chrome.storage.local.set({
            "userMacros": userMacros
        });
    });
}

// Load a macro into the variables actions
function load(macroName, callback) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {

        var userMacros = result.userMacros;
        actions = [];

        for (var i = 0; i < userMacros.length; i++) {
            if (userMacros[i].name === macroName) {
                actions = userMacros[i].actions;
                break;
            }
        }

        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

// Delete a macro with the given name
function remove(macroName) {
    chrome.storage.local.get({
        userMacros: []
    }, function (result) {
        var userMacros = result.userMacros;
        for (var i = 0; i < userMacros.length; i++) {
            if (userMacros[i].name === macroName) {
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
