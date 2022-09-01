var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function c(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(e,t){e.appendChild(t)}function a(e,t,n){e.insertBefore(t,n||null)}function l(e){e.parentNode.removeChild(e)}function u(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function s(e){return document.createElement(e)}function d(e){return document.createTextNode(e)}function f(){return d(" ")}function p(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function m(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function h(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function g(e,t){for(let n=0;n<e.options.length;n+=1){const o=e.options[n];if(o.__value===t)return void(o.selected=!0)}e.selectedIndex=-1}let b;function v(e){b=e}const $=[],y=[],_=[],x=[],k=Promise.resolve();let w=!1;function E(e){_.push(e)}const C=new Set;let M=0;function S(){const e=b;do{for(;M<$.length;){const e=$[M];M++,v(e),T(e.$$)}for(v(null),$.length=0,M=0;y.length;)y.pop()();for(let e=0;e<_.length;e+=1){const t=_[e];C.has(t)||(C.add(t),t())}_.length=0}while($.length);for(;x.length;)x.pop()();w=!1,C.clear(),v(e)}function T(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const D=new Set;function N(e,t){-1===e.$$.dirty[0]&&($.push(e),w||(w=!0,k.then(S)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function R(r,i,a,u,s,d,f,p=[-1]){const m=b;v(r);const h=r.$$={fragment:null,ctx:null,props:d,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(m?m.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:i.target||m.$$.root};f&&f(h.root);let g=!1;if(h.ctx=a?a(r,i.props||{},((e,t,...n)=>{const o=n.length?n[0]:t;return h.ctx&&s(h.ctx[e],h.ctx[e]=o)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](o),g&&N(r,e)),t})):[],h.update(),g=!0,o(h.before_update),h.fragment=!!u&&u(h.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);h.fragment&&h.fragment.l(e),e.forEach(l)}else h.fragment&&h.fragment.c();i.intro&&(($=r.$$.fragment)&&$.i&&(D.delete($),$.i(y))),function(e,n,r,i){const{fragment:a,on_mount:l,on_destroy:u,after_update:s}=e.$$;a&&a.m(n,r),i||E((()=>{const n=l.map(t).filter(c);u?u.push(...n):o(n),e.$$.on_mount=[]})),s.forEach(E)}(r,i.target,i.anchor,i.customElement),S()}var $,y;v(m)}function j(e,t,n){const o=e.slice();return o[19]=t[n],o[20]=t,o[21]=n,o}function A(e,t,n){const o=e.slice();return o[22]=t[n].label,o[23]=t[n].deviceId,o[24]=t[n].kind,o}function L(t){let n;return{c(){n=s("h2"),n.textContent="getUserMedia or MediaRecording API are not supported by your browser"},m(e,t){a(e,n,t)},p:e,d(e){e&&l(n)}}}function I(e){let t,n,c,r,d,h,b,v,$,y,_,x,k,w,C,M,S,T,D,N,R,L=e[2],I=[];for(let t=0;t<L.length;t+=1)I[t]=O(A(e,L,t));let q=e[5],H=[];for(let t=0;t<q.length;t+=1)H[t]=U(j(e,q,t));function z(e,t){return e[3]?P:B}let G=z(e),F=G(e);return{c(){t=s("div"),n=s("label"),c=s("span"),c.textContent="Select Microphone",r=f(),d=s("select");for(let e=0;e<I.length;e+=1)I[e].c();h=f(),b=s("div"),v=s("div"),v.textContent="Enable / Disable Media Constraints",$=f();for(let e=0;e<H.length;e+=1)H[e].c();y=f(),_=s("div"),x=s("div"),x.textContent="Chunked Streaming?",k=f(),w=s("label"),C=s("input"),M=f(),S=s("span"),S.textContent="Chunked 240b",T=f(),D=s("div"),F.c(),m(c,"class","text-label mr-5"),m(d,"class","voices"),void 0===e[1]&&E((()=>e[9].call(d))),m(t,"class","section"),m(b,"class","section flex-column"),m(C,"type","checkbox"),m(C,"class","mr-5"),m(S,"class","text-label"),m(_,"class","section flex-column"),m(D,"class","section justify-content-center confirm")},m(o,l){a(o,t,l),i(t,n),i(n,c),i(n,r),i(n,d);for(let e=0;e<I.length;e+=1)I[e].m(d,null);g(d,e[1]),a(o,h,l),a(o,b,l),i(b,v),i(b,$);for(let e=0;e<H.length;e+=1)H[e].m(b,null);a(o,y,l),a(o,_,l),i(_,x),i(_,k),i(_,w),i(w,C),C.checked=e[4],i(w,M),i(w,S),a(o,T,l),a(o,D,l),F.m(D,null),N||(R=[p(d,"change",e[9]),p(C,"change",e[11])],N=!0)},p(e,t){if(4&t){let n;for(L=e[2],n=0;n<L.length;n+=1){const o=A(e,L,n);I[n]?I[n].p(o,t):(I[n]=O(o),I[n].c(),I[n].m(d,null))}for(;n<I.length;n+=1)I[n].d(1);I.length=L.length}if(6&t&&g(d,e[1]),32&t){let n;for(q=e[5],n=0;n<q.length;n+=1){const o=j(e,q,n);H[n]?H[n].p(o,t):(H[n]=U(o),H[n].c(),H[n].m(b,null))}for(;n<H.length;n+=1)H[n].d(1);H.length=q.length}16&t&&(C.checked=e[4]),G===(G=z(e))&&F?F.p(e,t):(F.d(1),F=G(e),F&&(F.c(),F.m(D,null)))},d(e){e&&l(t),u(I,e),e&&l(h),e&&l(b),u(H,e),e&&l(y),e&&l(_),e&&l(T),e&&l(D),F.d(),N=!1,o(R)}}}function O(e){let t,n,o,c,r,u,p,m,g=e[22]+"",b=e[24]+"",v=e[23]+"";return{c(){t=s("option"),n=d(g),o=d(" - "),c=d(b),r=d(" - "),u=d(v),p=f(),t.__value=m=e[23],t.value=t.__value},m(e,l){a(e,t,l),i(t,n),i(t,o),i(t,c),i(t,r),i(t,u),i(t,p)},p(e,o){4&o&&g!==(g=e[22]+"")&&h(n,g),4&o&&b!==(b=e[24]+"")&&h(c,b),4&o&&v!==(v=e[23]+"")&&h(u,v),4&o&&m!==(m=e[23])&&(t.__value=m,t.value=t.__value)},d(e){e&&l(t)}}}function U(e){let t,n,o,c,r,u,g,b,v=e[19].constraintName+"";function $(){e[10].call(n,e[20],e[21])}return{c(){t=s("label"),n=s("input"),o=f(),c=s("span"),r=d(v),u=f(),m(n,"type","checkbox"),m(n,"class","mr-5"),m(c,"class","text-label")},m(l,s){a(l,t,s),i(t,n),n.checked=e[19].enabled,i(t,o),i(t,c),i(c,r),i(t,u),g||(b=p(n,"change",$),g=!0)},p(t,o){e=t,32&o&&(n.checked=e[19].enabled),32&o&&v!==(v=e[19].constraintName+"")&&h(r,v)},d(e){e&&l(t),g=!1,b()}}}function B(t){let n,o,c;return{c(){n=s("button"),n.innerHTML="<span>Record</span>",m(n,"class","primary")},m(e,r){a(e,n,r),o||(c=p(n,"click",t[7]),o=!0)},p:e,d(e){e&&l(n),o=!1,c()}}}function P(t){let n,o,c;return{c(){n=s("button"),n.innerHTML="<span>Stop</span>",m(n,"class","primary")},m(e,r){a(e,n,r),o||(c=p(n,"click",t[8]),o=!0)},p:e,d(e){e&&l(n),o=!1,c()}}}function q(t){let n;function o(e,t){return e[6]&&e[0]?I:L}let c=o(t),r=c(t);return{c(){n=s("div"),r.c(),m(n,"class","container")},m(e,t){a(e,n,t),r.m(n,null)},p(e,[t]){c===(c=o(e))&&r?r.p(e,t):(r.d(1),r=c(e),r&&(r.c(),r.m(n,null)))},i:e,o:e,d(e){e&&l(n),r.d()}}}const H="audio/webm; codecs=opus",z="audio/ogg; codecs=opus";function G(e,t,n){let o,c,r="MediaRecorder"in window,i=navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices,a=0,l="",u=[],s=!1,d=!1,f=[],{fileExt:p,mimeType:m}=MediaRecorder.isTypeSupported(z)?{fileExt:"ogg",mimeType:z}:MediaRecorder.isTypeSupported(H)?{fileExt:"webm",mimeType:H}:{fileExt:"mp4",mimeType:"audio/mp4"};function h(e){let t=f.map((e=>`${e.constraintName.substring(0,1)}_${e.enabled?1:0}`)).join("_"),n=`audio_${c}_${t}_${a}${d?".chunk":""}.${p}`,o=URL.createObjectURL(e),r=document.createElement("a");document.body.appendChild(r),r.style="display: none",r.href=o,r.download=n,r.click()}return async function(){if(!r||!i)return;await navigator.mediaDevices.getUserMedia({audio:!0});let e=await navigator.mediaDevices.enumerateDevices();if(n(2,u=e.filter((e=>"audioinput"===e.kind))),!u||0===u.length)return void n(0,i=!1);n(1,l=u[0].deviceId);let t=navigator.mediaDevices.getSupportedConstraints()||{};n(5,f=["autoGainControl","echoCancellation","noiseSuppression"].reduce(((e,n)=>(t[n]&&e.push({constraintName:n,enabled:!0}),e)),[]))}(),[i,l,u,s,d,f,r,async function(){l||(isOutputStreamNotSupported=!0),c=Date.now(),a=0;let e=[];const t=f.reduce(((e,t)=>(e[t.constraintName]=t.enabled,e)),{audio:{deviceId:{exact:l}}});let r=await navigator.mediaDevices.getUserMedia(t);o=new MediaRecorder(r,{mimeType:m,bitsPerSecond:128e3}),o.ondataavailable=t=>{if(t.data.size>0&&e.push(t.data),d){h(new Blob([t.data],{type:m})),a++}},o.onstop=()=>{if(n(3,s=!1),r.getAudioTracks().forEach((e=>e.stop())),d)return;h(new Blob(e,{type:m}))},o.onerror=e=>{console.log(e)},o.start(d?240:void 0),n(3,s=!0)},function(){o&&"recording"===o.state&&o.stop()},function(){l=function(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}(this),n(1,l),n(2,u)},function(e,t){e[t].enabled=this.checked,n(5,f)},function(){d=this.checked,n(4,d)}]}return new class extends class{$destroy(){!function(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}{constructor(e){super(),R(this,e,G,q,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
