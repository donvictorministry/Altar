/* cover-page.js - Full-Screen Native Book Cover UI
 * - Strict 10px gap at the top to clear the QR code.
 * - "Our God Answers Prayers!" set to exactly 22px.
 * - Button forced to a single line with the yellow forward arrow.
 * - Integrated premium MFM aesthetic artwork (praying hands & chains).
 * - Optimized flexbox to eliminate wasted middle space.
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
        
        /* 1. Strict 10px Top Gap to clear QR Code */
        '.cvp-top-gap{height:10px;min-height:10px;flex:none}',
        
        /* Typography Header (Centered per book standards) */
        '.cvp-head{text-align:center;padding:0 16px;flex:none}',
        '.cvp-h1{font-size:clamp(32px, 9vw, 48px);font-weight:900;font-style:italic;line-height:1.1;margin:0}',
        '.cvp-h2{font-size:clamp(56px, 16vw, 92px);font-weight:900;font-style:italic;color:#1877F2;line-height:1;margin:0;letter-spacing:-1px}',
        '.cvp-curve{width:140px;height:16px;margin:8px auto;display:block}',
        
        /* 2. Subtitle set to exactly 22px */
        '.cvp-sub{font-size:22px;font-weight:700;color:#3C4257;margin-top:4px;line-height:1.2}',
        'html[data-theme="dark"] .cvp-sub{color:#D5D9E0}',
        
        /* 3. Author Name */
        '.cvp-author{text-align:center;font-weight:800;font-size:clamp(14px, 3.5vw, 16px);color:#1877F2;letter-spacing:1px;margin-top:clamp(16px, 3vh, 24px);padding:0 16px;flex:none}',
        
        /* 4. Single-Line Begin Button */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 20px;margin-top:clamp(16px, 3vh, 24px);flex:none;z-index:10}',
        '.cvp-btn{background:#1877F2;color:#FFFFFF;border:3px solid #FFD54A;border-radius:32px;padding:0 20px 0 24px;min-height:56px;font-size:1.15rem;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;max-width:340px;box-shadow:0 8px 20px rgba(24,119,242,0.35);animation:cvpup .6s ease-out;cursor:pointer;white-space:nowrap;flex-wrap:nowrap}',
        '.cvp-btn:active{transform:scale(0.96)}',
        '.cvp-btn-icon{width:22px;height:22px;flex:none;color:#FFD54A}',
        
        /* 5. Photorealistic Artwork Area (Absorbs the remaining space and anchors to bottom) */
        '.cvp-art-area{flex:1;display:flex;align-items:flex-end;justify-content:center;position:relative;overflow:hidden;margin-top:16px}',
        '.cvp-scene{width:100%;height:100%;object-fit:cover;object-position:bottom center;mix-blend-mode:multiply}',
        'html[data-theme="dark"] .cvp-scene{mix-blend-mode:screen}',
        
        '@keyframes cvpup{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}'
      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 Q50 20 100 10" fill="none" stroke="#FFD54A" stroke-width="4" stroke-linecap="round"/></svg>';
    }

    function svgArrow() {
      return '<svg class="cvp-btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
            '<div class="cvp-top-gap"></div>' +
            '<div class="cvp-head">' +
              '<h1 class="cvp-h1">THE PRAYER</h1>' +
              '<h2 class="cvp-h2">APP</h2>' +
              svgCurve() +
              '<div class="cvp-sub">Our God Answers Prayers!</div>' +
            '</div>' +
            '<div class="cvp-author">REV. DR. CHRIS JOHNSON</div>' +
            '<div class="cvp-btn-area">' +
              '<button class="cvp-btn" type="button" id="cvp-start">' +
                '<span>BEGIN THE JOURNEY</span>' +
                svgArrow() +
              '</button>' +
            '</div>' +
            '<div class="cvp-art-area">' +
              '<img class="cvp-scene" src="watermarked_img_14714719304370825188.jpg" alt="Praying Hands with Broken Chains">' +
            '</div>' +
          '</div>' +
        '</section>';

      function begin() {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) {}
        if (typeof onBegin === 'function') onBegin();
      }
      container.querySelector('#cvp-start').addEventListener('click', begin);
    }

    window.CoverPage = { version: '8.0.0', render: render };
  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();