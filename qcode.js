/* qcode.js - a clean, scannable QR code on the far right corner of the cover page.
 *
 * STANDALONE: it carries its own QR encoder, CSS and JavaScript. No library, no internet.
 * The QR code opens your app address and nothing else.
 * Your logo sits in the middle of it (see CONFIG.logo below).
 * The app works without this file. If you delete it (and its script tag in index.html),
 * the cover simply shows no QR code. Nothing else is affected.
 *
 * How it connects: it watches for the cover page (the element named in CONFIG.host)
 * and places the QR badge inside it. cover-page.js is not touched.
 * Tap the badge to enlarge it so another phone can scan it easily.
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
      host: '.cvp',             /* the cover page element the badge is placed in */
      size: 112,                /* badge size in pixels on the cover */
      top: 14,                  /* distance from the top edge, in pixels */
      right: 14,                /* distance from the right edge, in pixels */
      dark: '#0A3F8F',          /* QR dots. Keep this dark so phones can read it */
      light: '#FFFFFF',         /* QR background. Keep this white */
      ring: '#E9B93C',          /* thin gold border around the badge */
      label: 'QR code for The Prayer App. Tap to enlarge.',
      bigTitle: 'Scan to open The Prayer App',
      bigHint: 'Point your phone camera at the code. Tap anywhere to close.',
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
          if (qr.m[y][x] && !inFinder(x, y)) { out.push('<rect x="' + (x + 0.04) + '" y="' + (y + 0.04) + '" width="0.92" height="0.92" rx="0.3" fill="' + CONFIG.dark + '"/>'); }
        }
      }
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (c) {
        out.push('<rect x="' + c[0] + '" y="' + c[1] + '" width="7" height="7" rx="1.9" fill="' + CONFIG.dark + '"/>');
        out.push('<rect x="' + (c[0] + 1) + '" y="' + (c[1] + 1) + '" width="5" height="5" rx="1.3" fill="' + CONFIG.light + '"/>');
        out.push('<rect x="' + (c[0] + 2) + '" y="' + (c[1] + 2) + '" width="3" height="3" rx="0.9" fill="' + CONFIG.dark + '"/>');
      });
      out.push('</svg>');
      return out.join('');
    }

    /* The QR picture with your logo in the middle. If the logo cannot load, the logo circle is removed. */
    function picture(qr, sizeCss) {
      var logo = CONFIG.logo ? '<span class="qcd-logo"><img src="' + CONFIG.logo.replace(/"/g, '&quot;') + '" alt="" onerror="this.parentNode.remove()"></span>' : '';
      return '<div class="qcd-wrap" style="width:' + sizeCss + ';height:' + sizeCss + '">' + svg(qr, 100) + logo + '</div>';
    }

    function address() {
      return CONFIG.url || location.href.split('#')[0].split('?')[0];
    }

    var STYLE_ID = 'qcd-style';
    function injectStyle() {
      if (document.getElementById(STYLE_ID)) { return; }
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = [
        '.qcd{position:absolute;z-index:6;top:calc(env(safe-area-inset-top,0px) + ' + CONFIG.top + 'px);right:calc(env(safe-area-inset-right,0px) + ' + CONFIG.right + 'px);',
        'width:' + CONFIG.size + 'px;height:' + CONFIG.size + 'px;padding:0;margin:0;border:2px solid ' + CONFIG.ring + ';border-radius:16px;overflow:hidden;cursor:pointer;',
        'background:' + CONFIG.light + ';box-shadow:0 6px 18px rgba(6,38,90,.4);animation:qcdin .8s cubic-bezier(.2,0,0,1) .6s both}',
        '.qcd:active{transform:scale(.96)}',
        '.qcd svg,.qcd-wrap svg{display:block;width:100%;height:100%}',
        '.qcd-wrap{position:relative;line-height:0}',
        '.qcd-logo{position:absolute;left:50%;top:50%;width:' + CONFIG.logoSize + '%;aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:50%;padding:5%;',
        'background:' + CONFIG.light + ';box-shadow:0 0 0 1.5px rgba(10,63,143,.18),0 2px 6px rgba(6,38,90,.25);overflow:hidden}',
        '.qcd-logo img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}',
        '.qcd-big{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;',
        'background:rgba(6,38,90,.86);color:#FFFFFF;text-align:center;font:19px/1.4 Roboto,Inter,system-ui,sans-serif;animation:qcdfade .25s ease-out}',
        '.qcd-big h2{margin:0;font-size:24px;font-weight:700}',
        '.qcd-big p{margin:0;opacity:.92}',
        '.qcd-card{padding:10px;border-radius:24px;border:3px solid ' + CONFIG.ring + ';background:' + CONFIG.light + ';box-shadow:0 12px 40px rgba(0,0,0,.45);line-height:0}',
        '@keyframes qcdin{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}',
        '@keyframes qcdfade{from{opacity:0}to{opacity:1}}',
        '@media (prefers-reduced-motion:reduce){.qcd,.qcd-big{animation:none}}'
      ].join('');
      document.head.appendChild(st);
    }

    function enlarge(qr) {
      if (document.querySelector('.qcd-big')) { return; }
      var big = document.createElement('div');
      big.className = 'qcd-big';
      big.setAttribute('role', 'dialog');
      big.setAttribute('aria-modal', 'true');
      big.innerHTML = '<h2></h2><div class="qcd-card">' + picture(qr, 'min(' + CONFIG.bigSize + 'px, calc(100dvw - 96px))') + '</div><p></p>';
      big.querySelector('h2').textContent = CONFIG.bigTitle;
      big.querySelector('p').textContent = CONFIG.bigHint;
      big.addEventListener('click', function () { big.remove(); });
      document.body.appendChild(big);
    }

    var cache = null, cacheUrl = '';
    function attach() {
      var host = document.querySelector(CONFIG.host);
      if (!host || host.querySelector('.qcd')) { return; }
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
      host.appendChild(b);
    }

    /* The cover is drawn by the app after this file loads, so watch for it. */
    if (!document.documentElement.classList.contains('blocked')) {
      new MutationObserver(attach).observe(document.documentElement, { childList: true, subtree: true });
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', attach); } else { attach(); }
    }

    window.QCode = { version: '1.0.0', config: CONFIG, encode: encode, attach: attach };
  } catch (err) {
    /* If this file has a mistake, the cover simply shows no QR code. */
  }
})();
