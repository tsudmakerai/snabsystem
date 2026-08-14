/**
 * SNABSYSTEM.RU - Single Page Application Core
 * 100% Pixel-Perfect Clone of https://snabsystem.ru/
 */

(function () {
  'use strict';

  const App = {
    catalog: [],
    brands: [],
    ajaxMenus: {},
    activeMenu: null,
    carouselTimer: null,
    currentSlide: 0,
    searchDebounce: null
  };

  const DOM = {
    appContent: document.getElementById('app-content'),
    menuContainer: document.getElementById('ajax-menu-container'),
    modalContainer: document.getElementById('modal-container')
  };

  // =========================================================================
  // Initialize Application
  // =========================================================================

  async function init() {
    try {
      const [catRes, brandRes, menuRes] = await Promise.all([
        fetch('/data/catalog.json'),
        fetch('/data/brands.json'),
        fetch('/data/ajax_menus_clean.json')
      ]);

      App.catalog = await catRes.json();
      App.brands = await brandRes.json();
      App.ajaxMenus = await menuRes.json();

      initRouter();
      initHeaderSearch();
      initMenuEvents();
      initGlobalEvents();
      handleRoute();
    } catch (e) {
      console.error('Init error:', e);
      if (DOM.appContent) {
        DOM.appContent.innerHTML = '<div class="container" style="padding:40px; text-align:center;"><h2>Ошибка загрузки данных</h2></div>';
      }
    }
  }

  // =========================================================================
  // Router
  // =========================================================================

  function navigateTo(url) {
    window.history.pushState(null, null, url);
    closeMenu();
    handleRoute();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initRouter() {
    window.addEventListener('popstate', handleRoute);

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      // Check if menu link
      if (link.classList.contains('menu-ajax-link')) {
        e.preventDefault();
        const menuType = link.dataset.menu || link.dataset.item;
        if (menuType) toggleMenu(menuType);
        return;
      }

      // Check if callback modal link
      if (link.id === 'call-me-event' || link.id === 'footer-call-me-event' || link.getAttribute('href') === '/ajaxy/call-me/nojs') {
        e.preventDefault();
        openCallbackModal();
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;

      // Handle internal SPA navigation
      if (href.startsWith('/') && !href.startsWith('//') && !link.hasAttribute('target') && !href.startsWith('/ajaxy/')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  }

  async function handleRoute() {
    const rawPath = window.location.pathname.replace(/\/$/, '') || '/';

    if (rawPath === '/') {
      renderHome();
      return;
    }

    if (rawPath === '/brands') {
      renderBrandsDirectory();
      return;
    }

    const cleanKey = rawPath.replace(/^\//, '');
    
    // Candidates to check in /data/pages/
    const candidates = [cleanKey];
    if (rawPath.startsWith('/brand/')) {
      const slug = cleanKey.replace(/^brand\//, '');
      candidates.unshift('brand-' + slug);
      candidates.push('brand/' + slug);
    }

    DOM.appContent.innerHTML = '<div class="container" style="padding: 100px; text-align: center;"><p style="color: #666; font-size: 16px;">Загрузка...</p></div>';

    for (const cand of candidates) {
      try {
        const res = await fetch('/data/pages/' + cand + '.html');
        if (res.ok) {
          const html = await res.text();
          renderPageFromData({ html: html, path: rawPath });
          return;
        }
      } catch (e) {
        // continue
      }
    }

    // Dynamic brand fallback
    if (rawPath.startsWith('/brand/')) {
      const slug = cleanKey.replace(/^brand\//, '');
      renderBrandPage(slug);
    } else {
      renderNotFound();
    }
  }

  // =========================================================================
  // Page Renderers
  // =========================================================================

  function renderHome() {
    document.title = 'Продажа промышленного оборудования - Система Снабжения';

    DOM.appContent.innerHTML = `
<div class="full-width">
    <div class="container">
        <div class="r-full-width">
          <!--noindex-->
  <section class="pp-front-slideshow col-12 hidden-sm" >
    <div id="slideshow" class="carousel slide">
  <!-- Indicators -->
  <ol class="carousel-indicators"><li data-target="#slideshow" data-slide-to="0" class="active"></li>
<li data-target="#slideshow" data-slide-to="1" class=""></li>
<li data-target="#slideshow" data-slide-to="2" class=""></li>
</ol>
  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <div class="item active"><div class="slide-default-promo bg-bluemid">Понимание деталей,<br>приходит с опытом.<br><a href="/ajaxy/menu-ajax/nojs/products?nojs_path=home" class="use-ajax menu-ajax-link" data-menu="products">Каталог деталей</a></div><img class="image" src="/assets/images/slide_default.jpg"></div><div class="item"><div class="r-row"><div class="col-sm-12 col-lg-7 text-wrapper"><big>У нас есть все для конвейера</big><p>“Система Снабжения” - поставщик промышленного оборудования с десятилетним опытом работы. Мы предлагаем надежное оборудование по приемлемым ценам.</p>
<p>Наши клиенты - частные заказчики, представители малого, среднего и крупного бизнеса. Мы гордимся доверием таких компаний, как “Газпром”, “Татнефть”, “УЭХК”.</p><div class="r-row images"><a href="/catalog/konveyernye-cepi-i-transporternye-lenty/eurochain" class="col-3 image"><img class="img-responsive" src="/assets/images/eurochain.png" width="125" height="44" alt="" title="" /></a><a href="/catalog/konveyernye-cepi-i-transporternye-lenty/iwis" class="col-3 image"><img class="img-responsive" src="/assets/images/iwis.png" width="125" height="44" alt="" title="" /></a><a href="/catalog/konveyernye-cepi-i-transporternye-lenty/marbett" class="col-3 image"><img class="img-responsive" src="/assets/images/marbett.png" width="125" height="44" alt="" title="" /></a><a href="/catalog/konveyernye-cepi-i-transporternye-lenty/habasit" class="col-3 image"><img class="img-responsive" src="/assets/images/habasit-logo.png" width="125" height="44" alt="" title="" /></a></div><div class="category-link"><a href="/catalog/konveyernye-cepi-i-lenty" class="btn btn-default">Каталог: Конвейерные цепи и ленты</a></div></div><div class="visible-lg col-lg-5 image-wrapper"><img class="img-responsive" src="/assets/images/conveyor.gif" width="427" height="350" alt="" title="" /></div></div></div><div class="item"><div class="r-row"><div class="col-sm-12 col-lg-7 text-wrapper"><big>Двигатели любой мощности</big><p>“Система Снабжения” - поставщик промышленного оборудования с десятилетним опытом работы. Мы предлагаем надежное оборудование по приемлемым ценам.</p>
<p>Наши клиенты - частные заказчики, представители малого, среднего и крупного бизнеса. Мы гордимся доверием таких компаний, как “Газпром”, “Татнефть”, “УЭХК”.</p><div class="r-row images"><a href="/catalog/elektrodvigateli/cantoni" class="col-3 image"><img class="img-responsive" src="/assets/images/cantoni.png" width="125" height="39" alt="" title="" /></a><a href="/catalog/elektrodvigateli/electro-adda" class="col-3 image"><img class="img-responsive" src="/assets/images/electro_adda_big_0.png" width="125" height="31" alt="" title="" /></a><a href="/catalog/elektrodvigateli/georgeii-kobold" class="col-3 image"><img class="img-responsive" src="/assets/images/georgii-kobold.png" width="125" height="24" alt="" title="" /></a><a href="/catalog/elektrodvigateli/shagovye-dvigateli-phytron" class="col-3 image"><img class="img-responsive" src="/assets/images/phytron.png" width="125" height="39" alt="" title="" /></a></div><div class="category-link"><a href="/catalog/elektrodvigateli" class="btn btn-default">Каталог: Электродвигатели</a></div></div><div class="visible-lg col-lg-5 image-wrapper"><img class="img-responsive" src="/assets/images/images22_m41.png" width="311" height="307" alt="" title="" /></div></div></div>  </div>

  <!-- Controls -->
  <a class="left carousel-control" id="carousel-prev" href="#slideshow" data-slide="prev">
    <span class="icon-prev icon-inverse"></span>
  </a>
  <a class="right carousel-control" id="carousel-next" href="#slideshow" data-slide="next">
    <span class="icon-next icon-inverse"></span>
  </a>
</div>
      </section>
<!--/noindex-->        </div>
    </div>
  </div>

<div class="container" >
  <div class="container">
          <div class="r-top">
        <!--noindex-->
  <section class="pp-front-catalog" >
    <h1 class="h5 text-center">Поставка оборудования, запасных частей и комплектующих</h1><div class="pp-product-catalog col-12 col-12"><ul class="r-row"><li class="col-lg-4 col-12 term-492"><a href="/catalog/promyshlennoe-oborudovanie" class="icon-term-492 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/promyshlennoe-oborudovanie">Промышленное оборудование</a></big><a href="/catalog/gidravlika">Гидравлика</a>, <a href="/catalog/nasosy">Насосы</a>, <a href="/catalog/pnevmatika">Пневматика и пневмоцилиндры</a>, <a href="/catalog/klapany">Клапаны</a>, <a href="/catalog/filtry">Фильтры</a>, <a href="/catalog/kompressory">Компрессоры</a>, <a href="/catalog/teploobmenniki">Теплообменники</a>, <a href="/catalog/vibratory">Вибраторы</a></div></li>
<li class="col-lg-4 col-12 term-3"><a href="/catalog/elektrodvigateli" class="icon-term-3 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/elektrodvigateli">Электродвигатели</a></big><a href="/catalog/motor-reduktor">Мотор-редуктор</a>, <a href="/catalog/privody">Приводы</a>, <a href="/catalog/reduktory">Редукторы</a>, <a href="/catalog/elektrotormoz">Электротормоз</a>, <a href="/catalog/chastotnye-preobrazovateli">Частотные преобразователи</a></div></li>
<li class="col-lg-4 col-12 term-12"><a href="/catalog/promyshlennaya-avtomatika" class="icon-term-12 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/promyshlennaya-avtomatika">Промышленная автоматика</a></big><a href="/catalog/enkodery">Энкодеры</a>, <a href="/catalog/izmeritelnaya-tehnika">Измерительная техника</a>, <a href="/catalog/registriruyushchie-pribory">Регистрирующие приборы</a>, <a href="/catalog/rele-i-datchiki">Реле и датчики</a></div></li>
<li class="clearfix"></li>
<li class="col-lg-4 col-12 term-5"><a href="/catalog/spectehnika-i-zapchasti" class="icon-term-5 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/spectehnika-i-zapchasti">Спецтехника и запчасти</a></big><a href="/catalog/selskohozyaystvennaya-tehnika">Сельскохозяйственная техника</a>, <a href="/catalog/stroitelnaya-tehnika">Строительная техника</a>, <a href="/catalog/podemnye-ustroystva">Подъемные устройства</a>, <a href="/catalog/ellap">Ellamp</a>, <a href="/catalog/spal">Spal</a></div></li>
<li class="col-lg-4 col-12 term-7"><a href="/catalog/zapasnye-chasti-i-detali" class="icon-term-7 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/zapasnye-chasti-i-detali">Запасные части и детали</a></big><a href="/catalog/podshipniki">Подшипники</a>, <a href="/catalog/kabeli-i-provodniki">Кабели и проводники</a>, <a href="/catalog/materialy">Материалы</a>, <a href="/catalog/remni">Ремни</a>, <a href="/catalog/roliki">Ролики</a>, <a href="/catalog/krany">Краны</a>, <a href="/catalog/konveyernye-cepi-i-lenty">Конвейерные цепи и ленты</a></div></li>
<li class="col-lg-4 col-12 term-8"><a href="/catalog/prochaya-tehnika" class="icon-term-8 icon-inverse"></a><div class="wrapper"><big><a href="/catalog/prochaya-tehnika">Прочая техника</a></big><a href="/catalog/umnyy-dom">Умный дом</a>, <a href="/catalog/energetika">Энергетика</a>, <a href="/catalog/sistemy-bezopasnosti">Системы безопасности</a>, <a href="/catalog/medicinskaya-tehnika">Медицинская техника</a>, <a href="/catalog/stanki-i-obrabotka-materialov">Станки и обработка материалов</a></div></li>
<li class="clearfix"></li>
</ul></div>
      </section>
<!--/noindex-->      </div>
    
          <div class="r-center-main">
  <section class="pp-promo-why-we-text col-12 col-sm-4 col-lg-3" >
              <h2 class="pane-title">Почему мы?</h2>
    <ul><li>качественное оборудование при выгодной стоимости;</li>
<li>профессиональная поддержка при подборе оборудования и запчастей;</li>
<li>подбор оборудования по техническому заданию;</li>
<li>доставка грузов в любую точку РФ;</li>
<li>соблюдение гарантийных обязательства поставщиков.</li>
</ul>
      </section>
<div class="panel-separator"></div>
  <section class="pp-promo-clients col-12 col-sm-8 col-lg-9" >
    <div class="r-row"><h2 class="col-12">Для каждого клиента</h2><div class="col-12 col-sm-4 col-lg-4"><img class="img-responsive" src="/assets/images/clients-manager.jpg"><h3>Персональный менеджер</h3><p>У нас нет путаницы, у нас есть персональный менеджер для каждого вашего заказа.</p></div><div class="col-12 col-sm-4 col-lg-4"><img class="img-responsive" src="/assets/images/clients-shipping.jpg"><h3>Доставка до двери</h3><p>Мы контролируем перевозку вашего груза с конвейера производителя до вашего адреса доставки.</p></div><div class="col-12 col-sm-4 col-lg-4"><img class="img-responsive" src="/assets/images/clients-online.jpg"><h3>Контроль заказа онлайн</h3><p>Статус исполнения заказа, весь документооборот и история сделки - всегда в вашем личном кабинете.</p></div></div>
      </section>
      </div>
      </div>
    `;

    setupCarousel();
  }

  function renderPageFromData(pageData) {
    DOM.appContent.innerHTML = pageData.content || pageData.html || '';

    if (pageData.title) {
      document.title = `${pageData.title} — Система Снабжения`;
    } else {
      const h1 = DOM.appContent.querySelector('h1');
      if (h1 && h1.textContent.trim()) {
        document.title = `${h1.textContent.trim()} — Система Снабжения`;
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Setup forms in the injected content
    DOM.appContent.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Ваша заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.');
        form.reset();
      });
    });

    // Setup tabs
    const tabs = DOM.appContent.querySelectorAll('.nav-tabs a');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.parentElement.classList.remove('active'));
        tab.parentElement.classList.add('active');

        const panes = DOM.appContent.querySelectorAll('.tab-pane');
        panes.forEach(p => p.classList.remove('active'));

        const targetId = tab.getAttribute('href').substring(1);
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  function renderBrandPage(brandSlug) {
    const brand = App.brands.find(b => b.slug === brandSlug) || {
      title: brandSlug.toUpperCase(),
      description: `Поставка оригинальной продукции ${brandSlug.toUpperCase()} с официальной гарантией.`,
      image: 'snabsystem-logo.png'
    };

    document.title = `${brand.title} — Система Снабжения`;

    DOM.appContent.innerHTML = `
<div class="container">
    <div class="r-system">
      <div class="col-12">
        <section class="pp-breadcrumb hidden-sm">
          <nav class="breadcrumbs"><a href="/">Главная</a> <i class="icon-small-next icon-inverse"></i> <a href="/brands">Производители</a></nav>
        </section>
      </div>
    </div>
  </div>
<div class="container">
      <div class="r-content">
          <div class="col-12 col-lg-9">
            <div class="r-main">
              <section class="pp-node-content col-12">
                <h1>${brand.title}</h1>
                <div class="tab-content">
                  <div class="tab-pane active" id="description">
                    <article class="field field-name-body">
                      <p>${brand.description || `Поставка оборудования и комплектующих ${brand.title} от официального дистрибьютора.`}</p>
                    </article>
                  </div>
                </div>
              </section>
            </div>
          </div>
      </div>
</div>`;
  }

  function renderBrandsDirectory() {
    document.title = 'Производители — Система Снабжения';
    let brandItems = App.brands.map(b => `
      <div class="col-6 col-sm-4 col-md-3" style="margin-bottom: 12px;">
        <a href="/brand/${b.slug}" style="font-weight: 600; display: block; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 3px;">${b.title}</a>
      </div>
    `).join('');

    DOM.appContent.innerHTML = `
      <div class="container" style="padding-top: 20px; padding-bottom: 40px;">
        <div class="container">
          <h1>Производители промышленного оборудования</h1>
          <p class="lead">Полный алфавитный перечень зарубежных заводов-изготовителей.</p>
          <div class="row" style="margin-top: 25px;">
            ${brandItems}
          </div>
        </div>
      </div>
    `;
  }

  function renderNotFound() {
    document.title = 'Страница не найдена — Система Снабжения';
    DOM.appContent.innerHTML = `
      <div class="container" style="text-align:center; padding: 60px 0;">
        <h1>404</h1>
        <p>Страница не найдена</p>
        <a href="/" class="btn btn-default">На главную</a>
      </div>
    `;
  }

  // =========================================================================
  // Dropdown Ajax Menu Controller
  // =========================================================================

  function initMenuEvents() {
    // Handled in main click interceptor
  }

  function toggleMenu(menuType) {
    if (App.activeMenu === menuType) {
      closeMenu();
    } else {
      openMenu(menuType);
    }
  }

  function openMenu(menuType) {
    App.activeMenu = menuType;

    const links = document.querySelectorAll('.menu-ajax-link');
    links.forEach(l => {
      if (l.dataset.menu === menuType || l.dataset.item === menuType) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    const menuHtml = App.ajaxMenus[menuType] || '';
    DOM.menuContainer.innerHTML = menuHtml;
    DOM.menuContainer.style.display = 'block';

    const header = document.querySelector('.r-header');
    if (header) {
      const headerRect = header.getBoundingClientRect();
      const topOffset = headerRect.bottom + window.scrollY;
      const menuItem = DOM.menuContainer.querySelector('.ajax-menu-item');
      if (menuItem) {
        menuItem.style.top = topOffset + 'px';
      }
    }

    const menuBg = DOM.menuContainer.querySelector('.ajax-menu-bg');
    if (menuBg) {
      menuBg.style.display = 'block';
    }

    const closeBtn = DOM.menuContainer.querySelector('button.icon-cancel, button.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
    }

    if (menuType === 'brands') {
      setupBrandsAlphabet();
    }

    DOM.menuContainer.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const brandInput = form.querySelector('input[name="brand"]');
        if (brandInput && brandInput.value.trim()) {
          closeMenu();
          navigateTo('/brands');
          return;
        }
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        closeMenu();
      });
    });
  }

  function closeMenu() {
    App.activeMenu = null;
    DOM.menuContainer.style.display = 'none';
    DOM.menuContainer.innerHTML = '';
    const links = document.querySelectorAll('.menu-ajax-link');
    links.forEach(l => l.classList.remove('active'));
  }

  function setupBrandsAlphabet() {
    const alphabetLinks = DOM.menuContainer.querySelectorAll('.pp-brands-alphabet a');

    alphabetLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        alphabetLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const letter = link.textContent.trim().toUpperCase();
        filterBrandsByLetter(letter);
      });
    });

    const searchInput = DOM.menuContainer.querySelector('.pp-brands-search input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toUpperCase();
        if (query) {
          alphabetLinks.forEach(l => l.classList.remove('active'));
          filterBrandsByQuery(query);
        }
      });
    }
  }

  function filterBrandsByLetter(letter) {
    const filtered = App.brands.filter(b => b.title.toUpperCase().startsWith(letter));
    renderBrandColumns(filtered, `Производители на букву «${letter}» не найдены`);
  }

  function filterBrandsByQuery(query) {
    const filtered = App.brands.filter(b => b.title.toUpperCase().includes(query));
    renderBrandColumns(filtered, `По запросу «${query}» ничего не найдено`);
  }

  function renderBrandColumns(brandsList, emptyMsg) {
    let target = DOM.menuContainer.querySelector('.ajax-pane-row > .col-12:last-child');
    if (!target) {
      target = DOM.menuContainer.querySelector('.pp-brands-alphabet')?.nextElementSibling;
    }
    if (!target) return;

    if (brandsList.length === 0) {
      target.innerHTML = `<div style="padding: 20px; color: #666;">${emptyMsg}</div>`;
      return;
    }

    const perCol = Math.ceil(brandsList.length / 3);
    let html = '<div class="r-row">';
    for (let c = 0; c < 3; c++) {
      const slice = brandsList.slice(c * perCol, (c + 1) * perCol);
      html += '<div class="col-lg-4 col-sm-6 col-12">';
      html += slice.map(b => `<a href="/brand/${b.slug}">${b.title}</a><br>`).join('');
      html += '</div>';
    }
    html += '</div>';
    target.innerHTML = html;
  }

  // =========================================================================
  // Carousel Controller
  // =========================================================================

  function setupCarousel() {
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) return;

    const items = slideshow.querySelectorAll('.carousel-inner .item');
    const indicators = slideshow.querySelectorAll('.carousel-indicators li');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    let current = 0;
    const total = items.length;

    function goTo(idx) {
      if (!items[current] || !indicators[current]) return;
      items[current].classList.remove('active');
      indicators[current].classList.remove('active');
      current = (idx + total) % total;
      if (items[current]) items[current].classList.add('active');
      if (indicators[current]) indicators[current].classList.add('active');
    }

    if (prevBtn) prevBtn.onclick = () => goTo(current - 1);
    if (nextBtn) nextBtn.onclick = () => goTo(current + 1);

    indicators.forEach((ind, i) => {
      ind.onclick = () => goTo(i);
    });

    if (App.carouselTimer) clearInterval(App.carouselTimer);
    App.carouselTimer = setInterval(() => goTo(current + 1), 6000);

    slideshow.onmouseenter = () => clearInterval(App.carouselTimer);
    slideshow.onmouseleave = () => {
      clearInterval(App.carouselTimer);
      App.carouselTimer = setInterval(() => goTo(current + 1), 6000);
    };
  }

  // =========================================================================
  // Live Header Search
  // =========================================================================

  function initHeaderSearch() {
    const searchInput = document.getElementById('site-search-input') || document.getElementById('edit-search-block-form--2');
    if (!searchInput) return;

    let searchResults = document.getElementById('search-results-dropdown');
    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.id = 'search-results-dropdown';
      searchResults.style.position = 'absolute';
      searchResults.style.top = '100%';
      searchResults.style.left = '0';
      searchResults.style.right = '0';
      searchResults.style.background = '#fff';
      searchResults.style.border = '1px solid #ccc';
      searchResults.style.zIndex = '1000';
      searchResults.style.display = 'none';
      searchResults.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      searchResults.style.maxHeight = '300px';
      searchResults.style.overflowY = 'auto';
      
      const wrapper = searchInput.parentElement;
      wrapper.style.position = 'relative';
      wrapper.appendChild(searchResults);
    }

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      clearTimeout(App.searchDebounce);

      if (!q || q.length < 2) {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }

      App.searchDebounce = setTimeout(() => {
        const results = [];

        App.catalog.forEach(cat => {
          if (cat.title.toLowerCase().includes(q)) {
            results.push({ title: cat.title, type: 'Категория', url: `/catalog/${cat.id}` });
          }
          if (cat.subcategories) {
            cat.subcategories.forEach(sub => {
              if (sub.title.toLowerCase().includes(q)) {
                results.push({ title: sub.title, type: `Каталог / ${cat.title}`, url: `/catalog/${sub.slug}` });
              }
            });
          }
        });

        App.brands.forEach(b => {
          if (b.title.toLowerCase().includes(q)) {
            results.push({ title: b.title, type: 'Производитель', url: `/brand/${b.slug}` });
          }
        });

        if (!searchResults) return;

        if (results.length === 0) {
          searchResults.innerHTML = '<div style="padding: 12px; color: #666; font-size: 13px;">Ничего не найдено</div>';
        } else {
          searchResults.innerHTML = results.slice(0, 10).map(r => `
            <a href="${r.url}" style="display: block; padding: 8px 12px; border-bottom: 1px solid #eee; text-decoration: none; color: #333;">
              <strong style="color: #006699; font-size: 13px;">${r.title}</strong>
              <small style="display: block; color: #888; font-size: 11px;">${r.type}</small>
            </a>
          `).join('');
        }
        searchResults.style.display = 'block';
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (searchResults && !e.target.closest('#search-block-form')) {
        searchResults.style.display = 'none';
      }
    });
  }

  // =========================================================================
  // Callback Modal
  // =========================================================================

  function openCallbackModal() {
    if (!DOM.modalContainer) return;
    const modalHtml = App.ajaxMenus['call-me'] || `
      <div id="call-me" class="modal fade in" style="display: block; background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" onclick="App.closeCallbackModal()">&times;</button>
              <h4 class="modal-title">Заказать обратный звонок</h4>
            </div>
            <div class="modal-body">
              <form id="call-me-modal-form">
                <div class="form-group" style="margin-bottom: 15px;">
                  <label>Ваше имя</label>
                  <input type="text" class="form-control" name="name" required placeholder="Иван Иванов" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                  <label>Номер телефона</label>
                  <input type="tel" class="form-control" name="phone" required placeholder="+7 (___) ___-__-__" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
                </div>
                <button type="submit" class="btn btn-primary" style="background: #006699; color: #fff; padding: 8px 20px; border: none; border-radius: 4px;">Заказать звонок</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    DOM.modalContainer.innerHTML = modalHtml;
    const modal = DOM.modalContainer.querySelector('.modal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('in');
      const closeBtn = modal.querySelector('.close');
      if (closeBtn) closeBtn.onclick = closeCallbackModal;

      const form = modal.querySelector('form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          alert('Спасибо за заявку! Наш специалист перезвонит вам в течение 10 минут.');
          closeCallbackModal();
        };
      }
    }
  }

  function closeCallbackModal() {
    if (DOM.modalContainer) {
      DOM.modalContainer.innerHTML = '';
    }
  }

  function initGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        closeCallbackModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (App.activeMenu) {
        if (!e.target.closest('.r-header') && !e.target.closest('#ajax-menu-container')) {
          closeMenu();
        }
      }
    });
  }

  // Expose global methods
  window.App = {
    openMenu,
    closeMenu,
    toggleMenu,
    openCallbackModal,
    closeCallbackModal,
    navigateTo
  };

  // Start app when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
