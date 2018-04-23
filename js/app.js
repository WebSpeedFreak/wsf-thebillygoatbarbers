(function () {
    'use strict';

    var screenWidth = 0;
    var screenHeight = 0;

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    var headerElement = null;
    var headerHeight = 0;
    var footerElement = null;
    var footerHeight = 0;

    var screenOrientation = {
        Undefined: 0,
        Portrait: 1,
        Landscape: 2
    };

    var liveOrientation = 0;

    var resizeTimer;

    var appLaunched = false;

    var pageNotFound = false;

    function GetElementData() {
        headerElement = document.getElementsByTagName('header')[0];
        if (headerElement) {
            headerHeight = headerElement.clientHeight;
        }
        footerElement = document.getElementsByTagName('footer')[0];
        if (footerElement) {
            footerHeight = footerElement.clientHeight;
        }
        console.log("Header/Footer Heights : " + headerHeight + " / " + footerHeight);
    }

    function GetScreenData() {
        screenWidth = screen.width;
        screenHeight = screen.height;
        console.log("Screen Size : " + screenWidth + " by " + screenHeight);

        windowWidth = $(window).width();
        windowHeight = $(window).height();
        console.log("Window Size : " + windowWidth + " by " + windowHeight);
    }

    function ScaleSections() {
        var sectionHeight = windowHeight - headerHeight;
        console.log("Section Height : " + sectionHeight);
        if (screenWidth < 320) {
            $('section#home').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#prices').removeAttr("style");
            $('section#hours').removeAttr("style");
            return;
        }
        if ((screenWidth >= 320) && (screenWidth < 768)) {
            $('section#home').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#prices').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#hours').each(function () {
                this.style.height = (sectionHeight - footerHeight) + "px";
            });
            return;
        }
        if ((screenWidth >= 768) && (screenHeight <= 480)) {
            $('section#home').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#prices').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#hours').each(function () {
                this.style.height = (sectionHeight - footerHeight) + "px";
            });
            return;
        }
        if (screenWidth >= 768) {
            $('section#home').each(function () {
                this.style.height = sectionHeight + "px";
            });
            $('section#prices').removeAttr("style");
            $('section#hours').removeAttr("style");
        }
    }
    function ScalePageNotFound() {
        var sectionHeight = windowHeight - headerHeight;
        console.log("Section Height : " + sectionHeight);
        $('section#page-not-found').each(function () {
            this.style.height = (sectionHeight - footerHeight) + "px";
        });
    }

    function ScaleOverlay() {
        var $owrapper = $('.banner-overlay-wrapper');
        var $overlay = $('.banner-overlay');
        var $oWidth = $overlay.innerWidth();
        var $oHeight = $overlay.innerHeight();
        var $wWidth = $(window).width();
        var $wHeight = $(window).height();
        var $top = ($wHeight - $oHeight) - 120 + "px";

        var $translate = "translate(0," + $top + ")";
        $owrapper.css({
            transform: $translate
        });
        console.log("Banner Overlay Top : " + $wHeight + " " + $oHeight + " " + $top);

        var $left = (($wWidth - $oWidth) / 2) + "px";
        $overlay.css({
            left: $left
        });
        console.log("Banner Overlay Left :  " + $wWidth + " " + $oWidth + " " + $left);
    }

    function VerticalCentre(parent, child) {
        var $parent = $(parent);
        if ($parent) {
            var $child = $parent.find(child);
            if ($child) {
                var $parentHeight = $parent.height();
                var $childHeight = $child.height();
                var $top = (($parentHeight - $childHeight) / 2) + "px";
                var $translate = "translate(0," + $top + ")";
                $child.css({
                    transform: $translate
                });
            }
        }
    }

    function PortraitVerticalCentre() {
        if (!pageNotFound) {
            if ((screenWidth <= 480) && (liveOrientation === screenOrientation.Portrait)) {
                VerticalCentre('#prices', '.vertical-centre');
                VerticalCentre('#hours', '.vertical-centre');
                return;
            }
            if ((screenWidth <= 768) && (liveOrientation === screenOrientation.Landscape)) {
                VerticalCentre('#prices', '.vertical-centre');
                VerticalCentre('#hours', '.vertical-centre');
                return;
            }
            if ((screenHeight <= 480) && (liveOrientation === screenOrientation.Landscape)) {
                VerticalCentre('#prices', '.vertical-centre');
                VerticalCentre('#hours', '.vertical-centre');
                return;
            }
            $('#prices .vertical-centre').removeAttr("style");
            $('#hours .vertical-centre').removeAttr("style");
        } else {
            VerticalCentre('#page-not-found', '.vertical-centre');
        }
    }

    function LogoBooksy() {
        if (screenWidth <= 480) {
            $('.prices-portrait .logo').removeClass('hide');
            $('.prices-portrait .booksy').removeClass('hide');
            $('.hours-portrait .logo').removeClass('hide');
            $('.hours-portrait .walk-ins').removeClass('hide');
        } else {
            $('.prices-portrait .logo').addClass('hide');
            $('.prices-portrait .booksy').addClass('hide');
            $('.hours-portrait .logo').addClass('hide');
            $('.hours-portrait .walk-ins').addClass('hide');
        }
    }

    function LogoGoToOurSite() {
        var bNarrow = ((screenWidth <= 480) && (liveOrientation === screenOrientation.Portrait));
        var bWide = ((screenWidth >= 768) && (screenHeight <= 480) && (liveOrientation === screenOrientation.Landscape));
        var bAtLeastATablet = ((screenWidth >= 768) && (screenHeight >= 768));
        if ((bNarrow || bAtLeastATablet) && (!bWide)) {
            $('.page-not-found-portrait .logo').removeClass('hide');
            $('.page-not-found-portrait .go-to-our-site').removeClass('hide');
            $('.page-not-found-landscape').addClass('hide');
        } else {
            $('.page-not-found-portrait .logo').addClass('hide');
            $('.page-not-found-portrait .go-to-our-site').addClass('hide');
            $('.page-not-found-landscape').removeClass('hide');
        }
        if (((screenWidth >= 768) && (screenWidth < 992)) && (liveOrientation === screenOrientation.Portrait)) {
            $('.page-not-found-portrait').removeClass('col-sm-6').addClass('col-sm-12');
        } else {
            $('.page-not-found-portrait').removeClass('col-sm-12').addClass('col-sm-6');
        }
    }

    function ScaleApp() {
        if (!pageNotFound) {
            GetScreenData();
            ScaleSections();
            ScaleOverlay();
            LogoBooksy();
            PortraitVerticalCentre();
        }
        else {
            GetScreenData();
            ScalePageNotFound()
            LogoGoToOurSite();
            PortraitVerticalCentre();
        }
    }

    function LaunchApp() {
        var mediaMatchQuery = window.matchMedia("(orientation: portrait)");
        if (mediaMatchQuery.matches) {
            liveOrientation = screenOrientation.Portrait;
        } else {
            liveOrientation = screenOrientation.Landscape;
        }
        console.log(mediaMatchQuery, "Launch Live Orientation : " + liveOrientation);
        GetElementData();
        ScaleApp();
        appLaunched = true;
    }

    // Event Listeners

    var mediaPortraitQuery = window.matchMedia("(orientation: portrait)");
    var mediaLandscapeQuery = window.matchMedia("(orientation: landscape)");

    mediaPortraitQuery.addListener(function (mediaQuery) {
        if (mediaQuery.matches) {
            if (liveOrientation !== screenOrientation.Portrait) {
                console.log("matchMedia Event Listener : Portrait");
                liveOrientation = screenOrientation.Portrait;
                ScaleApp();
            }
        }
    });
    mediaLandscapeQuery.addListener(function (mediaQuery) {
        if (mediaQuery.matches) {
            if (liveOrientation !== screenOrientation.Landscape) {
                console.log("matchMedia Event Listener : Landscape");
                liveOrientation = screenOrientation.Landscape;
                ScaleApp();
            }
        }
    });

    $(window).resize(function () {
        if (appLaunched) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                var screenWidth = screen.width;
                var screenHeight = screen.height;
                if (screenWidth > screenHeight) {
                    if (liveOrientation !== screenOrientation.Landscape) {
                        console.log("This window has been resized to Landscape - " + screenWidth + " by " + screenHeight);
                        liveOrientation = screenOrientation.Landscape;
                        ScaleApp();
                    }
                } else {
                    if (liveOrientation !== screenOrientation.Portrait) {
                        console.log("This window has been resized to Portrait - " + screenWidth + " by " + screenHeight);
                        liveOrientation = screenOrientation.Portrait;
                        ScaleApp();
                    }
                }
            }, 250);
        }
    });

    $(document).ready(function () {
        console.log("Document Ready");

        pageNotFound = ($('#page-not-found').length);

        if (!pageNotFound) {
            $('nav').find('.nav a').click(function () {
                var $href = $(this).attr('href');
                $('html, body').animate({
                    scrollTop: $($href).offset().top - 90
                }, 500);
                return false;
            });
        }

        LaunchApp();

        $('.loading-background').fadeOut(250);
        $('.noshow').addClass('reveal').removeClass('noshow');

        if ($('.carousel').length) {
            $('.carousel').carousel();
        }
    });
})();