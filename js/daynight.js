import*as THREE from"three";import{moodSample,moodFogColor,moodEmissive}from"./moods.js";import{driveBrandMats}from"./brandmat.js";import{nm}from"./scenekit.js";export const DAY_START=18.35;export{clockRate,openingScale,OPEN_SCALE,OPEN_HOLD,OPEN_EASE}from"./clockband.js";const KEYS=[{h:0,top:395279,hor:1709072,sun:9087156,sunI:.18,hemiI:.16,glow:1,haze:.0056,exp:1.06},{h:4.5,top:461071,hor:1709330,sun:9087156,sunI:.18,hemiI:.16,glow:1,haze:.0056,exp:1.06},{h:6,top:2898528,hor:13204046,sun:16751189,sunI:1.15,hemiI:.32,glow:.75,haze:.003,exp:1.02},{h:7.5,top:5076651,hor:14467226,sun:16767400,sunI:2.2,hemiI:.52,glow:.25,haze:.0026,exp:.93},{h:10,top:4882366,hor:13815490,sun:16773848,sunI:2.3,hemiI:.85,glow:0,haze:.0022,exp:.79},{h:12.5,top:4159682,hor:13946815,sun:16774882,sunI:2.5,hemiI:.88,glow:0,haze:.002,exp:.75},{h:15,top:4882362,hor:14076078,sun:16773332,sunI:2.35,hemiI:.86,glow:0,haze:.0024,exp:.8},{h:17.5,top:4614302,hor:14986354,sun:16760444,sunI:3.3,hemiI:.3,glow:.2,haze:.0032,exp:.92},{h:19,top:2767438,hor:13922623,sun:16744504,sunI:2.35,hemiI:.24,glow:.62,haze:.0036,exp:1},{h:19.7,top:1712948,hor:8014380,sun:10135220,sunI:.32,hemiI:.42,glow:.9,haze:.003,exp:1.04},{h:20.5,top:527126,hor:1971730,sun:9087156,sunI:.18,hemiI:.18,glow:1,haze:.0056,exp:1.06},{h:24,top:395279,hor:1709072,sun:9087156,sunI:.18,hemiI:.16,glow:1,haze:.0056,exp:1.06}];const _a=new THREE.Color;const _b=new THREE.Color;function sample(hours){let i=0;while(i<KEYS.length-2&&KEYS[i+1].h<=hours)i++;const k0=KEYS[i];const k1=KEYS[i+1];const t=(hours-k0.h)/(k1.h-k0.h);return{top:_a.setHex(k0.top).lerp(_b.setHex(k1.top),t).clone(),hor:_a.setHex(k0.hor).lerp(_b.setHex(k1.hor),t).clone(),sun:_a.setHex(k0.sun).lerp(_b.setHex(k1.sun),t).clone(),sunI:k0.sunI+(k1.sunI-k0.sunI)*t,hemiI:k0.hemiI+(k1.hemiI-k0.hemiI)*t,glow:k0.glow+(k1.glow-k0.glow)*t,haze:k0.haze+(k1.haze-k0.haze)*t,exp:k0.exp+(k1.exp-k0.exp)*t}}export function createSkyDome(scene){const uniforms={topColor:{value:new THREE.Color(7315668)},horizonColor:{value:new THREE.Color(11847898)},sunDir:{value:new THREE.Vector3(0,1,0)},haloI:{value:.35},sunColor:{value:new THREE.Color(16773328)},sunHaze:{value:1},moonDir:{value:new THREE.Vector3(-.35,.72,-.5).normalize()},moonI:{value:0},cloudAmt:{value:0},cloudTime:{value:0},cloudLit:{value:new THREE.Color(16777215)},cloudDark:{value:new THREE.Color(8884896)}};const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms,vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      varying vec3 vDir;
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 sunColor;
      uniform vec3 sunDir;
      uniform float haloI;
      uniform float sunHaze;
      uniform vec3 moonDir;
      uniform float moonI;
      uniform float cloudAmt;
      uniform float cloudTime;
      uniform vec3 cloudLit;
      uniform vec3 cloudDark;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      // Five octaves with a slight rotation between each, and normalised by
      // the amplitude sum so the output actually spans 0..1 rather than
      // clustering around 0.47 — which is what made the first coverage band
      // miss the distribution entirely. The rotation stops the octaves
      // stacking into visible grid streaks along the axes.
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5, sum = 0.0;
        mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
        for (int i = 0; i < 5; i++) {
          v += a * vnoise(p);
          sum += a;
          p = rot * p * 2.07;
          a *= 0.52;
        }
        return v / sum;
      }

      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, 0.0, 1.0);
        vec3 col = mix(horizonColor, topColor, pow(h, 0.62));
        float s = max(dot(d, sunDir), 0.0);
        // tight disc + a restrained halo — the old pow(s,10) glow flooded
        // half the sky to white around the sun
        // the disc, a restrained glow, and the bible's wide soft halo that
        // washes the frame warm — the disc runs past 1.0 so the bloom takes it
        col += sunColor * (pow(s, 1200.0) * (1.6 + haloI * 1.4) + pow(s, 26.0) * 0.11 * sunHaze + pow(s, 7.0) * 0.42 * haloI * sunHaze);
        // the moon: a small cool disc with a soft halo, only after dark
        float m = max(dot(d, moonDir), 0.0);
        col += vec3(0.86, 0.90, 1.0) * (pow(m, 4000.0) * 1.1 + pow(m, 120.0) * 0.06) * moonI;

        // One coherent branch across the whole dome, so the fbm costs nothing
        // when coverage is zero — which is how lowGfx and the phone path skip it.
        if (cloudAmt > 0.001) {
          // flat-plane projection: cheap, and it gives real perspective
          // convergence toward the horizon instead of a pasted-on band
          //
          // The fade reaches much lower than it used to. At 0.04-0.34 the
          // clouds only existed for a player who looked up, which is not how
          // anyone plays — the whole layer was invisible in normal sightlines.
          // 0.012-0.11 puts them into the sky you actually see down a street,
          // and the projection is clamped hard enough at max(d.y, 0.05) that
          // it still does not band where it stretches toward infinity.
          float horizonFade = smoothstep(0.012, 0.11, d.y);
          vec2 uv = d.xz / max(d.y, 0.05);
          uv = uv * 0.42 + vec2(cloudTime * 0.0061, cloudTime * 0.0023);
          float n = fbm(uv);
          // fbm is normalised now, so the band sits where the noise lives.
          // A second, larger-scale sample breaks the field into weather
          // systems — banks with real gaps — instead of one even mottle.
          float mass = fbm(uv * 0.31 + 11.3);
          // THE THRESHOLD THAT MADE THE CITY OVERCAST.
          //
          // At 0.62 the band sat below where this fbm's values actually live,
          // so nearly everything passed it: at the default cloudAmt of 0.58 the
          // layer covered almost the whole sky, and it has done in every frame
          // this game has ever rendered. The sky's gradient was never the
          // problem — with the branch off it is a deep blue running to a warm
          // horizon — the cloud was simply painted over all of it, in a colour
          // taken from the gradient itself, which is why it read as a flat
          // horizon-coloured dome rather than as cloud.
          //
          // Calibrated by picture, not by arithmetic: a sweep of this constant
          // rendered at noon, 0.74 through 0.94. 0.88 is the LA sky — deep blue
          // overhead, a bank of high cloud, wisps across it. The cloudAmt
          // coefficient goes 0.34 -> 0.46 at the same time so the knob keeps
          // its range: at 0.62/0.34 nothing above cloudAmt 1 could ever reach
          // overcast again, so rain had nowhere to go.
          float lo = 0.95 - cloudAmt * 0.46 - mass * 0.16;
          float cov = smoothstep(lo, lo + 0.20, n) * horizonFade;
          // lit from the sun side, shadowed away from it
          float sl = clamp(dot(d, sunDir) * 0.5 + 0.5, 0.0, 1.0);
          col = mix(col, mix(cloudDark, cloudLit, sl * sl), cov * 0.95);
        }
        gl_FragColor = vec4(col, 1.0);
      }`});const dome=new THREE.Mesh(new THREE.SphereGeometry(860,28,14),mat);dome.frustumCulled=false;dome.renderOrder=-10;scene.add(nm(dome,"daynight:dome"));const starCount=650;const starPos=new Float32Array(starCount*3);for(let i=0;i<starCount;i++){const theta=Math.random()*Math.PI*2;const phi=Math.acos(.08+Math.random()*.85);const r=820;starPos[i*3]=r*Math.sin(phi)*Math.cos(theta);starPos[i*3+1]=r*Math.cos(phi);starPos[i*3+2]=r*Math.sin(phi)*Math.sin(theta)}const starGeo=new THREE.BufferGeometry;starGeo.setAttribute("position",new THREE.BufferAttribute(starPos,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:13623551,size:1.7,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false}));stars.frustumCulled=false;stars.renderOrder=-9;scene.add(nm(stars,"daynight:stars"));return{dome,uniforms,stars}}const _sunDir=new THREE.Vector3;const _skyDir=new THREE.Vector3(0,1,0);const _fogGray=new THREE.Color;const _sodiumHaze=new THREE.Color(4599834);export function applyDayNight(hours,ctx){const{scene,sun,hemi,sky,camera,city,renderer}=ctx;const s=sample(hours);moodSample(s,hours);const ang=(hours-6)/13.7*Math.PI;const elev=Math.sin(ang)*.92;_skyDir.set(Math.cos(ang),elev,.21).normalize();if(elev>.035){_sunDir.set(Math.cos(ang),elev,.21).normalize()}else{_sunDir.set(-.35,.72,-.5).normalize()}sun.color.copy(s.sun);sun.intensity=s.sunI;hemi.intensity=s.hemiI;hemi.color.copy(s.top).lerp(_a.setHex(11125990),.28);hemi.groundColor.setHex(3817272).multiplyScalar(.4+(1-s.glow)*.6);sky.uniforms.topColor.value.copy(s.top);sky.uniforms.horizonColor.value.copy(s.hor);sky.uniforms.sunColor.value.copy(s.sun);sky.uniforms.sunDir.value.copy(_sunDir);sky.uniforms.sunHaze.value=.35+(1-s.glow)*.55;sky.uniforms.moonI.value=Math.max(0,s.glow-.5)*2;const lit=sky.uniforms.cloudLit.value.copy(s.hor).lerp(s.sun,.45);lit.multiplyScalar(.92+(1-s.glow)*.3);sky.uniforms.cloudDark.value.copy(s.hor).multiplyScalar(.42+(1-s.glow)*.26);sky.uniforms.cloudAmt.value=ctx.clouds===false?0:.58-s.glow*.12;sky.uniforms.cloudTime.value=hours*60;sky.dome.position.copy(camera.position);sky.stars.material.opacity=Math.max(0,(s.glow-.62)/.38)*.9;sky.stars.position.copy(camera.position);scene.fog.color.copy(s.hor);const fogLuma=scene.fog.color.r*.299+scene.fog.color.g*.587+scene.fog.color.b*.114;scene.fog.color.lerp(_fogGray.setRGB(fogLuma,fogLuma,fogLuma),.3).multiplyScalar(.86);const nightHaze=Math.max(0,(s.glow-.62)/.38);if(nightHaze>0)scene.fog.color.lerp(_sodiumHaze,nightHaze*.7);moodFogColor(scene.fog.color);const gh=Math.max(0,1-Math.abs(hours-18.5)/2.2);const camY=camera?.position?.y??0;const lowPool=.3+.7*Math.max(0,1-Math.max(0,camY-8)/62);const EDGE_CAP=1.35+Math.max(0,(s.glow-.7)/.3)*1.1,FAR=430;const hazeScale=(scene.userData.hazeScale??1)*(scene.userData.hazeAt&&camera?scene.userData.hazeAt(camera.position):1);const goldRelief=1-gh*gh*.3;scene.fog.density=Math.min(s.haze*goldRelief*lowPool*hazeScale,EDGE_CAP/FAR);if(gh>0)scene.fog.color.lerp(s.hor,gh*.2);const gold=Math.max(0,1-Math.abs(hours-18.5)/1.6);const envFloor=.14+.16*gold;if("environmentIntensity"in scene)scene.environmentIntensity=envFloor+(.75-envFloor)*Math.pow(1-s.glow,3);const em=moodEmissive();for(const m of city.windowMats)m.emissiveIntensity=(.06+s.glow*1.75)*em;city.lampGlowMat.opacity=Math.min(1,s.glow*.72*em);city.bulbMat.emissiveIntensity=(.25+s.glow*1.9)*em;driveBrandMats(s.glow,em);if(renderer)renderer.toneMappingExposure=s.exp;return{glow:s.glow,sunDir:_sunDir,skyDir:_skyDir,exposure:s.exp}}
