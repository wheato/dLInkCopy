
var links = [],
    pageLinkText = '',
    copyType = 0; //0:列表, 1:页面所有

function deleteItemHandler (e) {

    if(e.target.className == 'btn-del-item'){

        var target = e.target,
            index = target.getAttribute('data-index'),
            ddNode = target.parentNode;

        ddNode.parentNode.removeChild(ddNode);

        links.splice(index, 1);

        if(links.length == 0){

            document.querySelector('.btn-copy-list').className += ' disable';

        }

        window.localStorage.dlinkCopy = JSON.stringify(links);

    }

}

function copyListHandler (e) {

    if(e.target.className.indexOf('disable') > -1){

        return false;

    }

    copyType = 0;
    document.execCommand("copy");
}

function copyHandler (e) {

    e.preventDefault();

    var clipboardData = e.clipboardData;

    if(copyType == 0) {
        clipboardData.setData('Text', links.join('\n'));
    } else if(copyType == 1){

        console.log(pageLinkText);

        clipboardData.setData('Text', pageLinkText);

    }

    //清除Data
    window.localStorage.dlinkCopy = '';
    links = [];
    document.querySelector('.btn-copy-list').className += ' disable';

}

function copyAllHandler (e) {
    copyType = 1;

    chrome.runtime.sendMessage({

        'name': 'getPageLinks'

    }, function(response){

        pageLinkText = response;
        
        document.execCommand("copy");

    });
}

document.addEventListener('DOMContentLoaded', function() {

    var htmlText = '',
        tpl = '<dd class="link-item" data-index="{1}"><input type="input" class="link-input" value="{0}"><span class="btn-del-item"></span></dd>';

    var copyListBtn = document.querySelector('.btn-copy-list'),
        copyAllBtn = document.querySelector('.btn-get-all-ml');

    window.localStorage.dlinkCopy && (links = JSON.parse(window.localStorage.dlinkCopy));

    links.forEach(function ( link, index ) {
        
        htmlText += tpl.replace('{0}', link).replace('{1}', index);
        
    });

    document.querySelector('.link-list').innerHTML += htmlText;

    if(links.length != 0){

        copyListBtn.className = copyListBtn.className.replace('disable', '').trim();

    }

    document.body.addEventListener('click', deleteItemHandler);
    copyListBtn.addEventListener('click', copyListHandler);
    copyAllBtn.addEventListener('click', copyAllHandler);
    document.body.addEventListener('copy', copyHandler);

});










