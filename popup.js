
var links = [],
    pageLinkText = '',
    copyType = 0; //0:列表, 1:页面所有

var copyListBtn = document.querySelector('.btn-copy-list'),
    copyAllBtn = document.querySelector('.btn-get-all-ml'),
    listCount = document.querySelector('#J_list_count'),
    listWrap = document.querySelector('.link-list');

function deleteItemHandler (e) {

    if(e.target.className == 'btn-del-item'){

        var target = e.target,
            index = target.getAttribute('data-index'),
            ddNode = target.parentNode;

        ddNode.parentNode.removeChild(ddNode);

        links.splice(index, 1);

        listCount.innerHTML = '(' + links.length + ')';

        if(links.length == 0){

            copyListBtn.className += ' disable';
            listWrap.className += ' none';

        }

        window.localStorage.dlinkCopy = JSON.stringify(links);

    }

}

function showTips () {
    var tips = document.querySelector('.m-float-tips');
    tips.style.display = 'block';

    var hide = function (e) {

        tips.style.display = 'none';

        tips.removeEventListener('webkitAnimationEnd', hide);

    };

    tips.addEventListener('webkitAnimationEnd', hide);

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
    var ddDoms = null;

    if(copyType == 0) {

        clipboardData.setData('Text', links.join('\n'));

        //清除Data
        window.localStorage.dlinkCopy = '';
        links = [];

        copyListBtn.className += ' disable';
        listWrap.className += ' none';
        listCount.innerHTML = '(0)';

        ddDoms = document.querySelectorAll('.link-list dd');

        for(var i = 0; i < ddDoms.length; i++){

            ddDoms[i].parentNode.removeChild(ddDoms[i]);

        }

    } else if(copyType == 1){

        console.log(pageLinkText);

        clipboardData.setData('Text', pageLinkText);

    }

    showTips();

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

    window.localStorage.dlinkCopy && (links = JSON.parse(window.localStorage.dlinkCopy));

    links.forEach(function ( link, index ) {
        
        htmlText += tpl.replace('{0}', link).replace('{1}', index);
        
    });

    if(links.length == 0){

        listWrap.className += ' none';

    } else {

        listWrap.className = listWrap.className.replace('none', '').trim();

    }

    listCount.innerHTML = '(' + links.length + ')';

    listWrap.innerHTML += htmlText;

    //update dom object
    copyListBtn = document.querySelector('.btn-copy-list');
    copyAllBtn = document.querySelector('.btn-get-all-ml');
    listCount = document.querySelector('#J_list_count');

    if(links.length != 0){

        copyListBtn.className = copyListBtn.className.replace('disable', '').trim();

    }

    document.body.addEventListener('click', deleteItemHandler);
    copyListBtn.addEventListener('click', copyListHandler);
    copyAllBtn.addEventListener('click', copyAllHandler);
    document.body.addEventListener('copy', copyHandler);

});










