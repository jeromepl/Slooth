chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "redirect_tab") {
    	redirectCurrentTab(sender, request.newUrl);
    }
    else if (request.message == "open_tab") {
    	openNewTab(request.newUrl);
    }
});

function redirectCurrentTab(sender, newUrl) {
	chrome.tabs.update(sender.tab.id, {url: newUrl});
}

function openNewTab(newUrl) {
	chrome.tabs.create({url: newUrl});
}