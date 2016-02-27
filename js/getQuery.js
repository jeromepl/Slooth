//From an DOM element, get a query to that DOM element
function getQuery(e) {
    var element = e;
    var query = [];

    while(!element.id && element != $('html')[0]) {
        var jEl = $(element);
        if(jEl.index() > 0) { //Since nth-child, eq and nth-of-type dont work well with multiple sub-children, give up and just store the whole element
            query.push(" > " + element.localName + jEl.index()); //TODO test this
            query = [e];
            break;
        }
        else {
            query.push(element.localName);
        }
        element = $(element).parent()[0];
    }

    var id;
    if(id = element.id) //Add the last id
        query.push('#' + id);

    //Reverse the array
    for(var i = 0; i < query.length / 2; i++) {
        var temp = query[i];
        query[i] = query[query.length - 1 - i];
        query[query.length - 1 - i] = temp;
    }

    //Assemble the string
    var finalString = "";
    if(query.length > 1)
        finalString = query.join(" ");
    else
        finalString = query[0];

    //console.log(finalString);
    //console.log($(finalString)[0]);
    return finalString;
}
