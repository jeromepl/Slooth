var recording = false;

function startRecording() {
    recording = true;
}

function stopRecording() {
    recording = false;
}

$(document).on('click', function(e) {
    if(recording) {
        getQuery(e.target);
    }
});

//Detect URL change
$(document).on('ready', function(e) {
    if(recording) {
        window.location.href;
    }
});

$(document).on('blur', function(e) {
    if(recording) {
        $(e.target).text();
    }
});

$(document).on('submit', function(e) {
    if(recording) {
        //Similar to click on submit button?
    }
});
