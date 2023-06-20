(function () {

  var app = app || {};

  var spBreak = 767.98;
  var offsetY = window.pageYOffset;
  var menuOpen = false;

  app.init = function () {
    app.detectBrowsers();
    app.tabletViewport();
    app.smoothScroll();
    app.accordion();
    app.scrollHint();
    app.introductionSlider();
    app.navigation();
    app.accordionCommon();
    app.headerScroll();
    app.scrollLeft();
    app.toTop();
    app.keyvisualSlider();
    app.lightBox();
  };

  app.isMobile = function () {
    return window.matchMedia('(max-width: ' + spBreak + 'px)').matches;
  };

  app.detectBrowsers = function () {
    var html = $('html');
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mac') >= 0) {
      html.addClass('is-mac');
    }
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        html.addClass('is-chrome');
      } else {
        html.addClass('is-safari');
      }
    }
    if (ua.indexOf('msie ') > -1 || ua.indexOf('trident/') > -1) {
      html.addClass('is-ie');
    }
    if (ua.indexOf('firefox') > -1) {
      html.addClass('is-firefox');
    }
    if (ua.indexOf('android') > -1) {
      html.addClass('is-android');
    }
    if (ua.match(/(iphone|ipod|ipad)/)) {
      html.addClass('is-ios');
    }
    if (ua.indexOf('edg/') > -1) {
      html.removeClass('is-chrome');
      html.addClass('is-chromium');
    }
  };

  app.tabletViewport = function () {
    var viewport = document.getElementById('viewport');
    var viewportSet = function () {
      var portrait = window.matchMedia('(orientation: portrait)').matches;
      if (screen.width < 375 && portrait) {
        viewport.setAttribute('content', 'width=375, user-scalable=0');
      } else if (screen.width >= 768 && screen.width <= 1199 || screen.width < 768 && screen.height >= 768 && !portrait) {
        viewport.setAttribute('content', 'width=1300, user-scalable=0');
        var ua = navigator.userAgent.toLowerCase();
        if ((/macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) || (ua.match(/(iphone|ipod|ipad)/) && !app.isMobile()) || (ua.indexOf('android') > -1 && !app.isMobile())) {
          $('html').addClass('is-tablet');
        }
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0');
        $('html').removeClass('is-tablet');
      }
    };
    viewportSet();
    window.onload = function () {
      viewportSet();
    };
    window.onresize = function () {
      viewportSet();
    };
  };

  app.smoothScroll = function () {
    var anchors = $('a[href*="#"]:not([href="#"])');
    var headerHeight = 0;
    var speed = 500;
    var timeDelay = 0;
    if ($('.header-sticky').length) {
      headerHeight = $('.header-sticky').innerHeight();
    }
    var triggerScroll = function (context) {
      var href = typeof context == 'string' ? context : '#' + $(context).attr('href').split('#')[1];
      if ($(context).hasClass('no-scroll')) return;
      if (!$(href).length) return;
      if ($('body').hasClass('has-menu')) {
        $('.js-button-menu').removeClass('is-active');
        app.closeMenu();
        timeDelay = 300;
      }
      setTimeout(function () {
        var position = $(href).offset().top - headerHeight;
        $('body, html').animate({ scrollTop: position }, speed, 'swing');
      }, timeDelay);
      return false;
    };
    setTimeout(function () {
      scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      scroll(0, 0);
      var timeout = 500;
      if (navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1) {
        timeout = 0;
      }
      setTimeout(function () {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', function () {
      return triggerScroll(this);
    });
  };

  app.accordionCommon = function () {
    if ($('.js-accordion').find('.list-item').hasClass('is-active')) {
      $('.js-accordion-content').slideDown();
    }
    $('.js-accordion').find('.js-accordion-heading').on('click', function () {
      $(this).parent().stop().toggleClass('is-active');
      $(this).parent().find('.js-accordion-content').stop().eq(0).slideToggle(300);
    });
  };

  app.scrollHint = function () {
    if (!$('.js-scroll-hint').length) return;
    $(window).on('load resize rotate', function () {
      if (app.isMobile()) {
        $('.js-scroll-hint').each(function () {
          var scroll = $(this);
          new ScrollHint(scroll, {
            i18n: {
              scrollable: ''
            }
          });
        });
      } else {
        $('.js-scroll-hint').attr('style', '');
      }
    });
  };

  app.introductionSlider = function () {
    if(!$('.js-introduction-slider').length) return;
    new Swiper('.js-introduction-slider', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      breakpoints: {
        0: {
          freeMode: true,
          centeredSlides: true
        }
      }
    });
  };

  app.openMenu = function () {
    offsetY = window.pageYOffset;
    $('.container').css({
      top: -offsetY + 'px'
    });
    $('.js-navigation').stop().fadeIn();
    $('body').addClass('has-menu');
    menuOpen = true;
  };

  app.closeMenu = function () {
    $('body').removeClass('has-menu');
    $('.js-button-menu').removeClass('is-active');
    $('.js-navigation').stop().fadeOut();
    $('.container').css({
      top: 'auto'
    });
    $('html,body').scrollTop(offsetY);
    menuOpen = false;
  };

  app.navigation = function () {
    $('.js-button-menu').click(function () {
      $(this).toggleClass('is-active');
      if ($(this).hasClass('is-active')) {
        app.openMenu();
      } else {
        app.closeMenu();
      }
      return false;
    });
    $('.js-button-close').click(function () {
      app.closeMenu();
      return false;
    });

    var heightNavigation = function () {
      var heightWindow = $(window).innerHeight();
      if ($('.js-navigation').length) {
        $('.js-navigation').css({
          height: heightWindow
        });
      }
    };

    heightNavigation();
    $(window).on('load resize', function () {
      heightNavigation();
    });
  };

  app.accordion = function () {
    $('.js-button-dropdown').click(function () {
      $(this)
        .parents('.has-sub')
        .toggleClass('is-active');
      $(this)
        .parents('.has-sub')
        .find('.js-accordion')
        .stop()
        .slideToggle();
      return false;
    });

  };

  app.headerScroll = function () {
    var headerFixed = function () {
      if (menuOpen) return;
      if ($(window).scrollTop() > $('.js-keyvisual').innerHeight()) {
        $('.header-sticky').addClass('is-header-sticky');
        $('body').addClass('is-sticky-fixed');
      } else {
        $('.header-sticky').removeClass('is-header-sticky');
        $('body').removeClass('is-sticky-fixed');
      }
    };

    headerFixed();

    $(window).on('load scroll resize', function () {
      headerFixed();
    });
  };

  app.scrollLeft = function () {
    if (!$('.js-scroll-left').length) return;
    $(window).on('load scroll resize', function () {
      var winLeft = $(window).scrollLeft();
      $('.js-scroll-left').css('margin-left', -winLeft + 'px');
    });
  };

  app.toTop = function () {
    if ($('.js-to-top').length) {
      var pageTop = $('.js-to-top');
      pageTop.hide();
      $(window).scroll(function () {
        if ($(this).scrollTop() > $('.js-keyvisual').innerHeight()) {
          pageTop.fadeIn();
        } else {
          pageTop.fadeOut();
        }
      });
      pageTop.click(function () {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
      });
    }
  };

  app.keyvisualSlider = function () {
    if (!$('.js-slider-keyvisual').length) return;
    new Swiper('.js-slider-keyvisual', {
      slidesPerView: 1,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    });
  };

  app.lightBox = function () {
    if (!$('.js-light-box').length) return;
    var photoSwipe = new PhotoSwipeLightbox({
      gallery: '.js-light-box',
      children: 'a',
      pswpModule: PhotoSwipe
    });
    photoSwipe.init();
    $('body').on('click', '.pswp__item', function (e) {
      if(!$(e.target).hasClass('pswp__img') ) {
        $('.pswp__button--close').click();
      }
    });
    $('.js-light-box-open a').on('click', function () {
      $(this).parent().siblings('.js-light-box').find('img').click();
    });
  };

  $(function () {
    app.init();
  });

})();

$(window).on('load', function () {
  window.WebFontConfig = {
    google: {
      families: [
        'Montserrat:500',
        'Alegreya+Sans+SC:400,500',
        'Zen+Kaku+Gothic+New:400,500,600,700:&display=swap'
      ]
    }
  };
  (function () {
    var wf = document.createElement('script');
    wf.src =
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
});

$(window).on('load', function () {
  $('body').removeClass('preload');
});
