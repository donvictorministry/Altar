/* cover-page.js - Full-Screen Native Book Cover UI
 * Production-ready layout with MFM-style broken chains & prayer hands.
 * - Strict 10px gap at the top.
 * - "Our God Answers Prayers!" set to exactly 22px.
 * - Button includes the yellow forward arrow.
 * - Pure SVG artwork for maximum sharpness and instant loading.
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
        
        /* 1. Strict 10px Top Gap */
        '.cvp-top-gap{height:10px;min-height:10px;flex:none}',
        
        /* Typography Header */
        '.cvp-head{text-align:center;padding:0 16px;flex:none}',
        '.cvp-h1{font-size:clamp(32px, 9vw, 48px);font-weight:900;font-style:italic;line-height:1.1;margin:0}',
        '.cvp-h2{font-size:clamp(56px, 16vw, 92px);font-weight:900;font-style:italic;color:#1877F2;line-height:1;margin:0;letter-spacing:-1px}',
        '.cvp-curve{width:140px;height:16px;margin:8px auto;display:block}',
        
        /* The specific 22px subtitle requirement */
        '.cvp-sub{font-size:22px;font-weight:700;color:#3C4257;margin-top:4px;line-height:1.2}',
        'html[data-theme="dark"] .cvp-sub{color:#D5D9E0}',
        
        /* 2. Author Name (Blue Marker Area) */
        '.cvp-author{text-align:center;font-weight:800;font-size:clamp(15px, 4vw, 17px);color:#1877F2;letter-spacing:1px;margin-top:clamp(20px, 5vh, 40px);padding:0 16px;flex:none}',
        
        /* 3. Begin Button (Bottom Red Marker Area) */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 20px;margin-top:clamp(20px, 4vh, 32px);flex:none;z-index:10}',
        '.cvp-btn{background:#1877F2;color:#FFFFFF;border:3px solid #FFD54A;border-radius:32px;padding:0 20px 0 24px;min-height:56px;font-size:1.15rem;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:340px;box-shadow:0 8px 20px rgba(24,119,242,0.35);animation:cvpup .6s ease-out;cursor:pointer}',
        '.cvp-btn:active{transform:scale(0.96)}',
        '.cvp-btn-icon{width:24px;height:24px;flex:none;color:#FFD54A}',
        
        /* 4. Praying Hands & Broken Chains Artwork Area */
        '.cvp-art-area{flex:1;display:flex;align-items:flex-end;justify-content:center;position:relative;overflow:hidden;padding-top:16px}',
        '.cvp-scene{width:100%;height:100%;max-height:45vh;object-fit:cover;object-position:bottom center}',
        
        '@keyframes cvpup{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}'
      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 Q50 20 100 10" fill="none" stroke="#FFD54A" stroke-width="4" stroke-linecap="round"/></svg>';
    }

    function svgArrow() {
      /* The right-pointing arrow for the button */
      return '<svg class="cvp-btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    function svgArtwork() {
      /* Detailed SVG featuring a radiant sun, realistic praying hands silhouette, and shattered chains. */
      return '<svg class="cvp-scene" viewBox="0 0 200 180" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
        '<defs>' +
        '<radialGradient id="sunGlow" cx="50%" cy="100%" r="100%">' +
        '<stop offset="0%" stop-color="#FFD54A" stop-opacity="1"/>' +
        '<stop offset="35%" stop-color="#FFD54A" stop-opacity="0.4"/>' +
        '<stop offset="80%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '</defs>' +
        '<!-- Divine Glow -->' +
        '<rect width="200" height="180" fill="url(#sunGlow)"/>' +
        '<circle cx="100" cy="170" r="70" fill="#FFD54A" opacity="0.65"/>' +
        
        '<!-- Shattered Chains (Deliverance/Breakthrough) -->' +
        '<g stroke="#061A40" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.85">' +
          '<!-- Left Chain Breaking -->' +
          '<path d="M60 150 Q45 130 30 145" />' +
          '<path d="M45 125 Q30 110 20 120" />' +
          '<path d="M65 145 L50 160 M35 125 L25 115" stroke-width="2"/>' +
          '<!-- Right Chain Breaking -->' +
          '<path d="M140 150 Q155 130 170 145" />' +
          '<path d="M155 125 Q170 110 180 120" />' +
          '<path d="M135 145 L150 160 M165 125 L175 115" stroke-width="2"/>' +
        '</g>' +

        '<!-- Realistic Praying Hands Silhouette -->' +
        '<g fill="#0A2F6B">' +
          '<!-- Left Hand -->' +
          '<path d="M100 180 C80 170 70 145 75 125 C78 115 85 95 90 75 C92 65 96 55 98 55 C100 55 101 65 102 75 C102 95 102 120 100 140 Z"/>' +
          '<path d="M75 125 C65 115 65 95 72 75 C74 70 76 70 78 75 C80 90 85 110 90 120 Z"/>' +
          '<path d="M72 100 C62 95 62 80 68 65 C70 60 72 60 74 65 C76 75 80 90 82 100 Z"/>' +
          '<path d="M68 85 C58 80 58 70 62 60 C64 55 66 55 68 60 C70 65 74 75 75 80 Z"/>' +
          '<!-- Right Hand -->' +
          '<path d="M100 180 C110 165 115 140 112 120 C108 95 102 75 100 55 C99 50 102 50 104 55 C110 80 118 105 120 130 Z" fill="#061A40"/>' +
          '<path d="M112 120 C122 110 125 90 120 70 C118 65 115 65 113 70 C110 85 108 105 105 115 Z" fill="#061A40"/>' +
          '<path d="M120 95 C130 85 132 70 125 55 C123 50 120 50 118 55 C115 70 112 85 110 95 Z" fill="#061A40"/>' +
          '<path d="M125 75 C135 65 135 55 130 45 C128 40 125 40 123 45 C120 55 118 65 116 70 Z" fill="#061A40"/>' +
          '<!-- Wrists / Base -->' +
          '<path d="M70 180 C75 160 125 160 130 180 Z" fill="#061A40"/>' +
        '</g>' +
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
              svgArtwork() +
            '</div>' +
          '</div>' +
        '</section>';

      function begin() {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) {}
        if (typeof onBegin === 'function') onBegin();
      }
      container.querySelector('#cvp-start').addEventListener('click', begin);
    }

    window.CoverPage = { version: '7.0.0', render: render };
  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();