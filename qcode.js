/* qcode.js - the QR code of The Prayer App, shown on the unlock screen in the place of the lock icon.
 *
 * STANDALONE: it carries its own QR encoder, CSS and JavaScript. No library, no internet.
 * The QR code opens your app address and nothing else.
 * Your logo sits in the middle of it (see CONFIG.logo below).
 * Tap the QR code to enlarge it. The enlarged view shows only: the QR code, the author name,
 * the app address, and the four contact buttons (email, WhatsApp, Facebook, phone).
 * The author and the four contacts come from book.js (META).
 *
 * How it connects: it watches for the lock icon on the unlock screen (the element named in
 * CONFIG.host), puts the QR badge in its place and hides the icon. app.js and cover-page.js
 * are not touched. If you delete this file (and its script tag in index.html), the unlock
 * screen simply shows the lock icon again. Nothing else is affected.
 */
(function () {
  'use strict';
  try {

    /* ============================================================
       EDIT HERE. Words, colours and sizes only.
       ============================================================ */
    var CONFIG = {
      url: '',                  /* the app address the QR opens. Leave empty to use the address this page is opened at */
      logo: 'https://REPLACE-WITH-YOUR-HOSTED-URL/logo.png',   /* your hosted logo, shown in the middle of the QR */
      logoSize: 20,             /* logo width as a percent of the badge. Keep it 22 or less so the code still scans */
      host: '.lock-ic',         /* the element the QR badge replaces (the lock icon on the unlock screen) */
      size: 112,                /* biggest badge size in pixels (it gets smaller on short screens) */
      dark: '#0A3F8F',          /* QR dots. Keep this dark so phones can read it */
      light: '#FFFFFF',         /* QR background. Keep this white */
      ring: '#E9B93C',          /* thin gold border around the badge */
      label: 'QR code for The Prayer App. Tap to enlarge.',
      closeLabel: 'Close',
      bigSize: 300              /* enlarged size in pixels (it never goes wider than the screen) */
    };
    /* ================= END OF THE EDIT AREA ================= */


    /* ------------------------------------------------------------
       QR ENCODER: byte mode, error correction level Q (about 25 percent can be covered,
       which keeps the code readable with a logo in the middle), versions 1 to 10.
       Fits web addresses up to about 150 characters.
       ------------------------------------------------------------ */
    var ECC = [13, 22, 18, 26, 18, 24, 18, 22, 20, 24];   /* error-correction codewords per block, level Q */
    var BLK = [1, 1, 2, 2, 4, 4, 6, 6, 8, 8];             /* number of blocks, level Q */

    function rawModules(v) {
      var r = (16 * v + 128) * v + 64, n;
      if (v >= 2) { n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) { r -= 36; } }
      return r;
    }
    function dataCw(v) { return Math.floor(rawModules(v) / 8) - ECC[v - 1] * BLK[v - 1]; }
    function bytesOf(t) {
      var s = unescape(encodeURIComponent(t)), a = [], i;
      for (i = 0; i < s.length; i++) { a.push(s.charCodeAt(i)); }
      return a;
    }
    function mul(x, y) {
      var z = 0, i;
      for (i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
      return z;
    }
    function rsDiv(d) {
      var r = [], i, j, root = 1;
      for (i = 0; i < d - 1; i++) { r.push(0); }
      r.push(1);
      for (i = 0; i < d; i++) {
        for (j = 0; j < d; j++) { r[j] = mul(r[j], root); if (j + 1 < d) { r[j] ^= r[j + 1]; } }
        root = mul(root, 2);
      }
      return r;
    }
    function rsRem(data, div) {
      var r = div.map(function () { return 0; });
      data.forEach(function (b) {
        var f = b ^ r.shift();
        r.push(0);
        div.forEach(function (c, i) { r[i] ^= mul(c, f); });
      });
      return r;
    }

    function encode(text) {
      var data = bytesOf(text), v, bits = [], i, k;
      for (v = 1; v <= 10; v++) { if (4 + (v < 10 ? 8 : 16) + 8 * data.length <= dataCw(v) * 8) { break; } }
      if (v > 10) { return null; }
      function put(val, len) { var j; for (j = len - 1; j >= 0; j--) { bits.push((val >>> j) & 1); } }
      put(4, 4);
      put(data.length, v < 10 ? 8 : 16);
      data.forEach(function (b) { put(b, 8); });
      var capBits = dataCw(v) * 8;
      put(0, Math.min(4, capBits - bits.length));
      put(0, (8 - bits.length % 8) % 8);
      for (k = 0xEC; bits.length < capBits; k ^= 0xEC ^ 0x11) { put(k, 8); }
      var cw = [];
      for (i = 0; i < bits.length; i += 8) {
        var b = 0;
        for (k = 0; k < 8; k++) { b = (b << 1) | bits[i + k]; }
        cw.push(b);
      }

      /* split into blocks, add error correction, interleave */
      var nb = BLK[v - 1], eccLen = ECC[v - 1], raw = Math.floor(rawModules(v) / 8);
      var nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = rsDiv(eccLen), blocks = [], pos = 0, dat;
      for (i = 0; i < nb; i++) {
        dat = cw.slice(pos, pos + shortLen - eccLen + (i < nShort ? 0 : 1));
        pos += dat.length;
        var ecc = rsRem(dat, div);
        if (i < nShort) { dat.push(0); }
        blocks.push(dat.concat(ecc));
      }
      var all = [];
      for (i = 0; i < blocks[0].length; i++) {
        blocks.forEach(function (blk, j) { if (i !== shortLen - eccLen || j >= nShort) { all.push(blk[i]); } });
      }

      /* draw the grid */
      var size = v * 4 + 17, m = [], f = [], y, x;
      for (y = 0; y < size; y++) { m.push(new Array(size).fill(false)); f.push(new Array(size).fill(false)); }
      function set(px, py, d) { m[py][px] = d; f[py][px] = true; }
      function bit(n, j) { return ((n >>> j) & 1) !== 0; }

      for (i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
      function finder(cx, cy) {
        var dx, dy, d;
        for (dy = -4; dy <= 4; dy++) {
          for (dx = -4; dx <= 4; dx++) {
            d = Math.max(Math.abs(dx), Math.abs(dy));
            if (cx + dx >= 0 && cx + dx < size && cy + dy >= 0 && cy + dy < size) { set(cx + dx, cy + dy, d !== 2 && d !== 4); }
          }
        }
      }
      finder(3, 3); finder(size - 4, 3); finder(3, size - 4);

      var al = [];
      if (v > 1) {
        var na = Math.floor(v / 7) + 2, st = Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2;
        al.push(6);
        for (pos = size - 7; al.length < na; pos -= st) { al.splice(1, 0, pos); }
      }
      al.forEach(function (ax, ai) {
        al.forEach(function (ay, aj) {
          if ((ai === 0 && aj === 0) || (ai === 0 && aj === al.length - 1) || (ai === al.length - 1 && aj === 0)) { return; }
          var dx, dy;
          for (dy = -2; dy <= 2; dy++) { for (dx = -2; dx <= 2; dx++) { set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); } }
        });
      });

      function format(mask) {
        var d = (3 << 3) | mask, rem = d, j;       /* 3 = error correction level Q */
        for (j = 0; j < 10; j++) { rem = (rem << 1) ^ ((rem >>> 9) * 0x537); }
        var fb = ((d << 10) | rem) ^ 0x5412;
        for (j = 0; j <= 5; j++) { set(8, j, bit(fb, j)); }
        set(8, 7, bit(fb, 6)); set(8, 8, bit(fb, 7)); set(7, 8, bit(fb, 8));
        for (j = 9; j < 15; j++) { set(14 - j, 8, bit(fb, j)); }
        for (j = 0; j < 8; j++) { set(size - 1 - j, 8, bit(fb, j)); }
        for (j = 8; j < 15; j++) { set(8, size - 15 + j, bit(fb, j)); }
        set(8, size - 8, true);
      }
      format(0);
      if (v >= 7) {
        var vr = v, vb;
        for (i = 0; i < 12; i++) { vr = (vr << 1) ^ ((vr >>> 11) * 0x1F25); }
        vb = (v << 12) | vr;
        for (i = 0; i < 18; i++) {
          var col = bit(vb, i), a = size - 11 + i % 3, c = Math.floor(i / 3);
          set(a, c, col); set(c, a, col);
        }
      }

      /* place the data in the zigzag order */
      i = 0;
      var right, vert, j2, upward;
      for (right = size - 1; right >= 1; right -= 2) {
        if (right === 6) { right = 5; }
        for (vert = 0; vert < size; vert++) {
          for (j2 = 0; j2 < 2; j2++) {
            x = right - j2;
            upward = ((right + 1) & 2) === 0;
            y = upward ? size - 1 - vert : vert;
            if (!f[y][x] && i < all.length * 8) { m[y][x] = bit(all[i >>> 3], 7 - (i & 7)); i++; }
          }
        }
      }

      /* choose the mask with the lowest penalty */
      function mask(k) {
        var yy, xx, inv;
        for (yy = 0; yy < size; yy++) {
          for (xx = 0; xx < size; xx++) {
            switch (k) {
              case 0: inv = (xx + yy) % 2 === 0; break;
              case 1: inv = yy % 2 === 0; break;
              case 2: inv = xx % 3 === 0; break;
              case 3: inv = (xx + yy) % 3 === 0; break;
              case 4: inv = (Math.floor(xx / 3) + Math.floor(yy / 2)) % 2 === 0; break;
              case 5: inv = xx * yy % 2 + xx * yy % 3 === 0; break;
              case 6: inv = (xx * yy % 2 + xx * yy % 3) % 2 === 0; break;
              default: inv = ((xx + yy) % 2 + xx * yy % 3) % 2 === 0;
            }
            if (inv && !f[yy][xx]) { m[yy][xx] = !m[yy][xx]; }
          }
        }
      }
      function penalty() {
        var p = 0, dark = 0, a, b, run;
        for (a = 0; a < size; a++) {
          run = 1;
          for (b = 1; b < size; b++) { if (m[a][b] === m[a][b - 1]) { run++; if (run === 5) { p += 3; } else if (run > 5) { p++; } } else { run = 1; } }
          run = 1;
          for (b = 1; b < size; b++) { if (m[b][a] === m[b - 1][a]) { run++; if (run === 5) { p += 3; } else if (run > 5) { p++; } } else { run = 1; } }
        }
        for (a = 0; a < size - 1; a++) {
          for (b = 0; b < size - 1; b++) { if (m[a][b] === m[a][b + 1] && m[a][b] === m[a + 1][b] && m[a][b] === m[a + 1][b + 1]) { p += 3; } }
        }
        for (a = 0; a < size; a++) { for (b = 0; b < size; b++) { if (m[a][b]) { dark++; } } }
        return p + (Math.ceil(Math.abs(dark * 20 - size * size * 10) / (size * size)) - 1) * 10;
      }
      var best = 0, bestP = Infinity, p;
      for (k = 0; k < 8; k++) {
        mask(k); format(k); p = penalty(); mask(k);
        if (p < bestP) { bestP = p; best = k; }
      }
      mask(best); format(best);
      return { size: size, m: m };
    }

    /* ------------------------------------------------------------
       DRAWING: rounded dots, rounded corner squares, white quiet zone
       ------------------------------------------------------------ */
    function svg(qr, px) {
      var n = qr.size, q = 4, out = [], x, y;
      function inFinder(a, b) { return (a < 7 && b < 7) || (a >= n - 7 && b < 7) || (a < 7 && b >= n - 7); }
      out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-q) + ' ' + (-q) + ' ' + (n + 2 * q) + ' ' + (n + 2 * q) + '" width="' + px + '" height="' + px + '" role="img" aria-label="QR code">');
      out.push('<rect x="' + (-q) + '" y="' + (-q) + '" width="' + (n + 2 * q) + '" height="' + (n + 2 * q) + '" rx="2.2" fill="' + CONFIG.light + '"/>');
      for (y = 0; y < n; y++) {
        for (x = 0; x < n; x++) {
          if (qr.m[y][x] && !inFinder(x, y)) { out.push('<rect x="' + (x + 0.02) + '" y="' + (y + 0.02) + '" width="0.96" height="0.96" rx="0.3" fill="' + CONFIG.dark + '"/>'); }
        }
      }
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (c) {
        out.push('<rect x="' + c[0] + '" y="' + c[1] + '" width="7" height="7" rx="0.8" fill="' + CONFIG.dark + '"/>');
        out.push('<rect x="' + (c[0] + 1) + '" y="' + (c[1] + 1) + '" width="5" height="5" rx="0.5" fill="' + CONFIG.light + '"/>');
        out.push('<rect x="' + (c[0] + 2) + '" y="' + (c[1] + 2) + '" width="3" height="3" rx="0.3" fill="' + CONFIG.dark + '"/>');
      });
      out.push('</svg>');
      return out.join('');
    }

    /* The QR picture with your logo in the middle. If the logo cannot load, the logo circle is removed. */
    function picture(qr, sizeCss) {
      var logo = CONFIG.logo ? '<span class="qcd-logo"><img src="' + CONFIG.logo.replace(/"/g, '&quot;') + '" alt="" onerror="this.parentNode.remove()"></span>' : '';
      return '<div class="qcd-wrap" style="width:' + sizeCss + ';height:' + sizeCss + '">' + svg(qr, 100) + logo + '</div>';
    }

    /* The address the QR opens: the one set in CONFIG.url, or the address this page is opened at. */
    function address() {
      return CONFIG.url || location.href.split('#')[0].split('?')[0];
    }

    function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    /* The four contact icons (same paths as icons.js, kept here so this file stands alone). */
    var ICONS = {
      mail: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
      facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'
    };
    function icon(name, size) {
      return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg>';
    }

    var STYLE_ID = 'qcd-style';
    function injectStyle() {
      if (document.getElementById(STYLE_ID)) { return; }
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = [
        /* the badge on the unlock screen */
        '.qcd-gone{display:none!important}',
        '.qcd{position:relative;flex:none;display:block;width:clamp(72px,13dvh,' + CONFIG.size + 'px);aspect-ratio:1/1;margin:0 auto;padding:0;border:2px solid ' + CONFIG.ring + ';border-radius:16px;overflow:hidden;cursor:pointer;',
        'background:' + CONFIG.light + ';box-shadow:0 6px 18px rgba(6,38,90,.3)}',
        '.qcd:active{transform:scale(.96)}',
        '.qcd-wrap{position:relative;line-height:0}',
        '.qcd svg,.qcd-wrap svg{display:block;width:100%;height:100%}',
        '.qcd-logo{position:absolute;left:50%;top:50%;width:' + CONFIG.logoSize + '%;aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:50%;padding:5%;',
        'background:' + CONFIG.light + ';box-shadow:0 0 0 1.5px rgba(10,63,143,.18),0 2px 6px rgba(6,38,90,.25);overflow:hidden}',
        '.qcd-logo img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}',
        /* the enlarged view */
        '.qcd-big{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;',
        'background:rgba(6,38,90,.86);font:19px/1.4 Roboto,Inter,system-ui,sans-serif;animation:qcdfade .25s ease-out}',
        '.qcd-card{position:relative;width:100%;max-width:380px;display:flex;flex-direction:column;align-items:center;gap:12px;padding:22px 18px 20px;border-radius:28px;',
        'border:3px solid ' + CONFIG.ring + ';background:' + CONFIG.light + ';color:#121212;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.45);max-height:calc(100dvh - 32px);overflow-y:auto}',
        '.qcd-card .qcd-wrap{flex:none}',
        '.qcd-author{margin:0;font-size:19px;font-weight:700;line-height:1.3;color:#121212}',
        '.qcd-url{margin:0;font-size:19px;font-weight:600;line-height:1.35;color:#0F5FCC;overflow-wrap:anywhere;-webkit-user-select:text;user-select:text}',
        '.qcd-cta{display:flex;justify-content:center;gap:16px;margin-top:4px}',
        '.qcd-cta a{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;color:#FFFFFF;box-shadow:0 4px 12px rgba(0,0,0,.28)}',
        '.qcd-cta .email{background:#8B0000}.qcd-cta .whatsapp{background:#25D366}.qcd-cta .facebook{background:#1877F2}.qcd-cta .phone{background:#1A8A44}',
        '.qcd-x{position:absolute;top:8px;right:8px;width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:#5F6368;cursor:pointer;display:grid;place-items:center}',
        '.qcd-x:active{background:rgba(24,119,242,.12)}',
        '@media (max-height:700px){.qcd{width:64px;border-radius:12px}}',
        '@keyframes qcdfade{from{opacity:0}to{opacity:1}}',
        '@media (prefers-reduced-motion:reduce){.qcd-big{animation:none}}'
      ].join('');
      document.head.appendChild(st);
    }

    function contacts() {
      var M = (window.Book && window.Book.meta) || {};
      return { author: M.author || '', email: M.email || '', phone: M.phone || '', whatsapp: M.whatsapp || '', facebook: M.facebook || '' };
    }

    function enlarge(qr) {
      if (document.querySelector('.qcd-big')) { return; }
      var C = contacts(), url = address();
      var big = document.createElement('div');
      big.className = 'qcd-big';
      big.setAttribute('role', 'dialog');
      big.setAttribute('aria-modal', 'true');
      big.innerHTML = '<div class="qcd-card">' +
        '<button class="qcd-x" type="button" aria-label="' + esc(CONFIG.closeLabel) + '"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>' +
        picture(qr, 'min(' + CONFIG.bigSize + 'px, calc(100dvw - 120px))') +
        '<p class="qcd-author">' + esc(C.author) + '</p>' +
        '<p class="qcd-url">' + esc(url).replace(/([\/.])/g, '$1<wbr>') + '</p>' +
        '<div class="qcd-cta">' +
        '<a class="email" href="mailto:' + esc(C.email) + '" aria-label="Email us">' + icon('mail', 28) + '</a>' +
        '<a class="whatsapp" href="https://wa.me/' + esc(String(C.whatsapp).replace(/[^0-9]/g, '')) + '" target="_blank" rel="noopener" aria-label="WhatsApp us">' + icon('whatsapp', 28) + '</a>' +
        '<a class="facebook" href="' + esc(C.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon('facebook', 28) + '</a>' +
        '<a class="phone" href="tel:' + esc(C.phone) + '" aria-label="Call us">' + icon('phone', 28) + '</a></div></div>';
      big.addEventListener('click', function () { big.remove(); });
      big.querySelector('.qcd-card').addEventListener('click', function (e) { e.stopPropagation(); });
      big.querySelector('.qcd-x').addEventListener('click', function () { big.remove(); });
      document.body.appendChild(big);
    }

    var cache = null, cacheUrl = '';
    function attach() {
      var host = document.querySelector(CONFIG.host);
      if (!host || !host.parentNode || host.parentNode.querySelector('.qcd')) { return; }
      var url = address();
      if (!cache || cacheUrl !== url) { cache = encode(url); cacheUrl = url; }
      if (!cache) { return; }
      injectStyle();
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qcd';
      b.setAttribute('aria-label', CONFIG.label);
      b.innerHTML = picture(cache, '100%');
      b.addEventListener('click', function () { enlarge(cache); });
      host.parentNode.insertBefore(b, host);
      host.classList.add('qcd-gone');
    }

    /* The unlock screen is drawn by the app after this file loads, so watch for it. */
    if (!document.documentElement.classList.contains('blocked')) {
      new MutationObserver(attach).observe(document.documentElement, { childList: true, subtree: true });
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', attach); } else { attach(); }
    }

    window.QCode = { version: '2.0.0', config: CONFIG, encode: encode, attach: attach };
  } catch (err) {
    /* If this file has a mistake, the unlock screen simply shows the lock icon. */
  }
})();
