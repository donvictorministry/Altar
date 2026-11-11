/* cover-page.js - Full-Screen Native Book Cover UI
 * Generates an edge-to-edge layout matching the book cover design,
 * with the BEGIN THE JOURNEY button positioned exactly where requested.
 */
(function () {
  'use strict';
  try {
    var STYLE_ID = 'cvp-style';

    function css() {
      return [
        '.cvp{position:fixed;inset:0;z-index:30;display:flex;width:100%;height:100dvh;background:#FFFFFF;overflow:hidden;font-family:Roboto,system-ui,sans-serif;-webkit-user-select:none;user-select:none;color:#121212}',
        'html[data-theme="dark"] .cvp{background:#121212;color:#FFFFFF}',
        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
        
        /* The Blue Book Spine */
        '.cvp-spine{width:clamp(36px, 10vw, 48px);background:#1877F2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:max(env(safe-area-inset-top), 24px) 0 max(env(safe-area-inset-bottom), 24px);flex:none}',
        '.cvp-spine-txt{writing-mode:vertical-rl;transform:rotate(180deg);color:#FFFFFF;font-size:1.1rem;font-weight:700;letter-spacing:1px;white-space:nowrap}',
        '.cvp-spine-plus{color:#FFD54A;font-size:2.5rem;font-weight:900;line-height:1}',
        
        /* The Main White Cover Face */
        '.cvp-face{flex:1;display:flex;flex-direction:column;position:relative}',
        
        /* Typography Header */
        '.cvp-head{text-align:center;padding:max(env(safe-area-inset-top), 4vh) 16px 0;flex:none}',
        '.cvp-h1{font-size:clamp(32px, 9vw, 48px);font-weight:900;font-style:italic;line-height:1.1;margin:0}',
        '.cvp-h2{font-size:clamp(56px, 16vw, 92px);font-weight:900;font-style:italic;color:#1877F2;line-height:1;margin:0;letter-spacing:-1px}',
        '.cvp-curve{width:140px;height:16px;margin:8px auto;display:block}',
        '.cvp-sub{font-size:clamp(12px, 3.5vw, 15px);font-weight:700;color:#3C4257;letter-spacing:1px;margin-top:12px}',
        'html[data-theme="dark"] .cvp-sub{color:#A0A6B5}',
        
        /* Middle Section: Button & Artwork */
        '.cvp-mid{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;position:relative;padding:0 20px}',
        
        /* The Button (Replacing the Red Marker) */
        '.cvp-btn{background:#1877F2;color:#FFFFFF;border:3px solid #FFD54A;border-radius:32px;padding:0 24px;min-height:56px;font-size:1.15rem;font-weight:800;display:flex;align-items:center;justify-content:center;width:100%;max-width:340px;box-shadow:0 8px 20px rgba(24,119,242,0.35);z-index:10;margin-bottom:auto;margin-top:4vh;animation:cvpup .6s ease-out}',
        '.cvp-btn:active{transform:scale(0.96)}',
        
        /* Mountain Artwork */
        '.cvp-scene{position:absolute;bottom:0;left:0;right:0;width:100%;height:auto;max-height:40vh;z-index:1}',
        
        /* Author Pill at Bottom */
        '.cvp-auth{background:#1877F2;color:#FFFFFF;text-align:center;font-weight:700;font-size:clamp(12px, 3.5vw, 15px);padding:14px;margin:0 16px max(env(safe-area-inset-bottom), 16px);border-radius:4px;flex:none;z-index:10;letter-spacing:1px}',
        
        '@keyframes cvpup{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}'
      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 Q50 20 100 10" fill="none" stroke="#FFD54A" stroke-width="4" stroke-linecap="round"/></svg>';
    }

    function svgScene() {
      return '<svg class="cvp-scene" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
        '<defs>' +
        '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BBD8FD" stop-opacity="0.3"/><stop offset="1" stop-color="#FFD54A" stop-opacity="0.7"/></linearGradient>' +
        '</defs>' +
        '<rect width="400" height="200" fill="url(#sky)"/>' +
        '<circle cx="200" cy="140" r="50" fill="#FFD54A" opacity="0.9"/>' +
        /* Back Mountains */
        '<path d="M-20 200 L120 100 L220 170 L320 90 L420 200 Z" fill="#4A86E0"/>' +
        /* Front Mountains */
        '<path d="M-20 200 L140 140 L220 190 L340 110 L420 200 Z" fill="#0A2F6B"/>' +
        /* Praying Figure */
        '<circle cx="120" cy="130" r="10" fill="#061A40"/>' +
        '<path d="M96 112 Q108 130 118 142 M144 112 Q132 130 122 142" stroke="#061A40" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M104 180 Q120 135 136 180 Z" fill="#061A40"/>' +
        '</svg>';
    }

    function render(container, onBegin) {
      if (!container) return;
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = css();
      if (!document.getElementById(STYLE_ID)) document.head.appendChild(st);

      container.innerHTML = 
        '<section class="cvp" role="region" aria-label="Cover">' +
          '<div class="cvp-spine">' +
            '<div class="cvp-spine-txt">The Prayer App</div>' +
            '<div class="cvp-spine-plus">+</div>' +
          '</div>' +
          '<div class="cvp-face">' +
            '<div class="cvp-head">' +
              '<h1 class="cvp-h1">THE PRAYER</h1>' +
              '<h2 class="cvp-h2">APP</h2>' +
              svgCurve() +
              '<div class="cvp-sub">A PRAYER COMPANION</div>' +
            '</div>' +
            '<div class="cvp-mid">' +
              '<button class="cvp-btn" type="button" id="cvp-start">BEGIN THE JOURNEY</button>' +
              svgScene() +
            '</div>' +
            '<div class="cvp-auth">REV. DR. CHRIS JOHNSON</div>' +
          '</div>' +
        '</section>';

      function begin() {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) {}
        if (typeof onBegin === 'function') onBegin();
      }
      container.querySelector('#cvp-start').addEventListener('click', begin);
    }

    window.CoverPage = { version: '4.0.0', render: render };
  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();