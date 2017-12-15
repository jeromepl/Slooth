$(document).ready(function () {
    // If this page was loaded from a redirect caused by a macro execution, tell the background script to continue the macro execution
    chrome.runtime.sendMessage({
        message: "continue_actions"
    });
});

// This listener is waiting for the background script to tell it what actions to do
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "execute") {
        if (request.action.type === "event") {
            triggerEvent(request.action.event);
        } // Redirects are handled in the background page
    }
});

// To trigger the events, check out https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
// TODO use TouchEvent for touch screens
function triggerEvent(savedEvent) {
    // Convert all query strings to element references:
    Object.keys(savedEvent).forEach(function (key) {
        if (typeof key === "string" && /^(#|html)/.test(savedEvent[key])) { // Replace query strings by their corresponding elements
            var $element = $(savedEvent[key]);
            if ($element.length) {
                savedEvent[key] = $element[0];
            } else {
                // TODO When an element cannot be found, it could be that it is loaded asynchronously (waiting on some AJAX call). We could thus wait a few ms and try again
                console.warn("Key '" + key + "' could not be parsed to element: " + savedEvent[key]);
                savedEvent[key] = null;
            }
        }
    });
    
    // If the target could not be parsed, do not fire the event
    if (!savedEvent.target) {
        return;
    }
    
    // Create the appropriate event:
    var event;
    switch (savedEvent.parentEvent) {
        case "MouseEvent":
            event = new MouseEvent(savedEvent.type, savedEvent);
            break;
        case "KeyboardEvent":
            event = new KeyboardEvent(savedEvent.type, savedEvent);
            break;
        case "Event":
            event = new Event(savedEvent.type, savedEvent);
            break;
    }
    
    // Special case for "change" event: Need to actually change the value
    if (event.type === "change") {
        savedEvent.target.value = savedEvent.changed_value;
    }
    
    // Dispatch the event:
    savedEvent.target.dispatchEvent(event);
}
