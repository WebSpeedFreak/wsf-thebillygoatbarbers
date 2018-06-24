//  24/06/18 - Version 2.0

(function ($) {
    'use strict';

    $(document).ready(function () {
        console.log("Document Loaded");
        $('nav').find('.nav a').click(function () {
            var href = $(this).attr('href');
            var offset = $(href).offset().top - 90;
            if (($(window).width() <= 320) || ($(window).height() <= 320)) {
                offset = $(href).offset().top - 70;
            }
            $('html, body').animate({
                scrollTop: offset
            }, 500);
            return false;
        });

        $('.loading').removeClass('loading');
        $('.noshow').addClass('reveal').removeClass('noshow');

        if ($('.carousel').length) {
            $('.carousel').delay(1000).carousel();
        }
    });

    $(window).on('load', function () {
        console.log("Window Loaded");

        // There May Yet Be Code To Go Here.
    });

}(jQuery));