(function ($) {
    // See https://gist.github.com/jeromepl/e77469ebf862494387bdfbaca7a9a57d
    //
    // From an DOM element, get a query to that DOM element
    // Returns, for example, "html>body:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)"
    // Or, "#some-id>div:nth-of-type(2)"
    //
    // Usage: $(someElement).getQuery();
    $.fn.getQuery = function() {
        var id = this.attr('id');
        var localName = this.prop('localName');

        if (id)
            return '#' + escapeCSSString(id);
        if (localName === 'html')
            return 'html';

        var parentSelector = this.parent().getQuery();
        var index = this.index(parentSelector + '>' + localName) + 1;
        return parentSelector + '>' + localName + ':nth-of-type(' + index + ')';
    };

    // Colons and spaces are accepted in IDs in HTML but not in CSS syntax
    // Similar (but much more simplified) to the CSS.escape() working draft
    function escapeCSSString(cssString) {
        return cssString.replace(/(:)/g, "\\$1");
    }
}(jQuery));
