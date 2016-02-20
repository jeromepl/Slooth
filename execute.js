
function redirectTo(url) {
    window.location.href = url;
}

function clickButton(query) {
	$(query).click();
}

function fillField(query, text) {
	$(query).val(text);
}