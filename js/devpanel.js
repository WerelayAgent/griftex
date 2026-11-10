import{MOODS,MOOD_KEY}from"./moods.js";const FLY_KEYS=new Set(["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE","Space","ShiftLeft","ShiftRight"]);const HOTKEYS={__proto__:null,F2:"hud",BracketLeft:"hud",F3:"body",BracketRight:"body",F4:"fly",Backslash:"fly"};const CSS=`
#devpanel { position: fixed; left: 10px; top: 10px; z-index: 99999;
  width: 232px; padding: 8px 10px 10px; border: 1px solid #4a4a52;
  background: rgba(12,12,14,0.88); color: #e6e3dc;
  font: 11px/1.45 ui-monospace, Menlo, "Courier New", monospace; }
#devpanel h4 { margin: 9px 0 4px; font: bold 10px/1 ui-monospace, Menlo, monospace;
  letter-spacing: 0.10em; color: #8a8780; }
#devpanel h4:first-child { margin-top: 0; }
#devpanel button { font: bold 10px/1 ui-monospace, Menlo, monospace; color: #e6e3dc;
  background: #232329; border: 1px solid #4a4a52; padding: 4px 6px; margin: 0 3px 3px 0;
  cursor: pointer; }
#devpanel button:hover { background: #32323a; }
#devpanel button.on { background: #6fc8dc; border-color: #6fc8dc; color: #0a0a0b; }
#devpanel input[type=range] { width: 100%; margin: 2px 0; display: block; }
#devpanel .row { display: flex; justify-content: space-between; align-items: baseline; }
#devpanel .val { color: #6fc8dc; }
#devpanel .note { color: #8a8780; }
`;export function initDevPanel(){const D=window.__debug;if(!D||document.getElementById("devpanel"))return null;const style=document.createElement("style");style.textContent=CSS;document.head.appendChild(style);const root=document.createElement("div");root.id="devpanel";root.innerHTML=`
    <h4>TIME</h4>
    <div class="row"><span>hour</span><span class="val" id="dp-hour">--:--</span></div>
    <input type="range" id="dp-clock" min="0" max="23.99" step="0.05">
    <button id="dp-freeze">FREEZE</button>
    <h4>WEATHER — RELOADS</h4>
    <div id="dp-moods"></div>
    <h4>CAMERA</h4>
    <!-- \\ renders as one backslash: this is a template literal, and a lone
          is an escape character that silently eats itself and the character
         after it. It shipped as "F4 or " for exactly that reason. -->
    <button id="dp-fly">FREE FLY · F4 or \\</button>
    <div class="row"><span>speed</span><span class="val" id="dp-spd">18 m/s</span></div>
    <input type="range" id="dp-speed" min="1" max="120" step="1" value="18">
    <div class="note">WASD · Q/E down,up · SHIFT boost<br>click canvas to look · ESC frees cursor</div>
    <div class="val" id="dp-pos"></div>
    <h4>CLEAN FRAME</h4>
    <button id="dp-hud">HUD · F2 or [</button>
    <button id="dp-body">PLAYER · F3 or ]</button>
  `;document.body.appendChild(root);const $=id=>root.querySelector("#"+id);const elHour=$("dp-hour"),elClock=$("dp-clock"),elFreeze=$("dp-freeze");const elFly=$("dp-fly"),elSpeed=$("dp-speed"),elSpd=$("dp-spd"),elPos=$("dp-pos");const elHud=$("dp-hud"),elBody=$("dp-body");let frozen=false;let pinned=D.world?.clock??12;let scrubbing=false;const hhmm=h=>`${String(Math.floor(h)%24).padStart(2,"0")}:${String(Math.floor(h%1*60)).padStart(2,"0")}`;const scrub=()=>{pinned=+elClock.value;D.setClock(pinned);elHour.textContent=hhmm(pinned)};elClock.addEventListener("pointerdown",()=>{scrubbing=true});window.addEventListener("pointerup",()=>{scrubbing=false});elClock.addEventListener("input",scrub);elFreeze.addEventListener("click",()=>{frozen=!frozen;if(frozen)pinned=D.world?.clock??pinned;elFreeze.classList.toggle("on",frozen)});const moods=$("dp-moods");for(const key of Object.keys(MOODS)){const b=document.createElement("button");b.textContent=key.replace(/_/g," ");b.classList.toggle("on",key===MOOD_KEY);b.addEventListener("click",()=>{const u=new URL(location.href);u.searchParams.set("mood",key);location.href=u.toString()});moods.appendChild(b)}const THREE=D.THREE;const pos=new THREE.Vector3;const dir=new THREE.Vector3;const right=new THREE.Vector3;const held=Object.create(null);let flying=false;let yaw=0,pitch=0;let speed=+elSpeed.value;elSpeed.addEventListener("input",()=>{speed=+elSpeed.value;elSpd.textContent=`${speed} m/s`});function setFly(on){if(on===flying)return;flying=on;elFly.classList.toggle("on",flying);if(flying){const cam=window.__gfx?.camera;if(cam){pos.copy(cam.position);cam.getWorldDirection(dir);yaw=Math.atan2(dir.x,dir.z);pitch=Math.asin(Math.max(-1,Math.min(1,dir.y)))}else{pos.copy(D.player.pos).add(new THREE.Vector3(0,2,0));yaw=D.getCamYaw();pitch=0}D.eye(pos.x,pos.y,pos.z,yaw,pitch,true);const canvas=window.__gfx?.renderer?.domElement;try{canvas?.requestPointerLock?.()}catch{}}else{for(const k in held)held[k]=false;elPos.textContent="";D.eye(null)}}elFly.addEventListener("click",()=>setFly(!flying));function flyStep(dt){dir.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));right.set(-Math.cos(yaw),0,Math.sin(yaw));const s=speed*(held.ShiftLeft||held.ShiftRight?3:1)*dt;if(held.KeyW)pos.addScaledVector(dir,s);if(held.KeyS)pos.addScaledVector(dir,-s);if(held.KeyD)pos.addScaledVector(right,s);if(held.KeyA)pos.addScaledVector(right,-s);if(held.KeyE||held.Space)pos.y+=s;if(held.KeyQ)pos.y-=s;D.eye(pos.x,pos.y,pos.z,yaw,pitch,true);elPos.textContent=`x ${pos.x.toFixed(1)}  y ${pos.y.toFixed(1)}  z ${pos.z.toFixed(1)}`}let bodyHidden=false;let bodyWas=true;const setHud=off=>{D.hud.set(off);elHud.classList.toggle("on",off)};const setBody=hide=>{const g=D.playerBody()?.group;if(!g)return;if(hide&&!bodyHidden)bodyWas=g.visible;bodyHidden=hide;g.visible=hide?false:bodyWas;elBody.classList.toggle("on",hide)};elHud.addEventListener("click",()=>setHud(!D.hud.hidden()));elBody.addEventListener("click",()=>setBody(!bodyHidden));const mine=e=>root.contains(e.target);window.addEventListener("keydown",e=>{const act=HOTKEYS[e.code];if(act){e.preventDefault();if(act==="hud")setHud(!D.hud.hidden());if(act==="body")setBody(!bodyHidden);if(act==="fly")setFly(!flying);return}if(mine(e)||!flying||!FLY_KEYS.has(e.code))return;held[e.code]=true;e.preventDefault();e.stopImmediatePropagation()},true);window.addEventListener("keyup",e=>{if(mine(e)||!flying||!FLY_KEYS.has(e.code))return;held[e.code]=false;e.stopImmediatePropagation()},true);window.addEventListener("mousemove",e=>{if(!flying||!document.pointerLockElement)return;yaw-=e.movementX*.0024;pitch=Math.max(-1.4,Math.min(1.4,pitch+e.movementY*.0018));e.stopImmediatePropagation()},true);window.addEventListener("mousedown",e=>{if(!flying||mine(e))return;if(!document.pointerLockElement){try{window.__gfx?.renderer?.domElement?.requestPointerLock?.()}catch{}}e.stopImmediatePropagation()},true);window.addEventListener("mouseup",e=>{if(!flying||mine(e))return;e.stopImmediatePropagation()},true);let last=performance.now();function tick(now){const dt=Math.min(.1,(now-last)/1e3);last=now;if(frozen)D.setClock(pinned);const h=frozen?pinned:D.world?.clock??0;elHour.textContent=hhmm(h);if(!scrubbing)elClock.value=String(h);if(flying)flyStep(dt);if(bodyHidden){const g=D.playerBody()?.group;if(g)g.visible=false}root.style.visibility=D.hud.hidden()?"hidden":"visible";requestAnimationFrame(tick)}requestAnimationFrame(tick);elHud.classList.toggle("on",D.hud.hidden());return{setFly,setHud,setBody,freeze:v=>{frozen=!!v;if(frozen)pinned=D.world?.clock??pinned;elFreeze.classList.toggle("on",frozen)}}}
