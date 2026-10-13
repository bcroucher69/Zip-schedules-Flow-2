/* ==========================================================================
   ZipSchedules purchase flow — app.js (no dependencies)

   Flow:  index.html  ──Buy Now──▶ email dialog ──▶ products.html (cart)
          ──Continue to Checkout──▶ registration.html (details ▶ verify)
          ──Verify──▶ checkout.html (Place Order ▶ Payment ▶ Billing ▶ Review ▶ Pay)
          ──Ok──▶ manage.html

   Integration points are all in `api` below. Every function returns a Promise
   and is currently a STUB that simulates success. Replace with real calls.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Catalog (replace with an API response when available)
     ------------------------------------------------------------------------ */
  var CDN = 'https://agcdn.altametrics.com/releaseHubWorks/agassets/v3/assets/images/';

  var CATALOG = [
    // Base product added by "Buy Now" on the landing page (not listed in the grid)
    { id: 'zipschedules', name: 'ZipSchedules', price: 19.99, image: CDN + 'common/zipSchedule.png', listed: false,
      label: 'Workforce', category: 'workforce', description: 'Employee scheduling and time tracking.' },

    // CONTENT: descriptions completed from the truncated design copy — review with product marketing.
    { id: 'zip-tunes', name: 'Zip Tunes', price: 9.99, image: CDN + 'common/zipSchedule.png', /* TODO: Zip Tunes artwork */
      label: 'Guest experience', category: 'recommended', description: 'Curated, licensed background music tailored to your restaurant.' },
    { id: 'zip-digital-signage', name: 'Zip Digital Signage', price: 15.00, image: CDN + 'dgx/svg/dgx_logo.svg',
      label: 'Guest experience', category: 'recommended', description: 'Engage customers with vibrant, easy-to-manage digital menu boards.' },
    { id: 'zip-clock', name: 'Zip Clock', price: 25.00, image: CDN + 'common/svg/zipclock.svg',
      label: 'Workforce', category: 'workforce', description: 'Simplify time tracking and prevent buddy punching.' },
    { id: 'zip-forecasting', name: 'Zip Forecasting', price: 49.00, image: CDN + 'common/zipForecast.png', featured: true,
      label: 'Workforce', category: 'workforce', description: 'Predict labor needs accurately using AI-driven sales forecasts.' },
    { id: 'zip-inventory', name: 'Zip Inventory', price: 39.00, image: CDN + 'common/zipInventory.png',
      label: 'Food', category: 'food', description: 'Manage stock levels, reduce waste, and streamline ordering.' },
    { id: 'zip-ordering', name: 'Zip Ordering', price: 29.00, image: CDN + 'common/zipordering-130.png',
      label: 'Food', category: 'food', description: 'Seamless integrated web and app ordering for your guests.' },
    { id: 'zip-checklist', name: 'Zip Checklist 1.0', price: 12.00, image: CDN + 'common/ZipChecklist.png',
      label: 'Food safety', category: 'food', description: 'Standardize operational procedures with digital checklists.' },
    { id: 'zip-reporting', name: 'Zip Reporting', price: 19.00, image: CDN + 'common/ZipReporting_Icon_150.png',
      label: 'Operations', category: 'recommended', description: 'Aggregated business intelligence and reporting across locations.' },
    { id: 'zip-shiftbook', name: 'Zip ShiftBook', price: 14.00, image: CDN + 'common/shiftBook.png',
      label: 'Workforce', category: 'workforce', description: 'Centralized digital logbook for communication between shifts.' }
  ];
  /* "Recommended" shows every app; Workforce / Food filter by `category`. Confirm the mapping with product. */

  /* ------------------------------------------------------------------------
     Plum POS hardware (one-time purchase, quantity per item).
     Names, descriptions and specs follow plumpos.com product pages.
     PRICES: placeholders until Plum POS confirms them; while HARDWARE_PRICES_FINAL is false,
     cards show an "Est." tag. IMAGES: replace the illustrations with Plum product photos.
     ------------------------------------------------------------------------ */
  var HARDWARE_PRICES_FINAL = false;
  var HW_IMG = 'assets/img/hardware/';
  var HARDWARE_GROUPS = [
    ['all', 'All hardware'], ['counter', 'Counter & POS'], ['payments', 'Payments'], ['mobile', 'Mobile & self-order'],
    ['kitchen', 'Kitchen'], ['accessories', 'Accessories'], ['guest', 'Guest experience'], ['time', 'Time & attendance']
  ];
  /* `photo: true` = product photo on white (blended into the card); false = illustration */
  var HARDWARE = [
    { id: 'hw-terminal', name: 'Plum POS Terminal', type: 'POS station', group: 'counter', price: 799, image: HW_IMG + 'pos-terminal.webp', photo: true,
      description: 'Countertop POS with a responsive 15.6" widescreen, built for busy counters and connected to every Plum device.',
      specs: ['15.6" widescreen', 'Magnetic stripe reader', 'Spill-resistant'] },
    { id: 'hw-handheld', name: 'Plum Handheld', type: 'Mobile POS', group: 'mobile', price: 499, image: HW_IMG + 'handheld.webp', photo: true,
      description: 'Take orders and payments tableside, at the drive-thru or curbside, synced straight to the kitchen.',
      specs: ['6.5"+ display', 'Drop-proof to 1.2 m', 'NFC & digital wallets'] },
    { id: 'hw-pax-a35', name: 'PAX A35 Payment Terminal', type: 'Payment terminal', group: 'payments', price: 399, image: HW_IMG + 'pax-a35.webp', photo: true,
      description: 'Fast, secure card terminal with a PIN pad that helps you take payments at the counter, drive-thru or curbside.',
      specs: ['PIN pad', 'Chip, swipe & tap', 'Drive-thru & curbside'] },
    { id: 'hw-kiosk', name: 'Plum Self-Service Kiosk', type: 'Self-order', group: 'mobile', price: 1499, image: HW_IMG + 'kiosk.webp', photo: true,
      description: 'Compact touchscreen kiosk where guests order and pay on their own; orders flow to POS and kitchen.',
      specs: ['Built-in printer', 'Scanner & payments', 'Small footprint'] },
    { id: 'hw-printer', name: 'Plum Receipt Printer', type: 'Printer', group: 'accessories', price: 249, image: HW_IMG + 'receipt-printer.webp', photo: true,
      description: 'Compact thermal receipt printer that sits next to your POS and keeps checkout moving.',
      specs: ['Thermal printing', 'Triple interface', 'Starter paper roll'] },
    { id: 'hw-drawer', name: 'Plum Cash Drawer', type: 'Cash management', group: 'accessories', price: 129, image: HW_IMG + 'cash-drawer.webp', photo: true,
      description: 'Heavy-duty cash drawer built to handle regular and high-volume use with ease.',
      specs: ['Heavy-duty build', 'High-volume use'] },
    { id: 'hw-scanner', name: 'Plum Scanner', type: 'Scanner', group: 'accessories', price: 149, image: HW_IMG + 'scanner.webp', photo: true,
      description: 'Countertop barcode scanner that pairs with Plum POS for fast item lookup at checkout.',
      specs: ['Barcode scanning', 'Pairs with Plum POS'] },
    // CONTENT: confirm name, description and specs for the Tunes device with Plum POS
    { id: 'hw-tunes-player', name: 'Zip Tunes Player', type: 'Music player', group: 'guest', price: 199, image: HW_IMG + 'tunes-player.webp', photo: true,
      description: 'In-store player for Zip Tunes. Connect it to your sound system to play your scheduled, licensed playlists.',
      specs: ['Pairs with Zip Tunes', 'Scheduled playlists'] },
    // No product photos supplied yet for these two; they use illustrations
    { id: 'hw-kds', name: 'Plum KDS', type: 'Kitchen display', group: 'kitchen', price: 599, image: HW_IMG + 'kds.svg',
      description: 'Replace paper tickets: route orders to stations, track prep times and show every modifier clearly.',
      specs: ['Station routing', 'Prep timers', 'Modifier display'] },
    { id: 'hw-timeclock', name: 'Plum Time Clock', type: 'Time & attendance', group: 'time', price: 349, image: HW_IMG + 'time-clock.svg',
      description: 'Time and attendance terminal with facial recognition that stops buddy punching and supports labor compliance.',
      specs: ['Facial recognition', 'Labor compliance'] }
  ];
  var HW_MAX_QTY = 99;
  function hardware(id) { for (var i = 0; i < HARDWARE.length; i++) if (HARDWARE[i].id === id) return HARDWARE[i]; return null; }

  var MERCHANT_NAME = 'Altametrics LLC';
  var BASE_PRODUCT = 'zipschedules';

  function product(id) {
    for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
    return null;
  }

  /* ------------------------------------------------------------------------
     2. API stubs — replace with real endpoints
     ------------------------------------------------------------------------ */
  function delay(value, ms) {
    return new Promise(function (resolve) { setTimeout(function () { resolve(value); }, ms || 400); });
  }

  var api = {
    /** Capture lead email from the landing / catalog dialog. */
    saveEmail: function (email) { return delay({ ok: true }); },

    /** Create the account. Payload: { name, email, business, weekStart, phone, captchaToken } */
    registerAccount: function (payload) { return delay({ ok: true, accountId: 'acct_demo' }); },

    /** Send (or resend) the 6-digit verification code to the account email. */
    sendVerificationCode: function (email) { return delay({ ok: true }); },

    /** Verify the 6-digit code. Resolve { ok: false, message } on failure. */
    verifyCode: function (email, code) { return delay({ ok: true }); },

    /** Validate a discount code. Resolve { ok: true, amount, label } or { ok: false, message }. */
    applyDiscount: function (code, cartIds) {
      return delay({ ok: false, message: 'This discount code isn\u2019t valid.' });
    },

    /**
     * Tokenize card details with the payment processor (CSG Forte).
     * PRODUCTION: card data must be captured by Forte's hosted fields / Forte Checkout,
     * never posted to your own servers. This stub only returns non-sensitive metadata.
     */
    tokenizeCard: function (card) {
      return delay({ ok: true, token: 'tok_demo_' + Date.now(), brand: card.brand, last4: card.last4,
                     expMonth: card.expMonth, expYear: card.expYear });
    },

    /** Create the subscription(s) and charge. Payload: { token, billing, items, discount } */
    submitPayment: function (payload) { return delay({ ok: true, orderId: 'ord_demo' }, 900); },

    /** Cancel a subscription from the Manage page. */
    unsubscribe: function (appId) { return delay({ ok: true }); }
  };

  /* ------------------------------------------------------------------------
     3. Flow state (sessionStorage, with in-memory fallback)
     Never stores card numbers or security codes.
     ------------------------------------------------------------------------ */
  var STORE_KEY = 'zs_flow_v1';
  var memoryState = {};

  var store = {
    get: function () {
      try {
        var raw = window.sessionStorage.getItem(STORE_KEY);
        return raw ? JSON.parse(raw) : memoryState;
      } catch (e) { return memoryState; }
    },
    set: function (patch) {
      var next = Object.assign({}, store.get(), patch);
      memoryState = next;
      try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) { /* storage unavailable */ }
      return next;
    },
    cart: function () { return (store.get().cart || []).filter(product); },
    addToCart: function (id) {
      var cart = store.cart();
      if (cart.indexOf(id) === -1) cart.push(id);
      return store.set({ cart: cart });
    },
    removeFromCart: function (id) {
      return store.set({ cart: store.cart().filter(function (x) { return x !== id; }) });
    },
    /** Hardware: { id: qty } */
    hw: function () {
      var h = store.get().hardware || {}, out = {};
      Object.keys(h).forEach(function (id) { if (hardware(id) && h[id] > 0) out[id] = h[id]; });
      return out;
    },
    setQty: function (id, qty) {
      var h = store.hw(); qty = Math.max(0, Math.min(HW_MAX_QTY, Math.floor(qty) || 0));
      if (qty) h[id] = qty; else delete h[id];
      return store.set({ hardware: h });
    },
    hwLines: function () {
      var h = store.hw();
      return HARDWARE.filter(function (x) { return h[x.id]; }).map(function (x) { return { p: x, qty: h[x.id], total: x.price * h[x.id] }; });
    },
    hasItems: function () { return store.cart().length > 0 || store.hwLines().length > 0; },
    /** monthly apps, one-time hardware, discount and what's due today */
    totals: function () {
      var monthly = subtotal(store.cart());
      var hw = store.hwLines().reduce(function (s, l) { return s + l.total; }, 0);
      var units = store.hwLines().reduce(function (s, l) { return s + l.qty; }, 0);
      var discount = (store.get().discount && store.get().discount.amount) || 0;
      return { monthly: monthly, hardware: hw, discount: discount, due: Math.max(monthly + hw - discount, 0), apps: store.cart().length, units: units };
    }
  };

  /* ------------------------------------------------------------------------
     4. Helpers
     ------------------------------------------------------------------------ */
  var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  function fmt(n) { return money.format(n); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function subtotal(ids) { return ids.reduce(function (sum, id) { return sum + product(id).price; }, 0); }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function setLoading(btn, loading, label) {
    if (!btn) return;
    if (loading) {
      btn.dataset.html = btn.innerHTML;
      btn.textContent = label || 'Please wait\u2026';
      btn.classList.add('is-loading');
      btn.disabled = true;
    } else {
      if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }
  }

  /** Show / clear an inline error under a control (expects <p id="{id}-error">). */
  function fieldError(input, message) {
    var err = document.getElementById(input.id + '-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = message; err.hidden = false; }
    } else {
      input.removeAttribute('aria-invalid');
      if (err) { err.textContent = ''; err.hidden = true; }
    }
    return !message;
  }

  function clearErrorsOnInput(form) {
    $$('input, select', form).forEach(function (el) {
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) fieldError(el, ''); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) fieldError(el, ''); });
    });
  }

  function focusFirstInvalid(form) {
    var bad = $('[aria-invalid="true"]', form);
    if (bad) bad.focus();
  }

  /* Dialogs: open/close with focus return, backdrop click to close */
  var lastFocus = null;
  function openDialog(dialog, focusSel) {
    if (!dialog) return;
    if (!dialog.open) {
      lastFocus = lastFocus || document.activeElement;
      dialog.showModal();
    }
    var target = focusSel ? $(focusSel, dialog) : null;
    if (target) target.focus();
  }
  function closeDialog(dialog, keepFocus) {
    if (dialog && dialog.open) dialog.close();
    if (!keepFocus && lastFocus && document.body.contains(lastFocus)) { lastFocus.focus(); lastFocus = null; }
  }
  function wireDialogs() {
    $$('dialog').forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (e.target !== d || d.hasAttribute('data-static')) return;
        var r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(d);
      });
      if (d.hasAttribute('data-static')) d.addEventListener('cancel', function (e) { e.preventDefault(); });
    });
    $$('[data-close-dialog]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeDialog(btn.closest('dialog')); });
    });
  }

  var ICON_CHECK = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var ICON_PLUS = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_X = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /** Move the header stepper to a step (1-4). */
  function setStep(n) {
    $$('.stepper__item').forEach(function (li) {
      var i = +li.getAttribute('data-step');
      var state = i < n ? 'done' : (i === n ? 'current' : 'upcoming');
      li.setAttribute('data-state', state);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      var sr = $('.sr-only', li);
      if (sr) sr.textContent = state === 'done' ? ' (completed)' : (state === 'current' ? ' (current step)' : '');
    });
  }

  var ICON_MINUS = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
  var ICON_TRASH = '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';
  var ICON_BOX = '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>';

  /** Quantity stepper used on hardware cards and in the order summary */
  function qtyHTML(p, qty, compact) {
    return '<div class="qty' + (compact ? ' qty--sm' : '') + '" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
      '<button type="button" class="qty__btn" data-qty-dec="' + p.id + '" aria-label="' + (qty <= 1 ? 'Remove ' + esc(p.name) : 'Decrease quantity') + '">' + (qty <= 1 ? ICON_TRASH : ICON_MINUS) + '</button>' +
      '<input class="qty__input" type="number" inputmode="numeric" min="1" max="' + HW_MAX_QTY + '" value="' + qty + '" data-qty-input="' + p.id + '" aria-label="Quantity">' +
      '<button type="button" class="qty__btn" data-qty-inc="' + p.id + '" aria-label="Increase quantity"' + (qty >= HW_MAX_QTY ? ' disabled' : '') + '>' + ICON_PLUS + '</button></div>';
  }
  /** Wire +/- / typed quantity inside a container; onChange re-renders */
  function wireQty(root, onChange) {
    root.addEventListener('click', function (e) {
      var inc = e.target.closest('[data-qty-inc]'), dec = e.target.closest('[data-qty-dec]');
      if (inc) { var id = inc.getAttribute('data-qty-inc'); store.setQty(id, (store.hw()[id] || 0) + 1); onChange(id, 'inc'); }
      if (dec) { var id2 = dec.getAttribute('data-qty-dec'); store.setQty(id2, (store.hw()[id2] || 0) - 1); onChange(id2, 'dec'); }
    });
    root.addEventListener('change', function (e) {
      var inp = e.target.closest('[data-qty-input]'); if (!inp) return;
      var id = inp.getAttribute('data-qty-input'), v = parseInt(inp.value, 10);
      store.setQty(id, isNaN(v) || v < 1 ? 1 : v); onChange(id, 'input');
    });
  }
  function refocus(root, id, kind) {
    var sel = kind === 'inc' ? '[data-qty-inc="' + id + '"]' : kind === 'dec' ? '[data-qty-dec="' + id + '"]' : '[data-qty-input="' + id + '"]';
    var el = $(sel, root) || $('[data-hw-add="' + id + '"]', root); if (el) el.focus();
  }
  function priceTag(p) {
    return fmt(p.price) + (HARDWARE_PRICES_FINAL ? '' : '<span class="est-tag" title="Estimated price">Est.</span>');
  }

  function itemRow(p, removable) {
    return '<li class="cart-item">' +
      '<img class="cart-item__thumb" src="' + esc(p.image) + '" alt="" width="40" height="40">' +
      '<div><p class="cart-item__name">' + esc(p.name) + '</p><p class="cart-item__meta">Monthly subscription</p></div>' +
      '<p class="cart-item__price">' + fmt(p.price) + '<span class="cart-item__meta">/mo</span></p>' +
      (removable ? '<button type="button" class="cart-item__remove" data-remove="' + p.id + '" aria-label="Remove ' + esc(p.name) + '">' + ICON_X + '</button>' : '') +
    '</li>';
  }

  /* Mobile navigation (landing + catalog) */
  function wireNavToggle() {
    $$('[data-nav-toggle]').forEach(function (toggle) {
      var nav = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!nav) return;
      function set(open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        nav.classList.toggle('is-open', open);
      }
      toggle.addEventListener('click', function () { set(toggle.getAttribute('aria-expanded') !== 'true'); });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); }
      });
      window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches) set(false); });
    });
  }

  /* Email capture dialog (landing + catalog). onDone(email) runs after save. */
  var emailDone = null;
  function wireEmailDialog() {
    var dialog = $('#email-dialog');
    var form = $('#email-form');
    if (!dialog || !form) return;
    var input = $('#email-input');
    clearErrorsOnInput(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!email) return fieldError(input, 'Enter your email address.'), input.focus();
      if (!isEmail(email)) return fieldError(input, 'Enter a valid email address, like name@company.com.'), input.focus();
      var btn = $('button[type="submit"]', form);
      setLoading(btn, true);
      api.saveEmail(email).then(function () {
        store.set({ email: email });
        setLoading(btn, false);
        closeDialog(dialog, true);
        if (emailDone) emailDone(email);
      });
    });
  }
  function askForEmail(onDone) {
    emailDone = onDone;
    var input = $('#email-input');
    if (input && !input.value) input.value = store.get().email || '';
    openDialog($('#email-dialog'), '#email-input');
  }

  /* ------------------------------------------------------------------------
     5. Pages
     ------------------------------------------------------------------------ */

  /* ---------- Landing ---------- */
  function initLanding() {
    var header = $('.l-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    $$('[data-buy-now]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        askForEmail(function () {
          store.addToCart(btn.getAttribute('data-buy-now') || BASE_PRODUCT);
          window.location.href = 'products.html';
        });
      });
    });
  }

  /* ---------- Products & cart ---------- */
  function initCatalog() {
    var grid = $('#product-grid'), hwGrid = $('#hardware-grid'), items = $('#summary-items'), active = 'recommended', hwGroup = 'all';
    function cardHTML(p) {
      return '<article class="pcard' + (p.featured ? ' pcard--featured' : '') + '" data-id="' + p.id + '">' +
        '<div class="pcard__head"><img class="pcard__icon" src="' + esc(p.image) + '" alt="" width="56" height="56" loading="lazy">' +
        '<div class="pcard__titles"><h3 class="pcard__name">' + esc(p.name) + '</h3><p class="pcard__cat">' + esc(p.label || '') + (p.featured ? '<span class="pcard__badge">Popular</span>' : '') + '</p></div></div>' +
        '<p class="pcard__desc">' + esc(p.description) + '</p>' +
        '<div class="pcard__foot"><div><p class="pcard__price">' + fmt(p.price) + '<span class="pcard__per">/mo</span></p>' +
        '<a class="pcard__details" href="#" data-details="' + p.id + '" aria-label="Details for ' + esc(p.name) + '">Details</a></div>' +
        '<button type="button" class="btn btn--primary btn--sm pcard__add" data-add="' + p.id + '"></button></div></article>';
    }
    function hwCardHTML(p) {
      return '<article class="hcard" data-hw="' + p.id + '" data-group="' + p.group + '">' +
        '<div class="hcard__media' + (p.photo ? ' hcard__media--photo' : '') + '" data-media data-label="' + esc(p.name) + '"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" width="' + (p.photo ? 550 : 240) + '" height="' + (p.photo ? 580 : 160) + '" loading="lazy" decoding="async"></div>' +
        '<div class="hcard__body"><p class="hcard__type">' + esc(p.type) + '</p><h3 class="hcard__name">' + esc(p.name) + '</h3>' +
        '<p class="hcard__desc">' + esc(p.description) + '</p>' +
        '<ul class="hcard__specs">' + p.specs.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<div class="hcard__foot"><div class="hcard__pricebox"><p class="hcard__price">' + fmt(p.price) + '</p>' +
          '<p class="hcard__per">one-time' + (HARDWARE_PRICES_FINAL ? '' : ' <span class="est-tag" title="Estimated price">Est.</span>') + '</p></div>' +
        '<div class="hcard__action" data-hw-action="' + p.id + '"></div></div></div></article>';
    }
    function syncAdd() {
      var cart = store.cart(), owned = store.get().purchased || [];
      $$('[data-add]', grid).forEach(function (b) {
        var p = product(b.getAttribute('data-add')), added = cart.indexOf(p.id) !== -1, own = owned.indexOf(p.id) !== -1;
        b.classList.toggle('is-added', added || own);
        b.closest('.pcard').classList.toggle('is-added', added);
        b.setAttribute('aria-disabled', String(added || own));
        b.setAttribute('aria-label', own ? 'You already own ' + p.name : (added ? p.name + ' is in your cart' : 'Add ' + p.name + ' to cart'));
        b.innerHTML = own ? ICON_CHECK + 'Owned' : (added ? ICON_CHECK + 'Added' : ICON_PLUS + 'Add');
      });
      var h = store.hw();
      $$('[data-hw-action]', hwGrid).forEach(function (box) {
        var id = box.getAttribute('data-hw-action'), p = hardware(id), q = h[id] || 0;
        box.closest('.hcard').classList.toggle('is-added', q > 0);
        box.innerHTML = q > 0 ? qtyHTML(p, q) : '<button type="button" class="btn btn--primary btn--sm pcard__add" data-hw-add="' + id + '" aria-label="Add ' + esc(p.name) + ' to cart">' + ICON_PLUS + 'Add</button>';
      });
    }
    function hwRow(l) {
      return '<li class="cart-item cart-item--hw"><img class="cart-item__thumb cart-item__thumb--hw" src="' + esc(l.p.image) + '" alt="" width="40" height="40">' +
        '<div><p class="cart-item__name">' + esc(l.p.name) + '</p><p class="cart-item__meta">' + fmt(l.p.price) + ' each, one-time</p>' + qtyHTML(l.p, l.qty, true) + '</div>' +
        '<p class="cart-item__price">' + fmt(l.total) + '</p></li>';
    }
    function renderSummary() {
      var cart = store.cart(), lines = store.hwLines(), t = store.totals();
      var parts = [];
      if (cart.length) parts.push('<li class="summary-group">Apps<span>billed monthly</span></li>' + cart.map(function (id) { return itemRow(product(id), true); }).join(''));
      if (lines.length) parts.push('<li class="summary-group">Hardware<span>one-time</span></li>' + lines.map(hwRow).join(''));
      items.innerHTML = parts.length ? parts.join('') : '<li class="order-summary__empty">Your cart is empty.<br>Add an app or hardware to continue.</li>';
      var countBits = [];
      if (t.apps) countBits.push(t.apps + (t.apps === 1 ? ' app' : ' apps'));
      if (t.units) countBits.push(t.units + (t.units === 1 ? ' device' : ' devices'));
      $('#sum-count').textContent = countBits.join(', ');
      $('#sum-subtotal').textContent = fmt(t.monthly) + '/mo';
      $('#sum-subtotal').closest('.totals__row').hidden = !t.monthly && !!t.hardware;
      $('#sum-monthly').closest('.totals__row').hidden = !t.monthly && !!t.hardware;
      $('#sum-hw-row').hidden = !t.hardware;
      $('#sum-hardware').textContent = fmt(t.hardware);
      $('#sum-monthly').textContent = fmt(t.monthly) + '/mo';
      $('#sum-discount-row').hidden = !t.discount;
      $('#sum-discount').textContent = '- ' + fmt(t.discount);
      $('#sum-due').textContent = fmt(t.due);
      $('#sum-due-sub').textContent = t.monthly ? 'Then ' + fmt(t.monthly) + '/mo' : (t.hardware ? 'One-time hardware purchase' : '');
      $('#bar-total').textContent = fmt(t.due);
      $('#bar-count').textContent = (countBits.join(', ') || '0 items') + ', due today';
      $$('[data-checkout]').forEach(function (b) { b.disabled = !store.hasItems(); });
      syncAdd();
    }
    function matches(text, q) { return !q || text.toLowerCase().indexOf(q) !== -1; }
    function filter() {
      var q = $('#product-search').value.trim().toLowerCase(), apps = 0, hw = 0;
      var showApps = active !== 'hardware';
      $$('.pcard', grid).forEach(function (c) {
        var p = product(c.getAttribute('data-id'));
        c.hidden = !(showApps && (active === 'recommended' || p.category === active) && matches(p.name + ' ' + p.description + ' ' + p.label, q));
        if (!c.hidden) apps++;
      });
      $$('.hcard', hwGrid).forEach(function (c) {
        var p = hardware(c.getAttribute('data-hw'));
        c.hidden = !((hwGroup === 'all' || p.group === hwGroup) && matches(p.name + ' ' + p.type + ' ' + p.description + ' ' + p.specs.join(' '), q));
        if (!c.hidden) hw++;
      });
      $('#apps-section').hidden = !showApps;
      $('#catalog-empty').hidden = !showApps || apps > 0;
      $('#hardware-empty').hidden = hw > 0;
      $('#search-status').textContent = q ? apps + (apps === 1 ? ' app' : ' apps') + ' and ' + hw + ' hardware ' + (hw === 1 ? 'item' : 'items') + ' found' : '';
    }

    grid.innerHTML = CATALOG.filter(function (p) { return p.listed !== false; }).map(cardHTML).join('');
    hwGrid.innerHTML = HARDWARE.map(hwCardHTML).join('');
    $('#hw-filters').innerHTML = HARDWARE_GROUPS.map(function (g) {
      var n = g[0] === 'all' ? HARDWARE.length : HARDWARE.filter(function (x) { return x.group === g[0]; }).length;
      return '<button type="button" class="chip" data-hw-group="' + g[0] + '" aria-pressed="' + (g[0] === 'all') + '">' + esc(g[1]) + '<span class="chip__count">' + n + '</span></button>';
    }).join('');

    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-add]');
      if (a && a.getAttribute('aria-disabled') !== 'true') {
        var appId = a.getAttribute('data-add');
        var doAdd = function () { store.addToCart(appId); renderSummary(); a.focus(); };
        if (store.get().email) doAdd(); else askForEmail(doAdd);
      }
      if (e.target.closest('[data-details]')) e.preventDefault(); // TODO: product detail page
    });
    hwGrid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-hw-add]');
      if (a) {
        var id = a.getAttribute('data-hw-add');
        var doAdd = function () { store.setQty(id, 1); renderSummary(); refocus(hwGrid, id, 'inc'); };
        if (store.get().email) doAdd(); else askForEmail(doAdd);
      }
    });
    wireQty(hwGrid, function (id, kind) { renderSummary(); refocus(hwGrid, id, kind); });
    wireQty(items, function (id, kind) { renderSummary(); if (store.hw()[id]) refocus(items, id, kind); else $('#summary-title').focus(); });
    items.addEventListener('click', function (e) { var r = e.target.closest('[data-remove]'); if (r) { store.removeFromCart(r.getAttribute('data-remove')); renderSummary(); $('#summary-title').focus(); } });
    $('#product-search').addEventListener('input', filter);
    $$('.seg-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.seg-tab').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        t.setAttribute('aria-pressed', 'true'); active = t.getAttribute('data-category'); filter();
        if (active === 'hardware') $('#hardware-section').scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
    $('#hw-filters').addEventListener('click', function (e) {
      var c = e.target.closest('[data-hw-group]'); if (!c) return;
      $$('[data-hw-group]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true'); hwGroup = c.getAttribute('data-hw-group'); filter();
    });
    $$('[data-checkout]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!store.hasItems()) return;
        window.location.href = store.get().verified ? 'checkout.html' : 'registration.html';
      });
    });
    renderSummary(); filter();
  }

  /* ---------- Registration ---------- */
  function initRegistration() {
    var details = $('#details-form');
    var verify = $('#verify-form');
    var state = store.get();
    clearErrorsOnInput(details);

    if (state.email) $('#reg-email').value = state.email;

    // Order recap in the brand panel
    var cartIds = store.cart();
    if (store.hasItems() && $('#auth-order')) {
      var svg = function (d) { return '<svg class="auth-order__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
      var APP_ICON = {
        'zipschedules': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2v2H8zM14 14h2v2h-2z"/>',
        'zip-tunes': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
        'zip-digital-signage': '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
        'zip-clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'zip-forecasting': '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
        'zip-inventory': '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
        'zip-ordering': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
        'zip-checklist': '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
        'zip-reporting': '<path d="M12 20V10M18 20V4M6 20v-4"/>',
        'zip-shiftbook': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>'
      };
      $('#auth-order-items').innerHTML = cartIds.map(function (id) {
        var p = product(id);
        return '<li class="auth-order__row">' + svg(APP_ICON[id] || APP_ICON['zip-reporting']) +
          '<span class="auth-order__name">' + esc(p.name) + '</span><span class="auth-order__price">' + fmt(p.price) + '/mo</span></li>';
      }).join('');
      $('#auth-order-items').innerHTML += store.hwLines().map(function (l) {
        return '<li class="auth-order__row"><svg class="auth-order__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON_BOX + '</svg>' +
          '<span class="auth-order__name">' + esc(l.p.name) + ' <span class="auth-order__qty">&times;' + l.qty + '</span></span><span class="auth-order__price">' + fmt(l.total) + '</span></li>';
      }).join('');
      $('#auth-order-total').textContent = fmt(store.totals().due);
      $('#auth-order').hidden = false;
    }
    if (state.account) {
      $('#reg-name').value = state.account.name || '';
      $('#reg-business').value = state.account.business || '';
    }

    details.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#reg-name'), email = $('#reg-email'), business = $('#reg-business'), week = $('#reg-week-start');
      var ok = true;
      ok = fieldError(name, name.value.trim() ? '' : 'Enter your name.') && ok;
      ok = fieldError(email, !email.value.trim() ? 'Enter your email.' : (isEmail(email.value.trim()) ? '' : 'Enter a valid email address.')) && ok;
      ok = fieldError(business, business.value.trim() ? '' : 'Search for and select your business.') && ok;
      ok = fieldError(week, week.value ? '' : 'Choose the day your week starts.') && ok;
      if (!ok) return focusFirstInvalid(details);

      var payload = {
        name: name.value.trim(), email: email.value.trim(), business: business.value.trim(),
        weekStart: week.value, phone: ('+1 ' + $('#reg-phone').value).trim(),
        captchaToken: null // TODO: grecaptcha.getResponse()
      };
      var btn = $('button[type="submit"]', details);
      setLoading(btn, true);
      api.registerAccount(payload)
        .then(function () { return api.sendVerificationCode(payload.email); })
        .then(function () {
          store.set({ email: payload.email, account: payload });
          setLoading(btn, false);
          details.hidden = true;
          verify.hidden = false;
          $('#verify-email').textContent = payload.email;
          setStep(3);
          $('.otp-input', verify).focus();
        });
    });

    // OTP behaviour
    var otp = $$('.otp-input', verify);
    var otpGroup = $('.otp-inputs', verify);
    var msg = $('#verify-message');
    function setMsg(text, good) {
      msg.textContent = text || '';
      msg.hidden = !text;
      msg.classList.toggle('form-message--ok', !!good);
      if (good || !text) otpGroup.removeAttribute('aria-invalid'); else otpGroup.setAttribute('aria-invalid', 'true');
    }
    otp.forEach(function (input, i) {
      input.addEventListener('input', function () {
        input.value = input.value.replace(/\D/g, '').slice(0, 1);
        if (msg && !msg.hidden) setMsg('');
        if (input.value && otp[i + 1]) otp[i + 1].focus();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !input.value && otp[i - 1]) { otp[i - 1].focus(); otp[i - 1].value = ''; e.preventDefault(); }
        else if (e.key === 'ArrowLeft' && otp[i - 1]) otp[i - 1].focus();
        else if (e.key === 'ArrowRight' && otp[i + 1]) otp[i + 1].focus();
      });
      input.addEventListener('paste', function (e) {
        var digits = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (!digits) return;
        e.preventDefault();
        for (var j = 0; j + i < otp.length && j < digits.length; j++) otp[i + j].value = digits[j];
        otp[Math.min(i + digits.length, otp.length - 1)].focus();
      });
    });

    verify.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = otp.map(function (x) { return x.value; }).join('');
      if (code.length !== 6) {
        setMsg('Enter all 6 digits of the code.');
        var empty = otp.filter(function (x) { return !x.value; })[0];
        if (empty) empty.focus();
        return;
      }
      var btn = $('button[type="submit"]', verify);
      setLoading(btn, true, 'Verifying\u2026');
      api.verifyCode(store.get().email, code).then(function (res) {
        setLoading(btn, false);
        if (!res.ok) { setMsg(res.message || 'That code didn\u2019t match. Check the email and try again.'); otp[0].focus(); return; }
        store.set({ verified: true });
        window.location.href = 'checkout.html';
      });
    });

    var resend = $('#resend-code');
    resend.addEventListener('click', function () {
      resend.disabled = true;
      api.sendVerificationCode(store.get().email).then(function () {
        setMsg('A new code has been sent to your email.', true);
        setTimeout(function () { resend.disabled = false; }, 30000); // throttle resends
      });
    });
  }

  /* ---------- Checkout ---------- */
  var US_STATES = [['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']];

  function cardBrand(num) {
    if (/^4/.test(num)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^(6011|65|64[4-9])/.test(num)) return 'discover';
    return 'card';
  }
  var BRAND_LABEL = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover', card: 'Card' };
  function luhn(num) {
    var sum = 0, dbl = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var d = +num[i];
      if (dbl) { d *= 2; if (d > 9) d -= 9; }
      sum += d; dbl = !dbl;
    }
    return num.length >= 13 && sum % 10 === 0;
  }

  function initCheckout() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('demo') && !store.hasItems()) {
      store.set({ cart: ['zipschedules', 'zip-digital-signage'], email: 'name@company.com',
                  account: { name: 'Jordan Lee', business: 'Altametrics', email: 'name@company.com' } });
    }

    var placeBtn = $('#place-order');
    var payDialog = $('#payment-dialog');
    var billDialog = $('#billing-dialog');
    var reviewDialog = $('#review-dialog');
    var msgDialog = $('#message-dialog');

    function discountAmount() { var d = store.get().discount; return d ? d.amount : 0; }

    function renderAccount() {
      var s = store.get(), acct = s.account || {};
      var name = acct.name || '';
      $('#acct-initials').textContent = name ? name.split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase() : (s.email || '?').charAt(0).toUpperCase();
      $('#acct-name').textContent = name || 'Your account';
      $('#acct-meta').textContent = [s.email, acct.business].filter(Boolean).join(', ') || 'Email verified';
    }

    function renderOrder() {
      var cart = store.cart(), lines = store.hwLines(), t = store.totals();
      var html = '';
      if (cart.length) html += '<li class="summary-group">Apps<span>billed monthly</span></li>' + cart.map(function (id) { return itemRow(product(id), false); }).join('');
      if (lines.length) html += '<li class="summary-group">Hardware<span>one-time</span></li>' + lines.map(function (l) {
        return '<li class="cart-item cart-item--hw"><img class="cart-item__thumb cart-item__thumb--hw" src="' + esc(l.p.image) + '" alt="" width="40" height="40">' +
          '<div><p class="cart-item__name">' + esc(l.p.name) + ' &times;' + l.qty + '</p><p class="cart-item__meta">' + fmt(l.p.price) + ' each, one-time</p></div>' +
          '<p class="cart-item__price">' + fmt(l.total) + '</p></li>';
      }).join('');
      $('#order-items').innerHTML = html;
      $('#order-subtotal').textContent = fmt(t.monthly) + '/mo';
      $('#order-subtotal').closest('.your-order__row, .totals__row').hidden = !t.monthly && !!t.hardware;
      $('#order-hw-row').hidden = !t.hardware;
      $('#order-hardware').textContent = fmt(t.hardware);
      $('#order-discount-row').hidden = !t.discount;
      $('#order-discount').textContent = '- ' + fmt(t.discount);
      $('#order-total').textContent = fmt(t.due);
      $('#order-total-sub').textContent = t.monthly ? (t.hardware ? 'Due today, then ' + fmt(t.monthly) + '/mo' : 'Due today, then monthly') : (t.hardware ? 'One-time hardware purchase' : '');
      $('#pay-btn-label').textContent = 'Pay ' + fmt(t.due);
      $('#order-empty').hidden = store.hasItems();
      placeBtn.disabled = !store.hasItems();
    }

    // Discount code
    var dInput = $('#discount-code');
    var dApplied = $('#discount-applied');
    clearErrorsOnInput($('#checkout-form'));
    $('#apply-discount').addEventListener('click', function () {
      var code = dInput.value.trim();
      if (!code) return fieldError(dInput, 'Enter a discount code.'), dInput.focus();
      var btn = this;
      setLoading(btn, true, 'Applying\u2026');
      api.applyDiscount(code, store.cart()).then(function (res) {
        setLoading(btn, false);
        if (!res.ok) { store.set({ discount: null }); dApplied.hidden = true; fieldError(dInput, res.message); renderOrder(); return; }
        fieldError(dInput, '');
        store.set({ discount: { code: code, amount: res.amount, label: res.label } });
        dApplied.textContent = (res.label || code) + ' applied.';
        dApplied.hidden = false;
        renderOrder();
      });
    });

    // Place Order → payment details
    $('#checkout-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!store.hasItems()) return;
      openDialog(payDialog, '#card-number');
    });

    // Payment details
    var cardNum = $('#card-number'), cardExp = $('#card-exp'), cardCvc = $('#card-cvc');
    var payForm = $('#payment-form');
    clearErrorsOnInput(payForm);
    var chips = $('[data-brand-chips]', payDialog);
    var brandTag = $('#card-brand-tag');
    cardNum.addEventListener('input', function () {
      var digits = cardNum.value.replace(/\D/g, '').slice(0, 19);
      var detected = digits.length >= 2 ? cardBrand(digits) : '';
      var amex = detected === 'amex';
      if (chips) {
        chips.classList.toggle('has-match', !!detected && detected !== 'card');
        $$('.brand-chip', chips).forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-brand') === detected); });
      }
      brandTag.textContent = detected && detected !== 'card' ? BRAND_LABEL[detected] : '';
      cardNum.value = amex
        ? digits.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, function (m, a, b, c) { return [a, b, c].filter(Boolean).join(' '); })
        : digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
    cardExp.addEventListener('input', function () {
      var d = cardExp.value.replace(/\D/g, '').slice(0, 4);
      cardExp.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
    });
    cardCvc.addEventListener('input', function () { cardCvc.value = cardCvc.value.replace(/\D/g, '').slice(0, 4); });

    payForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var num = cardNum.value.replace(/\D/g, '');
      var exp = cardExp.value.replace(/\D/g, '');
      var mm = +exp.slice(0, 2), yy = +exp.slice(2, 4);
      var now = new Date(), curYY = now.getFullYear() % 100, curMM = now.getMonth() + 1;
      var brand = cardBrand(num);
      var ok = true;
      ok = fieldError(cardNum, !num ? 'Enter your card number.' : (luhn(num) ? '' : 'Check the card number \u2014 it doesn\u2019t look valid.')) && ok;
      ok = fieldError(cardExp, exp.length !== 4 || mm < 1 || mm > 12 ? 'Enter the expiry as MM / YY.'
        : (yy < curYY || (yy === curYY && mm < curMM) ? 'This card has expired.' : '')) && ok;
      ok = fieldError(cardCvc, new RegExp(brand === 'amex' ? '^\\d{4}$' : '^\\d{3}$').test(cardCvc.value) ? ''
        : 'Enter the ' + (brand === 'amex' ? '4' : '3') + '-digit security code.') && ok;
      if (!ok) return focusFirstInvalid(payForm);

      var btn = $('button[type="submit"]', payForm);
      setLoading(btn, true);
      api.tokenizeCard({ number: num, expMonth: mm, expYear: 2000 + yy, cvc: cardCvc.value, brand: brand, last4: num.slice(-4) })
        .then(function (res) {
          setLoading(btn, false);
          store.set({ payment: { token: res.token, brand: res.brand, last4: res.last4, expMonth: res.expMonth, expYear: res.expYear } });
          // Drop sensitive values from the DOM as soon as they're tokenized
          cardNum.value = ''; cardExp.value = ''; cardCvc.value = '';
          brandTag.textContent = '';
          if (chips) { chips.classList.remove('has-match'); $$('.brand-chip', chips).forEach(function (c) { c.classList.remove('is-active'); }); }
          closeDialog(payDialog, true);
          prefillBilling();
          openDialog(billDialog, '#bill-name');
        });
    });

    // Billing information
    var stateSel = $('#bill-state');
    stateSel.insertAdjacentHTML('beforeend', US_STATES.map(function (s) {
      return '<option value="' + s[0] + '">' + s[1] + '</option>';
    }).join(''));
    var billForm = $('#billing-form');
    clearErrorsOnInput(billForm);

    function prefillBilling() {
      var s = store.get(), b = s.billing || {};
      var acct = s.account || {};
      $('#bill-name').value = b.fullName || acct.name || '';
      $('#bill-address1').value = b.address1 || '';
      $('#bill-address2').value = b.address2 || '';
      $('#bill-city').value = b.city || '';
      stateSel.value = b.state || '';
      $('#bill-postal').value = b.postal || '';
      $('#bill-phone').value = b.phone || '';
      $('#bill-email').value = b.email || s.email || '';
    }

    billForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = {
        fullName: $('#bill-name'), address1: $('#bill-address1'), city: $('#bill-city'),
        state: stateSel, postal: $('#bill-postal'), email: $('#bill-email'), phone: $('#bill-phone')
      };
      var ok = true;
      ok = fieldError(f.fullName, f.fullName.value.trim() ? '' : 'Enter the cardholder\u2019s full name.') && ok;
      ok = fieldError(f.address1, f.address1.value.trim() ? '' : 'Enter the billing address.') && ok;
      ok = fieldError(f.city, f.city.value.trim() ? '' : 'Enter the city.') && ok;
      ok = fieldError(f.state, f.state.value ? '' : 'Choose a state.') && ok;
      ok = fieldError(f.postal, /^\d{5}(-\d{4})?$/.test(f.postal.value.trim()) ? '' : 'Enter a 5-digit ZIP code.') && ok;
      ok = fieldError(f.phone, !f.phone.value.trim() || f.phone.value.replace(/\D/g, '').length >= 10 ? '' : 'Enter a 10-digit phone number.') && ok;
      ok = fieldError(f.email, isEmail(f.email.value.trim()) ? '' : 'Enter a valid email address.') && ok;
      if (!ok) return focusFirstInvalid(billForm);

      store.set({ billing: {
        fullName: f.fullName.value.trim(), address1: f.address1.value.trim(), address2: $('#bill-address2').value.trim(),
        city: f.city.value.trim(), state: f.state.value, postal: f.postal.value.trim(),
        phone: f.phone.value.trim(), email: f.email.value.trim()
      } });
      closeDialog(billDialog, true);
      renderReview();
      openDialog(reviewDialog, '#pay-btn');
    });

    // Review
    function renderReview() {
      var s = store.get(), pay = s.payment || {}, b = s.billing || {}, acct = s.account || {};
      var cart = store.cart();
      $('#review-merchant').textContent = MERCHANT_NAME;
      $('#review-brand').textContent = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX', discover: 'DISC' }[pay.brand] || 'CARD';
      $('#review-pay-lines').innerHTML =
        esc(BRAND_LABEL[pay.brand || 'card']) + ' ending in ' + esc(pay.last4) + '<br>' +
        '<span class="muted">' + esc(b.fullName) + (acct.business ? ', ' + esc(acct.business) : '') + '</span><br>' +
        '<span class="review-exp">Expires ' + String(pay.expMonth).padStart(2, '0') + '/' + esc(pay.expYear) + '</span>';
      $('#review-bill-lines').innerHTML =
        esc(b.fullName) + (acct.business ? '<br><span class="muted">' + esc(acct.business) + '</span>' : '') + '<br>' +
        esc([b.address1, b.address2].filter(Boolean).join(', ')) + '<br>' +
        esc(b.city + ', ' + b.state + ' ' + b.postal) + '<br>' +
        '<span class="muted">' + esc(b.email) + '</span>';
      var t = store.totals();
      $('#review-rows').innerHTML = cart.map(function (id) {
        var p = product(id);
        return '<div class="amount-summary__row"><dt>' + esc(p.name) + '</dt><dd>' + fmt(p.price) + '/mo</dd></div>';
      }).join('') + store.hwLines().map(function (l) {
        return '<div class="amount-summary__row"><dt>' + esc(l.p.name) + ' &times;' + l.qty + '</dt><dd>' + fmt(l.total) + '</dd></div>';
      }).join('') + (t.discount
        ? '<div class="amount-summary__row"><dt>Discount</dt><dd>- ' + fmt(t.discount) + '</dd></div>' : '');
      $('#review-total').textContent = fmt(t.due);
      $('#pay-error').hidden = true;
    }

    $('#edit-payment').addEventListener('click', function () { closeDialog(reviewDialog, true); openDialog(payDialog, '#card-number'); });
    $('#edit-billing').addEventListener('click', function () { closeDialog(reviewDialog, true); prefillBilling(); openDialog(billDialog, '#bill-name'); });

    $('#pay-btn').addEventListener('click', function () {
      var btn = this, s = store.get();
      setLoading(btn, true, 'Processing payment\u2026');
      // hardware: { id: qty } — one-time items that ship to the billing/business address
      api.submitPayment({ token: s.payment && s.payment.token, billing: s.billing, items: store.cart(), hardware: store.hw(), discount: s.discount || null })
        .then(function (res) {
          setLoading(btn, false);
          if (!res.ok) {
            var err = $('#pay-error');
            err.textContent = res.message || 'The payment didn\u2019t go through. Check your card details or try another card.';
            err.hidden = false;
            return;
          }
          var bought = store.cart(), devices = store.hwLines();
          var join = function (arr) { return arr.length > 1 ? arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1] : arr[0]; };
          var appText = bought.length ? 'You\u2019re now subscribed to ' + join(bought.map(function (id) { return '<strong>' + esc(product(id).name) + '</strong>'; })) + '.' : '';
          var hwText = devices.length ? ' Your hardware order (' + join(devices.map(function (l) { return l.qty + ' &times; ' + esc(l.p.name); })) + ') is confirmed; we&rsquo;ll email shipping details.' : '';
          $('#message-text').innerHTML = (appText + hwText).trim() + (bought.length ? ' Configure your apps, or ask your manager to configure them.' : '');
          $('#message-meta').textContent = 'Order ' + res.orderId + '. A receipt was sent to ' + ((s.billing && s.billing.email) || s.email || 'your email') + '.';
          store.set({ purchased: bought, orderId: res.orderId, cart: [], hardware: {}, discount: null, payment: null });
          closeDialog(reviewDialog, true);
          openDialog(msgDialog, '#message-ok');
        });
    });

    $('#message-ok').addEventListener('click', function () {
      var first = (store.get().purchased || [])[0];
      window.location.href = 'manage.html' + (first ? '?app=' + encodeURIComponent(first) : '');
    });

    renderAccount();
    renderOrder();
  }

  /* ---------- Manage subscription ---------- */
  function initManage() {
    var params = new URLSearchParams(window.location.search);
    var p = product(params.get('app') || (store.get().purchased || [])[0]) || product(BASE_PRODUCT);
    $$('[data-app-name]').forEach(function (el) { el.textContent = p.name; });
    $('#plan-price').textContent = p.price.toFixed(2);
    $('#plan-icon').src = p.image;
    document.title = 'Manage ' + p.name + ' | My Apps';

    var confirmDlg = $('#confirm-dialog');
    var unsub = $('#unsubscribe');
    unsub.addEventListener('click', function () { openDialog(confirmDlg, '[data-close-dialog]'); });

    $('#confirm-unsubscribe').addEventListener('click', function () {
      var btn = this;
      setLoading(btn, true, 'Unsubscribing\u2026');
      api.unsubscribe(p.id).then(function () {
        setLoading(btn, false);
        closeDialog(confirmDlg, true);
        var pill = $('#plan-status');
        pill.textContent = 'Cancelled';
        pill.classList.replace('status-pill--active', 'status-pill--cancelled');
        $('#plan-footer-text').textContent = 'This subscription has been cancelled.';
        unsub.hidden = true;
        $('#resubscribe').hidden = false;
        openDialog($('#message-dialog'), '#message-ok');
      });
    });
    $('#message-ok').addEventListener('click', function () { closeDialog($('#message-dialog')); $('#resubscribe').focus(); });
  }

  /* ------------------------------------------------------------------------
     6. Boot
     ------------------------------------------------------------------------ */
  /* Images: swap in a branded fallback panel if a remote image fails to load */
  function markFailed(img) {
    var wrap = img.closest('[data-media]');
    if (wrap) wrap.classList.add('is-failed'); else img.classList.add('is-failed');
  }
  document.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'IMG') markFailed(e.target); }, true);

  document.addEventListener('DOMContentLoaded', function () {
    $$('img').forEach(function (img) { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markFailed(img); });
    wireDialogs();
    wireNavToggle();
    wireEmailDialog();
    var page = document.body.getAttribute('data-page');
    if (page === 'landing') initLanding();
    if (page === 'catalog') initCatalog();
    if (page === 'registration') initRegistration();
    if (page === 'checkout') initCheckout();
    if (page === 'manage') initManage();
  });

  // Exposed for integration and debugging
  window.ZipFlow = { api: api, store: store, catalog: CATALOG, hardware: HARDWARE };
})();
