(function () {
  'use strict';

  try {
    var STYLE_ID = 'cvp-style';

    /* Replace this value with your photograph URL when ready. */
    var AUTHOR_PHOTO_URL = 'YOUR_PHOTO_URL_HERE';

    var PHOTO_PLACEHOLDER =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 360">' +
        '<rect width="280" height="360" fill="#EAF0F8"/>' +
        '<circle cx="140" cy="125" r="53" fill="#B7C8DF"/>' +
        '<path d="M42 360 Q48 225 140 225 Q232 225 238 360" fill="#B7C8DF"/>' +
        '<rect x="1" y="1" width="278" height="358" fill="none" stroke="#FFFFFF" stroke-width="2"/>' +
        '</svg>'
      );

    function css() {
      return [
        /* Main book cover */
        '.cvp{position:fixed;inset:0;z-index:30;display:flex;width:100%;height:100dvh;overflow:hidden;background:#071A35;color:#FFFFFF;font-family:Georgia,serif;user-select:none;-webkit-user-select:none}',

        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',

        /* Physical book spine */
        '.cvp-spine{width:clamp(44px,12vw,54px);flex:none;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;padding:max(env(safe-area-inset-top),20px) 3px max(env(safe-area-inset-bottom),20px);background:linear-gradient(90deg,#1255AD,#1877F2 65%,#1260C5);border-right:2px solid #D4AF37;box-shadow:3px 0 12px rgba(0,0,0,.25);z-index:2}',

        '.cvp-spine-title,.cvp-spine-author{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;text-align:center;color:#FFFFFF}',

        '.cvp-spine-title{font-family:Georgia,serif;font-size:17px;font-weight:700;letter-spacing:1px}',

        '.cvp-spine-author{font-family:Georgia,serif;font-size:13px;font-weight:500;letter-spacing:.5px}',

        /* Front cover */
        '.cvp-face{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,rgba(24,119,242,.22),transparent 55%),linear-gradient(145deg,#102C50 0%,#071A35 65%,#061326 100%)}',

        '.cvp-face:before{content:"";position:absolute;inset:12px;border:1px solid rgba(212,175,55,.45);pointer-events:none}',

        '.cvp-top-gap{height:max(env(safe-area-inset-top),3vh);flex:none}',

        /* Title */
        '.cvp-head{text-align:center;padding:0 12px;position:relative;z-index:2;flex:none}',

        '.cvp-kicker{font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:2.5px;color:#D4AF37;margin-bottom:14px}',

        '.cvp-h1{font-family:Georgia,serif;font-size:clamp(31px,8.5vw,47px);font-weight:700;line-height:1.1;margin:0;color:#FFFFFF;letter-spacing:.5px}',

        '.cvp-h2{font-family:Georgia,serif;font-size:clamp(65px,17vw,94px);font-weight:700;line-height:.95;margin:4px 0 0;color:#E8CA78;letter-spacing:2px}',

        '.cvp-curve{width:130px;height:16px;margin:9px auto 3px;display:block}',

        '.cvp-sub{font-family:Georgia,serif;font-size:22px;font-weight:600;line-height:1.25;color:#FFFFFF;margin-top:9px}',

        /* Author photograph */
        '.cvp-photo-area{flex:1;min-height:120px;display:flex;align-items:center;justify-content:center;padding:12px 10px;position:relative;z-index:2}',

        '.cvp-photo-frame{width:clamp(140px,43vw,205px);aspect-ratio:7/9;padding:5px;background:linear-gradient(135deg,#F5DE9B,#D4AF37,#A87920);border:1px solid #F5DE9B;box-shadow:0 12px 32px rgba(0,0,0,.4),0 0 22px rgba(212,175,55,.13);position:relative}',

        '.cvp-author-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center center;background:#EAF0F8;border:3px solid #FFFFFF}',

        /* Author name */
        '.cvp-author{text-align:center;font-family:Georgia,serif;font-size:clamp(16px,4.5vw,20px);font-weight:700;letter-spacing:.5px;color:#E8CA78;padding:0 10px;margin:5px 0 0;flex:none;position:relative;z-index:3}',

        /* Entry button */
        '.cvp-btn-area{display:flex;justify-content:center;padding:0 20px max(env(safe-area-inset-bottom),22px);margin-top:20px;flex:none;position:relative;z-index:5}',

        '.cvp-btn{width:100%;max-width:340px;min-height:58px;background:#1877F2;color:#FFFFFF;border:2px solid #D4AF37;border-radius:5px;padding:12px 20px;font-family:Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:1px;box-shadow:0 8px 24px rgba(0,0,0,.3);cursor:pointer}',

        '.cvp-btn:active{transform:scale(.97)}',

        /* Compact screens */
        '@media(max-height:680px){.cvp-top-gap{height:10px}.cvp-kicker{margin-bottom:6px;font-size:13px}.cvp-h1{font-size:30px}.cvp-h2{font-size:63px}.cvp-sub{margin-top:5px}.cvp-photo-area{min-height:90px;padding:6px}.cvp-photo-frame{width:clamp(115px,32vw,155px)}.cvp-author{margin-top:2px;font-size:16px}.cvp-btn-area{margin-top:9px}}',

        '@media(prefers-reduced-motion:no-preference){.cvp-btn{animation:cvpup .5s ease-out}}',

        '@keyframes cvpup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'

      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 130 16" aria-hidden="true">' +
        '<path d="M2 8 H43 M87 8 H128" stroke="#D4AF37" stroke-width="1.5"/>' +
        '<path d="M65 1 L72 8 L65 15 L58 8 Z" fill="#D4AF37"/>' +
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

          /* Book spine: ONLY title and author */
          '<aside class="cvp-spine">' +
            '<div class="cvp-spine-title">The Prayer App</div>' +
            '<div class="cvp-spine-author">Rev. Dr. Chris Johnson</div>' +
          '</aside>' +

          /* Front cover */
          '<main class="cvp-face">' +

            '<div class="cvp-top-gap"></div>' +

            '<header class="cvp-head">' +
              '<div class="cvp-kicker">A GLOBAL PRAYER EXPERIENCE</div>' +
              '<h1 class="cvp-h1">THE PRAYER</h1>' +
              '<h2 class="cvp-h2">APP</h2>' +
              svgCurve() +
              '<div class="cvp-sub">Our God Answers Prayers!</div>' +
            '</header>' +

            /* PVC proportion: 35:45 */
            '<div class="cvp-photo-area">' +
              '<div class="cvp-photo-frame">' +
                '<img class="cvp-author-photo" ' +
                  'src="' + PHOTO_PLACEHOLDER + '" ' +
                  'alt="Rev. Dr. Chris Johnson" ' +
                  'id="cvp-author-photo">' +
              '</div>' +
            '</div>' +

            '<div class="cvp-author">Rev. Dr. Chris Johnson</div>' +

            '<div class="cvp-btn-area">' +
              '<button class="cvp-btn" type="button" id="cvp-start">' +
                'BEGIN THE JOURNEY' +
              '</button>' +
            '</div>' +

          '</main>' +
        '</section>';

      /* Quick photograph replacement */
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
      version: '7.1.0',
      render: render
    };

  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();