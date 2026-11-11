/* cover-page.js - the cover (welcome) page of "The Prayer App"
 *
 * STANDALONE: this file carries its own CSS, HTML and JavaScript.
 * The app works without it. If you delete or edit this file, the app simply
 * skips the cover and opens the access-code screen. Nothing else is affected.
 *
 * Layout, top to bottom: book picture, author pill, title, tagline, invitation,
 * BEGIN button, blue wave with the Read Online and Read Offline buttons.
 *
 * Contract with the app (the only link between them):
 *     window.CoverPage.render(containerElement, onBegin)
 * It also fires a "coverpage:begin" event on the container when a begin button is tapped.
 *   BEGIN THE JOURNEY, Read Online and Read Offline all call onBegin,
 *   so the app opens the access-code (unlock) screen.
 */
(function () {
  'use strict';
  try {
    /* ---------- edit the words and colours here ---------- */
    var TEXT = {
      author: 'Rev. Dr. Chris Johnson, PhD',
      line1: 'THE PRAYER',
      line2: 'APP',
      tagline: 'Prayer Points for Authority, Breakthrough and Restoration',
      invite: 'Enter your access code to unlock your spiritual breakthrough.',
      button: 'BEGIN THE JOURNEY',
      online: 'Read Online',
      offline: 'Read Offline',
      /* words printed on the little book picture */
      spine: 'The Prayer App',
      bookLine: 'A PRAYER COMPANION',
      bookAuthor: 'REV. DR. CHRIS JOHNSON'
    };
    var C = {
      brand: '#1877F2', brandMid: '#0F5FCC', brandDeep: '#083A85',
      gold: '#FFD54A', goldLine: '#E9B93C'
    };
    /* ----------------------------------------------------- */

    var STYLE_ID = 'cvp-style';

    function css() {
      return [
        '.cvp{position:fixed;inset:0;z-index:30;width:100dvw;height:100dvh;overflow:hidden;color:#121212;',
        'background:radial-gradient(ellipse 95% 48% at 50% 4%,rgba(24,119,242,.16) 0%,rgba(24,119,242,.06) 46%,rgba(255,255,255,0) 72%),#FFFFFF;',
        'font-family:Roboto,Inter,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-user-select:none;user-select:none}',
        'html[data-theme="dark"] .cvp{color:#FFFFFF;background:radial-gradient(ellipse 95% 48% at 50% 4%,rgba(106,169,255,.26) 0%,rgba(106,169,255,.08) 46%,rgba(18,18,18,0) 72%),#121212}',
        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
        '.cvp button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}',
        '.cvp h2,.cvp p{margin:0}',
        '.cvp svg{display:block;flex:none}',
        '.cvp-content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:clamp(6px,1.3dvh,14px);',
        'padding:calc(env(safe-area-inset-top,0px) + clamp(16px,4.5dvh,52px)) 22px calc(clamp(176px,23dvh,250px) + env(safe-area-inset-bottom,0px))}',
        /* sparkles */
        '.cvp-spark{position:absolute;z-index:1;pointer-events:none;animation:cvptw 3.4s ease-in-out infinite}',
        /* book picture */
        '.cvp-book{width:clamp(76px,15.5dvh,122px);flex:none;filter:drop-shadow(0 10px 14px rgba(6,38,90,.28));animation:cvpfloat 6s ease-in-out infinite}',
        '.cvp-book svg{width:100%;height:auto}',
        /* author pill */
        '.cvp-pill{display:flex;align-items:center;justify-content:center;gap:12px;width:min(100%,420px);min-height:clamp(46px,6.4dvh,58px);margin-top:clamp(6px,1.8dvh,20px);padding:0 18px;',
        'border-radius:30px;border:2px solid rgba(24,119,242,.3);background:rgba(24,119,242,.09);color:' + C.brandMid + ';font-size:20px;font-weight:700;line-height:1.2}',
        'html[data-theme="dark"] .cvp-pill{color:#9CC4FF;border-color:rgba(106,169,255,.4);background:rgba(106,169,255,.12)}',
        /* title */
        '.cvp-title{font-weight:900;font-style:italic;letter-spacing:-.03em;line-height:.98}',
        '.cvp-l1{display:block;font-size:clamp(42px,min(13.4vw,7.4dvh),72px);color:#121212}',
        'html[data-theme="dark"] .cvp-l1{color:#FFFFFF}',
        '.cvp-l2{display:block;font-size:clamp(58px,min(20vw,11dvh),108px);color:' + C.brand + '}',
        'html[data-theme="dark"] .cvp-l2{color:#6AA9FF}',
        '.cvp-tag{font-size:21px;font-weight:700;line-height:1.35;color:#3C4257;max-width:380px}',
        'html[data-theme="dark"] .cvp-tag{color:#D5D9E0}',
        '.cvp-invite{font-size:22px;font-weight:700;line-height:1.3;max-width:360px}',
        /* begin button */
        '.cvp-btn{width:min(100%,420px);height:clamp(58px,8dvh,68px);margin-top:clamp(4px,1.2dvh,12px);display:flex;align-items:center;justify-content:center;gap:14px;',
        'border:3px solid ' + C.gold + '!important;border-radius:36px;color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:.05em;',
        'background:linear-gradient(180deg,#4C9AFF 0%,' + C.brandMid + ' 52%,#0A3F8F 100%);',
        'box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(6,38,90,.4),0 10px 26px rgba(10,63,143,.38);animation:cvpglow 2.6s ease-in-out infinite}',
        '.cvp-btn:active{transform:scale(.97);filter:brightness(.95)}',
        '.cvp-btn svg{width:34px;height:24px}',
        /* wave footer */
        '.cvp-foot{position:absolute;left:0;right:0;bottom:0;z-index:3;height:clamp(168px,22dvh,246px)}',
        '.cvp-wave{position:absolute;inset:0;width:100%;height:100%;display:block}',
        '.cvp-acts{position:absolute;left:0;right:0;bottom:0;display:flex;gap:12px;padding:0 16px calc(env(safe-area-inset-bottom,0px) + clamp(22px,4.5dvh,40px))}',
        '.cvp-glass{flex:1 1 0;min-width:0;height:60px;display:flex;align-items:center;justify-content:center;gap:12px;border-radius:30px;color:#FFFFFF;font-size:21px;font-weight:700;',
        'background:rgba(255,255,255,.17);border:1.5px solid rgba(255,255,255,.55)!important;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
        '.cvp-glass:active{background:rgba(255,255,255,.3)}',
        '.cvp-glass svg{width:26px;height:26px}',
        /* motion */
        '.cvp-in{opacity:0;animation:cvpup .8s cubic-bezier(.2,0,0,1) forwards}',
        '@keyframes cvpup{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}',
        '@keyframes cvpfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
        '@keyframes cvptw{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}',
        '@keyframes cvpglow{0%,100%{box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(6,38,90,.4),0 0 0 0 rgba(255,213,74,.5),0 10px 26px rgba(10,63,143,.38)}',
        '60%{box-shadow:inset 0 2px 0 rgba(255,255,255,.35),inset 0 -6px 14px rgba(6,38,90,.4),0 0 0 12px rgba(255,213,74,0),0 10px 26px rgba(10,63,143,.38)}}',
        '@media (max-height:620px){.cvp-tag{font-size:19px}.cvp-invite{font-size:20px}.cvp-pill{font-size:19px}}',
        '@media (prefers-reduced-motion:reduce){.cvp *{animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important}}'
      ].join('');
    }

    /* The little book picture: blue spine, white cover, sunrise prayer scene. */
    function bookArt() {
      return '<svg viewBox="0 0 212 272" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>' +
        '<linearGradient id="cvpSp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + C.brandDeep + '"/><stop offset="1" stop-color="' + C.brand + '"/></linearGradient>' +
        '<linearGradient id="cvpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BBD8FD"/><stop offset=".62" stop-color="#FFE7A8"/><stop offset="1" stop-color="#FFC857"/></linearGradient>' +
        '<radialGradient id="cvpSun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#FFF3C4" stop-opacity=".9"/><stop offset="1" stop-color="' + C.gold + '" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="cvpScene"><rect x="42" y="122" width="148" height="98" rx="2"/></clipPath></defs>' +
        '<ellipse cx="106" cy="264" rx="84" ry="6" fill="#06265A" opacity=".16"/>' +
        '<rect x="186" y="8" width="14" height="248" rx="2" fill="#F3E6B8"/><path d="M190 12v240M194 12v240M198 12v240" stroke="#E2CF96" stroke-width=".8"/>' +
        '<rect x="30" y="4" width="164" height="252" rx="3" fill="#FFFFFF" stroke="#D5E3F8"/>' +
        '<rect x="8" y="8" width="26" height="248" rx="3" fill="url(#cvpSp)"/>' +
        '<text transform="translate(27 26) rotate(90)" font-size="12" font-weight="800" font-style="italic" fill="#FFFFFF" font-family="Roboto,Arial,sans-serif">' + TEXT.spine + '</text>' +
        '<path d="M19 238h4v-6h5v-4h-5v-6h-4v6h-5v4h5z" fill="' + C.gold + '"/>' +
        '<text x="112" y="38" text-anchor="middle" font-size="17" font-weight="900" font-style="italic" fill="#121212" font-family="Roboto,Arial,sans-serif">' + TEXT.line1 + '</text>' +
        '<text x="112" y="72" text-anchor="middle" font-size="34" font-weight="900" font-style="italic" fill="' + C.brand + '" font-family="Roboto,Arial,sans-serif">' + TEXT.line2 + '</text>' +
        '<path d="M74 80 Q112 90 150 80" stroke="' + C.goldLine + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<text x="112" y="104" text-anchor="middle" font-size="7" font-weight="700" letter-spacing=".8" fill="#3C4257" font-family="Roboto,Arial,sans-serif">' + TEXT.bookLine + '</text>' +
        '<g clip-path="url(#cvpScene)"><rect x="42" y="122" width="148" height="98" fill="url(#cvpSky)"/>' +
        '<circle cx="142" cy="170" r="48" fill="url(#cvpSun)"/><circle cx="142" cy="170" r="9" fill="#FFFFFF" opacity=".95"/>' +
        '<path d="M42 204 L88 160 L118 184 L152 150 L190 190 L190 222 L42 222Z" fill="#4A86E0"/>' +
        '<path d="M42 222 L42 198 Q80 186 112 202 Q150 190 190 206 L190 222Z" fill="#0A2F6B"/>' +
        '<path d="M60 198 q10 -16 28 -16 q10 0 14 16z" fill="#0A2F6B"/>' +
        '<circle cx="80" cy="165" r="4.2" fill="#081F4A"/><path d="M80 170 q-7 4 -6 13 l-3 5 h13 l2 -6 q2 -9 -6 -12z" fill="#081F4A"/>' +
        '<path d="M77 173 L70 161 M83 173 L90 161" stroke="#081F4A" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>' +
        '<rect x="42" y="228" width="148" height="18" rx="2" fill="' + C.brandMid + '"/>' +
        '<text x="116" y="240.5" text-anchor="middle" font-size="7" font-weight="700" letter-spacing=".6" fill="#FFFFFF" font-family="Roboto,Arial,sans-serif">' + TEXT.bookAuthor + '</text>' +
        '<rect x="30" y="4" width="4" height="252" fill="#000000" opacity=".07"/></svg>';
    }

    function sparkle(size, color) {
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4Z" fill="' + color + '"/></svg>';
    }
    function arrow() {
      return '<svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 12 H30 M21 3 L31 12 L21 21" fill="none" stroke="' + C.gold + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    function iconBook() {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H11v15H4.5A1.5 1.5 0 0 0 3 20.5z"/><path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H13v15h6.5a1.5 1.5 0 0 1 1.5 1.5z"/></svg>';
    }
    function iconDownload() {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10.5l5 5 5-5M4 18v2.5h16V18"/></svg>';
    }
    function wave() {
      return '<svg class="cvp-wave" viewBox="0 0 360 200" preserveAspectRatio="none" aria-hidden="true"><defs>' +
        '<linearGradient id="cvpWv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.brand + '"/><stop offset=".55" stop-color="' + C.brandMid + '"/><stop offset="1" stop-color="' + C.brandDeep + '"/></linearGradient></defs>' +
        '<path d="M0 34 C70 8 140 6 210 22 S320 40 360 22 L360 200 L0 200Z" fill="url(#cvpWv)"/>' +
        '<path d="M0 40 C70 14 140 12 210 28 S320 46 360 28" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4"/></svg>';
    }

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) { return; }
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = css();
      document.head.appendChild(st);
    }

    function render(container, onBegin) {
      if (!container) { return; }
      injectStyle();
      container.innerHTML =
        '<section class="cvp" role="region" aria-label="Cover">' +
        '<span class="cvp-spark" style="left:12%;top:19%">' + sparkle(18, C.brand) + '</span>' +
        '<span class="cvp-spark" style="left:20%;top:31%;animation-delay:1.2s">' + sparkle(12, C.goldLine) + '</span>' +
        '<span class="cvp-spark" style="right:16%;top:36%;animation-delay:2.1s">' + sparkle(14, C.brand) + '</span>' +
        '<div class="cvp-content">' +
        '<div class="cvp-book cvp-in" style="animation-delay:.05s">' + bookArt() + '</div>' +
        '<div class="cvp-pill cvp-in" style="animation-delay:.2s">' + sparkle(26, C.brand) + '<span>' + TEXT.author + '</span></div>' +
        '<h2 class="cvp-title cvp-in" style="animation-delay:.32s" aria-label="' + TEXT.line1 + ' ' + TEXT.line2 + '"><span class="cvp-l1">' + TEXT.line1 + '</span><span class="cvp-l2">' + TEXT.line2 + '</span></h2>' +
        '<p class="cvp-tag cvp-in" style="animation-delay:.44s">' + TEXT.tagline + '</p>' +
        '<p class="cvp-invite cvp-in" style="animation-delay:.54s">' + TEXT.invite + '</p>' +
        '<button class="cvp-btn cvp-in" style="animation-delay:.66s" type="button" data-act="begin"><span>' + TEXT.button + '</span>' + arrow() + '</button>' +
        '</div>' +
        '<div class="cvp-foot cvp-in" style="animation-delay:.8s">' + wave() +
        '<div class="cvp-acts"><button class="cvp-glass" type="button" data-act="online">' + iconBook() + '<span>' + TEXT.online + '</span></button>' +
        '<button class="cvp-glass" type="button" data-act="offline">' + iconDownload() + '<span>' + TEXT.offline + '</span></button></div></div>' +
        '</section>';

      function begin() {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) { /* ignore */ }
        if (typeof onBegin === 'function') { onBegin(); }
      }
      container.querySelector('[data-act="begin"]').addEventListener('click', begin);
      container.querySelector('[data-act="online"]').addEventListener('click', begin);
      container.querySelector('[data-act="offline"]').addEventListener('click', begin);
    }

    window.CoverPage = { version: '2.0.0', render: render };
  } catch (err) {
    /* If this file has a mistake, the app just skips the cover. */
  }
})();
