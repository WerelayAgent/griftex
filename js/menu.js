import{CITY,HALF,WORLD,HALF_WORLD,roadCenter,N}from"./city.js";import{paletteColor}from"./paint.js";import{layout}from"./layout.js";import{LOTS,lotRect}from"./lots.js";import{CITY_NAME,AVENUES,STREETS}from"./adcopy.js";import{freewayLoop,CORNER_R}from"./freewayloop.js";import{metroLine}from"./metroline.js";import{opensIn}from"./plots/opens.js";import{drawCityMap,drawMapLegend,drawMapCompass,MAP_SPAN,MAP_HOME,clampView,MAP_INK,cityMapPlaces,mintPlace,streetAt,PLOT_STATE,PLOT_STATE_WORD}from"./citymap.js";import{econChip,ensureGriftCSS}from"./griftui.js";let menuEl=null;let mapEl=null;let mapCanvas=null;const mapView={cx:MAP_HOME.cx,cz:MAP_HOME.cz,z:1};let mapDirty=null;let mapWorld=null;function mapClamp(){clampView(mapView)}let hooks=null;let statRefs=null;const DISPLAY="var(--cf-display)";const MONO="ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono','Courier New',monospace";const CSS=`
#pausemenu {
  position: fixed; inset: 0; z-index: 40; display: none;
  align-items: center; justify-content: center; overflow-y: auto;
  padding: 24px 14px; box-sizing: border-box;
  font-family: ${MONO}; color: #ded5bd; text-align: left;
  background:
    radial-gradient(ellipse at center, rgba(8,6,4,.30) 40%, rgba(5,4,3,.78) 100%),
    rgba(10,8,6,.38);
  /* the city goes soft behind the sheet. The canvas is frozen while paused,
     so this composites once rather than every frame. */
  -webkit-backdrop-filter: blur(4px) saturate(.5) brightness(.82);
  backdrop-filter: blur(4px) saturate(.5) brightness(.82);
}
/* low graphics opts out of the blur — it is the one expensive part */
body.lowgfx #pausemenu {
  -webkit-backdrop-filter: saturate(.5) brightness(.82);
  backdrop-filter: saturate(.5) brightness(.82);
}
.pz-wrap { display: flex; gap: 26px; align-items: flex-start; max-width: 880px; margin: auto; }
.pz-left { width: 300px; flex: none; }
.pz-kick { font: 700 10px ${MONO}; letter-spacing: .34em; color: #9a917c; margin: 0 0 4px 2px; }
.pz-title {
  font: 400 54px/0.92 ${DISPLAY}; letter-spacing: .02em; text-transform: uppercase;
  color: #ded5bd; text-shadow: 0 3px 0 rgba(0,0,0,.6); margin-bottom: 4px;
}
.pz-title span { color: var(--cf-accent); }
.pz-rule { height: 2px; width: 58px; background: var(--cf-accent); margin: 10px 0 18px 2px; }
.pzb { box-sizing: border-box; margin: 0 0 9px; }
.pzb svg { flex: none; opacity: .8; }
.pzb:hover svg, .pzb:focus-visible svg { opacity: 1; }
.pzb:focus-visible { outline: none; border-color: var(--cf-accent-dk); }
.pz-sec { margin-top: 18px; padding: 14px 16px 12px; background: rgba(20,17,13,.82); border: 1px solid #2c261c; border-radius: 2px; }
.pz-sechead { margin-bottom: 11px; }
.pz-live { margin: 10px 0 2px; }
.pz-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin: 9px 0; }
.pz-row label { font: 600 11px ${MONO}; letter-spacing: .1em; color: #cfc6ae; }
.pz-row input[type=range] {
  -webkit-appearance: none; appearance: none; width: 128px; height: 4px; border-radius: 1px;
  background: linear-gradient(90deg, var(--cf-accent) var(--v,50%), #2c261c var(--v,50%));
  outline: none; cursor: pointer;
}
.pz-row input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 2px;
  background: #ded5bd; border: 1px solid var(--cf-accent); box-shadow: 0 1px 3px rgba(0,0,0,.6);
}
.pz-row input[type=range]::-moz-range-thumb {
  width: 13px; height: 13px; border-radius: 2px; background: #ded5bd; border: 1px solid var(--cf-accent);
}
.pz-row input[type=checkbox] {
  -webkit-appearance: none; appearance: none; width: 17px; height: 17px; margin: 0; cursor: pointer;
  background: #14110d; border: 1px solid #3a3428; border-radius: 2px; position: relative;
}
.pz-row input[type=checkbox]:checked { background: var(--cf-accent); border-color: var(--cf-accent-dk); }
.pz-row input[type=checkbox]:checked::after {
  content: ''; position: absolute; left: 5px; top: 1px; width: 4px; height: 9px;
  border: solid #1a0f0a; border-width: 0 2px 2px 0; transform: rotate(42deg);
}
.pz-row input:focus-visible { outline: 1px solid var(--cf-accent); outline-offset: 2px; }
.pz-card {
  width: 320px; flex: none; padding: 18px 20px 16px; box-sizing: border-box;
  background: rgba(20,17,13,.86); border: 1px solid #2c261c; border-radius: 2px;
  box-shadow: 0 18px 40px rgba(0,0,0,.45);
}
.pz-cardkick { font: 700 10px ${MONO}; letter-spacing: .3em; color: #9a917c; }
.pz-cardtitle { font: 400 24px ${DISPLAY}; letter-spacing: .03em; color: #ded5bd; text-transform: uppercase; margin: 2px 0 12px; }
.pz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.pz-stat .l { font: 700 9px ${MONO}; letter-spacing: .18em; color: #9a917c; margin-bottom: 2px; }
.pz-stat .v { font: 400 21px/1 ${DISPLAY}; letter-spacing: .02em; color: #ded5bd; }
.pz-stat .v em { font-style: normal; color: var(--cf-accent); }
.pz-bar { margin-top: 13px; }
.pz-bar .t { display: flex; justify-content: space-between; font: 700 9px ${MONO}; letter-spacing: .18em; color: #9a917c; margin-bottom: 4px; }
.pz-bar .t b { color: #ded5bd; font-weight: 700; }
.pz-bar .track { height: 5px; background: #241f17; border-radius: 1px; overflow: hidden; }
.pz-bar .fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--cf-accent-dk), var(--cf-accent)); }
.pz-foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: 15px; padding-top: 11px; border-top: 1px solid #2c261c; }
.pz-foot .lvl { font: 400 19px ${DISPLAY}; color: var(--cf-accent); letter-spacing: .04em; }
.pz-foot .xp { font: 600 10px ${MONO}; letter-spacing: .14em; color: #9a917c; }
.pz-chain .cf-v { font-size: 10px; letter-spacing: .06em; }
.pz-chain .cf-v i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; vertical-align: 1px; background: var(--cf-accent); box-shadow: 0 0 6px var(--cf-accent); }
.pz-chain .cf-v i.stale { background: var(--cf-warn); box-shadow: 0 0 6px var(--cf-warn); }
.pz-chain .cf-v i.off { background: #c2603c; box-shadow: none; }
.pz-chain .cf-v em { font-style: normal; color: #9a917c; }
.pz-act { margin-top: 13px; padding-top: 9px; border-top: 1px solid #2c261c; }
.pz-act .t { display: flex; justify-content: space-between; font: 700 9px ${MONO}; letter-spacing: .18em; color: #9a917c; margin-bottom: 5px; }
.pz-act .t b { color: #9a917c; font-weight: 700; }
.pz-act .r { display: flex; gap: 8px; font: 600 10px ${MONO}; letter-spacing: .04em; color: #cfc6ae; margin: 3px 0; }
.pz-act .r .c { color: #9a917c; flex: none; }
.pz-act .r .x { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pz-act .r .s { flex: none; color: #9a917c; }
.pz-act .r .s.v { color: var(--cf-accent); }
.pz-act .r .s.t { color: var(--cf-warn); }
.pz-act .none { font: 600 10px ${MONO}; color: #6b6f66; letter-spacing: .06em; }
/* GRIFT ID: the identity panel — a wallet is the account, a guest is the same
   player without one. Restrained: an address, a chain, three numbers, one button. */
.pz-id { margin: 0 0 12px; padding: 12px 14px 12px 18px; box-sizing: border-box; }
.pz-id .k { font: 700 9px ${MONO}; letter-spacing: .3em; color: #9a917c; }
.pz-id .addr { font: 400 26px/1 ${DISPLAY}; letter-spacing: .04em; color: #ded5bd; margin: 6px 0 2px; }
.pz-id .addr.guest { color: #9a917c; }
.pz-id .chain { font: 700 9.5px ${MONO}; letter-spacing: .22em; color: var(--cf-accent); }
.pz-id .chain.off { color: #9a917c; }
.pz-id .nums { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 10px 0 2px; }
.pz-id .nums .l { font: 700 8.5px ${MONO}; letter-spacing: .2em; color: #9a917c; }
.pz-id .nums .v { font: 400 19px/1 ${DISPLAY}; letter-spacing: .03em; color: #ded5bd; margin-top: 2px; }
.pz-id .note { font: 600 10px ${MONO}; letter-spacing: .06em; color: #9a917c; margin: 8px 0 2px; }
.pz-id .rows { display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; margin: 10px 0 2px; font: 700 9.5px ${MONO}; letter-spacing: .14em; }
.pz-id .rows .k { color: #9a917c; }
.pz-id .rows .v { color: #ded5bd; text-align: right; }
.pz-id .acts { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.pz-id .acts .cf-btn { width: auto; padding: 8px 11px; font-size: 10.5px; margin: 0; }
#bigmap {
  /* ABOVE THE LANDING, OR IT IS A MAP NOBODY CAN SEE. #landing is z-index 80
     and this was 40, so VIEW CITY MAP on the home screen opened the sheet
     BEHIND the front page: the map drew, the panel populated, every row was
     clickable, and the whole thing was under an opaque overlay. In game there
     is no landing over it, so a higher index costs nothing there. */
  position: fixed; inset: 0; z-index: 90; display: none; flex-direction: column;
  align-items: center; justify-content: center; font-family: ${MONO};
  /* NEAR BLACK, NOT A TINT. At .55 over the home screen the landing's own art
     — a lit doorway, a headline, a blurred street — read straight through the
     sheet and sat behind the district list, so the map looked like a panel
     somebody had left open on top of a website rather than a map. The ground
     the city is drawn on is the darkest thing on the screen; everything else
     gets to be brighter than it. */
  background: rgba(8,9,11,.93);
  -webkit-backdrop-filter: saturate(.4) brightness(.45) blur(2px);
  backdrop-filter: saturate(.4) brightness(.45) blur(2px);
}
.pz-maptitle { font: 400 30px ${DISPLAY}; letter-spacing: .04em; color: #ded5bd; text-transform: uppercase; }
.pz-maptip { font: 700 10px ${MONO}; letter-spacing: .24em; color: #9a917c; margin: 4px 0 10px; }
.pz-maptip b { color: var(--cf-accent); font-weight: 700; }
#bigmap canvas { border: 1px solid #2c261c; border-radius: 2px; box-shadow: 0 20px 50px rgba(0,0,0,.55); cursor: crosshair; }
/* FAST TRAVEL — the map's right-hand column. Same ink, same hairlines; the
   accent marks only the selected destination, which is its one job. */
.pz-maprow { display: flex; gap: 14px; align-items: flex-start; }
/* the explorer: the home screen's panel beside the sheet */
/* THE EXPLORER IS A PANEL, NOT LOOSE TEXT. It was a bare flex column with no
   border and no ground: the list ran to the bottom of its scroll box and the
   rows past the cut simply stopped mid-word over whatever was behind the
   sheet, which reads as broken rather than scrollable. It now carries the same
   hairline and the same ground as .pz-travel beside it — one column system,
   two columns — and the search and tabs sit in a header that does not scroll
   away from the list they filter. */
/* IT IS GIVEN A HEIGHT, NOT A CEILING. A flex column of auto height whose
   middle child is 'flex: 1; min-height: 0' resolves that child to ZERO — the
   basis is 0, the content no longer contributes, and nothing stops it
   collapsing. The 24 rows were all in the DOM and every one of them was a box
   of no height inside a scroller of no height: present, findable, invisible.
   sizeMapCanvas sets the height to match the sheet beside it, which makes the
   height definite and the list's flex resolve against something real. */
.pz-explore { width: 268px; height: min(84vmin, 640px); display: flex; flex-direction: column;
  border: 1px solid #2c261c; background: rgba(10,8,6,.72); }
.pz-explore .mx-head { padding: 9px 10px; display: flex; flex-direction: column; gap: 7px;
  border-bottom: 1px solid #2c261c; }
.pz-explore .mx-list { padding: 4px 0; }
/* THE KEY — the two lines the drawing cannot explain about itself.
   The icons carry their own meaning and the scale bar carries distance. Which
   line is the route and which is the metro is the one thing a player cannot
   work out by looking, so it is the one thing said here. Park and water get no
   entry: they are a hair off the land they sit on by design, and a swatch of
   either would be a black square explaining nothing.
   The colours come from js/citymap.js — see MAP_INK there for why. */
.mx-key { border-top: 1px solid #2c261c; padding: 8px 10px; display: flex; gap: 18px; }
.mx-key i { display: flex; align-items: center; gap: 6px; font: 600 8.5px ${MONO}; letter-spacing: .12em;
  color: #9a917c; font-style: normal; }
.mx-key i::before { content: ''; width: 16px; height: 0; border-top: 2px solid currentColor; flex: none; }
.mx-key i.k-route { color: var(--mx-route); }
.mx-key i.k-metro { color: var(--mx-metro); }
.mx-key i.k-metro::before { border-top-style: dashed; }
.mx-q { width: 100%; box-sizing: border-box; background: rgba(12,13,16,.85); color: var(--cf-ink, #cfc6ae);
  border: 1px solid var(--cf-edge-lit, #3d4b3c); border-radius: 2px; padding: 9px 10px;
  font: 600 11px var(--cf-mono, ui-monospace, monospace); letter-spacing: .1em; outline: none; }
.mx-q:focus { border-color: var(--cf-ink-dim, #8b978a); }
.mx-q::placeholder { color: var(--cf-ink-faint, #5d6a5d); }
.mx-go { width: 100%; box-sizing: border-box; margin-top: 6px; background: rgba(63,240,192,.08); color: #3ff0c0;
  border: 1px solid rgba(63,240,192,.45); border-radius: 2px; padding: 7px 10px; cursor: pointer;
  font: 600 10px var(--cf-mono, ui-monospace, monospace); letter-spacing: .14em; }
.mx-go:hover { background: rgba(63,240,192,.16); }
.mx-tabs { display: flex; flex-wrap: wrap; gap: 4px; }
.mx-tab { background: none; border: 1px solid var(--cf-edge, #262f24); color: var(--cf-ink-faint, #5d6a5d);
  border-radius: 2px; padding: 4px 7px; cursor: pointer;
  font: 600 9.5px var(--cf-mono, ui-monospace, monospace); letter-spacing: .1em; }
.mx-tab:hover { border-color: var(--cf-edge-lit, #3d4b3c); color: var(--cf-ink-dim, #8b978a); }
.mx-tab.on { border-color: #e0a44a; color: #e0a44a; }
.mx-list { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.mx-row { text-align: left; background: none; border: 0; border-left: 2px solid transparent; cursor: pointer;
  padding: 7px 9px; display: flex; flex-direction: column; gap: 2px; }
.mx-row:hover { background: rgba(224,164,74,.07); border-left-color: #e0a44a; }
.mx-row .mx-n { font: 700 11px var(--cf-mono, ui-monospace, monospace); letter-spacing: .07em; color: #ece5d5; }
.mx-row .mx-s { font: 600 9.5px var(--cf-mono, ui-monospace, monospace); letter-spacing: .06em; color: var(--cf-ink-faint, #5d6a5d); }
.mx-none { padding: 12px 9px; font: 600 10px var(--cf-mono, ui-monospace, monospace); color: var(--cf-ink-faint, #5d6a5d); }
/* the card that says what a mark is */
.pz-mapcard { position: fixed; z-index: 95; pointer-events: none; min-width: 150px; max-width: 220px;
  background: rgba(10,11,14,.96); border: 1px solid var(--cf-edge-lit, #3d4b3c); border-left: 2px solid #e0a44a;
  padding: 9px 11px; }
.pz-mapcard .mc-n { font: 700 11.5px var(--cf-mono, ui-monospace, monospace); letter-spacing: .08em; color: #ece5d5; }
.pz-mapcard .mc-l { margin-top: 3px; font: 600 9.5px var(--cf-mono, ui-monospace, monospace); letter-spacing: .06em; color: var(--cf-ink-dim, #8b978a); }
.pz-mapcard .mc-s { margin-top: 5px; font: 600 9.5px var(--cf-mono, ui-monospace, monospace); letter-spacing: .06em; color: #6f93b8; }
@media (max-width: 900px) { .pz-explore { width: 100%; height: 220px; } .mx-key { display: none; } }
.pz-travel { width: 250px; max-height: min(84vmin, 640px); display: flex; flex-direction: column;
  border: 1px solid #2c261c; background: rgba(10,8,6,.72); }
.pz-travel h4 { margin: 0; padding: 9px 11px 8px; font: 700 9px ${MONO}; letter-spacing: .3em; color: #9a917c;
  border-bottom: 1px solid #2c261c; text-transform: uppercase; }
.pz-travel .tv-why { padding: 8px 11px; font: 700 9.5px ${MONO}; letter-spacing: .1em; color: var(--cf-warn, #e0a33c);
  border-bottom: 1px solid #2c261c; line-height: 1.5; }
.pz-travel .tv-list { overflow: auto; flex: 1; }
.pz-travel button { display: block; width: 100%; text-align: left; background: none; border: 0;
  border-bottom: 1px solid rgba(44,38,28,.7); color: #ded5bd; font: 700 11px ${MONO}; letter-spacing: .08em;
  padding: 8px 11px; cursor: pointer; }
.pz-travel button:hover, .pz-travel button:focus-visible { background: var(--gr-accent-a, rgba(255,255,255,.06)); outline: 0; }
.pz-travel button small { display: block; font-size: 8.5px; letter-spacing: .22em; color: #7f7b73; margin-top: 2px; text-transform: uppercase; }
.pz-travel button.on { color: #fff; box-shadow: inset 3px 0 0 var(--cf-accent); }
.pz-travel .tv-go { padding: 10px 11px; border-top: 1px solid #2c261c; }
.pz-travel .tv-go .cf-btn { width: 100%; margin: 0; }
.pz-travel[data-blocked="1"] .tv-list { opacity: .5; }
body.gtc-paused #hud, body.gtc-paused #levelbadge, body.gtc-paused #news { visibility: hidden; }
@media (max-width: 720px), (max-height: 560px) {
  #pausemenu { align-items: flex-start; }
  .pz-wrap { flex-direction: column; gap: 14px; }
  .pz-left, .pz-card { width: min(86vw, 340px); }
  .pz-title { font-size: 40px; }
  .pz-stat .v { font-size: 18px; }
}`;function icon(kind){const P={play:'<path d="M5 3.5v8l7-4z" fill="currentColor" stroke="none"/>',photo:'<rect x="2" y="4.5" width="11" height="8" rx="1"/><circle cx="7.5" cy="8.5" r="2.4"/><path d="M5.5 4.5l1-1.7h2l1 1.7"/>',selfie:'<circle cx="7.5" cy="6" r="2.2"/><path d="M3.5 12.6c.7-2.2 2.2-3.3 4-3.3s3.3 1.1 4 3.3"/><path d="M1.8 2.8h2M1.8 2.8v2M13.2 12.8h-2M13.2 12.8v-2"/>',respawn:'<path d="M12.3 6.6A5 5 0 1 0 12.8 9"/><path d="M12.9 3.4v3.3H9.6"/>',cine:'<rect x="1.5" y="4" width="12" height="7" rx="1"/><path d="M1.5 6h12M1.5 9h12M4 4v7M7.5 4v7M11 4v7"/>',exit:'<path d="M9 2.5H3.2A.7.7 0 0 0 2.5 3.2v8.6a.7.7 0 0 0 .7.7H9"/><path d="M11 5l2.5 2.5L11 10"/><path d="M13.2 7.5H6.4"/>',wallet:'<rect x="1.8" y="4" width="11.4" height="8" rx="1"/><path d="M1.8 6.5h11.4"/><circle cx="10.5" cy="9.3" r="1"/>',locker:'<rect x="3" y="1.8" width="9" height="11.4" rx="1"/><path d="M3 5.5h9M3 9.2h9"/><path d="M9.5 3.6v.1M9.5 7.3v.1M9.5 11v.1"/>',ledger:'<rect x="2" y="2.2" width="11" height="10.6" rx="1"/><path d="M4.2 5.2h6.6M4.2 7.8h6.6M4.2 10.4h4"/>',market:'<path d="M2 11.5l3.2-3.4 2.6 2.2 2.4-3.6L13 4.2"/><path d="M10.6 4.2H13v2.4"/>'};return`<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[kind]}</svg>`}let leaveBtn=null;let walletBtn=null;let updateNote=null;let idPanel=null;function btn(label,kind,cls,onclick){const b=document.createElement("button");const map={pri:"cf-pri",warn:"cf-warn"};b.className="cf-btn pzb"+(cls?" "+(map[cls]||cls):"");b.innerHTML=icon(kind)+`<span>${label}</span>`;b.onclick=onclick;return b}function settingRow(label,input){const r=document.createElement("div");r.className="pz-row";const l=document.createElement("label");l.textContent=label;r.append(l,input);return r}let cssInjected=false;function ensureMenuCss(){if(cssInjected||document.getElementById("pausecss")){cssInjected=true;return}const style=document.createElement("style");style.id="pausecss";style.textContent=CSS;document.head.appendChild(style);cssInjected=true}const rangeFill=(el,min,max)=>{el.style.setProperty("--v",((el.value-min)/(max-min)*100).toFixed(1)+"%")};let travelEl=null;let exploreEl=null;let cardEl=null;let places=[];let filter="ALL";function buildMapEl(onWaypoint){if(mapEl)return mapEl;ensureMenuCss();mapEl=document.createElement("div");mapEl.id="bigmap";const mt=document.createElement("div");mt.className="pz-maptitle";mt.textContent="CITY MAP";const tip=document.createElement("div");tip.className="pz-maptip";tip.innerHTML="CLICK TO SET A WAYPOINT · CLICK A CRATE FOR ITS WAYPOINT · DRAG TO PAN · SCROLL TO ZOOM · DOUBLE-CLICK TO FIT — <b>M</b> TO CLOSE";mapCanvas=document.createElement("canvas");mapCanvas.width=640;mapCanvas.height=640;mapCanvas.style.cssText="width:640px;height:640px;";const mapWorldAt=e=>{const r=mapCanvas.getBoundingClientRect();const span=MAP_SPAN/mapView.z;return[(e.clientX-r.left)/r.width*span+mapView.cx-span/2,(e.clientY-r.top)/r.height*span+mapView.cz-span/2]};let drag=null;mapCanvas.addEventListener("pointerdown",e=>{mapCanvas.setPointerCapture?.(e.pointerId);drag={x:e.clientX,y:e.clientY,moved:0,cx:mapView.cx,cz:mapView.cz}});mapCanvas.addEventListener("pointermove",e=>{if(!drag)return;const r=mapCanvas.getBoundingClientRect();const span=MAP_SPAN/mapView.z;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(dx,dy));mapView.cx=drag.cx-dx/r.width*span;mapView.cz=drag.cz-dy/r.height*span;mapClamp();if(mapDirty)mapDirty()});const endDrag=e=>{if(!drag)return;const wasClick=drag.moved<5;drag=null;if(wasClick){let[wx,wz]=mapWorldAt(e);try{const crates=(mapWorld?.stockDrops?.list||[]).filter(d=>d.status==="AVAILABLE");if(crates.length){const r=mapCanvas.getBoundingClientRect();const snapWorld=12*(MAP_SPAN/mapView.z)/r.width;let best=null,bd=snapWorld;for(const d of crates){const dd=Math.hypot(d.x-wx,d.z-wz);if(dd<bd){bd=dd;best=d}}if(best){wx=best.x;wz=best.z}}}catch{}onWaypoint(wx,wz)}};mapCanvas.addEventListener("pointerup",endDrag);mapCanvas.addEventListener("pointercancel",()=>{drag=null});const plotAt=(wx,wz,reach)=>{let best=null,bd=Infinity;for(const pe of mapWorld?.plots?.list||[]){if(!pe.data?.stage||!pe.lot)continue;const L=pe.lot,dx=Math.max(0,Math.abs(wx-L.cx)-L.w/2),dz=Math.max(0,Math.abs(wz-L.cz)-L.d/2),d=Math.hypot(dx,dz);if(d<=reach&&d<bd){bd=d;best=pe}}return best};const plotCard=pe=>{const p=pe.data,state=PLOT_STATE(p.stage);const fmt=v=>{const n=Number(v);return Number.isFinite(n)?n.toLocaleString("en-US"):String(v??"")};const owner=p.ownerName?`${escapeHtml(p.ownerName)} ◇`:p.owner?escapeHtml(`${String(p.owner).slice(0,6)}…${String(p.owner).slice(-4)}`):"";const venue=p.stage==="built"&&p.bizName?`${escapeHtml(p.bizName)} ◇ · ${escapeHtml(String(p.kind||"").toUpperCase())}`:p.stage==="site"&&p.bizName?`${escapeHtml(p.bizName)} ◇ · BEING BUILT: ${escapeHtml(String(p.kind||"").toUpperCase())} · ${(()=>{const t=opensIn(p.opensAt);return t?`OPENS IN ${escapeHtml(t.toUpperCase())}`:"OPENING NOW"})()}`:p.stage==="owned"?"NOTHING BUILT YET":"";return`<div class="mc-n">PLOT ${escapeHtml(pe.id)}${pe.mine?" · YOURS":""}</div><div class="mc-l">${PLOT_STATE_WORD[state]}${p.off?" · CLOSED":""}${state==="forsale"&&p.price!=null?` · ${escapeHtml(fmt(p.price))} $GRIFTEX`:""}${owner?` · ${owner}`:""}</div>`+(venue?`<div class="mc-l">${venue}</div>`:"")+`<div class="mc-s">${escapeHtml(pe.lot.district||"")} · ${escapeHtml(streetAt(pe.lot.cx,pe.lot.cz))}</div>`};mapCanvas.addEventListener("pointermove",e=>{if(!cardEl||drag){if(cardEl)cardEl.style.display="none";return}const[wx,wz]=mapWorldAt(e);const span=MAP_SPAN/mapView.z;const reach=span*.022;const pe=plotAt(wx,wz,reach*.6);if(pe){cardEl.innerHTML=plotCard(pe);cardEl.style.display="block";cardEl.style.left=`${Math.min(window.innerWidth-230,e.clientX+16)}px`;cardEl.style.top=`${Math.max(8,e.clientY-12)}px`;return}if(exploreEl?.style.display==="none"){cardEl.style.display="none";return}let best=null,bd=Infinity;for(const p of places){if(p.kind==="district")continue;const d=Math.hypot(p.x-wx,p.z-wz);if(d<bd){bd=d;best=p}}if(!best||bd>reach){cardEl.style.display="none";return}const r=mapCanvas.getBoundingClientRect();cardEl.innerHTML=`<div class="mc-n">${escapeHtml(best.name)}</div><div class="mc-l">${escapeHtml(best.line||"")}${best.district?" · "+escapeHtml(best.district):""}</div><div class="mc-s">${escapeHtml(streetAt(best.x,best.z))}</div>`;cardEl.style.display="block";cardEl.style.left=`${Math.min(window.innerWidth-220,e.clientX+16)}px`;cardEl.style.top=`${Math.max(8,e.clientY-12)}px`});mapCanvas.addEventListener("pointerleave",()=>{if(cardEl)cardEl.style.display="none"});mapCanvas.addEventListener("wheel",e=>{e.preventDefault();const[wx,wz]=mapWorldAt(e);const before=mapView.z;mapView.z*=e.deltaY<0?1.25:1/1.25;mapClamp();if(mapView.z!==before){const r=mapCanvas.getBoundingClientRect();const span=MAP_SPAN/mapView.z;mapView.cx=wx-((e.clientX-r.left)/r.width-.5)*span;mapView.cz=wz-((e.clientY-r.top)/r.height-.5)*span;mapClamp()}if(mapDirty)mapDirty()},{passive:false});mapCanvas.addEventListener("dblclick",()=>{mapView.cx=MAP_HOME.cx;mapView.cz=MAP_HOME.cz;mapView.z=1;if(mapDirty)mapDirty()});travelEl=document.createElement("div");travelEl.className="pz-travel";travelEl.style.display="none";const row=document.createElement("div");row.className="pz-maprow";exploreEl=document.createElement("div");exploreEl.className="pz-explore";exploreEl.style.display="none";exploreEl.innerHTML=`<div class="mx-head"><input id="mx-q" class="mx-q" type="search" placeholder="SEARCH SAN VERANO" autocomplete="off" spellcheck="false"><button type="button" class="mx-go" id="mx-go" title="THE MINT's doors: Vista Ave, just north of Juniper, in Mid-rise">FIND THE MINT</button><div class="mx-tabs"></div></div><div class="mx-list"></div><div class="mx-key"><i class="k-route">ROUTE</i><i class="k-metro">METRO</i></div>`;exploreEl.style.setProperty("--mx-route",MAP_INK.route);exploreEl.style.setProperty("--mx-metro",MAP_INK.metro);exploreEl.querySelector("#mx-q").addEventListener("keydown",e=>e.stopPropagation());exploreEl.querySelector("#mx-go").addEventListener("click",()=>{const m=mintPlace();flyTo(m.x,m.z,3.6);onWaypoint(m.x,m.z)});cardEl=document.createElement("div");cardEl.className="pz-mapcard";cardEl.style.display="none";row.append(mapCanvas,exploreEl,travelEl);mapEl.appendChild(cardEl);mapEl.append(mt,tip,row);document.body.appendChild(mapEl);return mapEl}export function setMapDestinations(list,{onTravel=null,reason=null,onSelect=null,label="FAST TRAVEL"}={}){if(!travelEl)return null;travelEl.innerHTML="";if(!list||!list.length){travelEl.style.display="none";return null}travelEl.style.display="flex";travelEl.dataset.blocked=reason?"1":"0";const h=document.createElement("h4");h.textContent=label;travelEl.appendChild(h);if(reason){const w=document.createElement("div");w.className="tv-why";w.textContent=reason;travelEl.appendChild(w)}const ul=document.createElement("div");ul.className="tv-list";let chosen=null,chosenBtn=null;for(const d of list){const b=document.createElement("button");b.type="button";const note=d.note?" · "+d.note:"";b.innerHTML=`${d.name}<small>${d.kind}${d.district?" · "+d.district:""}${note}</small>`;b.addEventListener("click",()=>{if(chosenBtn)chosenBtn.classList.remove("on");chosen=d;chosenBtn=b;b.classList.add("on");go.textContent=reason?reason:`TRAVEL TO ${d.name}`;go.disabled=!!reason;if(onSelect)onSelect(d)});ul.appendChild(b)}travelEl.appendChild(ul);const foot=document.createElement("div");foot.className="tv-go";const go=document.createElement("button");go.type="button";go.className="cf-btn";go.textContent=reason||"PICK A DESTINATION";go.disabled=true;go.addEventListener("click",()=>{if(!chosen||reason||!onTravel)return;closeMap();onTravel(chosen)});foot.appendChild(go);travelEl.appendChild(foot);if(mapEl&&mapEl.style.display!=="none"){sizeMapCanvas();if(mapDirty)mapDirty()}return travelEl}export function openCityMap(world,{onWaypoint=null,explore=false}={}){buildMapEl(onWaypoint||(()=>{}));if(explore)wireExplorer(world);openMap(world);return mapEl}let flyRaf=0;function flyTo(x,z,zoom=3.2,ms=420){cancelAnimationFrame(flyRaf);const x0=mapView.cx,z0=mapView.cz,k0=mapView.z,t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/ms);const e=k<.5?2*k*k:1-(-2*k+2)**2/2;mapView.cx=x0+(x-x0)*e;mapView.cz=z0+(z-z0)*e;mapView.z=k0+(zoom-k0)*e;mapClamp();if(mapDirty)mapDirty();if(k<1)flyRaf=requestAnimationFrame(step)};flyRaf=requestAnimationFrame(step)}const TABS=["ALL","DISTRICTS","VENUES","STATIONS","SHOPS"];function wireExplorer(world){if(!exploreEl)return;exploreEl.style.display="flex";places=cityMapPlaces(world);const seen=new Set;for(const p of places)if(p.district)seen.add(p.district);for(const d of seen){const of=places.filter(x=>x.district===d);const cx=of.reduce((a,b)=>a+b.x,0)/of.length;const cz=of.reduce((a,b)=>a+b.z,0)/of.length;places.push({id:"district:"+d,name:d.toUpperCase(),kind:"district",icon:"generic",x:cx,z:cz,line:`${of.length} PLACE${of.length===1?"":"S"}`,district:null})}const tabs=exploreEl.querySelector(".mx-tabs");tabs.innerHTML="";for(const t of TABS){const b=document.createElement("button");b.type="button";b.className="mx-tab"+(t===filter?" on":"");b.textContent=t;b.onclick=()=>{filter=t;[...tabs.children].forEach(c=>c.classList.toggle("on",c.textContent===t));paintExplorer()};tabs.appendChild(b)}exploreEl.querySelector("#mx-q").oninput=paintExplorer;paintExplorer()}function paintExplorer(){const list=exploreEl.querySelector(".mx-list");const q=(exploreEl.querySelector("#mx-q").value||"").trim().toUpperCase();const want={ALL:null,DISTRICTS:"district",VENUES:"venue",STATIONS:"station",SHOPS:"shop"}[filter];const rows=places.filter(p=>want?p.kind===want:true).filter(p=>q?p.name.toUpperCase().includes(q)||String(p.line).toUpperCase().includes(q)||String(p.district||"").toUpperCase().includes(q):true).sort((a,b)=>a.kind===b.kind?a.name.localeCompare(b.name):TABS.indexOf(a.kind.toUpperCase()+"S")-TABS.indexOf(b.kind.toUpperCase()+"S"));list.innerHTML="";if(!rows.length){list.innerHTML='<div class="mx-none">nothing by that name</div>';return}for(const p of rows){const row=document.createElement("button");row.type="button";row.className="mx-row";row.innerHTML=`<span class="mx-n">${escapeHtml(p.name)}</span><span class="mx-s">${escapeHtml(p.line||"")}${p.district?" · "+escapeHtml(p.district):""}</span>`;row.onclick=()=>flyTo(p.x,p.z,p.kind==="district"?2.2:3.6);list.appendChild(row)}}const escapeHtml=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);export function cityMapOpen(){return!!mapEl&&mapEl.style.display==="flex"}export function initMenu(h){hooks=h;ensureMenuCss();menuEl=document.createElement("div");menuEl.id="pausemenu";const wrap=document.createElement("div");wrap.className="pz-wrap";const left=document.createElement("div");left.className="pz-left";left.innerHTML=`<div class="pz-kick">// SESSION HELD</div><div class="pz-title">PAUSED<span>.</span></div><div class="pz-rule"></div>`;left.appendChild(btn("RESUME","play","pri",()=>hooks.onResume()));left.appendChild(btn("PHOTO MODE","photo","",()=>hooks.onPhoto()));if(hooks.onCine)left.appendChild(btn("CINEMATIC MODE","cine","",()=>hooks.onCine()));if(hooks.cameraSupported){left.appendChild(btn("SELFIE CAM","selfie","",()=>hooks.onCamera()))}left.appendChild(btn("RESTART (RESPAWN)","respawn","warn",()=>hooks.onRestart()));leaveBtn=btn("STEP OUTSIDE","exit","",()=>hooks.onLeaveVenue?.());leaveBtn.style.display="none";left.appendChild(leaveBtn);if(hooks.identity){idPanel=document.createElement("div");idPanel.className="pz-id cf-card cf-punched";left.appendChild(idPanel);window.addEventListener("grift:identity",()=>{if(menuEl&&menuEl.style.display==="flex")paintIdentity()});window.addEventListener("store:change",()=>{if(menuEl&&menuEl.style.display==="flex")paintIdentity()})}if(hooks.onWallet){walletBtn=btn("CONNECT WALLET","wallet","",()=>hooks.onWallet());left.appendChild(walletBtn)}if(hooks.onLocker)left.appendChild(btn("THE LOCKER","locker","",()=>hooks.onLocker()));if(hooks.onEditLook)left.appendChild(btn("EDIT LOOK","locker","",()=>hooks.onEditLook()));if(hooks.onMarket)left.appendChild(btn("MARKET","market","",()=>hooks.onMarket()));if(hooks.onLedger)left.appendChild(btn("LEDGER","ledger","",()=>hooks.onLedger()));updateNote=document.createElement("div");updateNote.className="menu-note";updateNote.style.cssText="display:none;margin-top:10px;padding:8px 11px;border:1px solid #6a5a2a;background:#241f10;color:#e9c53a;font:12px/1.45 ui-monospace,monospace;border-radius:4px";updateNote.textContent="UPDATE READY — a newer build is installed. It starts the next time you load the game.";left.appendChild(updateNote);const s=hooks.settings;const vol=document.createElement("input");vol.type="range";vol.min=0;vol.max=100;vol.value=s.volume*100;vol.oninput=()=>{s.volume=vol.value/100;rangeFill(vol,0,100);hooks.onSettings()};rangeFill(vol,0,100);const sens=document.createElement("input");sens.type="range";sens.min=30;sens.max=220;sens.value=s.sens*100;sens.oninput=()=>{s.sens=sens.value/100;rangeFill(sens,30,220);hooks.onSettings()};rangeFill(sens,30,220);const inv=document.createElement("input");inv.type="checkbox";inv.checked=!!s.invertY;inv.onchange=()=>{s.invertY=inv.checked;hooks.onSettings()};const qual=document.createElement("input");qual.type="checkbox";qual.checked=!!s.lowGfx;qual.onchange=()=>{s.lowGfx=qual.checked;hooks.onSettings()};const north=document.createElement("input");north.type="checkbox";north.checked=!!s.mapNorthUp;north.onchange=()=>{s.mapNorthUp=north.checked;hooks.onSettings()};const dvol=document.createElement("input");dvol.type="range";dvol.min=0;dvol.max=100;dvol.value=(s.dispatchVol??.8)*100;dvol.oninput=()=>{s.dispatchVol=dvol.value/100;rangeFill(dvol,0,100);hooks.onSettings()};rangeFill(dvol,0,100);const dmute=document.createElement("input");dmute.type="checkbox";dmute.checked=!!s.dispatchMute;dmute.onchange=()=>{s.dispatchMute=dmute.checked;hooks.onSettings()};const perf=document.createElement("input");perf.type="checkbox";perf.checked=s.perfReports!==false;perf.onchange=()=>{s.perfReports=perf.checked;hooks.onSettings()};const group=(title,rows)=>{const g=document.createElement("div");g.className="cf-sec";const h2=document.createElement("div");h2.className="cf-sechead";h2.textContent=title;g.appendChild(h2);rows.forEach(r=>g.appendChild(r));return g};const sec=document.createElement("div");sec.className="pz-sec";const sh=document.createElement("div");sh.className="cf-sechead pz-sechead";sh.textContent="SETTINGS";sec.appendChild(sh);sec.append(group("AUDIO",[settingRow("VOLUME",vol),settingRow("DISPATCH RADIO",dvol),settingRow("DISPATCH MUTE",dmute)]),group("CONTROLS",[settingRow("SENSITIVITY",sens),settingRow("INVERT Y",inv)]),group("DISPLAY",[settingRow("PERFORMANCE MODE",qual),settingRow("MAP: NORTH UP",north)]),group("PRIVACY",[settingRow("SHARE PERFORMANCE DATA",perf)]));left.appendChild(sec);const card=document.createElement("div");card.className="pz-card";card.classList.add("cf-card","cf-punched");card.innerHTML=`<div class="cf-tab">EVIDENCE SHEET</div><div class="pz-cardtitle">Session Record</div><div class="pz-live"><div class="cf-row"><span class="cf-l">LOCATION</span><span class="cf-v" id="pz-loc">—</span></div><div class="cf-row"><span class="cf-l">TIME</span><span class="cf-v" id="pz-clock">—</span></div><div class="cf-row"><span class="cf-l">HEAT</span><span class="cf-v" id="pz-wanted">—</span></div><div class="cf-row"><span class="cf-l">WALLET</span><span class="cf-v" id="pz-wallet">—</span></div></div><div class="cf-rule cf-lit"></div><div class="pz-live pz-chain"><div class="cf-row"><span class="cf-l">CHAIN</span><span class="cf-v" id="pz-chain">—</span></div><div class="cf-row"><span class="cf-l">HOLDING</span><span class="cf-v" id="pz-holding">—</span></div><div class="cf-row"><span class="cf-l">KIOSK</span><span class="cf-v" id="pz-stocks">—</span></div></div><div class="cf-rule cf-lit"></div><div class="pz-grid">`+["SWUNG","BEST CASH-OUT","MISSIONS","FARES","TANKS","JACKPOTS","RIVALS BEATEN","CASH ON HAND"].map((l,i)=>`<div class="pz-stat"><div class="l">${l}</div><div class="v" data-st="${i}">—</div></div>`).join("")+`</div><div class="pz-bar"><div class="t"><span>PACKAGES</span><b data-st="pkt">0/20</b></div><div class="track"><div class="fill" data-st="pkb"></div></div></div><div class="pz-bar"><div class="t"><span>ACHIEVEMENTS</span><b data-st="act">0/0</b></div><div class="track"><div class="fill" data-st="acb"></div></div></div><div class="pz-foot"><div class="lvl" data-st="lvl">LEVEL 1</div><div class="xp" data-st="xp">0 XP</div></div><div class="pz-act"><div class="t"><span>RECENT ACTIVITY</span><b>LOCAL · TIER · VERIFIED</b></div><div id="pz-activity"></div></div>`;statRefs={};for(const el of card.querySelectorAll("[data-st]"))statRefs[el.dataset.st]=el;wrap.append(left,card);menuEl.appendChild(wrap);document.body.appendChild(menuEl);buildMapEl(hooks.onWaypoint);return{menuEl,mapEl}}function paintIdentity(){if(!idPanel||!hooks.identity)return;ensureGriftCSS();const id=hooks.identity();const n2=n=>String(n|0).padStart(2,"0");const row=(k,v)=>`<span class="k">${k}</span><span class="v">${v}</span>`;idPanel.innerHTML=`<div class="k">GRIFT ID</div><div class="addr${id.connected?"":" guest"}">${id.connected?id.abbrev:id.econ?.short?"GRIFT ID "+id.econ.short:"NO WALLET"}</div><div class="chain${id.connected?"":" off"}">${id.connected?`${id.chain} · CONNECTED`:"NO WALLET · THE GAME IS YOURS EITHER WAY"}</div>`+(id.econ?`<div class="rows" style="margin-bottom:4px">`+row("GRIFT ID",id.econ.short||"—")+row("CASH",id.econ.cash!=null?"$"+Math.round(id.econ.cash).toLocaleString("en-US"):"—")+row("COLLECTION",n2(id.econ.collection))+row("EARNED",n2(id.econ.earned))+row("PURCHASED",n2(id.econ.purchased))+row("MARKET",n2(id.econ.market))+row("LISTED",n2(id.econ.listed))+(id.econ.sales?row("MARKET SALES",n2(id.econ.sales)):"")+`</div>`:"")+(id.connected?`<div class="rows">`+row("STATUS","CONNECTED")+row("ACCESS",id.access||"HOLDER")+row("ASSETS",`${n2(id.stocks)} ${econChip("WALLET")}`+(id.claimable?` ${n2(id.claimable)} ${econChip("CLAIMABLE")}`:""))+row("COSMETICS",`${n2(id.cosmetics)}${id.drop?` · DROP ${id.drop.number} ${id.drop.collected} / ${id.drop.total}`:""}`)+row("CLAIMS",n2(id.claims))+row("SOLANA","CONNECTED")+`</div>`:`<div class="rows">`+row("STATUS","NOT CONNECTED")+row("ACCESS","NOT CONNECTED")+row("ASSETS",econChip("LOCAL"))+row("COSMETICS","STANDARD ISSUE")+`</div>`)+`<div class="acts"></div>`;const acts=idPanel.querySelector(".acts");const mk=(label,cls,fn)=>{const b=document.createElement("button");b.className="cf-btn"+(cls?" "+cls:"");b.textContent=label;b.onclick=fn;acts.appendChild(b)};if(hooks.onMarket)mk("MARKET","cf-pri",()=>hooks.onMarket());if(hooks.onLedger)mk("LEDGER","",()=>hooks.onLedger());if(id.connected){if(hooks.onStore)mk("OFFBOOK","",()=>hooks.onStore());if(hooks.onDisconnect)mk("DISCONNECT","",()=>hooks.onDisconnect())}else{if(hooks.onConnect)mk("CONNECT","",()=>hooks.onConnect());if(hooks.onStore)mk("OFFBOOK","",()=>hooks.onStore())}}export function openMenu(world){paintIdentity();if(updateNote){const up=typeof window!=="undefined"&&window.__gtcUpdate;updateNote.style.display=up&&up.ready?"":"none"}const st=world.stats;const r=statRefs;const ach=world.ach?Object.keys(world.ach).length:0;const achTotal=world.achTotal||10;const vals=[(st.swungM/1e3).toFixed(2)+" <em>km</em>","<em>$</em>"+(st.styleBest|0),st.missions|0,st.fares|0,st.tanks|0,st.jackpots|0,st.rivals|0,"<em>$</em>"+(world.money|0)];vals.forEach((v,i)=>{r[i].innerHTML=String(v)});const tok=st.tokens|0;r.pkt.textContent=`${tok}/20`;r.pkb.style.width=Math.min(100,tok/20*100)+"%";r.act.textContent=`${ach}/${achTotal}`;r.acb.style.width=Math.min(100,ach/achTotal*100)+"%";r.lvl.textContent="LEVEL "+world.level;r.xp.textContent=(world.xp|0)+" XP";const loc=document.getElementById("pz-loc");if(loc){const sn=document.getElementById("streetname");const d=sn?.querySelector("i")?.textContent||"";const st2=sn?Array.from(sn.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join("").trim():"";loc.textContent=d&&st2?`${d} // ${st2}`:d||st2||CITY_NAME}const clk=document.getElementById("pz-clock");if(clk){const h=Math.floor(world.clock)%24;const m=Math.floor(world.clock%1*60);clk.textContent=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`}const wnt=document.getElementById("pz-wanted");if(wnt){const n=world.wanted|0;wnt.innerHTML=n===0?'<span style="color:var(--cf-ink-faint)">HEAT 00 / 05</span>':`<span style="color:${n>=4?"var(--cf-danger)":"var(--cf-accent)"}">${"■".repeat(n)}</span><span style="color:var(--cf-ink-faint)">${"□".repeat(Math.max(0,5-n))}</span> <span style="color:var(--cf-ink-faint)">HEAT ${String(n).padStart(2,"0")} / 05</span>`}const wal=document.getElementById("pz-wallet");if(wal){const h=hooks.walletLine?.();wal.innerHTML=h?`${h} · CONNECTED`:'<span style="color:var(--cf-ink-faint)">NOT CONNECTED</span>'}const oc=hooks.onchain?.();if(oc){const put=(id,html)=>{const el=document.getElementById(id);if(el)el.innerHTML=html};const faint=t=>`<span style="color:var(--cf-ink-faint)">${t}</span>`;put("pz-chain",`<i class="${oc.chain.status==="LIVE"?"":oc.chain.status==="STALE"?"stale":"off"}"></i>${oc.chain.line}`);put("pz-holding",oc.wallet.graded?`${oc.wallet.balanceLine} <em>· ${oc.wallet.readLine}</em>`:faint(oc.wallet.tierState==="off"?`— · no ${oc.wallet.balanceLine.split(" ")[0]} contract deployed yet`:oc.wallet.connected?"— · reading the balance":"— · connect a wallet to read one"));put("pz-stocks",oc.stocks.positions?`${oc.stocks.positions} POSITION${oc.stocks.positions===1?"":"S"} · $${oc.stocks.stockValue.toLocaleString("en-US")} <em>· SIMULATED MARKET · LOCAL</em>`:faint("NONE · the kiosk trades 1-5 · LOCAL"));const act=document.getElementById("pz-activity");if(act){const list=oc.activity||[];act.innerHTML=list.length?list.map(e=>`<div class="r"><span class="c">${e.clock}</span><span class="x">${e.text}</span><span class="s ${e.src==="chain"?"v":e.src==="tier"?"t":""}">${e.tag}</span></div>`).join(""):'<div class="none">nothing yet — walk somewhere, buy something, link a wallet</div>'}}if(walletBtn)walletBtn.querySelector("span").textContent=hooks.walletLine?.()?"DISCONNECT WALLET":"CONNECT WALLET";if(leaveBtn){const room=hooks.venueInside?.();leaveBtn.style.display=room?"":"none";if(room)leaveBtn.querySelector("span").textContent=`STEP OUTSIDE — ${room}`}menuEl.style.display="flex";document.body.classList.add("gtc-paused")}export function closeMenu(){menuEl.style.display="none";document.body.classList.remove("gtc-paused")}function sizeMapCanvas(){const columns=(exploreEl?.style.display!=="none"?268+14:0)+(travelEl?.style.display!=="none"?250+14:0);const w=window.innerWidth-columns-64;const h=window.innerHeight-150;const size=Math.max(320,Math.min(1100,Math.floor(Math.min(w,h))));if(exploreEl)exploreEl.style.height=size+"px";if(travelEl)travelEl.style.maxHeight=size+"px";if(mapCanvas.width===size)return;mapCanvas.width=size;mapCanvas.height=size;mapCanvas.style.width=mapCanvas.style.height=size+"px"}export function openMap(world){mapEl.style.display="flex";document.body.classList.add("gtc-paused");sizeMapCanvas();mapWorld=world;mapDirty=()=>drawBigMap(world);drawBigMap(world)}window.addEventListener("resize",()=>{if(!mapEl||mapEl.style.display==="none")return;sizeMapCanvas();if(mapDirty)mapDirty()});export function closeMap(){mapEl.style.display="none";document.body.classList.remove("gtc-paused")}function cf(name,fallback){return paletteColor("--cf-"+name,fallback)}function venueMark(g,x,z,r,name){g.save();g.beginPath();g.moveTo(x,z-r);g.lineTo(x+r,z);g.lineTo(x,z+r);g.lineTo(x-r,z);g.closePath();g.fillStyle=inkA("warn",.85,"var(--cf-warn)");g.fill();g.strokeStyle=inkA("bg",.9,"#0b0e0b");g.lineWidth=Math.max(1,r*.2);g.stroke();if(r>=6&&name){g.fillStyle=cf("bg","#0b0e0b");g.font=`900 ${Math.round(r*1.1)}px system-ui, sans-serif`;g.textAlign="center";g.textBaseline="middle";g.fillText(name[0],x,z+r*.05)}g.restore()}function inkA(name,a,fallback){const hex=cf(name,fallback);const m=/^#?([0-9a-f]{6})$/i.exec(hex.replace("#","#"));if(!m)return hex;const n=parseInt(m[1],16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}export function drawBigMap(world){const g=mapCanvas.getContext("2d");const size=mapCanvas.width;mapClamp();const{sc,Z,mode}=drawCityMap(g,{size,cx:mapView.cx,cz:mapView.cz,zoom:mapView.z,world,surface:"map"});drawMapLegend(g,{size,sc,zoom:Z,mode});drawMapCompass(g,{size})}
