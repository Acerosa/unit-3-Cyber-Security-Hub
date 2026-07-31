/**
 * Shared hub navigation behaviour.
 * Desktop links work without JavaScript; this file enhances mobile menu controls.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function closeMenu(toggle, nav) {
    if (!toggle || !nav) {
      return;
    }
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  function openMenu(toggle, nav) {
    if (!toggle || !nav) {
      return;
    }
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  }

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-navigation');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu(toggle, nav);
      } else {
        openMenu(toggle, nav);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu(toggle, nav);
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(toggle, nav);
      });
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) {
        return;
      }
      var target = event.target;
      if (nav.contains(target) || toggle.contains(target)) {
        return;
      }
      closeMenu(toggle, nav);
    });
  }

  ready(initMobileNav);
})();
