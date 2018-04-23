'use strict';

var booksy = booksy || {};

(function () {

    var version = '1.0.1';

    var config = { baseUrl:"https://booksy.com/widget/", lang:"en", country:"gb", id:"4801" };

    config.mode = config.mode || 'dialog';
    config.theme = 'default'; // config.theme || 'default';
    config.iframeSrc = config.baseUrl + 'index.html?id=' + config.id + '&lang=' + config.lang + '&country=' + config.country + '&mode=' + config.mode;

    console.log("booksy.widget | config: ", config);

    var widgetContainer = document.getElementsByClassName('booksy-widget-container');

    var buttons = document.getElementsByClassName('booksy-widget-button');

    if (buttons) {
        console.log(buttons.length + " Widget Buttons Found");
    }
    else {
        console.log("No Widget Buttons Found");
    }

    if (config.mode == 'dialog') {
        var portraitButton = document.getElementsByClassName('booksy-widget-button')[0];
        var landscapeButton = document.getElementsByClassName('booksy-widget-button')[1];
        if (portraitButton) {
            portraitButton.addEventListener('click', function () {
                getOS() === 'other' ? dialogOpen(config.iframeSrc) : createDeepLink(config);
            });
            console.log ("portrait Button Event Added");
        }
        if (landscapeButton) {
            landscapeButton.addEventListener('click', function () {
                getOS() === 'other' ? dialogOpen(config.iframeSrc) : createDeepLink(config);
            });
            console.log ("landscape Button Event Added");
        }

        return;
    }

    if (config.mode == "inline") {
        createIframe(widgetContainer, config.iframeSrc);
        return;
    }

    errorBreak('unexpected widget mode', config.mode);

    /* Functions */

    function errorBreak() {
        var args = Array.prototype.slice.call(arguments);
        try {
            console.log.apply(console, args.unshift('[Booksy][widget][error]'));
        } catch (e) {};
        return;
    }

    function generateUniqueId(pattern) {
        pattern = pattern || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return pattern.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }

    function iframeFactory(options) {

        var opts = options || {};
        // inject unique identifier into iframe source address
        opts.src += (opts.src.indexOf('?') > -1 ? '&' : '?') + 'uniqueId=' + opts.uniqueId;

        var container = opts.container || document.body;
        var iframeId = undefined;

        return {
            create: create,
            element: function element() {
                return container.querySelector('iframe');
            }
        };

        function create() {
            if (iframeId) {
                return;
            }
            iframeId = generateUniqueId('iframe-xxxx');

            container.insertAdjacentHTML('beforeend', '\n                <iframe \n                    width="' + (opts.width || 476) + '" \n                    height="' + (opts.height || 660) + '"\n                    src="' + opts.src + '"\n                    style="border: 0">\n            ');

            // register "message" handler
            window.addEventListener('message', messageHandler, true);
        }

        function messageHandler(event) {
            var data = event.data;

            /**
             * data : {
             *     uniqueId : ...,
             *     events   : {
             *         name => { ... },
             *         ...
             *     }
             * }
             */

            // ignore message, if response unique identifier doesn't
            // match iframe src unique identifier
            if (data.uniqueId != opts.uniqueId || !data.events) {
                return;
            }

            var events = ['resize', 'close'];

            for (var i = events.length - 1; i > -1; i--) {
                var name = events[i];

                if (data.events[name]) {
                    // "close" => "onClose"
                    var callback = opts["on" + name.charAt(0).toUpperCase() + name.substr(1)];

                    // shortcut
                    if (typeof callback !== "function") continue;

                    try {
                        callback(data.events[name]);
                    } catch (e) {};
                }
            }
        }
    }

    function getOS() {

        return 'other';

        var ua = navigator.userAgent || navigator.vendor || window.opera;
        var os = 'other';

        if (ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/iPod/i)) {
            os = 'ios';
        } else if (ua.match(/Android/i)) {
            os = 'android';
        }

        return os;
    }

    function dialogOpen(src) {
        var overlay = document.createElement('div');
        overlay.setAttribute('class', 'booksy-widget-overlay');
        document.body.appendChild(overlay);

        var dialog = document.createElement('div');
        dialog.setAttribute('class', 'booksy-widget-dialog');
        document.body.appendChild(dialog);

        createIframe(dialog, src, overlay);

        scrollToElement(dialog);
    }

    function createIframe(container, src, overlay) {
        var iframe = iframeFactory({
            uniqueId: generateUniqueId('xxxxxxxxxx'),
            src: src,
            // width  : 650,
            // height : 800,
            container: container,
            onResize: function onResize(params) {
                window.setTimeout(function () {
                    iframe.element().style.height = params.height + 15 + 'px';
                }, 50);
            },
            onClose: function onClose() {
                container.remove();
                if (overlay) overlay.remove();
            }
        });

        return iframe.create();
    }

    function createDeepLink(config) {

        var cls = 'booksy-widget-mobile-overlay';
        var containerId = generateUniqueId('dl-xxxx');
        var skipId = generateUniqueId('skip-xxxx');

        document.body.insertAdjacentHTML('afterbegin', '\n            <div id="' + containerId + '" class="' + cls + ' ' + cls + '-' + config.lang + '">\n                <div class="' + cls + '-container">\n                    <a href="' + config.mobileOverlayUrl + '" class="' + cls + '-dl"></a>\n                    <a id="' + skipId + '" href="#skip" class="' + cls + '-skip">Skip</a>\n                </div>\n            </div>\n        ');

        document.getElementById(skipId).addEventListener('click', function () {
            document.getElementById(containerId).remove();
            dialogOpen(config.iframeSrc);
            return false;
        });
    }

    function scrollToElement(element) {
        window.scroll(0, findPosition(element));
    }

    function findPosition(element) {
        var current = 0;
        if (element.offsetParent) {
            do {
                current += element.offsetTop;
            } while (element = element.offsetParent);
            return [current];
        }
    }
})();