/* support-modal.js - the "Access Code" support modal.
 *
 * STANDALONE: own CSS, HTML and JavaScript. If you delete this file, the buttons that open it
 * (unlock screen, left menu, right menu) simply disappear and everything else keeps working.
 *
 * It opens from: the big button on the unlock screen, "Access Code" in both side menus,
 * and by itself a few minutes after a visitor without an access code opens the app.
 *
 * NO PAYMENT HERE. "Check out" opens your four contact links (email, WhatsApp, Facebook, phone)
 * with a ready-made message that includes the amount the person chose. You receive the support
 * yourself and send the access code. The contact links come from book.js (META).
 */
(function () {
  'use strict';
  try {

    /* ============================================================
       EDIT EVERYTHING HERE. Plain words and numbers only.
       ============================================================ */
    var CONFIG = {

      /* Buttons that open this modal */
      buttonLabel: 'Get Your Access Code',   /* the big button on the unlock screen */
      menuLabel: 'Access Code',              /* the item in the left and right menus */
      menuTag: 'Get yours',                  /* the small gold tag on that menu item */

      /* The modal pops up by itself this many minutes after the app opens (only for
         people without an access code, once per visit). 0 = never. */
      popupAfterMinutes: 2,

      title: 'Support and Unlock',
      tabs: ['Benefits', 'Impact', 'Support'],
      nextLabel: 'Continue',

      /* STEP 1: what they get. Icon names are in icons.js. */
      benefits: {
        hero: { icon: 'edit', title: 'Private Notepad', text: 'Write prayers and revelations, lock them with a PIN, and share them anytime.', badge: 'Powerful' },
        items: [
          { icon: 'book', title: 'Prayer chapters and points' },
          { icon: 'todo', title: 'Prayer to-do list' },
          { icon: 'offline', title: 'Pray offline anywhere' },
          { icon: 'moon', title: 'Dark mode and text size' },
          { icon: 'star', title: 'New features coming soon' },
          { icon: 'heart', title: 'Priority across our apps' }
        ]
      },

      /* STEP 2: what their support achieves */
      impact: {
        heading: 'Your seed keeps this ministry alive',
        text: 'Every gift helps us keep serving people like you, every single day.',
        items: [
          { icon: 'cloud', title: 'Hosting', text: 'Keeps this app online and fast.' },
          { icon: 'servers', title: 'Servers', text: 'Powers every unlock and update.' },
          { icon: 'group', title: 'Staff salaries', text: 'Supports those who build, write and pray.' },
          { icon: 'office', title: 'Ministry office', text: 'Covers daily operating costs.' },
          { icon: 'globe', title: 'More outreach', text: 'New prayer resources and apps for more hearts.' }
        ]
      },

      /* STEP 3: the amounts. Add, remove or change any of them. */
      support: {
        heading: 'Choose your support',
        usdLabel: 'US Dollars',
        usd: ['$5', '$10', '$20', '$50', '$100'],
        ngnLabel: 'Nigerian Naira',
        ngn: ['\u20A65,000', '\u20A610,000', '\u20A615,000', '\u20A625,000', '\u20A650,000', '\u20A670,000', '\u20A6100,000'],
        defaultPick: '$10',
        note: 'One-time support. Your access code is included.'
      },

      /* The Check out button and the contact box it opens */
      checkout: {
        button: 'Check out',
        boxTitle: 'Reach out to complete',
        boxText: 'Choose any link. We will send your access code once your support is received.',
        close: 'Close',
        /* {amount} is replaced with what the person picked */
        message: 'Hello, I would like to support with {amount} and get my access code for The Prayer App.'
      },

      /* Only used if book.js has no contacts */
      contactFallback: { email: '', phone: '', whatsapp: '', facebook: '' }
    };
    /* ================= END OF THE EDIT AREA ================= */


    var STYLE_ID = 'svm-style';
    var el = null, pushed = false, seen = false;
    var state = { pane: 0, pick: CONFIG.support.defaultPick };

    function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function icon(name, size) {
      var p = (window.ICON || {})[name];
      return p ? '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true"><path d="' + p + '"/></svg>' : '';
    }
    function hasAccess() {
      try { return !!(window.Lock && window.Lock.hasToken() && window.Book && window.Book.has()); } catch (e) { return false; }
    }

    function css() {
      return [
        '.svm{--bg:#FFFFFF;--tx:#121212;--sur:#F8F9FA;--line:#E0E0E0;--mut:#5F6368;--ptx:#1877F2;--tonal:rgba(24,119,242,.12);',
        'position:fixed;inset:0;z-index:85;width:100dvw;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--tx);',
        'font:19px/1.35 Roboto,Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-user-select:none;user-select:none;animation:svmin .28s cubic-bezier(.2,0,0,1)}',
        '.svm.svm-dark{--bg:#121212;--tx:#FFFFFF;--sur:#1E1E1E;--line:#333333;--mut:#B8BBC0;--ptx:#6AA9FF;--tonal:rgba(106,169,255,.16)}',
        '.svm *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
        '.svm button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}',
        '.svm h2,.svm p,.svm ul{margin:0;padding:0}',
        '.svm svg{display:block;flex:none}',
        /* top bar and tabs */
        '.svm-bar{flex:none;display:flex;align-items:center;gap:6px;min-height:56px;padding:env(safe-area-inset-top,0px) 8px 0;border-bottom:1px solid var(--line)}',
        '.svm-back{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:var(--tx)}',
        '.svm-back:active{background:var(--tonal)}',
        '.svm-bar h2{flex:1;font-size:22px;font-weight:700}',
        '.svm-tabs{flex:none;display:flex;gap:6px;padding:10px 16px 6px}',
        '.svm-tab{flex:1;min-height:44px;border-radius:22px;font-weight:600;color:var(--mut);border:1.5px solid var(--line)!important}',
        '.svm-tab[aria-selected="true"]{background:var(--ptx);color:#FFFFFF;border-color:var(--ptx)!important}',
        '.svm.svm-dark .svm-tab[aria-selected="true"]{color:#121212}',
        /* body and panes: spread out evenly, one idea per screen, no scrolling */
        '.svm-body{flex:1;min-height:0;overflow-y:auto;padding:clamp(8px,1.4dvh,14px) 20px 0}',
        '.svm-pane{min-height:100%;display:flex;flex-direction:column;justify-content:space-evenly;gap:clamp(6px,1.2dvh,12px)}',
        '.svm-pane[hidden]{display:none}',
        '.svm-feats{list-style:none;display:flex;flex-direction:column;gap:clamp(5px,.9dvh,9px)}',
        '.svm-feat{display:flex;align-items:center;gap:12px;min-height:clamp(40px,5.8dvh,50px);padding:0 14px;border-radius:16px;background:var(--sur);border:1px solid var(--line);font-weight:600;white-space:nowrap}',
        '.svm-feat .ic{color:var(--ptx);display:grid;place-items:center}',
        '.svm-feat.hero{align-items:flex-start;white-space:normal;padding:12px 14px;border:0;color:#FFFFFF;background:linear-gradient(135deg,#3A8CF7 0%,#0C4FAF 100%);box-shadow:0 8px 22px rgba(12,79,175,.35)}',
        '.svm-feat.hero .ic{width:46px;height:46px;border-radius:14px;background:#FFFFFF;color:#0F5FCC;flex:none}',
        '.svm-feat.hero .t{font-weight:700;font-size:21px;line-height:1.2}',
        '.svm-feat.hero .d{font-weight:400;line-height:1.3;margin-top:2px}',
        '.svm-badge{display:inline-block;margin-left:6px;padding:0 10px;border-radius:14px;background:#FFD54A;color:#3A2A00;font-size:19px;font-weight:700;line-height:1.5;vertical-align:middle}',
        /* impact */
        '.svm-h{font-size:23px;font-weight:700;line-height:1.2;text-align:center}',
        '.svm-sub{text-align:center;color:var(--mut);line-height:1.4}',
        '.svm-imp{display:flex;align-items:center;gap:12px;padding:8px 12px;border-radius:16px;background:var(--sur);border:1px solid var(--line)}',
        '.svm-imp .ic{width:44px;height:44px;border-radius:14px;background:var(--tonal);color:var(--ptx);display:grid;place-items:center;flex:none}',
        '.svm-imp b{display:block;font-size:20px;line-height:1.2}',
        '.svm-imp span{display:block;color:var(--mut);line-height:1.25}',
        /* amounts */
        '.svm-lab{font-weight:700;color:var(--mut)}',
        '.svm-chips{display:grid;gap:8px}',
        '.svm-chips.five{grid-template-columns:repeat(5,1fr)}',
        '.svm-chips.three{grid-template-columns:repeat(3,1fr)}',
        '.svm-chip{min-height:clamp(42px,6dvh,50px);border-radius:14px;background:var(--sur);border:1.5px solid var(--line)!important;font-weight:700;color:var(--tx);white-space:nowrap}',
        '.svm-chip[aria-pressed="true"]{background:linear-gradient(180deg,#4C9AFF,#0F5FCC);color:#FFFFFF;border-color:#E9B93C!important;box-shadow:0 6px 16px rgba(12,79,175,.35)}',
        '.svm-note{text-align:center;color:var(--mut)}',
        /* footer button */
        '.svm-foot{flex:none;padding:10px 20px calc(env(safe-area-inset-bottom,0px) + 24px)}',
        '.svm-go{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;height:56px;border-radius:28px;color:#FFFFFF;font-size:21px;font-weight:700;letter-spacing:.02em;',
        'background:linear-gradient(180deg,#4C9AFF 0%,#0F5FCC 55%,#0A3F8F 100%);border:2px solid #E9B93C;box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 8px 22px rgba(10,63,143,.4)}',
        '.svm-go:active{transform:scale(.98);filter:brightness(.95)}',
        /* contact box */
        '.svm-pop{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.55)}',
        '.svm-card{width:100%;background:var(--bg);border-radius:28px;padding:26px 20px 20px;text-align:center;box-shadow:0 10px 36px rgba(0,0,0,.4)}',
        '.svm-card h2{font-size:24px;margin-bottom:8px}',
        '.svm-card p{color:var(--mut);line-height:1.5}',
        '.svm-card .pick{display:inline-block;margin-top:10px;padding:2px 16px;border-radius:16px;background:var(--tonal);color:var(--ptx);font-weight:700}',
        '.svm-cta{display:flex;justify-content:center;gap:18px;margin:22px 0 18px}',
        '.svm-cta a{width:60px;height:60px;border-radius:50%;display:grid;place-items:center;color:#FFFFFF;box-shadow:0 4px 14px rgba(0,0,0,.28)}',
        '.svm-cta .email{background:#8B0000}.svm-cta .whatsapp{background:#25D366}.svm-cta .facebook{background:#1877F2}.svm-cta .phone{background:#1A8A44}',
        '.svm-close{width:100%;height:52px;border-radius:26px;border:2px solid var(--ptx)!important;color:var(--ptx);font-weight:700}',
        '@keyframes svmin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}',
        '@media (max-height:660px){.svm-sub,.svm-feat.hero .d{display:none}.svm-pane{justify-content:flex-start}}',
        '@media (max-height:600px){.svm-note{display:none}.svm-imp span{display:none}}',
        '@media (prefers-reduced-motion:reduce){.svm{animation:none}}'
      ].join('');
    }

    function contacts() {
      var M = (window.Book && window.Book.meta) || {}, F = CONFIG.contactFallback;
      return { email: M.email || F.email, phone: M.phone || F.phone, whatsapp: M.whatsapp || F.whatsapp, facebook: M.facebook || F.facebook };
    }
    function message() { return CONFIG.checkout.message.replace('{amount}', state.pick); }

    /* ---------- the three steps ---------- */
    function paneBenefits() {
      var B = CONFIG.benefits, h = B.hero;
      var items = B.items.map(function (f) { return '<li class="svm-feat"><span class="ic">' + icon(f.icon, 24) + '</span><span>' + esc(f.title) + '</span></li>'; }).join('');
      return '<ul class="svm-feats"><li class="svm-feat hero"><span class="ic">' + icon(h.icon, 28) + '</span><div><div class="t">' + esc(h.title) +
        (h.badge ? ' <span class="svm-badge">' + esc(h.badge) + '</span>' : '') + '</div><div class="d">' + esc(h.text) + '</div></div></li>' + items + '</ul>';
    }
    function paneImpact() {
      var I = CONFIG.impact;
      return '<h2 class="svm-h">' + esc(I.heading) + '</h2><p class="svm-sub">' + esc(I.text) + '</p>' +
        '<ul class="svm-feats">' + I.items.map(function (f) {
          return '<li class="svm-imp"><span class="ic">' + icon(f.icon, 24) + '</span><div><b>' + esc(f.title) + '</b><span>' + esc(f.text) + '</span></div></li>';
        }).join('') + '</ul>';
    }
    function chips(list, cls) {
      return '<div class="svm-chips ' + cls + '">' + list.map(function (v) {
        return '<button class="svm-chip" type="button" data-v="' + esc(v) + '" aria-pressed="' + (v === state.pick) + '">' + esc(v) + '</button>';
      }).join('') + '</div>';
    }
    function paneSupport() {
      var S = CONFIG.support;
      return '<h2 class="svm-h">' + esc(S.heading) + '</h2>' +
        '<div><div class="svm-lab">' + esc(S.usdLabel) + '</div>' + chips(S.usd, 'five') + '</div>' +
        '<div><div class="svm-lab">' + esc(S.ngnLabel) + '</div>' + chips(S.ngn, 'three') + '</div>' +
        '<p class="svm-note">' + esc(S.note) + '</p>';
    }

    function html() {
      var tabs = CONFIG.tabs.map(function (t, i) { return '<button class="svm-tab" type="button" role="tab" data-i="' + i + '">' + esc(t) + '</button>'; }).join('');
      return '<div class="svm-bar"><button class="svm-back" type="button" aria-label="Back">' + icon('back', 24) + '</button><h2>' + esc(CONFIG.title) + '</h2></div>' +
        '<div class="svm-tabs" role="tablist">' + tabs + '</div>' +
        '<div class="svm-body"><div class="svm-pane" data-p="0">' + paneBenefits() + '</div><div class="svm-pane" data-p="1" hidden>' + paneImpact() +
        '</div><div class="svm-pane" data-p="2" hidden>' + paneSupport() + '</div></div>' +
        '<div class="svm-foot"><button class="svm-go" type="button"></button></div>';
    }

    function show(i) {
      state.pane = i;
      Array.prototype.forEach.call(el.querySelectorAll('.svm-pane'), function (p) { p.hidden = Number(p.getAttribute('data-p')) !== i; });
      Array.prototype.forEach.call(el.querySelectorAll('.svm-tab'), function (t) { t.setAttribute('aria-selected', String(Number(t.getAttribute('data-i')) === i)); });
      el.querySelector('.svm-body').scrollTop = 0;
      label();
    }
    function label() {
      var go = el.querySelector('.svm-go');
      if (state.pane < 2) { go.innerHTML = '<span>' + esc(CONFIG.nextLabel) + '</span>' + icon('next', 26); }
      else { go.innerHTML = icon('check', 26) + '<span>' + esc(CONFIG.checkout.button) + ' ' + esc(state.pick) + '</span>'; }
    }

    function popHtml() {
      var C = contacts(), msg = message(), digits = String(C.whatsapp || '').replace(/[^0-9]/g, '');
      var mail = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Support and access code') + '&body=' + encodeURIComponent(msg);
      var wa = 'https://wa.me/' + digits + '?text=' + encodeURIComponent(msg);
      return '<div class="svm-pop"><div class="svm-card" role="dialog" aria-modal="true"><h2>' + esc(CONFIG.checkout.boxTitle) + '</h2><p>' + esc(CONFIG.checkout.boxText) + '</p>' +
        '<span class="pick">' + esc(state.pick) + '</span>' +
        '<div class="svm-cta"><a class="email" href="' + esc(mail) + '" aria-label="Email us">' + icon('mail', 30) + '</a>' +
        '<a class="whatsapp" href="' + esc(wa) + '" target="_blank" rel="noopener" aria-label="WhatsApp us">' + icon('whatsapp', 30) + '</a>' +
        '<a class="facebook" href="' + esc(C.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon('facebook', 30) + '</a>' +
        '<a class="phone" href="tel:' + esc(C.phone) + '" aria-label="Call us">' + icon('phone', 30) + '</a></div>' +
        '<button class="svm-close" type="button">' + esc(CONFIG.checkout.close) + '</button></div></div>';
    }

    /* ---------- open and close ---------- */
    function open() {
      if (el) { return; }
      seen = true;
      if (!document.getElementById(STYLE_ID)) {
        var st = document.createElement('style');
        st.id = STYLE_ID; st.textContent = css();
        document.head.appendChild(st);
      }
      var theme = document.documentElement.getAttribute('data-theme');
      var dark = theme ? theme === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      el = document.createElement('div');
      el.className = 'svm' + (dark ? ' svm-dark' : '');
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', CONFIG.title);
      el.innerHTML = html();
      document.body.appendChild(el);
      try { history.pushState({ svm: 1 }, ''); pushed = true; } catch (e) { pushed = false; }

      el.querySelector('.svm-back').addEventListener('click', function () { close(false); });
      Array.prototype.forEach.call(el.querySelectorAll('.svm-tab'), function (t) {
        t.addEventListener('click', function () { show(Number(t.getAttribute('data-i'))); });
      });
      Array.prototype.forEach.call(el.querySelectorAll('.svm-chip'), function (c) {
        c.addEventListener('click', function () {
          state.pick = c.getAttribute('data-v');
          Array.prototype.forEach.call(el.querySelectorAll('.svm-chip'), function (o) { o.setAttribute('aria-pressed', String(o === c)); });
          label();
        });
      });
      el.querySelector('.svm-go').addEventListener('click', function () {
        if (state.pane < 2) { show(state.pane + 1); return; }
        var holder = document.createElement('div');
        holder.innerHTML = popHtml();
        el.appendChild(holder.firstChild);
        el.querySelector('.svm-close').addEventListener('click', function () { var p = el.querySelector('.svm-pop'); if (p) { p.remove(); } });
      });
      show(0);
    }

    function close(fromPop) {
      if (!el) { return; }
      el.remove(); el = null;
      if (pushed && !fromPop) { pushed = false; try { history.back(); } catch (e) { /* ignore */ } }
      pushed = false;
    }
    window.addEventListener('popstate', function () { if (el) { pushed = false; close(true); } });

    /* ---------- pop up by itself, once per visit, for people without a code ---------- */
    function autoOpen() {
      if (el || seen || hasAccess() || document.documentElement.classList.contains('blocked')) { return; }
      if (document.visibilityState !== 'visible') {
        var wait = function () { if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', wait); autoOpen(); } };
        document.addEventListener('visibilitychange', wait);
        return;
      }
      open();
    }
    var mins = Number(CONFIG.popupAfterMinutes) || 0;
    if (mins > 0) { setTimeout(autoOpen, mins * 60000); }

    window.SupportModal = { version: '2.0.0', config: CONFIG, open: open, close: close };
  } catch (err) {
    /* If this file has a mistake, the buttons that open it simply do not appear. */
  }
})();
