/* cover-page.js - Minimal Image Cover
 * Displays Screenshot_20261111-054505_30b8f3.png full screen 
 * with the BEGIN THE JOURNEY button positioned precisely over the red marker.
 */
(function () {
  'use strict';
  try {
    var STYLE_ID = 'cvp-style';

    function css() {
      return [
        '.cvp{position:fixed;inset:0;z-index:30;width:100%;height:100dvh;overflow:hidden;background:#F5F8FF;display:flex;align-items:center;justify-content:center}',
        'html[data-theme="dark"] .cvp{background:#0F121A}',
        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
        /* Wrapper tightly hugs the image so percentage positioning is pixel-perfect */
        '.cvp-wrap{position:relative;width:100%;max-width:500px;display:flex}',
        '.cvp-wrap img{width:100%;height:auto;max-height:100dvh;object-fit:contain;display:block}',
        /* Button placed absolutely at 54% from the top (exactly over the red marker) */
        '.cvp-btn{position:absolute;top:54%;left:12%;right:12%;height:clamp(48px, 7dvh, 64px);display:flex;align-items:center;justify-content:center;',
        'background:#1877F2;color:#FFFFFF;border:2px solid #FFD54A;border-radius:32px;font-size:1.15rem;font-weight:800;letter-spacing:1px;box-shadow:0 8px 20px rgba(0,0,0,0.25);cursor:pointer;animation:cvpup 0.6s ease-out}',
        '.cvp-btn:active{transform:scale(0.96)}',
        '@keyframes cvpup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
      ].join('');
    }

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) return;
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = css();
      document.head.appendChild(st);
    }

    function render(container, onBegin) {
      if (!container) return;
      injectStyle();
      
      container.innerHTML =
        '<section class="cvp" role="region" aria-label="Cover">' +
          '<div class="cvp-wrap">' +
            '<img src="Screenshot_20261111-054505_30b8f3.png" alt="The Prayer App Cover">' +
            '<button class="cvp-btn" type="button" data-act="begin">BEGIN THE JOURNEY</button>' +
          '</div>' +
        '</section>';

      function begin() {
        try { container.dispatchEvent(new CustomEvent('coverpage:begin', { bubbles: true })); } catch (e) {}
        if (typeof onBegin === 'function') onBegin();
      }
      
      container.querySelector('[data-act="begin"]').addEventListener('click', begin);
    }

    window.CoverPage = { version: '3.0.0', render: render };
  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();