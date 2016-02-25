$(document).ready(function () {
    // TOOLS =============================================================
    $(window).load(function () {
        $('.toolbox').artificaToolsbox({
            sizes: 'typo_size1,typo_size2,typo_size3',
            defaultSize: 0
        });
        // GO TO TOP =====================================================
        $(window).scroll(function () {
            if ($(window).scrollTop() == "0") $('.gotoTopSlider').fadeOut('slow');
            else $('.gotoTopSlider').fadeIn('slow');
        });
        /*
        $('.btnGotoTop').live('click', function () {
            $("html, body").animate({
                scrollTop: 0
            }, 'slow');
            return false;
        });
        */
        //
    });

    if ($('.navPrincipal').length > 0) {
        $('.navPrincipal, .navDemarches, .navGrandsProjets, .navMonProfil').hover(

        function () {
            $(this).children('ul').children('li').children('.menuSub').css({
                'height': '0px',
                'visibility': 'hidden'
            });

            menuInterval = setTimeout(function () {
                window.clearTimeout(menuInterval);
                $('.navPrincipal, .navDemarches, .navGrandsProjets, .navMonProfil').children('ul').children('li').children('.menuSub').css({
                    'height': 'auto',
                    'visibility': 'visible'
                });
            }, 300);
        },

        function () {
            window.clearTimeout(menuInterval);
            $(this).children('ul').children('li').children('.menuSub').css({
                'height': 'auto',
                'visibility': 'visible'
            });
        });
    }

    // Menu Top Mobile ==================================================
    $('.btnMenuMobile').toggle(function () {
        $('.nav').css('display', 'block');
        $('.btnMenuMobile').addClass('active');
    },

    function () {
        $('.nav').css('display', 'none');
        $('.btnMenuMobile').removeClass('active');
    });


    // Check responsive < 940px ==================================================
    $(window).resize(function () {
        if ($(window).innerWidth() < 940) {
            $('body').addClass('resp');
            resp = true;
        } else {
            $('body').removeClass('resp');
            resp = false;
        };
    });
    $(window).resize();

    // resizeContent =============================================================
    function resizeContent() {
        //wWindow = $(window).innerWidth();
        wWindow = window.innerWidth;

        if (wWindow <= 1279 && wWindow >= 940) {
            if ($('.navSecondaire .slider').length == 0) {
                var heightElement = $('.navSecondaire ul li').css('height');
                var widthElement = parseInt($('.navSecondaire ul li').outerWidth(true));
                var countElement = $('.navSecondaire ul li').length;

                $('.navSecondaire ul li').each(function (i) {
                    $(this).attr('index', i);
                });

                // add element
                $('.navSecondaire ul').wrap('<div class="slider"></div>');
                //$('.navSecondaire .slider').before('<a href="/#" class="previous"></a>');
                $('.navSecondaire .slider').after('<a href="/#" class="next"></a>');


                // add CSS
                $('.navSecondaire').css({
                    'width': 330,
                    'overflow': 'hidden',
                    'height': 95
                });
                $('.navSecondaire .slider').css({
                    'display': 'block',
                    'width': 278,
                    'overflow': 'hidden'
                });
                $('.navSecondaire .slider ul').css({
                    'width': 2000,
                    'position': 'relative',
                    'left': 0
                });
                $('.navSecondaire .slider ul li').css({
                    'display': 'block',
                    'float': 'left'
                });

                $('.navSecondaire a.next').click(function () {
                    var temp = $('.navSecondaire .slider ul').position();
                    var left = parseFloat(temp.left);
                    left = -(left);

                    $('.navSecondaire .slider ul').animate({'left': -(72)}, 300, function () {
                        $('.navSecondaire .slider ul').css({
                            'left': 0
                        });
                        $('.navSecondaire .slider ul').append($('.navSecondaire .slider ul li:first'));

                    });

                    return false;
                });
            }
        } else {
            if ($('.navSecondaire .slider').length > 0) {
                $('.navSecondaire .slider').before('<ul class="reset"></ul>');

                var numberElement = $('.navSecondaire .slider ul li').length;
                for (var i = 0; i < numberElement; i++) {
                    $('.navSecondaire ul.reset').append($('.navSecondaire .slider ul li[index="' + i + '"]'));
                }

                $('.navSecondaire ul.reset').removeClass('reset');
                $('.navSecondaire .slider').remove();
                //$('.navSecondaire a.previous').remove();
                $('.navSecondaire a.next').remove();
                $('.navSecondaire').css({
                    'width': 'auto',
                        'overflow': 'none'
                });
                $('.navSecondaire ul').css({
                    'width': 'auto',
                    'left': '0px'
                });
            }
        }

        if (wWindow < 940) {
            if ($('.nav .navSecondaire').length == 0) {
                $('.nav').append($('.navSecondaire'));
            }
        } else {
            $('.header .container').prepend($('.nav .navSecondaire'));
        }
    }

    if ($('.navSecondaire').length > 0) {
        resizeContent();

        $(window).resize(function () {
            resizeContent();
        });
    }

    // /!\ Pensez à l'enlever plus tard :)
    function carouselNormalization() {
        var items = $('div[id^="carousel-"] .item'), //grab all slides
        heights = [], //create empty array to store height values
        tallest; //create variable to make note of the tallest slide

        if (items.length) {
            function normalizeHeights() {
                items.each(function() { //add heights to array
                    heights.push($(this).height()); 
                });
                tallest = Math.max.apply(null, heights); //cache largest value
                items.each(function() {
                    $(this).css('min-height',tallest + 'px');
                });
            };
            normalizeHeights();

            $(window).on('resize orientationchange', function () {
                tallest = 0, heights.length = 0; //reset vars
                items.each(function() {
                    $(this).css('min-height','0'); //reset min-height
                }); 
                normalizeHeights(); //run it again 
            });
        }
    }
    carouselNormalization();

    $('.slider ul').hide();
    $('.slider ul').wrap('<div class="slider-wrap"></div>');
    $('.slider ul').show();                
    $('.agenda-slider').artifica('scrolls', {'width':840, 'slider':'slider', 'elemBySlide':4, 'moveSlide':210});
});