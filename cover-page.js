/* cover-page.js - Full-Screen Native Book Cover UI
 * Production-ready layout with pure SVG artwork (no external JPGs).
 * - "Our God Answers Prayers!" set to exactly 22px.
 * - Author and Button positioned perfectly to the designated markers.
 * - Base artwork features a premium glowing sun and minimalist praying hands.
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
        
        /* 1. Top Gap (Pushes the title down naturally) */
        '.cvp-top-gap{height:max(env(safe-area-inset-top), 6vh);flex:none}',
        
        /* Typography Header */
        '.cvp-head{text-align:center;padding:0 16px;flex:none}',
        '.cvp-h1{font-size:clamp(32px, 9vw, 48px);font-weight:900;font-style:italic;line-height:1.1;margin:0}',
        '.cvp-h2{font-size:clamp(56px, 16vw, 92px);font-weight:900;font-style:italic;color:#1877F2;line-height:1;margin:0;letter-spacing:-1px}',
        '.cvp-curve{width:140px;height:16px;margin:8px auto;display:block}',
        
        /* The specific 22px subtitle requirement */
        '.cvp-sub{font-size:22px;font-weight:700;color:#3C4257;margin-top:12px;line-height:1.2}',
        'html[data-theme="dark"] .cvp-sub{color:#D5D9E0}',
        
        /* 2. Author Name (Blue Marker) */
        '.cvp-author{text-align:center;font-weight:800;font-size:clamp(15px, 4vw, 17px);color:#1877F2;letter-spacing:1px;margin-top:clamp(24px, 6vh, 48px);padding:0 16px;flex:none}',
        
        /* 3. Begin Button (Bottom Red Marker) */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 20px;margin-top:clamp(24px, 5vh, 40px);flex:none;z-index:10}',
        '.cvp-btn{background:#1877F2;color:#FFFFFF;border:3px solid #FFD54A;border-radius:32px;padding:0 24px;min-height:56px;font-size:1.15rem;font-weight:800;display:flex;align-items:center;justify-content:center;width:100%;max-width:340px;box-shadow:0 8px 20px rgba(24,119,242,0.35);animation:cvpup .6s ease-out;cursor:pointer}',
        '.cvp-btn:active{transform:scale(0.96)}',
        
        /* 4. Praying Hands Artwork Area (Anchored to bottom) */
        '.cvp-art-area{flex:1;display:flex;align-items:flex-end;justify-content:center;position:relative;overflow:hidden}',
        '.cvp-scene{width:100%;height:100%;max-height:40vh;object-fit:cover;object-position:bottom center}',
        
        '@keyframes cvpup{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}'
      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 Q50 20 100 10" fill="none" stroke="#FFD54A" stroke-width="4" stroke-linecap="round"/></svg>';
    }

    function svgArtwork() {
      /* This draws the radiant glowing sun and the elegant praying hands/flame silhouette entirely in code. */
      return '<svg class="cvp-scene" viewBox="0 0 200 160" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
        '<defs>' +
        '<radialGradient id="sunGlow" cx="50%" cy="100%" r="100%">' +
        '<stop offset="0%" stop-color="#FFD54A" stop-opacity="1"/>' +
        '<stop offset="45%" stop-color="#FFD54A" stop-opacity="0.35"/>' +
        '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '</defs>' +
        '<!-- The Divine Glow -->' +
        '<rect width="200" height="160" fill="url(#sunGlow)"/>' +
        '<circle cx="100" cy="150" r="55" fill="#FFD54A" opacity="0.6"/>' +
        '<!-- The Praying Hands (Two-Toned Silhouette) -->' +
        '<g transform="translate(0, 10)">' +
          '<!-- Left Hand -->' +
          '<path d="M100 150 C80 120 75 80 85 50 C90 35 100 20 100 20 C100 20 110 35 115 50 C125 80 120 120 100 150 Z" fill="#0A2F6B"/>' +
          '<!-- Right Hand (Highlights the palms pressed together) -->' +
          '<path d="M100 150 C85 120 82 85 92 60 C95 50 100 40 100 40 C100 40 105 50 108 60 C118 85 115 120 100 150 Z" fill="#1877F2"/>' +
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
              '<button class="cvp-btn" type="button" id="cvp-start">BEGIN THE JOURNEY</button>' +
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

    window.CoverPage = { version: '6.0.0', render: render };
  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();