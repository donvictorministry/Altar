(function () {
  'use strict';

  try {
    var STYLE_ID = 'cvp-style';

    /* QUICK PHOTO REPLACEMENT */
    var AUTHOR_PHOTO_URL = 'YOUR_PHOTO_URL_HERE';

    var PHOTO_PLACEHOLDER =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
        '<rect width="400" height="400" fill="#EAF0F8"/>' +
        '<circle cx="200" cy="140" r="70" fill="#B7C8DF"/>' +
        '<path d="M60 400 Q80 260 200 260 Q320 260 340 400" fill="#B7C8DF"/>' +
        '</svg>'
      );

    function css() {
      return [
        /* FULL ANDROID VIEWPORT */
        '.cvp{position:fixed;inset:0;z-index:30;width:100%;height:100dvh;display:flex;overflow:hidden;background:#071A35;color:#FFFFFF;font-family:Georgia,serif;user-select:none;-webkit-user-select:none}',
        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',

        /* BOOK SPINE */
        '.cvp-spine{width:10vw;min-width:20px;flex:none;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:20px;padding:max(env(safe-area-inset-top),16px) 2px max(env(safe-area-inset-bottom),16px);background:#1877F2;border-right:2px solid #D4AF37}',

        '.cvp-spine-title,.cvp-spine-author{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;text-align:center;color:#FFFFFF}',

        '.cvp-spine-title{font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:.5px}',

        '.cvp-spine-author{font-family:Georgia,serif;font-size:15px;font-weight:500;letter-spacing:.3px}',

        /* FRONT COVER */
        '.cvp-face{flex:1;min-width:0;height:100%;position:relative;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,rgba(24,119,242,.18),transparent 58%),linear-gradient(145deg,#102C50,#071A35 65%,#061326)}',

        '.cvp-face:before{content:"";position:absolute;inset:8px;border:1px solid rgba(212,175,55,.45);pointer-events:none}',

        /* TOP SPACING */
        '.cvp-top-gap{height:5vh;flex:none}',

        /* TITLE */
        '.cvp-head{text-align:center;padding:0 10px;position:relative;z-index:2;flex:none}',

        '.cvp-h1{font-family:Georgia,serif;font-size:clamp(34px,8.5vw,49px);font-weight:700;line-height:1.12;margin:0;color:#FFFFFF;letter-spacing:.3px}',

        '.cvp-h2{font-family:Georgia,serif;font-size:clamp(68px,17vw,100px);font-weight:700;line-height:.98;margin:5px 0 0;color:#E8CA78;letter-spacing:1px}',

        '.cvp-curve{width:140px;height:17px;margin:12px auto 5px;display:block}',

        '.cvp-sub{font-family:Georgia,serif;font-size:22px;font-weight:700;line-height:1.3;color:#FFFFFF;margin-top:9px}',

        /* PHOTOGRAPH */
        '.cvp-photo-area{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:12px 8px;position:relative;z-index:2}',
        '.cvp-photo-frame{width:200px;height:200px;border-radius:50%;padding:6px;flex:none;background:linear-gradient(135deg,#F5DE9B,#D4AF37,#A87920);border:1px solid #F5DE9B;box-shadow:0 12px 32px rgba(0,0,0,.4)}',
        '.cvp-author-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center center;background:#EAF0F8;border:3px solid #FFFFFF;border-radius:50%}',
        /* AUTHOR NAME */
        '.cvp-author{text-align:center;font-family:Georgia,serif;font-size:clamp(19px,5.2vw,22px);font-weight:900;letter-spacing:.7px;line-height:1.3;color:#E8CA78;padding:0 5px;margin:12px 0 0;flex:none;position:relative;z-index:3}',

        /* ENTRY BUTTON */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 12px;margin-top:22px;flex:none;position:relative;z-index:5}',
        '.cvp-btn{width:100%;min-height:64px;background:#1877F2;color:#FFFFFF;border:2px solid #D4AF37;border-radius:7px;padding:12px 8px;font-family:Arial,sans-serif;font-size:clamp(17px,4.5vw,21px);font-weight:900;letter-spacing:.7px;box-shadow:0 8px 24px rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap}',
        '.cvp-btn-icon{width:24px;height:24px;flex:none;color:#E8CA78}',
        '.cvp-btn:active{transform:scale(.98)}',

        /* BOTTOM SPACING */
        '.cvp-bottom-gap{height:5vh;min-height:20px;flex:none}',
        '@media(prefers-reduced-motion:no-preference){.cvp-btn{animation:cvpup .45s ease-out}}',
        '@keyframes cvpup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'

      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 140 17" aria-hidden="true">' +
        '<path d="M2 8 H49 M91 8 H138" stroke="#D4AF37" stroke-width="2"/>' +
        '<path d="M70 0 L79 8 L70 17 L61 8 Z" fill="#D4AF37"/>' +
        '</svg>';
    }

    function svgArrow() {
      return '<svg class="cvp-btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    function render(container, onBegin) {
      if (!container) return;

      if (!document.getElementById(STYLE_ID)) {
        var st = document.createElement('style');
        st.id = STYLE_ID;
        st.textContent = css();
        document.head.appendChild(st);
      }

      container.innerHTML =
        '<section class="cvp" role="region" aria-label="The Prayer App Book Cover">' +

          /* BOOK SPINE: ONLY TWO INSCRIPTIONS */
          '<aside class="cvp-spine">' +
            '<div class="cvp-spine-title">The Prayer App</div>' +
            '<div class="cvp-spine-author">Rev. Dr. Chris Johnson</div>' +
          '</aside>' +

          /* FRONT COVER */
          '<main class="cvp-face">' +

            '<div class="cvp-top-gap"></div>' +

            '<header class="cvp-head">' +
              '<h1 class="cvp-h1">THE PRAYER</h1>' +
              '<h2 class="cvp-h2">APP</h2>' +
              svgCurve() +
              '<div class="cvp-sub">Our God Answers Prayers!</div>' +
            '</header>' +

            /* PVC 35:45 PHOTOGRAPH */
            '<div class="cvp-photo-area">' +
              '<div class="cvp-photo-frame">' +
                '<img class="cvp-author-photo" ' +
                  'src="' + PHOTO_PLACEHOLDER + '" ' +
                  'alt="Rev. Dr. Chris Johnson" ' +
                  'id="cvp-author-photo">' +
              '</div>' +
            '</div>' +

            /* AUTHOR */
            '<div class="cvp-author">REV. DR. CHRIS JOHNSON</div>' +

            /* BEGIN JOURNEY */
            '<div class="cvp-btn-area">' +
              '<button class="cvp-btn" type="button" id="cvp-start">' +
                '<span>BEGIN THE JOURNEY</span>' +
                svgArrow() +
              '</button>' +
            '</div>' +

            '<div class="cvp-bottom-gap"></div>' +
          '</main>' +
        '</section>';

      /* QUICK PHOTO URL SWAP */
      if (AUTHOR_PHOTO_URL !== 'YOUR_PHOTO_URL_HERE') {
        container.querySelector('#cvp-author-photo').src =
          AUTHOR_PHOTO_URL;
      }

      function begin() {
        try {
          container.dispatchEvent(
            new CustomEvent('coverpage:begin', { bubbles: true })
          );
        } catch (e) {}

        if (typeof onBegin === 'function') onBegin();
      }

      container.querySelector('#cvp-start')
        .addEventListener('click', begin);
    }

    window.CoverPage = {
      version: '8.1.0',
      render: render
    };

  } catch (err) {
  }
})();