(function () {
  'use strict';

  try {
    var STYLE_ID = 'cvp-style';

    /* QUICK PHOTO REPLACEMENT */
    var AUTHOR_PHOTO_URL = 'https://app.donvictorministry.org.ng/Altar/dr-dvg.png';

    var PHOTO_PLACEHOLDER =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 450">' +
        '<rect width="350" height="500" fill="#EAF0F8"/>' +
        '<path d="M0 0H350V450H0Z" fill="#DCE6F3"/>' +
        '<path d="M25 25H325V425H25Z" fill="none" stroke="#FFFFFF" stroke-width="2"/>' +
        '<text x="175" y="230" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#8296B2">MY PHOTO</text>' +
        '</svg>'
      );

    function css() {
      return [
        /* MAIN BOOK */
        '.cvp{position:fixed;inset:0;z-index:30;display:flex;width:100%;height:100dvh;overflow:hidden;background:#071A35;color:#FFFFFF;font-family:Georgia,serif;user-select:none;-webkit-user-select:none}',

        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',

        /* PHYSICAL BOOK SPINE */
        '.cvp-spine{width:clamp(48px,11vw,58px);min-width:20px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:18px;padding:max(env(safe-area-inset-top),20px) 3px max(env(safe-area-inset-bottom),20px);background:linear-gradient(90deg,#1255AD,#1877F2 65%,#1260C5);border-right:2px solid #D4AF37;box-shadow:3px 0 12px rgba(0,0,0,.25);z-index:2}',

        '.cvp-spine-title,.cvp-spine-author{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;text-align:center;color:#FFFFFF}',

        '.cvp-spine-title{font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:.8px}',

        '.cvp-spine-author{font-family:Georgia,serif;font-size:15px;font-weight:500;letter-spacing:.4px}',

        /* FRONT COVER */
        '.cvp-face{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,rgba(24,119,242,.18),transparent 58%),linear-gradient(145deg,#102C50 0%,#071A35 65%,#061326 100%)}',

        '.cvp-face:before{content:"";position:absolute;inset:10px;border:1px solid rgba(212,175,55,.45);pointer-events:none}',

        /* TOP BREATHING SPACE */
        '.cvp-top-gap{height:max(env(safe-area-inset-top),4vh);flex:none}',

        /* TITLE */
        '.cvp-head{text-align:center;padding:0 12px;position:relative;z-index:2;flex:none}',

        '.cvp-h1{font-family:Georgia,serif;font-size:clamp(34px,8.5vw,49px);font-weight:700;line-height:1.12;margin:0;color:#FFFFFF;letter-spacing:.3px}',

        '.cvp-h2{font-family:Georgia,serif;font-size:clamp(68px,17vw,100px);font-weight:700;line-height:.98;margin:5px 0 0;color:#E8CA78;letter-spacing:1px}',

        '.cvp-curve{width:140px;height:17px;margin:12px auto 5px;display:block}',

        '.cvp-sub{font-family:Georgia,serif;font-size:clamp(21px,5.5vw,25px);font-weight:700;line-height:1.3;color:#FFFFFF;margin-top:9px}',

        /* PHOTOGRAPH AREA */
        '.cvp-photo-area{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:14px 12px;position:relative;z-index:2}',

        '.cvp-photo-frame{width:min(84%,340px);height:100%;max-height:40vh;aspect-ratio:7/9;padding:6px;background:linear-gradient(135deg,#F5DE9B,#D4AF37,#A87920);border:1px solid #F5DE9B;box-shadow:0 12px 32px rgba(0,0,0,.4),0 0 22px rgba(212,175,55,.13);overflow:hidden}',

        '.cvp-author-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center center;background:#EAF0F8;border:3px solid #FFFFFF}',

        /* AUTHOR NAME */
        '.cvp-author{text-align:center;font-family:Georgia,serif;font-size:clamp(19px,5.2vw,22px);font-weight:900;letter-spacing:.7px;line-height:1.25;color:#E8CA78;padding:0 8px;margin:8px 0 0;flex:none;position:relative;z-index:3}',

        /* BUTTON */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 12px;margin-top:20px;flex:none;position:relative;z-index:5}',

        '.cvp-btn{width:100%;max-width:390px;min-height:64px;background:#1877F2;color:#FFFFFF;border:2px solid #D4AF37;border-radius:7px;padding:12px 10px;font-family:Arial,sans-serif;font-size:clamp(17px,4.5vw,21px);font-weight:900;letter-spacing:.7px;box-shadow:0 8px 24px rgba(0,0,0,.3);cursor:pointer}',

        '.cvp-btn:active{transform:scale(.98)}',

        /* BOTTOM BREATHING SPACE */
        '.cvp-bottom-gap{height:max(env(safe-area-inset-bottom),3vh);min-height:18px;flex:none}',

        /* SHORT SCREENS */
        '@media(max-height:700px){.cvp-top-gap{height:2vh}.cvp-h1{font-size:32px}.cvp-h2{font-size:65px}.cvp-curve{margin:6px auto 2px}.cvp-sub{margin-top:5px;font-size:20px}.cvp-photo-frame{max-height:34vh}.cvp-photo-area{padding:7px 10px}.cvp-author{margin-top:5px;font-size:19px}.cvp-btn-area{margin-top:10px}.cvp-btn{min-height:54px}.cvp-bottom-gap{height:12px;min-height:8px}}',

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

          /* BOOK SPINE: ONLY TITLE AND AUTHOR */
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

            /* LARGE REPLACEABLE PHOTOGRAPH */
            '<div class="cvp-photo-area">' +
              '<div class="cvp-photo-frame">' +
                '<img class="cvp-author-photo" ' +
                  'src="' + PHOTO_PLACEHOLDER + '" ' +
                  'alt="Rev. Dr. Chris Johnson" ' +
                  'id="cvp-author-photo">' +
              '</div>' +
            '</div>' +

            /* AUTHOR NAME */
            '<div class="cvp-author">REV. DR. CHRIS JOHNSON</div>' +

            /* ENTRY */
            '<div class="cvp-btn-area">' +
              '<button class="cvp-btn" type="button" id="cvp-start">' +
                'BEGIN THE JOURNEY' +
              '</button>' +
            '</div>' +

            '<div class="cvp-bottom-gap"></div>' +

          '</main>' +
        '</section>';

      /* PHOTO URL QUICK SWAP */
      if (AUTHOR_PHOTO_URL !== 'YOUR_PHOTO_URL_HERE') {
        var photo = container.querySelector('#cvp-author-photo');
        photo.src = AUTHOR_PHOTO_URL;
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
      version: '8.0.0',
      render: render
    };

  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();