/**
 * snabsystem.ru clone — Vanilla JS
 * Carousel, Mobile Menu, Smooth scroll
 */
(function () {
  'use strict';

  // ─── Carousel ──────────────────────────────────────────
  const carousel = document.getElementById('slideshow');
  if (carousel) {
    const items = carousel.querySelectorAll('.carousel-inner > .item');
    const indicators = carousel.querySelectorAll('.carousel-indicators li');
    let current = 0;
    let interval = null;
    const INTERVAL_MS = 5000;

    function goTo(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      items[current].classList.remove('active');
      indicators[current].classList.remove('active');
      current = index;
      items[current].classList.add('active');
      indicators[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      interval = setInterval(next, INTERVAL_MS);
    }

    function stopAuto() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    // Indicator clicks
    indicators.forEach(function (li) {
      li.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-slide-to'), 10));
        startAuto();
      });
    });

    // Arrow clicks
    var leftCtrl = carousel.querySelector('.carousel-control.left');
    var rightCtrl = carousel.querySelector('.carousel-control.right');
    if (leftCtrl) leftCtrl.addEventListener('click', function (e) { e.preventDefault(); prev(); startAuto(); });
    if (rightCtrl) rightCtrl.addEventListener('click', function (e) { e.preventDefault(); next(); startAuto(); });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Touch swipe
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAuto();
      }
    }, { passive: true });

    startAuto();
  }

  // ─── Mobile Menu ───────────────────────────────────────
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('closeMenuBtn');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  // Close on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ─── Callback modal (placeholder) ──────────────────────
  window.openCallback = function () {
    var name = prompt('Введите ваше имя:');
    if (!name) return;
    var phone = prompt('Введите ваш телефон:');
    if (!phone) return;
    alert('Спасибо, ' + name + '! Наш менеджер свяжется с вами по номеру ' + phone + '.');
  };

  // ─── Smooth scroll for hash links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Search form handler ───────────────────────────────
  document.querySelectorAll('.form-inline').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = this.querySelector('input[name="q"]');
      if (q && q.value.trim()) {
        alert('Поиск: ' + q.value.trim());
      }
    });
  });
})();
