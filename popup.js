
function getCurrentTabUrl(callback) {

    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {

        var tab = tabs[0];

        var url = tab.url;

        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);

    });

}

function addToList(link) {

}

document.addEventListener('DOMContentLoaded', function() {

    getCurrentTabUrl(function(url) {

    });
});