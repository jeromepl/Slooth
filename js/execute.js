
function redirectTo(url) {
	chrome.runtime.sendMessage({message: "open_tab", newUrl:url});
}

function clickButton(query) {
	$(query).click();
}

function fillField(query, text) {
	$(query).val(text);
}

//chrome.runtime.sendMessage({message: "start_recording"});