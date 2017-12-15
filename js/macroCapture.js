// Register most events on the page. This works by first subscrbing to all events below on the document.body of the page.
// Second, the stopPropagation and stopImmediatePropagation methods on Events are overriden in order to make sure that events
// that don't bubble all the way up to the body are still registered.

var trackedEvents = ["MOUSEDOWN", "MOUSEUP", "CLICK", "DBLCLICK", "KEYDOWN", "KEYUP", "KEYPRESS", "FOCUS", "BLUR", "SELECT", "CHANGE"];
// TODO possibly add MOUSEMOVE, MOUSEDRAG, MOUSEOVER, (SCROLL?)

function handleEvent(event) {
    var eventValues = parseEvent(event);
    
    chrome.runtime.sendMessage({
        message: "add_action",
        action: {
            type: "event",
            event: eventValues
        }	
    });
}

function parseEvent(event) {
    var eventValues = {};
    var originalEvent = event;
    
    while (event instanceof Object) {
        Object.getOwnPropertyNames(event).forEach(function (propName) {
            var value = originalEvent[propName];
            
            if (propName === propName.toUpperCase()) // Avoid saving constant values
                return;
            
            if (typeof originalEvent[propName] === 'object' || typeof originalEvent[propName] === 'function') {
                if (originalEvent[propName] instanceof Element) {
                    value = $(originalEvent[propName]).getQuery();
                }
                else {
                    return;
                }
            }
            
            eventValues[propName] = value;
        }, this);
        
        event = Object.getPrototypeOf(event);
    }
    
    // Add the event type to the list of values:
    var parentEvent;
    if (originalEvent instanceof MouseEvent) {
        parentEvent = "MouseEvent";
    } else if (originalEvent instanceof KeyboardEvent) {
        parentEvent = "KeyboardEvent";
    } else if (originalEvent instanceof Event) {
        parentEvent = "Event";
    }
        
    eventValues.parentEvent = parentEvent;
    
    // Special case for "change" event: Add the value changed to the event
    if (originalEvent.type === "change") {
        eventValues.changed_value = originalEvent.target.value;
    }
    
    return eventValues;
}

// Register all event listeners
trackedEvents.forEach(function(event) {
    document.body.addEventListener(event.toLowerCase(), handleEvent);
});

// Override stopPropagation and stopImmediatePropagation
var _stopPropagation = Event.prototype.stopPropagation;
var _stopImmediatePropagation = Event.prototype.stopImmediatePropagation;

// FIXME this does not work as the content_scripts of the extension run in a sandboxed environment. Changes to 'Event' won't be reflected on the main page
Event.prototype.stopPropagation = function() {
    handleEvent(this);
    _stopPropagation.apply(this, arguments);
};
Event.prototype.stopImmediatePropagation = function() {
    handleEvent(this);
    _stopImmediatePropagation.apply(this, arguments);
};
