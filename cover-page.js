(function () {
  'use strict';

  try {
    var STYLE_ID = 'cvp-style';

    function css() {
      return [
        '.cvp{position:fixed;inset:0;z-index:30;display:flex;width:100%;height:100dvh;overflow:hidden;background:#07162D;color:#FFFFFF;font-family:Georgia,serif;user-select:none;-webkit-user-select:none}',

        '.cvp *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',

        /* Premium spine */

        '.cvp-spine{width:42px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:max(env(safe-area-inset-top),24px) 0 max(env(safe-area-inset-bottom),24px);background:linear-gradient(180deg,#102D52,#07162D);border-right:1px solid rgba(212,175,55,.55)}',

        '.cvp-spine-txt{writing-mode:vertical-rl;transform:rotate(180deg);font-family:Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:2px;color:#E8CA78;white-space:nowrap}',

        '.cvp-spine-plus{font-family:Georgia,serif;color:#D4AF37;font-size:30px;font-weight:400}',

        /* Main cover */

        '.cvp-face{flex:1;min-width:0;display:flex;flex-direction:column;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 65%,rgba(24,119,242,.20),transparent 48%),linear-gradient(145deg,#10294B 0%,#07162D 55%,#061020 100%)}',

        '.cvp-face:before{content:"";position:absolute;inset:12px;border:1px solid rgba(212,175,55,.30);pointer-events:none}',

        '.cvp-face:after{content:"";position:absolute;width:220px;height:220px;border:1px solid rgba(212,175,55,.12);border-radius:50%;top:35%;left:50%;transform:translateX(-50%);pointer-events:none}',

        '.cvp-top-gap{height:max(env(safe-area-inset-top),3vh);flex:none}',

        /* Header */

        '.cvp-head{text-align:center;padding:0 14px;position:relative;z-index:2;flex:none}',

        '.cvp-kicker{font-family:Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:2px;color:#D4AF37;margin-bottom:15px}',

        '.cvp-h1{font-size:clamp(34px,9vw,48px);font-weight:700;line-height:1.12;margin:0;letter-spacing:1px;color:#FFFFFF}',

        '.cvp-h2{font-size:clamp(66px,17vw,96px);font-weight:700;line-height:.95;margin:5px 0 0;color:#E8CA78;letter-spacing:2px;text-shadow:0 4px 20px rgba(212,175,55,.18)}',

        '.cvp-curve{width:145px;height:18px;margin:12px auto 5px;display:block}',

        '.cvp-sub{font-family:Arial,sans-serif;font-size:22px;font-weight:700;line-height:1.3;color:#FFFFFF;margin-top:12px}',

        /* Artwork */

        '.cvp-art-area{flex:1;min-height:130px;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;overflow:hidden}',

        '.cvp-scene{width:100%;height:100%;max-height:39vh;display:block;object-fit:contain}',

        /* Author */

        '.cvp-author{text-align:center;font-family:Arial,sans-serif;font-weight:800;font-size:18px;color:#E8CA78;letter-spacing:1.5px;padding:0 12px;margin:8px 0 0;flex:none;position:relative;z-index:3}',

        /* Entry button */

        '.cvp-btn-area{display:flex;justify-content:center;padding:0 22px max(env(safe-area-inset-bottom),22px);margin-top:20px;flex:none;position:relative;z-index:5}',

        '.cvp-btn{width:100%;max-width:340px;min-height:58px;background:linear-gradient(135deg,#E8CA78,#C69B35);color:#07162D;border:1px solid #F5DF9B;border-radius:5px;padding:12px 20px;font-family:Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:1px;box-shadow:0 8px 25px rgba(0,0,0,.35);cursor:pointer}',

        '.cvp-btn:active{transform:scale(.97)}',

        '@media(max-height:650px){.cvp-top-gap{height:12px}.cvp-kicker{margin-bottom:8px}.cvp-h1{font-size:32px}.cvp-h2{font-size:64px}.cvp-sub{margin-top:6px}.cvp-art-area{min-height:90px}.cvp-scene{max-height:28vh}.cvp-btn-area{margin-top:10px}.cvp-author{margin-top:3px}}',

        '@media(prefers-reduced-motion:no-preference){.cvp-btn{animation:cvpup .6s ease-out}}',

        '@keyframes cvpup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'

      ].join('');
    }

    function svgCurve() {
      return '<svg class="cvp-curve" viewBox="0 0 140 18" aria-hidden="true">' +
        '<path d="M5 9 H45 M95 9 H135" stroke="#D4AF37" stroke-width="1.5"/>' +
        '<path d="M70 2 L77 9 L70 16 L63 9 Z" fill="#D4AF37"/>' +
        '</svg>';
    }

    function svgArtwork() {
      return '<svg class="cvp-scene" viewBox="0 0 400 330" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +

        '<defs>' +

        '<radialGradient id="cvpGlow">' +
        '<stop offset="0%" stop-color="#E8CA78" stop-opacity=".55"/>' +
        '<stop offset="55%" stop-color="#1877F2" stop-opacity=".15"/>' +
        '<stop offset="100%" stop-color="#07162D" stop-opacity="0"/>' +
        '</radialGradient>' +

        '<linearGradient id="cvpGold" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#FFF0B5"/>' +
        '<stop offset="50%" stop-color="#D4AF37"/>' +
        '<stop offset="100%" stop-color="#A87920"/>' +
        '</linearGradient>' +

        '</defs>' +

        /* Radiant background */

        '<circle cx="200" cy="155" r="145" fill="url(#cvpGlow)"/>' +

        '<circle cx="200" cy="155" r="105" fill="none" stroke="#D4AF37" stroke-opacity=".35" stroke-width="1"/>' +

        '<circle cx="200" cy="155" r="125" fill="none" stroke="#D4AF37" stroke-opacity=".15" stroke-width="1"/>' +

        /* Radiant rays */

        '<g stroke="#D4AF37" stroke-opacity=".45" stroke-width="2" stroke-linecap="round">' +
        '<path d="M200 10 V35 M200 275 V300"/>' +
        '<path d="M55 155 H80 M320 155 H345"/>' +
        '<path d="M97 52 L115 70 M285 240 L303 258"/>' +
        '<path d="M303 52 L285 70 M115 240 L97 258"/>' +
        '</g>' +

        /* Praying hands */

        '<g stroke="url(#cvpGold)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +

        /* Left hand */

        '<path d="M199 262 C181 244 157 214 146 181 C137 153 134 123 137 90 C138 78 146 74 152 82 C160 91 162 126 166 146 L168 61 C168 49 178 46 184 55 C190 64 188 112 190 138 L194 45 C195 32 207 32 211 45 C214 59 207 119 207 143 L218 65 C220 53 231 55 233 68 C235 82 223 143 220 166 C216 201 211 237 199 262 Z" fill="#123C70"/>' +

        /* Right hand */

        '<path d="M201 262 C219 244 243 214 254 181 C263 153 266 123 263 90 C262 78 254 74 248 82 C240 91 238 126 234 146 L232 61 C232 49 222 46 216 55 C210 64 212 112 210 138 L206 45 C205 32 193 32 189 45 C186 59 193 119 193 143 L182 65 C180 53 169 55 167 68 C165 82 177 143 180 166 C184 201 189 237 201 262 Z" fill="#1877F2"/>' +

        '</g>' +

        /* Joined palms detail */

        '<path d="M200 42 C198 100 198 174 200 260" fill="none" stroke="#FFF0B5" stroke-width="2" stroke-opacity=".85"/>' +

        /* Wrist ornament */

        '<path d="M166 243 Q200 264 234 243" fill="none" stroke="#D4AF37" stroke-width="3"/>' +

        '<path d="M172 252 Q200 271 228 252" fill="none" stroke="#D4AF37" stroke-opacity=".5" stroke-width="1.5"/>' +

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
        '<section class="cvp" role="region" aria-label="The Prayer App Cover">' +

          '<div class="cvp-spine">' +
            '<div class="cvp-spine-txt">THE PRAYER APP</div>' +
            '<div class="cvp-spine-plus">✦</div>' +
          '</div>' +

          '<div class="cvp-face">' +

            '<div class="cvp-top-gap"></div>' +

            '<header class="cvp-head">' +
              '<div class="cvp-kicker">A GLOBAL PRAYER EXPERIENCE</div>' +
              '<h1 class="cvp-h1">THE PRAYER</h1>' +
              '<h2 class="cvp-h2">APP</h2>' +
              svgCurve() +
              '<div class="cvp-sub">Our God Answers Prayers!</div>' +
            '</header>' +

            '<div class="cvp-art-area">' +
              svgArtwork() +
            '</div>' +

            '<div class="cvp-author">REV. DR. CHRIS JOHNSON</div>' +

            '<div class="cvp-btn-area">' +
              '<button class="cvp-btn" type="button" id="cvp-start">' +
                'BEGIN THE JOURNEY' +
              '</button>' +
            '</div>' +

          '</div>' +
        '</section>';

      function begin() {
        try {
          container.dispatchEvent(
            new CustomEvent('coverpage:begin', { bubbles: true })
          );
        } catch (e) {}

        if (typeof onBegin === 'function') onBegin();
      }

      container.querySelector('#cvp-start').addEventListener('click', begin);
    }

    window.CoverPage = {
      version: '7.0.0',
      render: render
    };

  } catch (err) {
    /* Fails gracefully if interrupted */
  }
})();