var trackedEvents = ["MOUSEDOWN", "MOUSEUP", "CLICK", "KEYDOWN", "KEYUP", "KEYPRESS", "DBLCLICK", "FOCUS", "BLUR", "SELECT", "CHANGE"]; // TODO possibly add MOUSEMOVE, MOUSEDRAG, MOUSEOVER
// These events can be grouped in 2 categories: MouseEvents and KeyboardEvents (TODO what are blur, focus, change and select events?)

function handleEvent(event) {
    console.log('Event triggered: ', event.type);
    console.log('on target: ' + event.target);
    console.log(event);
    console.log();
}

// Register all event listeners
trackedEvents.forEach(function(event) {
    document.body.addEventListener(event.toLowerCase(), handleEvent);
    console.log('Registered event:', event);
});

// Override stopPropagation and stopImmediatePropagation
var _stopPropagation = Event.stopPropagation;
var _stopImmediatePropagation = Event.stopImmediatePropagation;

Event.stopPropagation = function() {
    handleEvent(this);
    _stopPropagation.apply(this);
}
Event.stopImmediatePropagation = function() {
    handleEvent(this);
    _stopImmediatePropagation.apply(this);
}   

// To trigger the events, check out https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events