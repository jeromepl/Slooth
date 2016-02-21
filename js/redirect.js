var recording = false;
var needFlushing = false;

var actions = [];
var phrase ="";
var tempActions = [];

var activeMacro =0;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "redirect_tab") {
    	redirectCurrentTab(sender, request.newUrl);
    }
    else if (request.message == "open_tab") {
    	openNewTab(request.newUrl);
    }
    else if (request.message == "start_recording") {
    	console.log("START");
    	actions = [];
    	recording = true;
    }
    else if (request.message == "stop_recording") {
    	console.log("STOP");
    	openNewTab("http://localhost/TestNuance/recordPage.html?record");
    	recording = false;
    }
    else if (request.message == "add_action") {
    	if (recording) {
    		actions.push(request.action);
    	}
    }
    else if (request.message == "is_recording") {
    	sendResponse({rec:recording});
    }
    else if (request.message == "run_macro") {
    	load();
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    		//chrome.tabs.sendMessage(tabs[0].id, {message: "execute_actions", macro: actions});
    		executeActions(actions, tabs[0]);

    	});
    }
    else if (request.message == "flush_actions") {
    	if (needFlushing) {
    		needFlushing = false;
        	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        		//chrome.tabs.sendMessage(tabs[0].id, {message: "execute_actions", macro: actions});
        		executeActions(tempActions, tabs[0]);

        	});
    	}
    }
    else if(request.message =="setPhrase")
    {
        phrase = request.phrase;
        store();
    }
    else if(request.message =="loadPhrase")
    {
        console.log("hear you loud and clear");
        chrome.storage.local.get({userMacros:[]},function(result){

        var userMacros = result.userMacros;
        if(userMacros.length!=0)
        {

            var result =-1;
             for(var i=0; i<userMacros.length;i++)
            {
               if(userMacros[i].activationPhrase == request.phrase)
               {
                 result=i;
                 break;
               }
            }
            if(result!=-1)
            {
                actions=tempActions= userMacros[result].macros;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                executeActions(tempActions, tabs[0]);

                });
            }
            else
            {
                sendResponse({error_msg:"No Macros matched activation phrase."});

            }
        }
        else
        {
            sendResponse({error_msg:"There are no macros to launch!"});
        }
        
      });
    }
});

function executeActions(acts, tab) {
	for (var i = 0; i < actions.length; i++) {
		console.log(actions[i]);
		if (actions[i].type == "redirect" && i != actions.length - 1) {
			tempActions = acts.slice(i+1, actions.length);
			needFlushing = true;
    		chrome.tabs.sendMessage(tab.id, {message: "execute", action: acts[i]});
    		break;
		}
		else {
			chrome.tabs.sendMessage(tab.id, {message: "execute", action: acts[i]});
		}
	}
}

function redirectCurrentTab(sender, newUrl) {
	chrome.tabs.update(sender.tab.id, {url: newUrl});
}

function openNewTab(newUrl) {
	chrome.tabs.create({url: newUrl});
}


function store() {
	for (var i = 0; i < actions.length; i++) {
		console.log(actions[i]);
	}
    chrome.storage.local.get({userMacros:[]},function(result){
        var userMacros = result.userMacros;
        userMacros.push({"macros" : actions,"activationPhrase":phrase});

        chrome.storage.local.set({"userMacros":userMacros});
    });
	//chrome.storage.local.set({"macros" : actions,"activationPhrase":phrase});
}

function load() {
      chrome.storage.local.get({userMacros:[]},function(result){

        var userMacros = result.userMacros;
        actions = userMacros[0].macros;
        phrase = userMacros[0].activationPhrase;
      });
	/*chrome.storage.local.get("macros", function(items) {
		console.log(items);
		actions = items.macros;
	});
    chrome.storage.local.get("activationPhrase",function(msg){
        console.log(msg);
        phrase=msg;
    })*/

}
