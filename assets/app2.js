var st="1.9.0",ct={variantFlipOrder:{start:"sme",middle:"mse",end:"ems"},positionFlipOrder:{top:"tbrl",right:"rltb",bottom:"btrl",left:"lrbt"},position:"bottom",margin:8,padding:0},at=(a,t,e)=>{const{container:r,arrow:s,margin:o,padding:i,position:n,variantFlipOrder:c,positionFlipOrder:p}={container:document.documentElement.getBoundingClientRect(),...ct,...e},{left:h,top:l}=t.style;t.style.left="0",t.style.top="0";const u=a.getBoundingClientRect(),d=t.getBoundingClientRect(),g={t:u.top-d.height-o,b:u.bottom+o,r:u.right+o,l:u.left-d.width-o},m={vs:u.left,vm:u.left+u.width/2-d.width/2,ve:u.left+u.width-d.width,hs:u.top,hm:u.bottom-u.height/2-d.height/2,he:u.bottom-d.height},[b,H="middle"]=n.split("-"),E=p[b],q=c[H],{top:j,left:N,bottom:F,right:I}=r;for(const w of E){const y=w==="t"||w==="b";let _=g[w];const[R,B]=y?["top","left"]:["left","top"],[V,L]=y?[d.height,d.width]:[d.width,d.height],[J,Q]=y?[F,I]:[I,F],[tt,et]=y?[j,N]:[N,j];if(!(_<tt||_+V+i>J))for(const O of q){let x=m[(y?"v":"h")+O];if(!(x<et||x+L+i>Q)){if(x-=d[B],_-=d[R],t.style[B]=`${x}px`,t.style[R]=`${_}px`,s){const P=y?u.width/2:u.height/2,A=L/2,U=P>A,ot={s:U?A:P,m:A,e:U?A:L-P},rt={t:V,b:0,r:0,l:V},it=x+ot[O],nt=_+rt[w];s.style[B]=`${it}px`,s.style[R]=`${nt}px`}return w+O}}}return t.style.left=h,t.style.top=l,null},lt=(a,t,e)=>{const r=typeof a=="object"&&!(a instanceof HTMLElement)?a:{reference:a,popper:t,...e};return{update(s=r){const{reference:o,popper:i}=Object.assign(r,s);if(!i||!o)throw new Error("Popper- or reference-element missing.");return at(o,i,r)}}};function X(a,t,e,r,s={}){t instanceof HTMLCollection||t instanceof NodeList?t=Array.from(t):Array.isArray(t)||(t=[t]),Array.isArray(e)||(e=[e]);for(const o of t)for(const i of e)o[a](i,r,{capture:!1,...s});return Array.prototype.slice.call(arguments,1)}var f=X.bind(null,"addEventListener"),v=X.bind(null,"removeEventListener");function M(a){const t=document.createElement("div");return t.innerHTML=a.trim(),t.firstElementChild}function Z(a){const t=(r,s)=>{const o=r.getAttribute(s);return r.removeAttribute(s),o},e=(r,s={})=>{const o=t(r,":obj"),i=t(r,":ref"),n=o?s[o]={}:s;i&&(s[i]=r);for(const c of Array.from(r.children)){const p=t(c,":arr"),h=e(c,p?{}:n);p&&(n[p]||(n[p]=[])).push(Object.keys(h).length?h:c)}return s};return e(M(a))}function K(a){let t=a.path||a.composedPath&&a.composedPath();if(t)return t;let e=a.target.parentElement;for(t=[a.target,e];e=e.parentElement;)t.push(e);return t.push(document,window),t}function W(a){return a instanceof Element?a:typeof a=="string"?a.split(/>>/g).reduce((t,e,r,s)=>(t=t.querySelector(e),r<s.length-1?t.shadowRoot:t),document):null}function Y(a,t=e=>e){function e(r){const s=[.001,.01,.1][Number(r.shiftKey||r.ctrlKey*2)]*(r.deltaY<0?1:-1);let o=0,i=a.selectionStart;a.value=a.value.replace(/[\d.]+/g,(n,c)=>c<=i&&c+n.length>=i?(i=c,t(Number(n),s,o)):(o++,n)),a.focus(),a.setSelectionRange(i,i),r.preventDefault(),a.dispatchEvent(new Event("input"))}f(a,"focus",()=>f(window,"wheel",e,{passive:!1})),f(a,"blur",()=>v(window,"wheel",e))}var pt={on:f,off:v,createElementFromString:M,createFromTemplate:Z,eventPath:K,resolveElement:W,adjustableInputNumbers:Y},{min:C,max:ht,floor:ut,round:dt}=Math;function ft(a){if(a.toLowerCase()==="black")return"#000";const t=document.createElement("canvas").getContext("2d");return t.fillStyle=a,/^#0{3,6}$/.test(t.fillStyle)?null:t.fillStyle}function T(a,t,e){a=a/360*6,t/=100,e/=100;const r=ut(a),s=a-r,o=e*(1-t),i=e*(1-s*t),n=e*(1-(1-s)*t),c=r%6,p=[e,i,o,o,n,e][c],h=[n,e,e,i,o,o][c],l=[o,o,n,e,e,i][c];return[p*255,h*255,l*255]}function mt(a,t,e){return T(a,t,e).map(r=>dt(r).toString(16).padStart(2,"0"))}function gt(a,t,e){const r=T(a,t,e),s=r[0]/255,o=r[1]/255,i=r[2]/255,n=C(1-s,1-o,1-i),c=n===1?0:(1-s-n)/(1-n),p=n===1?0:(1-o-n)/(1-n),h=n===1?0:(1-i-n)/(1-n);return[c*100,p*100,h*100,n*100]}function bt(a,t,e){t/=100,e/=100;const r=(2-t)*e/2;return r!==0&&(r===1?t=0:r<.5?t=t*e/(r*2):t=t*e/(2-r*2)),[a,t*100,r*100]}function D(a,t,e){a/=255,t/=255,e/=255;const r=C(a,t,e),s=ht(a,t,e),o=s-r;let i,n;const c=s;if(o===0)i=n=0;else{n=o/s;const p=((s-a)/6+o/2)/o,h=((s-t)/6+o/2)/o,l=((s-e)/6+o/2)/o;a===s?i=l-h:t===s?i=1/3+p-l:e===s&&(i=2/3+h-p),i<0?i+=1:i>1&&(i-=1)}return[i*360,n*100,c*100]}function vt(a,t,e,r){return a/=100,t/=100,e/=100,r/=100,[...D((1-C(1,a*(1-r)+r))*255,(1-C(1,t*(1-r)+r))*255,(1-C(1,e*(1-r)+r))*255)]}function yt(a,t,e){t/=100,e/=100,t*=e<.5?e:1-e;const r=2*t/(e+t)*100,s=(e+t)*100;return[a,isNaN(r)?0:r,s]}function wt(a){return D(...a.match(/.{2}/g).map(t=>parseInt(t,16)))}function _t(a){a=a.match(/^[a-zA-Z]+$/)&&ft(a)||a;const t={cmyk:/^cmyk\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)/i,rgba:/^rgba?\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D*?(([\d.]+)(%?)|$)/i,hsla:/^hsla?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,hsva:/^hsva?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,hexa:/^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i},e=s=>s.map(o=>/^(|\d+)\.\d+|\d+$/.test(o)?Number(o):void 0);let r;t:for(const s in t)if(r=t[s].exec(a))switch(s){case"cmyk":{const[,o,i,n,c]=e(r);if(o>100||i>100||n>100||c>100)break t;return{values:vt(o,i,n,c),type:s}}case"rgba":{let[,o,,i,,n,,,c]=e(r);if(o=r[2]==="%"?o/100*255:o,i=r[4]==="%"?i/100*255:i,n=r[6]==="%"?n/100*255:n,c=r[9]==="%"?c/100:c,o>255||i>255||n>255||c<0||c>1)break t;return{values:[...D(o,i,n),c],a:c,type:s}}case"hexa":{let[,o]=r;(o.length===4||o.length===3)&&(o=o.split("").map(c=>c+c).join(""));const i=o.substring(0,6);let n=o.substring(6);return n=n?parseInt(n,16)/255:void 0,{values:[...wt(i),n],a:n,type:s}}case"hsla":{let[,o,i,n,,c]=e(r);if(c=r[6]==="%"?c/100:c,o>360||i>100||n>100||c<0||c>1)break t;return{values:[...yt(o,i,n),c],a:c,type:s}}case"hsva":{let[,o,i,n,,c]=e(r);if(c=r[6]==="%"?c/100:c,o>360||i>100||n>100||c<0||c>1)break t;return{values:[o,i,n,c],a:c,type:s}}}return{values:null,type:null}}function k(a=0,t=0,e=0,r=1){const s=(i,n)=>(c=-1)=>n(~c?i.map(p=>Number(p.toFixed(c))):i),o={h:a,s:t,v:e,a:r,toHSVA(){const i=[o.h,o.s,o.v,o.a];return i.toString=s(i,n=>`hsva(${n[0]}, ${n[1]}%, ${n[2]}%, ${o.a})`),i},toHSLA(){const i=[...bt(o.h,o.s,o.v),o.a];return i.toString=s(i,n=>`hsla(${n[0]}, ${n[1]}%, ${n[2]}%, ${o.a})`),i},toRGBA(){const i=[...T(o.h,o.s,o.v),o.a];return i.toString=s(i,n=>`rgba(${n[0]}, ${n[1]}, ${n[2]}, ${o.a})`),i},toCMYK(){const i=gt(o.h,o.s,o.v);return i.toString=s(i,n=>`cmyk(${n[0]}%, ${n[1]}%, ${n[2]}%, ${n[3]}%)`),i},toHEXA(){const i=mt(o.h,o.s,o.v),n=o.a>=1?"":Number((o.a*255).toFixed(0)).toString(16).toUpperCase().padStart(2,"0");return n&&i.push(n),i.toString=()=>`#${i.join("").toUpperCase()}`,i},clone:()=>k(o.h,o.s,o.v,o.a)};return o}var S=a=>Math.max(Math.min(a,1),0);function z(a){const t={options:Object.assign({lock:null,onchange:()=>0,onstop:()=>0},a),_keyboard(o){const{options:i}=t,{type:n,key:c}=o;if(document.activeElement===i.wrapper){const{lock:p}=t.options,h=c==="ArrowUp",l=c==="ArrowRight",u=c==="ArrowDown",d=c==="ArrowLeft";if(n==="keydown"&&(h||l||u||d)){let g,m=0;p==="v"?g=h||l?1:-1:p==="h"?g=h||l?-1:1:(m=h?-1:u?1:0,g=d?-1:l?1:0),t.update(S(t.cache.x+.01*g),S(t.cache.y+.01*m)),o.preventDefault()}else c.startsWith("Arrow")&&(t.options.onstop(),o.preventDefault())}},_tapstart(o){f(document,["mouseup","touchend","touchcancel"],t._tapstop),f(document,["mousemove","touchmove"],t._tapmove),o.cancelable&&o.preventDefault(),t._tapmove(o)},_tapmove(o){const{options:i,cache:n}=t,{lock:c,element:p,wrapper:h}=i,l=h.getBoundingClientRect();let u=0,d=0;if(o){const b=o&&o.touches&&o.touches[0];u=o?(b||o).clientX:0,d=o?(b||o).clientY:0,u<l.left?u=l.left:u>l.left+l.width&&(u=l.left+l.width),d<l.top?d=l.top:d>l.top+l.height&&(d=l.top+l.height),u-=l.left,d-=l.top}else n&&(u=n.x*l.width,d=n.y*l.height);c!=="h"&&(p.style.left=`calc(${u/l.width*100}% - ${p.offsetWidth/2}px)`),c!=="v"&&(p.style.top=`calc(${d/l.height*100}% - ${p.offsetHeight/2}px)`),t.cache={x:u/l.width,y:d/l.height};const g=S(u/l.width),m=S(d/l.height);switch(c){case"v":return i.onchange(g);case"h":return i.onchange(m);default:return i.onchange(g,m)}},_tapstop(){t.options.onstop(),v(document,["mouseup","touchend","touchcancel"],t._tapstop),v(document,["mousemove","touchmove"],t._tapmove)},trigger(){t._tapmove()},update(o=0,i=0){const{left:n,top:c,width:p,height:h}=t.options.wrapper.getBoundingClientRect();t.options.lock==="h"&&(i=o),t._tapmove({clientX:n+p*o,clientY:c+h*i})},destroy(){const{options:o,_tapstart:i,_keyboard:n}=t;v(document,["keydown","keyup"],n),v([o.wrapper,o.element],"mousedown",i),v([o.wrapper,o.element],"touchstart",i,{passive:!1})}},{options:e,_tapstart:r,_keyboard:s}=t;return f([e.wrapper,e.element],"mousedown",r),f([e.wrapper,e.element],"touchstart",r,{passive:!1}),f(document,["keydown","keyup"],s),t}function xt(a={}){a=Object.assign({onchange:()=>0,className:"",elements:[]},a);const t=f(a.elements,"click",e=>{a.elements.forEach(r=>r.classList[e.target===r?"add":"remove"](a.className)),a.onchange(e),e.stopPropagation()});return{destroy:()=>v(...t)}}var kt=a=>{const{components:t,useAsButton:e,inline:r,appClass:s,theme:o,lockOpacity:i}=a.options,n=l=>l?"":'style="display:none" hidden',c=l=>a._t(l),p=Z(`
      <div :ref="root" class="pickr">

        ${e?"":'<button type="button" :ref="button" class="pcr-button"></button>'}

        <div :ref="app" class="pcr-app ${s||""}" data-theme="${o}" ${r?'style="position: unset"':""} aria-label="${c("ui:dialog","color picker dialog")}" role="window">
          <div class="pcr-selection" ${n(t.palette)}>
            <div :obj="preview" class="pcr-color-preview" ${n(t.preview)}>
              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${c("btn:last-color")}"></button>
              <div :ref="currentColor" class="pcr-current-color"></div>
            </div>

            <div :obj="palette" class="pcr-color-palette">
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${c("aria:palette")}" role="listbox"></div>
            </div>

            <div :obj="hue" class="pcr-color-chooser" ${n(t.hue)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${c("aria:hue")}" role="slider"></div>
            </div>

            <div :obj="opacity" class="pcr-color-opacity" ${n(t.opacity)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${c("aria:opacity","opacity selection slider")}" role="slider"></div>
            </div>
          </div>

          <div class="pcr-swatches ${t.palette?"":"pcr-last"}" :ref="swatches"></div>

          <div :obj="interaction" class="pcr-interaction" ${n(Object.keys(t.interaction).length)}>
            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${n(t.interaction.input)} aria-label="${c("aria:input","color input field")}">

            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HEXA" value="${i?"HEX":"HEXA"}" type="button" ${n(t.interaction.hex)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="RGBA" value="${i?"RGB":"RGBA"}" type="button" ${n(t.interaction.rgba)}>
            <input :ref="typeToggle" class="pcr-type pcr-toggle" value="RGB" type="button" ${n(t.interaction.hex&&t.interaction.rgba)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HSLA" value="${i?"HSL":"HSLA"}" type="button" ${n(t.interaction.hsla)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HSVA" value="${i?"HSV":"HSVA"}" type="button" ${n(t.interaction.hsva)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="CMYK" value="CMYK" type="button" ${n(t.interaction.cmyk)}>

            <input :ref="eyedropper" class="pcr-eyedropper" value="EYE DROPPER" type="button" ${typeof EyeDropper>"u"?'style="display:none" hidden':""}>

            <input :ref="save" class="pcr-save" value="${c("btn:save")}" type="button" ${n(t.interaction.save)} aria-label="${c("aria:btn:save")}">
            <input :ref="cancel" class="pcr-cancel" value="${c("btn:cancel")}" type="button" ${n(t.interaction.cancel)} aria-label="${c("aria:btn:cancel")}">
            <input :ref="clear" class="pcr-clear" value="${c("btn:clear")}" type="button" ${n(t.interaction.clear)} aria-label="${c("aria:btn:clear")}">
          </div>
        </div>
      </div>
    `),h=p.interaction;return h.options.find(l=>!l.hidden&&!l.classList.add("active")),h.type=()=>h.options.find(l=>l.classList.contains("active")),p},Ct=`
.pickr {
  position: relative;
  overflow: visible;
  transform: translateY(0);
}
.pickr * {
  box-sizing: border-box;
  outline: none;
  border: none;
  -webkit-appearance: none;
}

.pickr .pcr-button {
  position: relative;
  height: 2em;
  width: 2em;
  padding: 0.5em;
  cursor: pointer;
  font-family: system-ui,-apple-system,Segoe UI,sans-serif;
  border-radius: 8px;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" stroke="%2342445A" stroke-width="5px" stroke-linecap="round"><path d="M45,45L5,5"></path><path d="M45,5L5,45"></path></svg>') no-repeat center;
  background-size: 0;
  transition: all 0.3s;
}
.pickr .pcr-button::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 0.5em;
  border-radius: 8px;
  z-index: initial;
}
.pickr .pcr-button::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: background 0.3s;
  background: var(--pcr-color);
  border-radius: 8px;
}
.pickr .pcr-button.clear {
  background-size: 70%;
}
.pickr .pcr-button.clear::before {
  opacity: 0;
}
.pickr .pcr-button.clear:focus {
  box-shadow: 0 0 0 1px rgba(255,255,255,.85), 0 0 0 3px var(--pcr-color);
}
.pickr .pcr-button.disabled {
  cursor: not-allowed;
}

.pickr input:focus,
.pickr button:focus,
.pcr-app input:focus,
.pcr-app button:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pickr .pcr-palette,
.pickr .pcr-slider,
.pcr-app .pcr-palette,
.pcr-app .pcr-slider {
  transition: box-shadow 0.3s;
}
.pickr .pcr-palette:focus,
.pickr .pcr-slider:focus,
.pcr-app .pcr-palette:focus,
.pcr-app .pcr-slider:focus {
  box-shadow: 0 0 0 1px rgba(255,255,255,.85), 0 0 0 3px rgba(0,0,0,.25);
}

.pcr-app {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  border-radius: 12px;
  background: #1c1b22;
  border: 1px solid #302f38;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0s 0.3s;
  font-family: system-ui,-apple-system,Segoe UI,sans-serif;
  box-shadow: 0 20px 60px rgba(0,0,0,.45);
  left: 0;
  top: 0;
}
.pcr-app.visible {
  transition: opacity 0.3s;
  visibility: visible;
  opacity: 1;
}
.pcr-app .pcr-swatches {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.75em;
}
.pcr-app .pcr-swatches.pcr-last {
  margin: 0;
}
@supports (display: grid) {
  .pcr-app .pcr-swatches {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, 1.75em);
  }
}
.pcr-app .pcr-swatches > button {
  font-size: 1em;
  position: relative;
  width: calc(1.75em - 5px);
  height: calc(1.75em - 5px);
  border-radius: 6px;
  cursor: pointer;
  margin: 2.5px;
  flex-shrink: 0;
  justify-self: center;
  transition: all 0.15s;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  border: 1px solid #3f3f47;
}
.pcr-app .pcr-swatches > button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--pcr-color);
  border-radius: 5px;
  box-sizing: border-box;
}
.pcr-app .pcr-swatches > button:hover {
  filter: brightness(1.1);
  border-color: color-mix(in srgb, var(--accent) 50%, #3f3f47);
}
.pcr-app .pcr-swatches > button.pcr-active {
  border-color: var(--accent);
}
.pcr-app .pcr-swatches > button.pcr-recent::before {
  content: "";
  position: absolute;
  top: 2px;
  right: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  z-index: 2;
  box-shadow: 0 0 0 1px rgba(0,0,0,.4);
}
.pcr-app .pcr-interaction {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5em;
  margin-top: 0.75em;
}
.pcr-app .pcr-interaction > * {
  margin: 0;
  min-width: 0;
}
.pcr-app .pcr-interaction .pcr-result {
  grid-column: 1 / 3;
  grid-row: 1;
}
.pcr-app .pcr-interaction .pcr-toggle {
  grid-column: 3;
  grid-row: 1;
}
.pcr-app .pcr-interaction .pcr-eyedropper {
  grid-column: 1 / -1;
  grid-row: 2;
}
.pcr-app .pcr-interaction .pcr-save {
  grid-column: 1;
  grid-row: 3;
}
.pcr-app .pcr-interaction .pcr-cancel {
  grid-column: 2;
  grid-row: 3;
}
.pcr-app .pcr-interaction .pcr-clear {
  grid-column: 3;
  grid-row: 3;
}
.pcr-app .pcr-interaction input {
  letter-spacing: 0.07em;
  font-size: 0.75em;
  text-align: center;
  cursor: pointer;
  color: #a1a1aa;
  background: #18181b;
  border: 1px solid #3f3f47;
  border-radius: 8px;
  transition: all 0.15s;
  padding: 0.45em 0.5em;
}
.pcr-app .pcr-interaction input:hover {
  filter: brightness(1.15);
}
.pcr-app .pcr-interaction input:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pcr-app .pcr-interaction .pcr-eyedropper {
  font-weight: 500;
  letter-spacing: 0.08em;
}
.pcr-app .pcr-interaction .pcr-result {
  color: #f4f4f5;
  text-align: left;
  transition: all 0.2s;
  border-radius: 8px;
  background: #18181b;
  cursor: text;
  width: 100%;
}
.pcr-app .pcr-interaction .pcr-result::selection {
  background: var(--accent);
  color: #fff;
}
.pcr-app .pcr-interaction .pcr-type.active {
  color: #fff;
  background: #3f3f47;
  border-color: #3f3f47;
}
.pcr-app .pcr-interaction .pcr-type.pcr-hidden-type {
  display: none !important;
}
.pcr-app .pcr-interaction .pcr-save,
.pcr-app .pcr-interaction .pcr-cancel,
.pcr-app .pcr-interaction .pcr-clear {
  width: 100%;
  color: #a1a1aa;
  background: transparent;
  border: 1px solid #3f3f47;
  font-weight: 500;
  letter-spacing: 0;
}
.pcr-app .pcr-interaction .pcr-save:hover,
.pcr-app .pcr-interaction .pcr-cancel:hover,
.pcr-app .pcr-interaction .pcr-clear:hover {
  filter: none;
  color: #f4f4f5;
  border-color: color-mix(in srgb, #f4f4f5 40%, transparent);
  background: color-mix(in srgb, #f4f4f5 6%, transparent);
}
.pcr-app .pcr-interaction .pcr-save {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}
.pcr-app .pcr-interaction .pcr-save:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.pcr-app .pcr-interaction .pcr-clear:focus,
.pcr-app .pcr-interaction .pcr-cancel:focus,
.pcr-app .pcr-interaction .pcr-save:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pcr-app .pcr-selection .pcr-picker {
  position: absolute;
  height: 18px;
  width: 18px;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
}
.pcr-app .pcr-selection .pcr-color-palette,
.pcr-app .pcr-selection .pcr-color-chooser,
.pcr-app .pcr-selection .pcr-color-opacity {
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: column;
  cursor: grab;
}
.pcr-app .pcr-selection .pcr-color-palette:active,
.pcr-app .pcr-selection .pcr-color-chooser:active,
.pcr-app .pcr-selection .pcr-color-opacity:active {
  cursor: grabbing;
}

.pcr-app[data-theme=monolith] {
  width: 14.25em;
  max-width: 95vw;
  padding: 0.8em;
}
.pcr-app[data-theme=monolith] .pcr-selection {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 0.5em;
  border-radius: 0.15em;
  z-index: -1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-last-color {
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  border-radius: 0.15em 0 0 0.15em;
  z-index: 2;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  -webkit-appearance: none;
  appearance: none;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-current-color {
  border-radius: 0 0.15em 0.15em 0;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-last-color,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-current-color {
  background: var(--pcr-color);
  width: 50%;
  height: 100%;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-palette {
  width: 100%;
  height: 8em;
  z-index: 1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-palette .pcr-palette {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity {
  height: 0.5em;
  margin-top: 0.75em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-picker,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-picker {
  top: 50%;
  transform: translateY(-50%);
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-slider,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-slider {
  flex-grow: 1;
  border-radius: 50em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-slider {
  background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(0,100%,50%));
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-slider {
  background: linear-gradient(to right, transparent, black), url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 100%, 0.25em;
}
`,G=!1;function At(){if(G)return;G=!0;const a=document.createElement("style");a.id="pcr-monolith-styles",a.textContent=Ct,document.head.appendChild(a)}At();var St=class ${static utils=pt;static version=st;static I18N_DEFAULTS={"ui:dialog":"color picker dialog","btn:toggle":"toggle color picker dialog","btn:swatch":"color swatch","btn:last-color":"use previous color","btn:save":"Save","btn:cancel":"Cancel","btn:clear":"Reset","aria:btn:save":"save and close","aria:btn:cancel":"cancel and close","aria:btn:clear":"clear and close","aria:input":"color input field","aria:palette":"color selection area","aria:hue":"hue selection slider","aria:opacity":"selection slider"};static DEFAULT_OPTIONS={appClass:null,theme:"classic",useAsButton:!1,padding:8,disabled:!1,comparison:!0,closeOnScroll:!1,outputPrecision:0,lockOpacity:!1,autoReposition:!0,container:"body",components:{interaction:{}},i18n:{},swatches:null,inline:!1,sliders:null,default:"#42445a",defaultRepresentation:null,position:"bottom-middle",adjustableNumbers:!0,showAlways:!1,recentColors:{enabled:!0,max:3,key:"anoxle-pcr-recent"},closeWithKey:"Escape"};_initializingActive=!0;_recalc=!0;_nanopop=null;_root=null;_color=k();_lastColor=k();_originalColor=null;_swatchColors=[];_recentCount=0;_setupAnimationFrame=null;_components=null;_eventBindings=[];_eventListener={init:[],save:[],hide:[],show:[],clear:[],change:[],changestop:[],cancel:[],swatchselect:[]};constructor(t){this.options=t=Object.assign({...$.DEFAULT_OPTIONS},t);const{swatches:e,components:r,theme:s,sliders:o,lockOpacity:i,padding:n,recentColors:c}=t;["nano","monolith"].includes(s)&&!o&&(t.sliders="h"),r.interaction||(r.interaction={});const{preview:p,opacity:h,hue:l,palette:u}=r;r.opacity=!i&&h,r.palette=u||p||h||l,this._preBuild(),this._buildComponents(),this._bindEvents(),this._finalBuild(),c&&c.enabled&&this._loadRecentColors().slice().reverse().forEach(b=>this.addSwatch(b,!0)),e&&e.length&&e.forEach(b=>this.addSwatch(b));const{button:d,app:g}=this._root;this._nanopop=lt(d,g,{margin:n}),d.setAttribute("role","button"),d.setAttribute("aria-label",this._t("btn:toggle"));const m=this;this._setupAnimationFrame=requestAnimationFrame((function b(){if(!g.offsetWidth)return requestAnimationFrame(b);m.setColor(m._color?.toHSLA().toString()??t.default),m._rePositioningPicker(),t.defaultRepresentation&&(m._representation=t.defaultRepresentation,m.setColorRepresentation(m._representation)),t.showAlways&&m.show(),m._initializingActive=!1,m._emit("init")}))}static create=t=>new $(t);_preBuild(){const{options:t}=this;for(const e of["el","container"])t[e]=W(t[e]);this._root=kt(this),t.useAsButton&&(this._root.button=t.el),t.container.appendChild(this._root.root)}_finalBuild(){const t=this.options,e=this._root;if(t.container.removeChild(e.root),t.inline){const r=t.el.parentElement;t.el.nextSibling?r.insertBefore(e.app,t.el.nextSibling):r.appendChild(e.app)}else t.container.appendChild(e.app);t.useAsButton?t.inline&&t.el.remove():t.el.parentNode.replaceChild(e.root,t.el),t.disabled&&this.disable(),t.comparison||(e.button.style.transition="none",t.useAsButton||(e.preview.lastColor.style.transition="none")),this.hide()}_buildComponents(){const t=this,e=this.options.components,r=(t.options.sliders||"v").repeat(2),[s,o]=r.match(/^[vh]+$/g)?r:[],i=()=>this._color||(this._color=this._lastColor.clone()),n={palette:z({element:t._root.palette.picker,wrapper:t._root.palette.palette,onstop:()=>t._emit("changestop","slider",t),onchange(c,p){if(!e.palette)return;const h=i(),{_root:l,options:u}=t,{lastColor:d,currentColor:g}=l.preview;t._recalc&&(h.s=c*100,h.v=100-p*100,h.v<0&&(h.v=0),t._updateOutput("slider"));const m=h.toRGBA().toString(0);this.element.style.background=m,this.wrapper.style.background=`
                        linear-gradient(to top, rgba(0, 0, 0, ${h.a}), transparent),
                        linear-gradient(to left, hsla(${h.h}, 100%, 50%, ${h.a}), rgba(255, 255, 255, ${h.a}))
                    `,u.comparison?!u.useAsButton&&!t._lastColor&&d.style.setProperty("--pcr-color",m):(l.button.style.setProperty("--pcr-color",m),l.button.classList.remove("clear"));const b=h.toHEXA().toString();for(const{el:H,color:E}of t._swatchColors)H.classList[b===E.toHEXA().toString()?"add":"remove"]("pcr-active");g.style.setProperty("--pcr-color",m)}}),hue:z({lock:o==="v"?"h":"v",element:t._root.hue.picker,wrapper:t._root.hue.slider,onstop:()=>t._emit("changestop","slider",t),onchange(c){if(!e.hue||!e.palette)return;const p=i();t._recalc&&(p.h=c*360),this.element.style.backgroundColor=`hsl(${p.h}, 100%, 50%)`,n.palette.trigger()}}),opacity:z({lock:s==="v"?"h":"v",element:t._root.opacity.picker,wrapper:t._root.opacity.slider,onstop:()=>t._emit("changestop","slider",t),onchange(c){if(!e.opacity||!e.palette)return;const p=i();t._recalc&&(p.a=Math.round(c*100)/100),this.element.style.background=`rgba(0, 0, 0, ${p.a})`,n.palette.trigger()}}),selectable:xt({elements:t._root.interaction.options,className:"active",onchange(c){t._representation=c.target.getAttribute("data-type").toUpperCase(),t._recalc&&t._updateOutput("swatch"),t._updateToggleLabel()}})};this._components=n}_bindEvents(){const{_root:t,options:e}=this,r=[f(t.interaction.clear,"click",()=>{this._originalColor&&(this.setHSVA(...this._originalColor.toHSVA(),!0),this.applyColor()),e.showAlways||this.hide()}),f(t.preview.lastColor,"click",()=>{this.setHSVA(...(this._lastColor||this._color).toHSVA(),!0),this._initializingActive||(this._emit("change",this._color,"lastColor",this),this._emit("changestop","lastColor",this))}),f(t.interaction.cancel,"click",()=>{this._originalColor&&this.setHSVA(...this._originalColor.toHSVA(),!0),this._initializingActive||(this._emit("change",this._color,"cancel",this),this._emit("changestop","cancel",this)),this._emit("cancel"),e.showAlways||this.hide()}),f(t.interaction.save,"click",()=>{!this.applyColor()&&!e.showAlways&&this.hide()}),f(t.interaction.result,["keyup","input"],s=>{this.setColor(s.target.value,!0)&&!this._initializingActive&&(this._emit("change",this._color,"input",this),this._emit("changestop","input",this)),s.stopImmediatePropagation()}),f(t.interaction.result,["focus","blur"],s=>{this._recalc=s.type==="blur",this._recalc&&this._updateOutput(null)}),f(t.interaction.typeToggle,"click",()=>{const s=(this._representation||"").toUpperCase();this.setColorRepresentation(s.startsWith("HEX")?"RGBA":"HEXA")}),f(t.interaction.eyedropper,"click",async()=>{try{const s=await new EyeDropper().open();s&&s.sRGBHex&&(this.setColor(s.sRGBHex,!0),this.applyColor(!0))}catch{}}),f([t.palette.palette,t.palette.picker,t.hue.slider,t.hue.picker,t.opacity.slider,t.opacity.picker],["mousedown","touchstart"],()=>{this._root.interaction.result.blur(),this._recalc=!0},{passive:!0})];if(!e.showAlways){const s=e.closeWithKey;r.push(f(t.button,"click",()=>this.isOpen()?this.hide():this.show()),f(document,"keyup",o=>this.isOpen()&&(o.key===s||o.code===s)&&this.hide()),f(document,["touchstart","mousedown"],o=>{this.isOpen()&&!K(o).some(i=>i===t.app||i===t.button)&&this.hide()},{capture:!0}))}if(e.adjustableNumbers){const s={rgba:[255,255,255,1],hsva:[360,100,100,1],hsla:[360,100,100,1],cmyk:[100,100,100,100]};Y(t.interaction.result,(o,i,n)=>{const c=s[this.getColorRepresentation().toLowerCase()];if(c){const p=c[n],h=o+(p>=100?i*1e3:i);return h<=0?0:Number((h<p?h:p).toPrecision(3))}return o})}if((e.autoReposition||e.closeOnScroll)&&!e.inline){let s=null;const o=this;r.push(f(window,["scroll","resize"],()=>{o.isOpen()&&(e.closeOnScroll&&o.hide(),s===null?(s=setTimeout(()=>s=null,100),requestAnimationFrame(function i(){o._rePositioningPicker(),s!==null&&requestAnimationFrame(i)})):(clearTimeout(s),s=setTimeout(()=>s=null,100)))},{capture:!0}))}this._eventBindings=r}_rePositioningPicker(){const{options:t}=this;if(!t.inline&&!this._nanopop.update({container:document.body.getBoundingClientRect(),position:t.position})){const e=this._root.app,r=e.getBoundingClientRect();e.style.top=`${(window.innerHeight-r.height)/2}px`,e.style.left=`${(window.innerWidth-r.width)/2}px`}}_updateOutput(t){const{_root:e,_color:r,options:s}=this;if(e.interaction.type()){const o=`to${e.interaction.type().getAttribute("data-type")}`;e.interaction.result.value=typeof r[o]=="function"?r[o]().toString(s.outputPrecision):""}!this._initializingActive&&this._recalc&&this._emit("change",r,t,this)}_updateToggleLabel(){const t=this._root&&this._root.interaction.typeToggle;t&&(t.value=(this._representation||"").toUpperCase().startsWith("HEX")?"RGB":"HEX")}_clearColor(t=!1){const{_root:e,options:r}=this;r.useAsButton||e.button.style.setProperty("--pcr-color","rgba(0, 0, 0, 0.15)"),e.button.classList.add("clear"),r.showAlways||this.hide(),this._lastColor=null,!this._initializingActive&&!t&&(this._emit("save",null),this._emit("clear"))}_parseLocalColor(t){const{values:e,type:r,a:s}=_t(t),{lockOpacity:o}=this.options,i=s!==void 0&&s!==1;return e&&e.length===3&&(e[3]=void 0),{values:!e||o&&i?null:e,type:r}}_t(t){return this.options.i18n[t]||$.I18N_DEFAULTS[t]}_emit(t,...e){this._eventListener[t].forEach(r=>r(...e,this))}on(t,e){return this._eventListener[t].push(e),this}off(t,e){const r=this._eventListener[t]||[],s=r.indexOf(e);return~s&&r.splice(s,1),this}addSwatch(t,e=!1){const{values:r}=this._parseLocalColor(t);if(r){const{_swatchColors:s,_root:o}=this,i=k(...r),n=M(`<button type="button" class="${e?"pcr-recent":""}" style="--pcr-color: ${i.toRGBA().toString(0)}" aria-label="${this._t("btn:swatch")}"/>`);return e?(o.swatches.insertBefore(n,o.swatches.firstChild),s.unshift({el:n,color:i}),this._recentCount++):(o.swatches.appendChild(n),s.push({el:n,color:i})),this._eventBindings.push(f(n,"click",()=>{this.setHSVA(...i.toHSVA(),!0),this._emit("swatchselect",i),this._emit("change",i,"swatch",this)})),!0}return!1}_loadRecentColors(){const{key:t,max:e}=this.options.recentColors||{};try{const r=localStorage.getItem(t),s=r?JSON.parse(r):[];return Array.isArray(s)?s.slice(0,e):[]}catch{return[]}}_saveRecentColor(t){const{key:e,max:r}=this.options.recentColors||{};let s=this._loadRecentColors().filter(o=>o.toLowerCase()!==t.toLowerCase());s.unshift(t),s=s.slice(0,r);try{localStorage.setItem(e,JSON.stringify(s))}catch{}return s}_refreshRecentSwatches(t){for(let e=0;e<this._recentCount;e++){const r=this._swatchColors.shift();r&&this._root.swatches.removeChild(r.el)}this._recentCount=0,this._saveRecentColor(t).slice().reverse().forEach(e=>this.addSwatch(e,!0))}removeSwatch(t){const e=this._swatchColors[t];if(e){const{el:r}=e;return this._root.swatches.removeChild(r),this._swatchColors.splice(t,1),t<this._recentCount&&this._recentCount--,!0}return!1}applyColor(t=!1){const{preview:e,button:r}=this._root,s=this._color.toRGBA().toString(0);return e.lastColor.style.setProperty("--pcr-color",s),this.options.useAsButton||r.style.setProperty("--pcr-color",s),r.classList.remove("clear"),this._lastColor=this._color.clone(),!this._initializingActive&&this.options.recentColors&&this.options.recentColors.enabled&&this._refreshRecentSwatches(this._color.toHEXA().toString()),!this._initializingActive&&!t&&this._emit("save",this._color),this}destroy(){cancelAnimationFrame(this._setupAnimationFrame),this._eventBindings.forEach(t=>v(...t)),this._components&&Object.keys(this._components).forEach(t=>this._components[t].destroy())}destroyAndRemove(){this.destroy();const{root:t,app:e}=this._root;t.parentElement&&t.parentElement.removeChild(t),e.parentElement.removeChild(e),Object.keys(this).forEach(r=>this[r]=null)}hide(){return this.isOpen()?(this._root.app.classList.remove("visible"),this._emit("hide"),!0):!1}show(){return!this.options.disabled&&!this.isOpen()?(this._originalColor=this._color.clone(),this._root.app.classList.add("visible"),this._rePositioningPicker(),this._emit("show",this._color),this):!1}isOpen(){return this._root.app.classList.contains("visible")}setHSVA(t=360,e=0,r=0,s=1,o=!1){const i=this._recalc;if(this._recalc=!1,t<0||t>360||e<0||e>100||r<0||r>100||s<0||s>1)return!1;if(this._color=k(t,e,r,s),this._components){const{hue:n,opacity:c,palette:p}=this._components;n.update(t/360),c.update(s),p.update(e/100,1-r/100)}return o||this.applyColor(),i&&this._updateOutput(),this._recalc=i,!0}setColor(t,e=!1){if(t===null)return this._clearColor(e),!0;const{values:r,type:s}=this._parseLocalColor(t);if(r){const o=s.toUpperCase(),{options:i}=this._root.interaction,n=i.find(c=>c.getAttribute("data-type")===o);if(n&&!n.hidden)for(const c of i)c.classList[c===n?"add":"remove"]("active");return this.setHSVA(...r,e)?this.setColorRepresentation(o):!1}return!1}setColorRepresentation(t){return t=t.toUpperCase(),!!this._root.interaction.options.find(e=>e.getAttribute("data-type").startsWith(t)&&!e.click())}getColorRepresentation(){return this._representation}getColor(){return this._color}getSelectedColor(){return this._lastColor}getRoot(){return this._root}disable(){return this.hide(),this.options.disabled=!0,this._root.button.classList.add("disabled"),this}enable(){return this.options.disabled=!1,this._root.button.classList.remove("disabled"),this}};export{St as default};
