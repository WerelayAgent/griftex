import{sfxCardSlide,sfxChipClack,sfxWinChime}from"./sound.js";let cssDone=false;function injectCss(){if(cssDone)return;cssDone=true;const st=document.createElement("style");st.textContent=`
.cas-screen{position:fixed;inset:0;z-index:55;display:none;flex-direction:column;overflow:auto;
  color:#f3e9d2;text-align:center;-webkit-user-select:none;user-select:none;
  background:radial-gradient(ellipse at 50% 16%,rgba(255,190,110,.15),rgba(0,0,0,0) 55%),
    radial-gradient(ellipse at 50% 45%,#241812 0%,#0b0705 78%,#050302 100%)}
.cas-screen::after{content:'';position:fixed;inset:0;pointer-events:none;box-shadow:inset 0 0 22vmin rgba(0,0,0,.85)}
.cas-room{display:flex;flex-direction:column;align-items:center;margin:auto;padding:20px 10px 16px;max-width:100vw}
.cas-tilt{perspective:1100px}
.cas-rail{position:relative;border-radius:30px;padding:16px;transform:rotateX(4.5deg);transform-origin:50% 100%;
  background:repeating-linear-gradient(93deg,rgba(0,0,0,.13) 0 2px,rgba(0,0,0,0) 2px 11px),
    linear-gradient(180deg,#7a4a26,#5d3418 45%,#42230e);
  box-shadow:0 22px 44px rgba(0,0,0,.65),inset 0 2px 2px rgba(255,220,160,.35),inset 0 -3px 6px rgba(0,0,0,.5)}
.cas-felt{position:relative;border-radius:18px;padding:16px 16px 12px;min-width:min(560px,88vw);
  background:radial-gradient(ellipse at 50% 26%,var(--felt-lite),var(--felt) 55%,var(--felt-dark) 100%);
  box-shadow:inset 0 4px 18px rgba(0,0,0,.55),inset 0 0 60px rgba(0,0,0,.25);
  border:2px solid rgba(0,0,0,.35);outline:1px dashed rgba(232,192,99,.26);outline-offset:-7px}
.cas-plaque{position:absolute;top:-13px;left:50%;transform:translateX(-50%);z-index:2;
  padding:5px 20px 4px;border-radius:8px;white-space:nowrap;
  background:linear-gradient(180deg,#f7e3a4,#d0a844 45%,#96702a);
  color:#3a2606;font:400 19px/1.15 'Anton',Arial,sans-serif;letter-spacing:3px;
  box-shadow:0 3px 8px rgba(0,0,0,.55),inset 0 1px 1px rgba(255,255,255,.5),inset 0 -2px 3px rgba(0,0,0,.4);
  text-shadow:0 1px 0 rgba(255,255,255,.45)}
.cas-settle{margin:10px 0 0;font:700 10px ui-monospace,Menlo,Consolas,monospace;letter-spacing:.24em;color:#a8917a;text-transform:uppercase}
.cas-settle b{color:#ffd76a;font-weight:700}
.cas-zone{display:flex;align-items:center;justify-content:center;gap:9px;height:26px}
.cas-cards{min-height:92px;display:flex;justify-content:center;align-items:center;flex-wrap:wrap}
.cas-cards.mini{min-height:48px}
.cas-msg{font:800 15px Arial;color:#ffd76a;min-height:20px;margin:6px 0 2px;text-shadow:0 1px 3px rgba(0,0,0,.7)}
.cas-total{display:inline-block;min-width:30px;padding:2px 8px;border-radius:6px;
  background:linear-gradient(180deg,#f7e3a4,#cfa544 50%,#8a6a1e);color:#2e1e04;font:800 13px Arial;
  box-shadow:inset 0 1px 1px rgba(255,255,255,.5),inset 0 -1px 2px rgba(0,0,0,.45),0 1px 3px rgba(0,0,0,.5)}
.cas-spot{position:relative;width:64px;height:64px;margin:2px auto;border-radius:50%;
  border:2px dashed rgba(255,245,220,.32);display:flex;align-items:center;justify-content:center}
.cas-spot .lbl{font:700 9px Arial;color:rgba(255,245,220,.38);letter-spacing:2px}
.cas-tray{display:inline-flex;align-items:center;gap:9px;padding:6px 16px 6px 10px;border-radius:12px;
  background:linear-gradient(180deg,#241813,#120a07);border:1px solid #5a3c1e;
  box-shadow:inset 0 2px 6px rgba(0,0,0,.75),0 2px 6px rgba(0,0,0,.5)}
.cas-tray .stack{position:relative;width:27px;height:30px}
.cas-tray .lbl{font:700 9px Arial;color:#a8917a;letter-spacing:2px}
.cas-tray .amt{font:400 20px 'Anton',Arial;color:#ffd76a;letter-spacing:1px;text-shadow:0 0 10px rgba(255,180,60,.35)}
.cas-chip{position:relative;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;
  font-family:Arial;font-weight:800;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.65);
  box-shadow:0 3px 5px rgba(0,0,0,.5),inset 0 2px 3px rgba(255,255,255,.3),inset 0 -3px 4px rgba(0,0,0,.35)}
.cas-chip::after{content:'';position:absolute;inset:13%;border-radius:50%;border:1.5px dashed rgba(255,255,255,.5)}
.cas-chipbtn{border:none;cursor:pointer;transition:transform .1s,box-shadow .15s;padding:0}
.cas-chipbtn:hover{transform:translateY(-3px)}
.cas-chipbtn:active{transform:scale(.94)}
.cas-chipbtn.sel{box-shadow:0 0 0 3px #ffd76a,0 3px 5px rgba(0,0,0,.5)}
.cas-chipcol{display:inline-flex;flex-direction:column;align-items:center;gap:4px}
.cas-chipcol .lbl{font:700 9px Arial;color:#8d7b64;letter-spacing:2px}
.cas-actions{display:flex;gap:12px;justify-content:center;align-items:flex-start;flex-wrap:wrap;margin-top:16px;min-height:0}
.cas-nav{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:11px}
.cas-sub{font:700 10px Arial;color:#8d7b64;letter-spacing:1px;margin-top:9px}
.cas-btn{font:800 14px Arial;letter-spacing:1.5px;color:#f3e9d2;border:1.5px solid rgba(232,192,99,.55);
  border-radius:10px;padding:11px 18px;cursor:pointer;
  background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(0,0,0,.18)),var(--felt,#175c38);
  box-shadow:0 3px 7px rgba(0,0,0,.45),inset 0 1px 1px rgba(255,255,255,.18);
  text-shadow:0 1px 2px rgba(0,0,0,.6);transition:transform .08s,filter .12s}
.cas-btn:hover{filter:brightness(1.18)}
.cas-btn:active{transform:translateY(1px) scale(.97)}
.cas-btn.gold{color:#2e1e04;border-color:#8a6a1e;text-shadow:0 1px 0 rgba(255,255,255,.45);
  background:linear-gradient(180deg,#f7e3a4,#d8b04a 55%,#a87e2a)}
.cas-btn.nav{font-size:12px;padding:8px 12px;opacity:.94}
.cas-btn.leave{color:#c9b295;border-color:rgba(201,178,149,.35);
  background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(0,0,0,.22)),#241813}
.cas-card{display:inline-block;position:relative;margin:3px;perspective:700px;vertical-align:top;
  border-radius:9%;transition:transform .15s}
.cas-card .inner{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;
  transition:transform .45s cubic-bezier(.4,1.4,.6,1)}
.cas-card.facedown .inner{transform:rotateY(180deg)}
.cas-card canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:9%;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:0 3px 6px rgba(0,0,0,.45)}
.cas-card canvas.back{transform:rotateY(180deg)}
.cas-card.cas-held{box-shadow:0 0 0 3px #ffd76a,0 6px 10px rgba(0,0,0,.5);transform:translateY(-8px)}
.cas-deal{animation:casDeal .32s cubic-bezier(.2,.9,.3,1) backwards}
@keyframes casDeal{from{transform:translate(70px,-90px) rotate(9deg);opacity:0}}
.cas-banner{position:absolute;left:50%;top:40%;z-index:6;pointer-events:none;transform:translate(-50%,-50%);
  font:400 46px 'Anton',Arial;letter-spacing:4px;white-space:nowrap}
.cas-banner.win{color:#ffd76a;background:linear-gradient(100deg,#8a6a1e 15%,#fff3c0 38%,#ffd76a 50%,#fff3c0 62%,#8a6a1e 85%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;background-size:220% 100%;
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.7)) drop-shadow(0 0 18px rgba(255,190,60,.5));
  animation:casBannerPop .22s cubic-bezier(.2,1.6,.4,1),casShimmer .75s linear .1s}
.cas-banner.big{font-size:58px}
.cas-banner.stamp{font-size:36px;color:#ff5540;border:4px solid #ff5540;border-radius:10px;padding:2px 18px;
  background:rgba(30,4,2,.3);transform:translate(-50%,-50%) rotate(-7deg);
  text-shadow:0 0 12px rgba(255,60,40,.45);box-shadow:inset 0 0 14px rgba(255,60,40,.25);
  animation:casStamp .3s cubic-bezier(.3,1.8,.4,1)}
.cas-banner.mut{color:#e8dcc2;font-size:32px;animation:casBannerPop .25s ease-out}
.cas-banner.out{opacity:0;transition:opacity .25s}
@keyframes casBannerPop{from{transform:translate(-50%,-50%) scale(.4);opacity:0}}
@keyframes casStamp{from{transform:translate(-50%,-50%) rotate(-7deg) scale(2.2);opacity:0}}
@keyframes casShimmer{from{background-position:200% 0}to{background-position:-60% 0}}
.cas-bulbs{display:flex;gap:7px;justify-content:center;margin:2px 0 10px}
.cas-bulb{width:6px;height:6px;border-radius:50%;background:#ffd76a;box-shadow:0 0 6px #ffb63a;
  animation:casBulb 1s steps(2) infinite}
.cas-bulb:nth-child(2n){animation-delay:.5s}
@keyframes casBulb{50%{background:#6a4a1a;box-shadow:none}}
.cas-reelbox{display:inline-flex;gap:9px;justify-content:center;position:relative;padding:14px 16px;border-radius:12px;
  background:linear-gradient(180deg,#181510,#0c0a07);
  box-shadow:inset 0 3px 10px rgba(0,0,0,.85),inset 0 0 0 2px #3a2c18,0 4px 8px rgba(0,0,0,.4)}
.cas-reelbox::after{content:'';position:absolute;inset:0;border-radius:12px;pointer-events:none;
  background:linear-gradient(115deg,rgba(255,255,255,.13) 0 20%,rgba(255,255,255,0) 23%)}
.cas-reel{width:72px;height:88px;border-radius:7px;font-size:44px;line-height:88px;color:#111;
  background:linear-gradient(180deg,#b8b4a8 0%,#fdfbf4 26% 74%,#a8a498 100%);
  box-shadow:inset 0 0 6px rgba(0,0,0,.45)}
.cas-reel.spin{filter:blur(.7px);animation:casReelJig .12s linear infinite}
.cas-reel.stop{animation:casReelStop .28s cubic-bezier(.2,2.2,.4,1)}
@keyframes casReelJig{25%{transform:translateY(2.5px)}75%{transform:translateY(-2.5px)}}
@keyframes casReelStop{from{transform:translateY(-9px)}}
.cas-payline{position:absolute;left:7px;right:7px;top:50%;height:2px;pointer-events:none;
  background:linear-gradient(90deg,transparent,#ff5540 10% 90%,transparent);box-shadow:0 0 6px rgba(255,85,64,.7)}
.cas-payline::before,.cas-payline::after{content:'';position:absolute;top:-5px;border:6px solid transparent}
.cas-payline::before{left:-8px;border-left:8px solid #e8c063}
.cas-payline::after{right:-8px;border-right:8px solid #e8c063}
.cas-wheelwrap{position:relative;width:190px;height:190px;margin:4px auto 2px}
.cas-wheelwrap canvas{position:absolute;inset:0;width:100%;height:100%}
.cas-wheelptr{position:absolute;left:50%;top:-5px;transform:translateX(-50%);width:0;height:0;z-index:3;
  border:8px solid transparent;border-top:13px solid #e8c063;filter:drop-shadow(0 2px 2px rgba(0,0,0,.6))}
.cas-hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;height:64px;z-index:2;
  border-radius:50%;border:3px solid #e8c063;background:#20242e;color:#fff;font:400 26px/58px 'Anton',Arial;
  box-shadow:0 0 14px rgba(0,0,0,.7),inset 0 2px 6px rgba(0,0,0,.6);transition:background .15s}
.cas-rlgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:440px;margin:10px auto 4px}
.cas-rlcell{position:relative;font:800 13px Arial;letter-spacing:1px;color:#f3e9d2;padding:12px 4px;
  border:1.5px solid rgba(232,192,99,.5);border-radius:8px;background:rgba(0,0,0,.15);cursor:pointer;
  text-shadow:0 1px 2px rgba(0,0,0,.6);transition:filter .1s,transform .08s}
.cas-rlcell:hover{filter:brightness(1.3)}
.cas-rlcell:active{transform:scale(.96)}
.cas-rlcell.red{background:linear-gradient(180deg,#c0392b,#8e2418)}
.cas-rlcell.blackc{background:linear-gradient(180deg,#20242e,#101218)}
.cas-rlcell.lucky{background:linear-gradient(180deg,#1f7a43,#135229)}
.pk-row{display:flex;align-items:center;justify-content:center;margin:1px 0}
.pk-name{font:700 11px Arial;color:rgba(255,245,220,.5);letter-spacing:2px;width:66px;text-align:right;margin-right:7px}
.pk-handname{font:700 11px Arial;color:#ffd76a;margin-left:7px;min-width:78px;text-align:left}
@media (max-width:600px){
  .cas-rail{padding:11px;border-radius:22px}
  .cas-felt{padding:11px 8px 8px;min-width:min(560px,92vw)}
  .cas-plaque{font-size:15px;letter-spacing:2px;padding:4px 14px 3px;top:-11px}
  .cas-banner{font-size:32px}.cas-banner.big{font-size:40px}.cas-banner.stamp{font-size:26px}.cas-banner.mut{font-size:24px}
  .cas-btn{font-size:12px;padding:9px 12px}
  .cas-actions{gap:8px;margin-top:12px}
  .cas-cards{min-height:74px}
  .cas-tray .amt{font-size:17px}
  .cas-reel{width:56px;height:72px;font-size:34px;line-height:72px}
  .cas-wheelwrap{width:150px;height:150px}
  .cas-hub{width:52px;height:52px;font:400 20px/46px 'Anton',Arial}
  .cas-rlgrid{gap:5px}
  .cas-rlcell{padding:10px 2px;font-size:11px}
  .pk-name{width:44px;letter-spacing:1px}
  .pk-handname{min-width:56px;font-size:9px}
}`;document.head.appendChild(st)}export function makeScreen({id,title,felt,feltLite,feltDark,sub}){injectCss();const screen=document.createElement("div");screen.id=id;screen.className="cas-screen";screen.style.setProperty("--felt",felt);screen.style.setProperty("--felt-lite",feltLite);screen.style.setProperty("--felt-dark",feltDark);const room=document.createElement("div");room.className="cas-room";const tilt=document.createElement("div");tilt.className="cas-tilt";const rail=document.createElement("div");rail.className="cas-rail";const plaque=document.createElement("div");plaque.className="cas-plaque";plaque.textContent=title;const feltEl=document.createElement("div");feltEl.className="cas-felt";rail.append(plaque,feltEl);tilt.appendChild(rail);const settle=document.createElement("div");settle.className="cas-settle";settle.innerHTML="SETTLEMENT · <b>LOCAL</b> — onchain settlement · coming soon";const actions=document.createElement("div");actions.className="cas-actions";const nav=document.createElement("div");nav.className="cas-nav";room.append(tilt,settle,actions,nav);if(sub){const s=document.createElement("div");s.className="cas-sub";s.textContent=sub;room.appendChild(s)}screen.appendChild(room);document.body.appendChild(screen);return{screen,felt:feltEl,actions,nav}}export function casBtn(label,cls=""){const b=document.createElement("button");b.className="cas-btn"+(cls?" "+cls:"");b.textContent=label;return b}let arcN=0;export function arcLabel(text,w=130,flip=false){const h=30,mid=w/2;const d=flip?`M 4 8 Q ${mid} 36 ${w-4} 8`:`M 4 26 Q ${mid} -6 ${w-4} 26`;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("width",w);s.setAttribute("height",h);s.style.overflow="visible";const id="casarc"+arcN++;s.innerHTML=`<path id="${id}" d="${d}" fill="none"/><text style="font:700 12px Arial;letter-spacing:5px;fill:rgba(255,245,220,.42)"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`;return s}const CHIP_COLORS={50:["#3f89c9","#5da4e0"],100:["#c94b3a","#e0654f"],200:["#d07a2e","#e39448"],250:["#2f9e5b","#46bb74"],500:["#7a4bc9","#9468de"],1e3:["#caa93a","#e4c455"],2e3:["#c93a86","#e055a2"]};function styleChip(c,v,size){const[base,lite]=CHIP_COLORS[v]||["#8b95a6","#a6b0c0"];c.className=(c.className?c.className+" ":"")+"cas-chip";c.style.width=c.style.height=size+"px";c.style.fontSize=Math.max(8,size*.28)+"px";c.style.background=`radial-gradient(circle at 50% 44%, ${lite} 0 53%, rgba(0,0,0,0) 54%),repeating-conic-gradient(#f3ead6 0 15deg, ${base} 15deg 60deg)`;c.style.backgroundColor=base;c.textContent=v>=1e3?v/1e3+"K":v;return c}export function chipNode(v,size=46){return styleChip(document.createElement("span"),v,size)}export function betChip(v,onPick,size=48){const b=styleChip(document.createElement("button"),v,size);b.classList.add("cas-chipbtn");b.onclick=()=>{sfxChipClack();onPick(v,b)};return b}export function chipCol(v,caption,onPick,size=48){const w=document.createElement("span");w.className="cas-chipcol";w.appendChild(betChip(v,onPick,size));const l=document.createElement("span");l.className="lbl";l.textContent=caption;w.appendChild(l);return w}export function flyChip(fromEl,toEl,amount,{n=1,size=34}={}){if(!fromEl||!toEl)return;const f=fromEl.getBoundingClientRect(),t=toEl.getBoundingClientRect();const dx=t.left+t.width/2-(f.left+f.width/2);const dy=t.top+t.height/2-(f.top+f.height/2);for(let k=0;k<n;k++){const c=chipNode(amount,size);c.style.cssText+=`position:fixed;left:${f.left+f.width/2-size/2}px;top:${f.top+f.height/2-size/2}px;z-index:70;pointer-events:none;transition:transform .38s cubic-bezier(.3,.9,.4,1),opacity .38s;`;document.body.appendChild(c);setTimeout(()=>{c.style.transform=`translate(${dx}px,${dy}px) scale(.82)`;c.style.opacity="0.92"},20+k*70);setTimeout(()=>c.remove(),480+k*70)}sfxChipClack();setTimeout(sfxChipClack,380)}export function trayNode(id,label="BANK"){const w=document.createElement("div");w.className="cas-tray";const stack=document.createElement("span");stack.className="stack";[1e3,500,100].forEach((v,i)=>{const c=chipNode(v,19);c.style.cssText+=`position:absolute;left:${i*2}px;top:${10-i*5}px;font-size:0;`;c.textContent="";stack.appendChild(c)});const col=document.createElement("span");col.style.cssText="display:flex;flex-direction:column;align-items:flex-start;line-height:1.1";col.innerHTML=`<span class="lbl">${label}</span><span class="amt" id="${id}">$0</span>`;w.append(stack,col);return w}export function setBank(el,v){const cur=el._v??v;el._v=v;cancelAnimationFrame(el._raf);if(v>cur){const t0=performance.now();const dur=Math.min(900,250+(v-cur)/12);const step=t=>{const k=Math.min(1,(t-t0)/dur);const e=1-(1-k)*(1-k);el.textContent="$"+Math.round(cur+(v-cur)*e);if(k<1)el._raf=requestAnimationFrame(step)};el._raf=requestAnimationFrame(step)}else{el.textContent="$"+v}}export function flourish(host,kind,text){host.querySelector(".cas-banner")?.remove();const b=document.createElement("div");b.className="cas-banner "+(kind==="big"?"win big":kind);b.textContent=text;host.appendChild(b);if(kind==="win"||kind==="big")sfxWinChime();setTimeout(()=>b.classList.add("out"),700);setTimeout(()=>b.remove(),1e3)}function roundRect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}const PIPS={2:[[0,-1],[0,1]],3:[[0,-1],[0,0],[0,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]],7:[[-1,-1],[1,-1],[0,-.5],[-1,0],[1,0],[-1,1],[1,1]],8:[[-1,-1],[1,-1],[0,-.5],[-1,0],[1,0],[0,.5],[-1,1],[1,1]],9:[[-1,-1],[1,-1],[-1,-.33],[1,-.33],[0,0],[-1,.33],[1,.33],[-1,1],[1,1]],10:[[-1,-1],[1,-1],[0,-.66],[-1,-.33],[1,-.33],[-1,.33],[1,.33],[0,.66],[-1,1],[1,1]]};function drawCourt(g,W,H,rank,suit,col,red){const px=W*.16,py=H*.155;roundRect(g,px,py,W-2*px,H-2*py,W*.04);g.fillStyle="#f3ecd7";g.fill();g.strokeStyle="#c9a13b";g.lineWidth=W*.022;g.stroke();g.save();roundRect(g,px,py,W-2*px,H-2*py,W*.04);g.clip();g.translate(W/2,H/2);g.rotate(-.55);g.fillStyle=red?"rgba(200,56,42,.14)":"rgba(35,38,49,.12)";g.fillRect(-W,-H*.055,W*2,H*.11);g.restore();const cw=W*.3,cy=H*.33;g.beginPath();g.moveTo(W/2-cw/2,cy);g.lineTo(W/2-cw/2,cy-H*.05);g.lineTo(W/2-cw/4,cy-H*.02);g.lineTo(W/2,cy-H*.07);g.lineTo(W/2+cw/4,cy-H*.02);g.lineTo(W/2+cw/2,cy-H*.05);g.lineTo(W/2+cw/2,cy);g.closePath();g.fillStyle="#d4af37";g.fill();g.strokeStyle="#8a6a1e";g.lineWidth=1.5;g.stroke();if(rank==="Q"){g.fillStyle="#fbf8ef";for(const dx of[-cw/2,0,cw/2]){g.beginPath();g.arc(W/2+dx,cy-H*(dx?.05:.07),W*.018,0,7);g.fill()}}if(rank==="J"){g.strokeStyle=col;g.lineWidth=W*.02;g.beginPath();g.moveTo(W/2+cw*.62,cy+H*.02);g.quadraticCurveTo(W/2+cw*.85,cy-H*.09,W/2+cw*.55,cy-H*.13);g.stroke()}g.fillStyle=col;g.font=`400 ${W*.315}px 'Anton',Arial`;g.textAlign="center";g.textBaseline="middle";g.fillText(rank,W/2,H*.55);g.font=`${W*.16}px serif`;g.fillText(suit,W/2,H*.72)}function drawFace(g,W,H,rank,suit){const red=suit==="♥"||suit==="♦";const col=red?"#c8382a":"#232631";roundRect(g,1.5,1.5,W-3,H-3,W*.09);g.fillStyle="#fbf8ef";g.fill();g.strokeStyle="#cfc8b6";g.lineWidth=2;g.stroke();g.fillStyle=col;g.textAlign="center";g.textBaseline="middle";const rs=rank==="10"?W*.15:W*.185;for(let k=0;k<2;k++){g.save();if(k){g.translate(W,H);g.rotate(Math.PI)}g.font=`800 ${rs}px Arial`;g.fillText(rank,W*.14,H*.085);g.font=`${W*.16}px serif`;g.fillText(suit,W*.14,H*.085+W*.17);g.restore()}if(rank==="A"){g.font=`${W*.52}px serif`;g.fillText(suit,W/2,H*.53)}else if("JQK".includes(rank)){drawCourt(g,W,H,rank,suit,col,red)}else{g.font=`${W*.2}px serif`;for(const[x,y]of PIPS[+rank]||[]){g.fillText(suit,W/2+x*W*.2,H*.52+y*H*.26)}}}function drawBack(g,W,H){roundRect(g,1.5,1.5,W-3,H-3,W*.09);g.fillStyle="#5c1d44";g.fill();g.strokeStyle="#3a1029";g.lineWidth=2;g.stroke();roundRect(g,W*.075,W*.075,W-W*.15,H-W*.15,W*.05);g.strokeStyle="rgba(235,248,238,.75)";g.lineWidth=W*.018;g.setLineDash([W*.035,W*.03]);g.stroke();g.setLineDash([]);const cy=H*.45;g.fillStyle="rgba(30,8,22,.42)";const st=W*.115;for(let y=W*.17;y<H-W*.15;y+=st){for(let x=W*.17+Math.round(y/st)%2*st/2;x<W-W*.15;x+=st){if(Math.hypot(x-W/2,y-cy)<W*.34)continue;g.beginPath();g.moveTo(x,y-W*.022);g.lineTo(x+W*.022,y);g.lineTo(x,y+W*.022);g.lineTo(x-W*.022,y);g.closePath();g.fill()}}g.save();g.translate(W/2,cy);g.beginPath();g.arc(0,0,W*.27,0,7);g.fillStyle="#f4e9d2";g.fill();g.strokeStyle="#3a1029";g.lineWidth=W*.02;g.stroke();g.beginPath();g.arc(0,0,W*.185,0,7);g.fillStyle="#2f7a4a";g.fill();g.strokeStyle="#1e5232";g.lineWidth=W*.028;g.lineCap="round";for(let k=0;k<6;k++){const a=k*Math.PI/3+.4;g.beginPath();g.moveTo(Math.cos(a)*W*.165,Math.sin(a)*W*.165);g.quadraticCurveTo(Math.cos(a+.55)*W*.13,Math.sin(a+.55)*W*.13,Math.cos(a+.9)*W*.08,Math.sin(a+.9)*W*.08);g.stroke()}g.beginPath();g.arc(0,0,W*.07,0,7);g.fillStyle="#6b4a2b";g.fill();g.beginPath();g.arc(-W*.024,-W*.024,W*.018,0,7);g.fillStyle="#f7ead9";g.fill();g.restore();g.fillStyle="#f7ead9";g.textAlign="center";g.textBaseline="middle";g.font=`400 ${W*.1}px 'Anton',Arial`;g.fillText("P A L M",W/2,H*.8)}const faceCache=new Map;const backCache=new Map;export function faceCanvas(rank,suit,w){const key=w+rank+suit;let cv=faceCache.get(key);if(cv)return cv;cv=document.createElement("canvas");cv.width=w*2;cv.height=Math.round(w*1.42)*2;drawFace(cv.getContext("2d"),cv.width,cv.height,rank,suit);faceCache.set(key,cv);return cv}export function backCanvas(w){let cv=backCache.get(w);if(cv)return cv;cv=document.createElement("canvas");cv.width=w*2;cv.height=Math.round(w*1.42)*2;drawBack(cv.getContext("2d"),cv.width,cv.height);backCache.set(w,cv);return cv}export function cardNode(rank,suit,{w=58,facedown=false,deal=false,delay=0}={}){const h=Math.round(w*1.42);const card=document.createElement("span");card.className="cas-card"+(facedown?" facedown":"")+(deal?" cas-deal":"");card.style.width=w+"px";card.style.height=h+"px";if(deal&&delay)card.style.animationDelay=delay+"ms";const inner=document.createElement("span");inner.className="inner";for(const[src,cls]of[[faceCanvas(rank,suit,w),""],[backCanvas(w),"back"]]){const cv=document.createElement("canvas");cv.width=src.width;cv.height=src.height;if(cls)cv.className=cls;cv.getContext("2d").drawImage(src,0,0);inner.appendChild(cv)}card.appendChild(inner);return card}export function syncCardRow(box,cards,{w=58,hiddenAt,onClick,held,toCard}={}){const map=toCard||(c=>c);let st=box._cas;if(!st||cards.length<st.length){box.innerHTML="";st=box._cas=[]}let changed=0;const make=i=>{const{rank,suit}=map(cards[i]);const hid=!!hiddenAt?.(i);const node=cardNode(rank,suit,{w,facedown:hid,deal:true,delay:changed*80});if(onClick)node.onclick=()=>onClick(i);changed++;return{card:cards[i],node,hidden:hid}};for(let i=0;i<st.length;i++){if(st[i].card!==cards[i]){const e=make(i);box.replaceChild(e.node,st[i].node);st[i]=e}}for(let i=st.length;i<cards.length;i++){const e=make(i);box.appendChild(e.node);st.push(e)}for(let i=0;i<st.length;i++){const hid=!!hiddenAt?.(i);if(hid!==st[i].hidden){st[i].hidden=hid;st[i].node.classList.toggle("facedown",hid);if(!hid)sfxCardSlide()}if(held)st[i].node.classList.toggle("cas-held",!!held[i])}if(changed)sfxCardSlide()}
