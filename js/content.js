
(function () {

    var pageLinks = [],
        mLinks = [];

    //判断一个链接是不是磁力链接
    var isMagnet = function (link) {

        var reg = /magnet:\?xt=/ig;

        return reg.test(link);

    };

    //保存到localstorage
    var saveToLs = function (link) {

        var links = [];

        chrome.runtime.sendMessage({

            'name': 'updateItem'

        }, function(localData){

            if(localData){
                links = JSON.parse(localData);
            }


            links.push(link);

            chrome.runtime.sendMessage({

                'name': 'putItem',
                'data': JSON.stringify(links)

            }, function(response){

                console.log(response);

            });

        });

    };

    //找到页面所有的Magnet
    var findMagnet = function (htmlText) {

        var reg = /magnet:?[^\"]+/ig;

        return htmlText.match(reg);

    };

    //增加标记;
    var addTag = function (dom, link) {

        var span = document.createElement('span');
        span.className = 'dLink-add-to-list';
        span.style = 'color:red;cursor: pointer;';
        span.innerHTML = '添加到列表';
        span.setAttribute('data-link', link);
        dom.appendChild(span);

    };

    //setStyle
    var setAddedStyle = function ($dom) {
        $dom.css({
            'cursor': 'default',
            'color': 'grey'
        });
        $dom.html('已添加').addClass('hasAdded');
    };

    //获取ajax页面的磁力链接
    var getNextPageMLink = function(link, cb ){

        $.ajax({
            url: link,
            type: 'GET',
            success: function(data){

                //提取里面是不是有磁力链接
                var m = findMagnet(data);

                cb && cb(m);

            }
        });

    };

    //获取页面所有的A标签
    var getAllLinkDom = function () {

        var aDoms = document.querySelectorAll('a');

        aDoms = Array.prototype.slice.call(aDoms);

        return aDoms;

    };

    //事件函数
    var addToListHandler = function (e) {

        e.stopPropagation();

        if( $(this).hasClass('hasAdded') ){

            return false;

        } else {

            setAddedStyle($(this));

            saveToLs($(this).attr('data-link'));

        }

    };

    var init = function () {

        var aDoms = getAllLinkDom();

        aDoms.forEach( function (dom) {

            if( isMagnet(dom.getAttribute('href')) ){

                pageLinks.push(dom.getAttribute('href'));

                addTag(dom.parentNode, dom.getAttribute('href'));

            }

        });

        //同步整个页面的链接
        chrome.runtime.sendMessage({
            'name': 'putPageLinks',
            'data': pageLinks
        }, function(response){
            console.log(response);
        });

        $('body').on('click', '.dLink-add-to-list', addToListHandler);

    };

    init();



})();

