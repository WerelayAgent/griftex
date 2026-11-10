import{CHAIN_NAME,EVM_CHAIN_ID}from"./identity.js";export const WALLET_CATALOGUE=[{rdns:"app.phantom",name:"Phantom",mark:"P",install:"https://phantom.com/download",deep:url=>"https://phantom.app/ul/browse/"+encodeURIComponent(url)+"?ref="+encodeURIComponent(location.origin)},{rdns:"com.solflare",name:"Solflare",mark:"S",install:"https://solflare.com/download",deep:url=>"https://solflare.com/ul/v1/browse/"+encodeURIComponent(url)+"?ref="+encodeURIComponent(location.origin)},{rdns:"app.backpack",name:"Backpack",mark:"B",install:"https://backpack.app/download"}];const byRdns=r=>WALLET_CATALOGUE.find(c=>c.rdns===r)||null;const byName=n=>WALLET_CATALOGUE.find(c=>c.name.toLowerCase()===String(n||"").toLowerCase())||null;export function onPhone(){try{if(window.matchMedia&&window.matchMedia("(hover: none) and (pointer: coarse)").matches)return true}catch{}return window.innerWidth<=560}let el=null;let resolvePick=null;let lastFocus=null;let opts={};let chosen=null;const h=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};const STYLE_ID="wm-style";function ensureStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement("style");s.id=STYLE_ID;s.textContent=`
.wm-scrim { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center;
  padding: 20px; background: rgba(6,7,9,.86); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
.wm-card { width: min(100%, 392px); max-height: calc(100vh - 40px); overflow: auto; box-sizing: border-box;
  display: flex; flex-direction: column; gap: 12px; padding: 20px;
  background: var(--gr-void, #0a0b0d); color: var(--gr-ink, #ede6d6);
  border: 1px solid var(--gr-line-2, #2c261c); border-left: 2px solid var(--gr-accent, #e0a44a); border-radius: 3px; }
.wm-head { display: flex; align-items: baseline; gap: 8px; }
.wm-h { flex: 1; font-family: var(--gr-display, inherit); font-size: 13px; letter-spacing: .2em; text-transform: uppercase; }
.wm-x { background: none; border: 0; color: var(--gr-ink-3, #8a8272); font: inherit; font-size: 17px; line-height: 1;
  padding: 0 2px; cursor: pointer; }
.wm-x:hover { color: var(--gr-ink, #ede6d6); }
.wm-sub { font-size: 11.5px; line-height: 1.55; color: var(--gr-ink-2, #b9b1a0); margin: -4px 0 0; }
.wm-rows { display: flex; flex-direction: column; gap: 6px; }
.wm-row { display: flex; align-items: center; gap: 11px; width: 100%; box-sizing: border-box; text-align: left;
  padding: 11px 12px; border-radius: 3px; cursor: pointer; text-decoration: none;
  background: rgba(255,255,255,.035); border: 1px solid var(--gr-line-2, #2c261c); color: var(--gr-ink, #ede6d6);
  font: inherit; transition: border-color .15s ease, background .15s ease, transform .07s ease-out; }
.wm-row:hover { border-color: var(--gr-ink-2, #b9b1a0); background: rgba(255,255,255,.07); }
.wm-row.pressed { transform: translateY(1px) scale(.994); }
.wm-row.is-off { opacity: .74; }
.wm-ico { width: 26px; height: 26px; flex: none; border-radius: 5px; object-fit: cover; background: rgba(255,255,255,.06); }
.wm-mark { width: 26px; height: 26px; flex: none; border-radius: 5px; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.06); font-family: var(--gr-display, inherit); font-size: 12px; color: var(--gr-ink-2, #b9b1a0); }
.wm-nm { flex: 1; font-size: 12.5px; letter-spacing: .02em; }
.wm-tag { font-family: var(--gr-data, ui-monospace, monospace); font-size: 9.5px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--gr-ink-3, #8a8272); }
.wm-row.is-on .wm-tag { color: var(--gr-accent, #e0a44a); }
.wm-status { display: flex; align-items: center; gap: 10px; padding: 13px 12px; border-radius: 3px;
  background: rgba(255,255,255,.035); border: 1px solid var(--gr-line-2, #2c261c); }
.wm-spin { width: 14px; height: 14px; flex: none; border: 2px solid currentColor; border-top-color: transparent;
  border-radius: 50%; animation: wm-spin .7s linear infinite; }
@keyframes wm-spin { to { transform: rotate(360deg); } }
.wm-st { font-size: 12px; line-height: 1.5; }
.wm-st b { display: block; font-family: var(--gr-display, inherit); font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; font-weight: 400; }
.wm-st span { color: var(--gr-ink-3, #8a8272); font-size: 11px; }
.wm-bad .wm-st b { color: var(--gr-warn, #e08a5a); }
.wm-acts { display: flex; gap: 8px; }
.wm-btn { flex: 1; box-sizing: border-box; padding: 12px 14px; border-radius: 3px; cursor: pointer; font: inherit;
  font-family: var(--gr-display, inherit); font-size: 11.5px; letter-spacing: .13em; text-transform: uppercase;
  transition: background .15s ease, border-color .15s ease, transform .07s ease-out; }
.wm-btn.pressed { transform: translateY(1px) scale(.994); }
.wm-pri { background: var(--gr-ink, #ede6d6); color: var(--gr-void, #0a0b0d); border: 1px solid var(--gr-ink, #ede6d6); }
.wm-pri:hover { background: #fff; border-color: #fff; }
.wm-sec { background: transparent; color: var(--gr-ink, #ede6d6); border: 1px solid var(--gr-line-2, #2c261c); }
.wm-sec:hover { border-color: var(--gr-ink-2, #b9b1a0); }
.wm-chain { font-family: var(--gr-data, ui-monospace, monospace); font-size: 9.5px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--gr-ink-3, #8a8272); }
@media (prefers-reduced-motion: reduce) {
  .wm-spin { animation: none; border-top-color: currentColor; opacity: .55; }
  .wm-row.pressed, .wm-btn.pressed { transform: none; }
}
@media (max-width: 420px) {
  .wm-scrim { padding: 12px; align-items: flex-end; }
  .wm-card { width: 100%; max-height: calc(100vh - 24px); padding: 16px; }
}`;document.head.appendChild(s)}const chainLine=()=>`${CHAIN_NAME} · MAINNET`;const PROMISE="One signature proves the wallet is yours. No transaction is sent, nothing moves, and nothing is spent.";function body(){return el&&el.querySelector(".wm-card")}function shell(title,mode){ensureStyle();if(!el){el=h("div","wm-scrim");el.appendChild(h("div","wm-card"));el.addEventListener("mousedown",ev=>{if(ev.target===el)close(null)});document.addEventListener("keydown",onKey,true);lastFocus=document.activeElement;document.body.appendChild(el)}el.setAttribute("data-wm-mode",mode||"status");const card=body();card.textContent="";const head=h("div","wm-head");head.appendChild(h("div","wm-h",title));const x=h("button","wm-x","×");x.type="button";x.setAttribute("aria-label","Close");x.addEventListener("click",()=>close(null));head.appendChild(x);card.appendChild(head);return card}function onKey(ev){if(ev.key==="Escape"&&el){ev.stopPropagation();close(null)}}function close(value){if(!el)return;document.removeEventListener("keydown",onKey,true);el.remove();el=null;chosen=null;const r=resolvePick;resolvePick=null;if(r)r(value);try{if(lastFocus&&lastFocus.focus)lastFocus.focus()}catch{}lastFocus=null;if(!value&&typeof opts.onCancel==="function")opts.onCancel()}function rowsFor(wallets){const rows=document.createElement("div");rows.className="wm-rows";const seen=new Set;wallets.forEach((w,i)=>{const cat=byRdns(w.rdns)||byName(w.name);if(cat)seen.add(cat.rdns);const b=h("button","wm-row is-on");b.type="button";if(w.icon){const img=h("img","wm-ico");img.src=w.icon;img.alt="";img.addEventListener("error",()=>{img.replaceWith(markFor(cat,w.name))});b.appendChild(img)}else b.appendChild(markFor(cat,w.name));b.appendChild(h("div","wm-nm",w.name));b.appendChild(h("div","wm-tag","Installed"));b.addEventListener("click",()=>pick(w));rows.appendChild(b);if(i===0)setTimeout(()=>{try{b.focus()}catch{}},0)});const url=location.href;WALLET_CATALOGUE.forEach(c=>{if(seen.has(c.rdns))return;const phone=onPhone();const href=phone&&c.deep?c.deep(url):c.install;const a=h("a","wm-row is-off");a.href=href;a.target="_blank";a.rel="noopener noreferrer";a.appendChild(markFor(c,c.name));a.appendChild(h("div","wm-nm",c.name));a.appendChild(h("div","wm-tag",phone&&c.deep?"Open in app":"Install"));rows.appendChild(a)});return rows}function markFor(cat,name){return h("div","wm-mark",cat&&cat.mark||String(name||"?").trim().charAt(0).toUpperCase()||"?")}function pick(w){chosen=w;const r=resolvePick;resolvePick=null;waiting(w.name);if(r)r(w)}export function chooseWallet(wallets,options={}){opts=options||{};return new Promise(resolve=>{resolvePick=resolve;const card=shell("Which wallet","choose");card.appendChild(h("p","wm-sub",PROMISE));card.appendChild(rowsFor(wallets||[]));card.appendChild(h("div","wm-chain",chainLine()))})}export function offerWallets(options={}){opts=options||{};return new Promise(resolve=>{resolvePick=resolve;const card=shell("You will need a wallet","install");card.appendChild(h("p","wm-sub",`GRIFTEX signs you in with a wallet instead of an account. ${PROMISE}`));card.appendChild(rowsFor([]));card.appendChild(h("div","wm-chain",chainLine()))})}function statusScreen(title,kind,head,detail,actions){const card=shell(title,"status");const box=h("div","wm-status"+(kind==="bad"?" wm-bad":""));if(kind==="wait")box.appendChild(h("div","wm-spin"));const st=h("div","wm-st");st.appendChild(h("b",null,head));if(detail)st.appendChild(h("span",null,detail));box.appendChild(st);card.appendChild(box);if(actions&&actions.length){const acts=h("div","wm-acts");actions.forEach(a=>{const b=h("button","wm-btn "+(a.primary?"wm-pri":"wm-sec"),a.label);b.type="button";b.addEventListener("click",a.onClick);acts.appendChild(b)});card.appendChild(acts)}card.appendChild(h("div","wm-chain",chainLine()));return card}export function waiting(name,options){if(options)opts=options;statusScreen("Connecting","wait","Waiting for your wallet…",name?`${name} should be asking you to sign. Nothing is sent.`:"Your wallet should be asking you to sign.",[{label:"Cancel",onClick:()=>close(null)}])}export function declined(){if(!el)return;statusScreen("Connecting","bad","Signature declined","Nothing happened, and nothing was sent. Press try again when you are ready.",retryActions())}export function noAnswer(){if(!el)return;statusScreen("Connecting","bad","Your wallet did not answer","The extension may be locked or asleep. Open it, then try again.",retryActions())}export function wrongChain(){if(!el)return;statusScreen("Wrong network","bad","Your wallet is on another network",`GRIFTEX reads one chain. Your wallet can switch to ${CHAIN_NAME} — or add it, if it has never seen it — and nothing about your funds or your other networks changes.`,[{label:"Switch network",primary:true,onClick:()=>{if(opts.onRetry){waiting(chosen&&chosen.name);opts.onRetry(chosen)}}},{label:"Cancel",onClick:()=>close(null)}])}export function failed(message){if(!el)return;statusScreen("Connecting","bad","That did not work",String(message||"").slice(0,140),retryActions())}function retryActions(){const acts=[{label:"Cancel",onClick:()=>close(null)}];if(opts.onRetry)acts.unshift({label:"Try again",primary:true,onClick:()=>{waiting(chosen&&chosen.name);opts.onRetry(chosen)}});return acts}export function done(){close(true)}export function isOpen(){return!!el}export function picked(){return chosen}
