/* app.js - Phones and Tablets only.*/
(function () {
  'use strict';
  if (document.documentElement.classList.contains('blocked')) { return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function hasAccess() { return Lock.hasToken() && Book.has(); }

  var ICON = window.ICON || {};   /* the icon paths live in icons.js */

  function svg(name, size) {
    var s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="currentColor" aria-hidden="true"><path d="' + ICON[name] + '"/></svg>';
  }

  var UI = window.UI = {};
  var spinCount = 0;
  UI.spinner = function (on, msg) {
    var el = $('#spinner');
    if (on) {
      spinCount++;
      $('#spinMsg').textContent = msg || 'Please wait...';
      el.classList.add('show');
    } else {
      spinCount = Math.max(0, spinCount - 1);
      if (!spinCount) { el.classList.remove('show'); }
    }
  };
  var toastTimer;
  UI.toast = function (msg, type) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = (type || '') + ' show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = type || ''; }, 2200);
  };
  UI.dialog = function (o) {
    return new Promise(function (resolve) {
      var type = o.type || 'info';
      var acts = o.actions || [{ label: 'OK', value: 'ok' }];
      var wrap = document.createElement('div');
      wrap.className = 'dlg-scrim';
      var icon = type === 'success' ? 'checkc' : (type === 'error' ? 'error' : 'info');
      wrap.innerHTML = '<div class="dlg" role="alertdialog" aria-modal="true"><div class="dlg-ic ' + type + '">' + svg(icon, 38) +
        '</div><h2></h2><p></p><div class="dlg-actions"></div></div>';
      $('h2', wrap).textContent = o.title || '';
      $('p', wrap).textContent = o.message || '';
      var box = $('.dlg-actions', wrap);
      acts.forEach(function (a) {
        var b = document.createElement('button');
        b.className = 'btn ' + (a.style || '');
        b.textContent = a.label;
        b.onclick = function () { wrap.remove(); resolve(a.value); };
        box.appendChild(b);
      });
      $('#dialogHost').appendChild(wrap);
      if (box.lastChild) { box.lastChild.focus(); }
    });
  };
  UI.confirm = function (title, message, okLabel, danger) {
    return UI.dialog({
      type: 'info', title: title, message: message,
      actions: [{ label: 'Cancel', value: false, style: 'outline' }, { label: okLabel || 'OK', value: true, style: danger ? 'danger' : '' }]
    });
  };

  /* touch ripple */
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest ? e.target.closest('button, a.cta') : null;
    if (!t || t.disabled) { return; }
    var r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    var sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    t.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 600);
  });

  var root = document.documentElement;
  function theme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    put('prayer_theme', t);
    var m = $('meta[name="theme-color"]');
    if (m) { m.content = t === 'dark' ? '#121212' : '#FFFFFF'; }
    syncTheme();
  }
  function syncTheme() {
    var dark = theme() === 'dark';
    $('#btnDark .pill').innerHTML = svg(dark ? 'sun' : 'moon');
    $('#btnDark .lbl').textContent = dark ? 'Light' : 'Dark';
    var sw = $('#swDark');
    if (sw) { sw.setAttribute('aria-checked', String(dark)); }
  }
  function fontSize() {
    var f = parseInt(get('prayer_fs', '19'), 10);
    return f >= 19 && f <= 23 ? f : 19;
  }
  function setFont(n) {
    n = Math.max(19, Math.min(23, n));
    root.style.setProperty('--fs', n + 'px');
    put('prayer_fs', String(n));
    var v = $('#fsVal'), r = $('#fsRange');
    if (v) { v.textContent = n + ' px'; }
    if (r) { r.value = n; }
  }

  var stack = [];
  var routes = {}, activeRoute = null, navItems = [], quickActions = [], menuBuilt = false, navCount = 0;
  function applyOv() {
    $('#drawerLeft').classList.toggle('open', stack.indexOf('left') > -1);
    $('#drawerRight').classList.toggle('open', stack.indexOf('right') > -1);
    $('#sheet').classList.toggle('open', stack.indexOf('sheet') > -1);
    if (stack.indexOf('route') < 0 && activeRoute) {
      var name = activeRoute, r = routes[name];
      activeRoute = null;
      removeGate();
      if (r && r.close) { r.close(); }
    }
  }
  function pushOv(kind) {
    if (stack[stack.length - 1] === kind) { return; }
    stack.push(kind);
    history.pushState({ ov: stack.length }, '');
    applyOv();
  }
  function backOv() {
    if (!stack.length) { return; }
    stack.pop();
    applyOv();
    history.back();
  }
  function closeAll() {
    var n = stack.length;
    if (!n) { return; }
    stack.length = 0;
    applyOv();
    history.go(-n);
  }
  window.addEventListener('popstate', function (e) {
    var depth = (e.state && e.state.ov) || 0;
    if (stack.length > depth) { stack.length = depth; applyOv(); }
  });

  function removeGate() { var g = $('#npGate'); if (g) { g.remove(); } }
  function showGate(name) {
    var r = routes[name] || {}, label = r.title || 'This tool';
    removeGate();
    var g = document.createElement('div');
    g.id = 'npGate';
    g.className = 'np-gate';
    g.innerHTML = '<div class="dlg" role="alertdialog" aria-modal="true"><div class="dlg-ic">' + svg('lock', 36) + '</div><h2></h2><p></p>' +
      '<div class="dlg-actions"><button class="btn outline" id="gateClose">Close</button><button class="btn" id="gateCode">Enter code</button></div></div>';
    $('h2', g).textContent = 'Access code needed';
    $('p', g).textContent = label + ' is free to open, but only readers with an access code can use it.';
    document.body.appendChild(g);
    $('#gateClose').addEventListener('click', backOv);
    $('#gateCode').addEventListener('click', goUnlock);
  }
  function goUnlock() {
    closeAll();
    cur = 'lock';
    render();
    main.scrollTop = 0;
  }
  function mountNavItem(o) {
    var b = document.createElement('button');
    b.id = o.id;
    b.className = 'dr-item';
    b.setAttribute('data-gated', '1');
    b.innerHTML = o.html;
    b.addEventListener('click', function () { window.DV.openRoute(o.key); });
    var list = $('#rightList');
    list.insertBefore(b, list.children[navCount] || null);
    navCount++;
  }
  window.DV = {
    toast: function (m) { UI.toast(m); },
    route: function (name, cfg) { routes[name] = cfg; },
    openRoute: function (name) {
      var r = routes[name];
      if (!r || activeRoute) { return; }
      activeRoute = name;
      r.open();
      pushOv('route');
      if (!hasAccess()) { showGate(name); }
    },
    closeRoute: function () { if (activeRoute) { backOv(); } },
    addNavItem: function (o) {
      navItems.push(o);
      if (menuBuilt) { mountNavItem(o); refreshLocks(); }
    },
    addQuickAction: function (o) { if (o && o.route) { quickActions.push(o); } }
  };

  /* The "Access Code" menu items stay visible forever, even after unlocking. */
  function refreshAccessItems() {
    $$('[data-access-item]').forEach(function (b) { b.hidden = false; });   /* always visible, for everyone */
  }

  function refreshLocks() {
    var locked = !hasAccess();
    $$('[data-gated]').forEach(function (b) {
      var l = b.querySelector('.dr-lock');
      if (locked && !l) { l = document.createElement('span'); l.className = 'dr-lock'; l.innerHTML = svg('lock', 22); b.appendChild(l); }
      else if (!locked && l) { l.remove(); }
    });
  }

  function openSheet(title, html, after) {
    $('#sheetTitle').textContent = title;
    $('#sheetBody').innerHTML = html;
    $('#sheetBody').scrollTop = 0;
    pushOv('sheet');
    if (after) { after(); }
  }

  var GEAR_D = (function () {
    var n = 12, c = 50, ro = 49, rr = 42, rh = 36, step = Math.PI * 2 / n, d = '', i;
    function pt(r, a) { return (c + r * Math.cos(a)).toFixed(2) + ' ' + (c + r * Math.sin(a)).toFixed(2); }
    for (i = 0; i < n; i++) {
      var a = i * step;
      d += (i ? 'L' : 'M') + pt(rr, a) + 'L' + pt(ro, a + step * 0.14) + 'L' + pt(ro, a + step * 0.36) + 'L' + pt(rr, a + step * 0.5);
    }
    d += 'Z';
    d += 'M' + (c - rh) + ' ' + c + 'A' + rh + ' ' + rh + ' 0 1 0 ' + (c + rh) + ' ' + c + 'A' + rh + ' ' + rh + ' 0 1 0 ' + (c - rh) + ' ' + c + 'Z';
    return d;
  })();
  /* Pictures shown when the hosted logo or photo cannot load. Facebook blue. */
  var FALLBACK = {
    logo: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#1877F2"/><path fill="#FFFFFF" d="M10 4h4v6h6v4h-6v7h-4v-7H4v-4h6z"/></svg>'),
    person: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CFE3FD"/><path fill="#1877F2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')
  };
  /* The ring turns. The picture inside is a separate element and never turns. */
  function gearInner(src, fb, alt) {
    return '<svg class="gear-ring" viewBox="0 0 100 100" aria-hidden="true"><path fill-rule="evenodd" d="' + GEAR_D + '"/></svg>' +
      '<img class="gear-img" data-fb="' + fb + '" alt="' + esc(alt || '') + '" src="' + esc(src) + '">';
  }
  function fixImgs(root) {
    $$('img.gear-img', root).forEach(function (img) {
      var fb = FALLBACK[img.getAttribute('data-fb')] || FALLBACK.logo;
      img.onerror = function () { img.onerror = null; img.src = fb; };
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src') !== fb) { img.onerror(); }
    });
  }
  function gearMarkup(size, src, fb, alt) {
    return '<span class="gear-wrap" style="--sz:' + size + 'px">' + gearInner(src, fb, alt) + '</span>';
  }
  function mountGears() {
    $$('.gear-slot').forEach(function (s) {
      s.style.setProperty('--sz', (s.getAttribute('data-size') || '44') + 'px');
      s.innerHTML = gearInner(M.logo, 'logo', '');
      fixImgs(s);
    });
  }

  var M = Book.meta;

  /* Fills {title} {author} {edition} {email} {phone} from book.js, and **bold** text. */
  function fill(t) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return M[k] != null ? M[k] : m; }); }
  function inline(t) { return esc(fill(t)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }

  function ctaRow(msg) {
    var wa = 'https://wa.me/' + String(M.whatsapp).replace(/[^0-9]/g, '') + (msg ? '?text=' + encodeURIComponent(msg) : '');
    var mail = 'mailto:' + M.email + (msg ? '?subject=' + encodeURIComponent('Access code request') + '&body=' + encodeURIComponent(msg) : '');
    return '<div class="cta-row">' +
      '<a class="cta email" href="' + esc(mail) + '" aria-label="Email us">' + svg('mail', 30) + '</a>' +
      '<a class="cta whatsapp" href="' + esc(wa) + '" target="_blank" rel="noopener" aria-label="WhatsApp us">' + svg('whatsapp', 30) + '</a>' +
      '<a class="cta facebook" href="' + esc(M.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + svg('facebook', 30) + '</a>' +
      '<a class="cta phone" href="tel:' + esc(M.phone) + '" aria-label="Call us">' + svg('phone', 30) + '</a></div>';
  }
  /* Turns the page blocks written in book.js (Book.pages) into HTML. */
  function renderBlocks(blocks) {
    return blocks.map(function (b) {
      var kind = b[0], val = b[1];
      if (kind === 'h') { return '<h3>' + inline(val) + '</h3>'; }
      if (kind === 'p') { return '<p>' + inline(val) + '</p>'; }
      if (kind === 'ul' || kind === 'ol') { return '<' + kind + '>' + val.map(function (li) { return '<li>' + inline(li) + '</li>'; }).join('') + '</' + kind + '>'; }
      if (kind === 'about') { return M.about.map(function (p) { return '<p>' + inline(p) + '</p>'; }).join(''); }
      if (kind === 'dev') {
        var d = M.developer;
        return '<div class="dev-wrap">' + gearMarkup(168, d.photo, 'person', d.name) + '</div><h3>' + esc(d.name) + '</h3><p class="muted">' + esc(d.role) + '</p><p>' + esc(d.bio) + '</p>';
      }
      if (kind === 'cta') { return ctaRow(); }
      if (kind === 'cta-code') { return ctaRow(CODE_MSG); }
      return '';
    }).join('');
  }
  function openInfo(key) {
    var p = Book.pages[key];
    if (!p) { return; }
    openSheet(p.title, '<div class="info' + (p.center ? ' center' : '') + '">' + renderBlocks(p.blocks) + '</div>', function () { fixImgs($('#sheetBody')); });
  }

  function buildMenus() {
    $('#btnLeft').innerHTML = svg('menu');
    $('#btnRight').innerHTML = svg('more');
    $('#sheetBack').innerHTML = svg('back');
    $('#leftBack').innerHTML = svg('back');
    $('#rightBack').innerHTML = svg('back');
    mountGears();

    var left = [['info', 'About the App', 'about'], ['person', 'About Developer', 'dev'], ['help', 'How to Use', 'how'],
      ['doc', 'Terms of Use', 'terms'], ['heart', 'Support Us', 'support'], ['mail', 'Contact Us', 'contact']];
    var SM = window.SupportModal;     /* optional file: support-modal.js */
    var accessItem = SM ? '<button class="dr-item access" data-access-item="1"><span class="dr-ic">' + svg('lock') + '</span><span class="dr-txt">' + esc(SM.config.menuLabel) + '</span><span class="dr-tag">' + esc(SM.config.menuTag) + '</span></button>' : '';
    $('#leftList').innerHTML = accessItem + left.map(function (i) {
      return '<button class="dr-item" data-info="' + i[2] + '"><span class="dr-ic">' + svg(i[0]) + '</span><span class="dr-txt">' + i[1] + '</span></button>';
    }).join('');

    $('#rightList').innerHTML = accessItem +
      '<div class="dr-row"><span class="dr-ic">' + svg('moon') + '</span><span class="dr-txt">Dark mode</span><button class="switch" id="swDark" role="switch" aria-checked="false" aria-label="Dark mode"></button></div>' +
      '<div class="dr-row col"><div class="dr-line"><span class="dr-ic">' + svg('textsize') + '</span><span class="dr-txt">Text size</span><span class="dr-val" id="fsVal"></span></div>' +
      '<input id="fsRange" type="range" min="19" max="23" step="1" aria-label="Text size from 19 to 23 pixels"></div>' +
      '<button class="dr-item" id="miTodo"><span class="dr-ic">' + svg('todo') + '</span><span class="dr-txt">To-do list</span></button>' +
      '<button class="dr-item" id="miInstall"><span class="dr-ic">' + svg('install') + '</span><span class="dr-txt">Install App</span></button>' +
      '<button class="dr-item" id="miShare"><span class="dr-ic">' + svg('share') + '</span><span class="dr-txt">Share App</span></button>';

    $$('[data-info]').forEach(function (b) { b.addEventListener('click', function () { openInfo(b.getAttribute('data-info')); }); });
    $$('[data-access-item]').forEach(function (b) { b.addEventListener('click', function () { SM.open(); }); });
    $('#swDark').addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark'); });
    $('#fsRange').addEventListener('input', function () { setFont(parseInt(this.value, 10)); });
    $('#miTodo').setAttribute('data-gated', '1');
    menuBuilt = true; navCount = 0;
    navItems.forEach(mountNavItem);
    $('#miTodo').addEventListener('click', openTodo);
    $('#miInstall').addEventListener('click', installApp);
    $('#miShare').addEventListener('click', shareApp);

    $('#btnLeft').addEventListener('click', function () { refreshAccessItems(); pushOv('left'); });
    $('#btnRight').addEventListener('click', function () { refreshLocks(); refreshAccessItems(); pushOv('right'); });
    $('#sheetBack').addEventListener('click', backOv);
    $('#leftBack').addEventListener('click', backOv);
    $('#rightBack').addEventListener('click', backOv);

    $('#navToc').innerHTML = '<span class="pill">' + svg('list') + '</span><span>TOC</span>';
    $('#navFront').innerHTML = '<span class="pill">' + svg('home') + '</span><span>Home</span>';
    $('#navPrev').innerHTML = '<span class="pill">' + svg('prev') + '</span><span>Prev</span>';
    $('#navNext').innerHTML = '<span class="pill">' + svg('next') + '</span><span>Next</span>';
    $('#btnDark').innerHTML = '<span class="pill"></span><span class="lbl">Dark</span>';
    $('#navToc').addEventListener('click', function () { go('toc'); });
    $('#navFront').addEventListener('click', function () { go('front'); });
    $('#navPrev').addEventListener('click', function () { step(-1); });
    $('#navNext').addEventListener('click', function () { step(1); });
    $('#btnDark').addEventListener('click', function () { setTheme(theme() === 'dark' ? 'light' : 'dark'); });
  }

  var cur = 'welcome';
  var view = $('#view'), main = $('#main');

  function go(id) {
    if (id !== 'front' && id !== 'toc' && !Book.find(id)) { id = 'front'; }
    cur = id;
    if (id !== 'front' && id !== 'toc') { put('prayer_last', id); }
    closeAll();
    render();
    main.scrollTop = 0;
  }
  function step(dir) {
    var ids = Book.ids(), i = ids.indexOf(cur);
    if (i < 0) { return; }
    var n = i + dir;
    if (n >= 0 && n < ids.length) { go(ids[n]); }
  }
  function updateNav() {
    var locked = cur === 'lock' || cur === 'welcome', ids = Book.ids(), i = ids.indexOf(cur);
    $('#navToc').classList.toggle('active', cur === 'toc');
    $('#navFront').classList.toggle('active', cur === 'front');
    $('#navToc').disabled = locked;
    $('#navFront').disabled = locked;
    $('#navPrev').disabled = locked || cur === 'toc' || i <= 0;
    $('#navNext').disabled = locked || cur === 'toc' || i < 0 || i >= ids.length - 1;
    document.body.classList.toggle('locked', locked);
  }
  function render() {
    if (cur === 'welcome') { renderWelcome(); }
    else if (cur === 'lock') { renderLock(); }
    else if (cur === 'front') { renderFront(); }
    else if (cur === 'toc') { renderToc(); }
    else { renderPage(Book.find(cur)); }
    updateNav();
  }

  var CODE_MSG = 'Hello, I would like to get an access code for The Prayer App.';
  function renderWelcome() {
    var CP = window.CoverPage;
    if (CP && typeof CP.render === 'function') {
      try {
        CP.render(view, function () { cur = 'lock'; render(); main.scrollTop = 0; });
        return;
      } catch (e) { /* fall through to the code screen */ }
    }
    cur = 'lock';
    renderLock();
  }

  function renderLock() {
    var SM = window.SupportModal;      /* optional file: support-modal.js */
    var pill = SM ? '<div class="lock-top"><button class="btn pill" id="btnInfo">' + svg('heart', 22) + '<span>' + esc(SM.config.buttonLabel) + '</span></button></div>' : '';
    var back = window.CoverPage ? '<button class="btn outline" id="btnWelcome">' + svg('back', 22) + '<span>Back</span></button>' : '';
    view.innerHTML = '<div class="lock">' + pill + '<div class="lock-main">' +
      '<div class="lock-ic">' + svg('lock', 40) + '</div>' +
      '<h2>Unlock your app</h2>' +
      '<p class="muted">Enter the access code you received. Each code works on one device only.</p>' +
      '<div class="field"><label for="codeInput">Access code</label>' +
      '<div class="pw"><input id="codeInput" type="password" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="Enter code">' +
      '<button class="eye" id="btnEye" type="button" aria-label="Show code" aria-pressed="false">' + svg('eye') + '</button></div></div>' +
      '<button class="btn block" id="btnUnlock">Unlock App</button>' +
      '<div class="lock-links"><button class="btn outline" id="btnNeedCode"><span>Need a code</span>' + svg('help', 22) + '</button>' + back + '</div></div></div>';
    $('#btnUnlock').addEventListener('click', doUnlock);
    $('#codeInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') { doUnlock(); } });
    $('#btnEye').addEventListener('click', function () {
      var inp = $('#codeInput'), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      this.setAttribute('aria-pressed', String(show));
      this.setAttribute('aria-label', show ? 'Hide code' : 'Show code');
      this.innerHTML = svg(show ? 'eyeoff' : 'eye');
      inp.focus();
    });
    $('#btnNeedCode').addEventListener('click', function () { openInfo('contact'); });
    if ($('#btnInfo')) { $('#btnInfo').addEventListener('click', function () { SM.open(); }); }
    if ($('#btnWelcome')) { $('#btnWelcome').addEventListener('click', function () { cur = 'welcome'; render(); main.scrollTop = 0; }); }
  }

  function doUnlock() {
    var input = $('#codeInput');
    if (!Lock.normalize(input.value)) { UI.toast('Enter your access code', 'error'); input.focus(); return; }
    Lock.unlock(input.value).then(function (r) {
      if (r.ok) {
        cur = 'front';
        render();
        UI.dialog({
          type: 'success', title: 'App unlocked',
          message: 'The Prayer App is now unlocked on this device. It works offline from now on.',
          actions: [{ label: 'Start praying', value: 'ok' }]
        });
      } else {
        UI.dialog({ type: 'error', title: 'Could not unlock', message: Lock.message(r.error) });
      }
    });
  }

  function renderFront() {
    var ids = Book.ids(), last = Book.find(get('prayer_last', ''));
    var qa = quickActions.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (q) {
      var rt = routes[q.route];
      return '<button class="btn ghost block" data-qa="' + esc(q.route) + '"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + q.icon + '</svg>' + esc((rt && rt.title) || q.label) + '</button>';
    }).join('');
    view.innerHTML = '<div class="cover"><div>' + gearMarkup(116, M.logo, 'logo', '') + '</div>' +
      '<p class="cover-ed">' + esc(M.kicker) + '</p>' +
      '<h2 class="cover-title">' + esc(M.title) + '</h2>' +
      '<p class="cover-sub">' + esc(M.subtitle) + '</p>' +
      '<p class="cover-author">' + esc(M.author) + '</p>' +
      '<p class="cover-ed">' + esc(M.edition) + '</p>' +
      '<div class="cover-actions"><button class="btn light block" id="cvStart">Start Praying</button>' +
      (last ? '<button class="btn ghost block" id="cvCont">Continue: ' + esc(last.title) + '</button>' : '') +
      qa +
      '<button class="btn ghost block" id="cvToc">Table of Contents</button></div></div>';
    fixImgs(view);
    $$('[data-qa]').forEach(function (b) { b.addEventListener('click', function () { DV.openRoute(b.getAttribute('data-qa')); }); });
    $('#cvStart').addEventListener('click', function () { if (ids[1]) { go(ids[1]); } });
    if (last) { $('#cvCont').addEventListener('click', function () { go(last.id); }); }
    $('#cvToc').addEventListener('click', function () { go('toc'); });
  }

  function renderToc() {
    var h = '<div class="toc"><h2>Table of Contents</h2>';
    Book.list().forEach(function (c) {
      h += '<button class="toc-item' + (c.id === get('prayer_last', '') ? ' current' : '') + '" data-id="' + esc(c.id) + '"><span>' + esc(c.title) + '</span>' + svg('next') + '</button>';
    });
    view.innerHTML = h + '</div>';
    $$('.toc-item').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-id')); }); });
  }

  function renderPage(ch) {
    var ids = Book.ids(), i = ids.indexOf(ch.id);
    var h = '<article class="page"><h2>' + esc(ch.title) + '</h2>';
    Book.parse(ch.body).forEach(function (b) {
      if (b.t === 'quote') { h += '<blockquote class="quote"><p>' + esc(b.text) + '</p>' + (b.cite ? '<cite>' + esc(b.cite) + '</cite>' : '') + '</blockquote>'; }
      else if (b.t === 'sub') { h += '<h3 class="sub">' + esc(b.text) + '</h3>'; }
      else if (b.t === 'decl') { h += '<div class="decl"><b>Declaration</b><p>' + esc(b.text) + '</p></div>'; }
      else { h += '<p>' + esc(b.text) + '</p>'; }
    });
    h += '</article><div class="pager">' +
      '<button class="btn outline" id="pgPrev">Previous</button>' +
      (i < ids.length - 1 ? '<button class="btn" id="pgNext">Next</button>' : '<button class="btn" id="pgFront">Back to Front</button>') + '</div>';
    view.innerHTML = h;
    $('#pgPrev').addEventListener('click', function () { step(-1); });
    if ($('#pgNext')) { $('#pgNext').addEventListener('click', function () { step(1); }); }
    if ($('#pgFront')) { $('#pgFront').addEventListener('click', function () { go('front'); }); }
  }

  function todos() { try { return JSON.parse(get('prayer_todos', '[]')) || []; } catch (e) { return []; } }
  function saveTodos(t) { put('prayer_todos', JSON.stringify(t)); }
  function openTodo() {
    openSheet('To-do list', '<div id="todoBox"></div>', drawTodo);
  }
  function drawTodo() {
    var ok = hasAccess(), dis = ok ? '' : ' disabled';
    var t = todos(), done = t.filter(function (x) { return x.done; }).length;
    var h = '';
    if (!ok) {
      h += '<div class="gate-note"><div class="dlg-ic">' + svg('lock', 34) + '</div>' +
        '<p>The to-do list is free to open, but only readers with an access code can use it.</p>' +
        '<button class="btn block" id="todoGate">Enter access code</button></div>';
    }
    h += '<div class="todo-add"><input id="todoText" type="text" maxlength="120" placeholder="Add a task" enterkeyhint="done" aria-label="New task"' + dis + '>' +
      '<button class="btn" id="todoAdd" aria-label="Add task"' + dis + '>' + svg('add') + '</button></div>';
    h += '<p class="todo-sum">' + (t.length ? done + ' of ' + t.length + ' done' : 'No tasks yet. Add your prayer plan.') + '</p>';
    t.forEach(function (x) {
      h += '<div class="todo-item' + (x.done ? ' done' : '') + '"><button class="iconbtn" data-tg="' + x.id + '" aria-label="Mark done"' + dis + '>' + svg(x.done ? 'boxon' : 'boxoff') +
        '</button><span class="tx">' + esc(x.text) + '</span><button class="iconbtn" data-rm="' + x.id + '" aria-label="Delete task"' + dis + '>' + svg('del') + '</button></div>';
    });
    if (done && ok) { h += '<div style="margin-top:16px"><button class="btn outline block" id="todoClear">Clear completed</button></div>'; }
    $('#todoBox').innerHTML = h;
    if ($('#todoGate')) { $('#todoGate').addEventListener('click', goUnlock); }
    $('#todoAdd').addEventListener('click', addTodo);
    $('#todoText').addEventListener('keydown', function (e) { if (e.key === 'Enter') { addTodo(); } });
    $$('[data-tg]').forEach(function (b) { b.addEventListener('click', function () {
      if (!hasAccess()) { return; }
      var list = todos(); list.forEach(function (x) { if (String(x.id) === b.getAttribute('data-tg')) { x.done = !x.done; } });
      saveTodos(list); drawTodo();
    }); });
    $$('[data-rm]').forEach(function (b) { b.addEventListener('click', function () {
      if (!hasAccess()) { return; }
      UI.confirm('Delete task?', 'This task will be removed from your list.', 'Delete', true).then(function (ok2) {
        if (!ok2) { return; }
        saveTodos(todos().filter(function (x) { return String(x.id) !== b.getAttribute('data-rm'); }));
        drawTodo(); UI.toast('Task deleted', 'success');
      });
    }); });
    if ($('#todoClear')) { $('#todoClear').addEventListener('click', function () {
      UI.confirm('Clear completed?', 'All finished tasks will be removed.', 'Clear', true).then(function (ok2) {
        if (!ok2) { return; }
        saveTodos(todos().filter(function (x) { return !x.done; }));
        drawTodo(); UI.toast('Completed tasks cleared', 'success');
      });
    }); }
  }
  function addTodo() {
    if (!hasAccess()) { UI.toast('An access code is needed to use the to-do list', 'error'); return; }
    var inp = $('#todoText'), v = inp.value.trim();
    if (!v) { UI.toast('Type a task first', 'error'); return; }
    var list = todos(); list.push({ id: Date.now(), text: v, done: false });
    saveTodos(list); drawTodo(); UI.toast('Task added', 'success');
    $('#todoText').focus();
  }
  
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () { deferred = null; UI.toast('App installed', 'success'); });
  function installApp() {
    var standalone = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
    if (standalone) { UI.dialog({ type: 'info', title: 'Already installed', message: 'You are using the installed app.' }); return; }
    if (deferred) {
      UI.confirm('Install this app?', 'Add The Prayer App to your home screen so it opens like a normal app.', 'Install').then(function (ok) {
        if (!ok) { return; }
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; });
      });
      return;
    }
    UI.dialog({ type: 'info', title: 'Install this app', message: 'Android: tap the three dots in Chrome, then choose Add to Home screen or Install app. iPhone: tap the Share button in Safari, then choose Add to Home Screen.' });
  }
  function shareApp() {
    var url = M.shareUrl || location.href.split('#')[0];
    if (navigator.share) { navigator.share({ title: M.title, text: M.shareText, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { UI.toast('Link copied', 'success'); }, function () { UI.dialog({ type: 'info', title: 'Share this link', message: url }); });
      return;
    }
    UI.dialog({ type: 'info', title: 'Share this link', message: url });
  }

  function start() {
    buildMenus();
    setFont(fontSize());
    syncTheme();

    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
    window.addEventListener('offline', function () { UI.toast('You are offline. Your app still works.'); });
    window.addEventListener('online', function () { UI.toast('Back online', 'success'); });

    if (Lock.hasToken()) {
      if (Book.has()) {
        cur = 'front';
        render();
        Lock.verify(false).then(function (r) {
          if (!r.ok) {
            closeAll();
            cur = 'lock';
            render();
            UI.dialog({ type: 'error', title: 'Access ended', message: Lock.message(r.error) });
          } else if (r.refreshed && cur !== 'front' && cur !== 'toc' && !Book.find(cur)) {
            go('front');
          } else if (r.refreshed) {
            render();
          }
        });
      } else {
        /* token without a saved copy (storage was cleared): fetch the content again */
        cur = 'lock';
        render();
        Lock.verify(true).then(function (r) {
          if (r.ok && Book.has()) { go('front'); }
          else if (!r.ok && r.error && r.error !== 'none') { UI.dialog({ type: 'error', title: 'Could not open the app', message: Lock.message(r.error) }); }
        });
      }
    } else {
      cur = 'welcome';
      render();
    }
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
