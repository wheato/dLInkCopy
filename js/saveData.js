var data = null,
    pageLinks = [];


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

    console.log(message.name);

    if(message.name == 'putItem'){

        data = message.data;

        window.localStorage.dlinkCopy = message.data;

        sendResponse('background get success');

    }

    if(message.name == 'updateItem'){

        sendResponse(window.localStorage.dlinkCopy);

    }

    if(message.name == 'putPageLinks'){

        pageLinks = message.data;

        sendResponse('send page Links Success');

    }

    if(message.name == 'getPageLinks'){

        sendResponse(pageLinks.join('\n'));

    }

});

