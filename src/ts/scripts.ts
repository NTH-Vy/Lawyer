(() => {
  const spBreak = 767.98;

  const isMobile = () => {
    return window.matchMedia(`(max-width: ${spBreak}px)`).matches;
  };

  const detectBrowsers = () => {
    const html = $('html');
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('mac') >= 0) {
      html.addClass('is-mac');
    }
    if (ua.indexOf('safari') !== -1) {
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

  const tabletViewport = () => {
    const viewport = document.getElementById('viewport');
    if (!viewport) {
      return;
    }
    let ua = '';
    const setViewport = () => {
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      if (window.screen.width < 375 && portrait) {
        viewport.setAttribute('content', 'width=375');
      } else if (
        (window.screen.width >= 768 && window.screen.width <= 1199) ||
        (window.screen.width < 768 && window.screen.height >= 768 && !portrait)
      ) {
        viewport.setAttribute('content', 'width=1300');
        ua = navigator.userAgent.toLowerCase();
        if (
          (/macintosh/i.test(ua) &&
            navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 1) ||
          (ua.match(/(iphone|ipod|ipad)/) && !isMobile()) ||
          (ua.indexOf('android') > -1 && !isMobile())
        ) {
          $('html').addClass('is-tablet');
        }
      } else {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, shrink-to-fit=no'
        );
        $('html').removeClass('is-tablet');
      }
    };
    setViewport();
    $(window).on('load resize', setViewport);
  };

  const smoothScroll = () => {
    const anchors = $('a[href*="#"]:not([href="#"])');
    const headerHeight = 0;
    const speed = 500;
    let timeout = 0;
    let position = 0;
    const triggerScroll = (context: string | HTMLAnchorElement) => {
      const href =
        typeof context === 'string' ?
          context :
          '#' + $(context).attr('href')?.split('#')[1];

      const hasScrollClass = typeof context === 'string' ?
        $(context).hasClass('no-scroll') : $(context).hasClass('no-scroll');
      if (!hasScrollClass && $(href).length) {
        position = ($(href).offset()?.top || 0) - headerHeight;
        $('body, html').animate({ scrollTop: position }, speed, 'swing');
        return false;
      }
      return true;
    };
    setTimeout(() => {
      window.scroll(0, 0);
      $('html').removeClass('is-loading').addClass('is-visible');
    }, 1);
    if (window.location.hash) {
      window.scroll(0, 0);
      if (
        navigator.userAgent.indexOf('MSIE ') > -1 ||
        navigator.userAgent.indexOf('Trident/') > -1
      ) {
        timeout = 0;
      } else {
        timeout = 500;
      }
      setTimeout(() => {
        triggerScroll(window.location.hash);
      }, timeout);
    }
    anchors.on('click', (e) => triggerScroll(e.target.closest('a')!));
  };

  $(() => {
    detectBrowsers();
    tabletViewport();
    smoothScroll();
  });
})();

(() => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const closeButton = navMenu?.querySelector<HTMLButtonElement>('.l-header__nav-close');

  if (!(hamburger instanceof HTMLButtonElement) || !(navMenu instanceof HTMLElement)) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  let previousOverflow = '';

  const closeMenu = () => {
    if (!navMenu.classList.contains('is-open')) {
      return;
    }

    hamburger.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    overlay.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = previousOverflow;
  };

  const openMenu = () => {
    previousOverflow = document.body.style.overflow;
    hamburger.classList.add('is-active');
    navMenu.classList.add('is-open');
    overlay.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  closeButton?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767.98) {
      closeMenu();
    }
  });
})();
