import*as THREE from"three";import{blockPlan,ringPlan}from"./blockplan.js";import{HALF_WORLD,WATER_X0,WATER_X1,WATER_Z,SEA_Z0,SEA_Z1,SEA_X}from"./harborgeometry.js";import{nm}from"./scenekit.js";const FAR=320,NEAR_R=230,ON_R=34,OFF_R=48,ROOF_SHADOW=64;const PUSH0=.955,PUSH1=.996;const PUSH_GLSL=`
  uniform float uFar;
  varying float vTrue;
  vec4 pushFar(vec4 mv) {
    float d = length(mv.xyz);
    vTrue = d;
    float t = 1.0 - exp(-d / 1800.0);
    float dd = uFar * (${PUSH0.toFixed(3)} + (${PUSH1.toFixed(3)} - ${PUSH0.toFixed(3)}) * t);
    mv.xyz *= dd / max(d, 1e-3);
    return mv;
  }`;const FOG_GLSL=`
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying float vTrue;
  vec3 fogged(vec3 c) {
    float f = 1.0 - exp(-uFogDensity * uFogDensity * vTrue * vTrue);
    return mix(c, uFogColor, clamp(f, 0.0, 1.0));
  }`;function skylineMaterial(U){return new THREE.ShaderMaterial({uniforms:U,fog:false,lights:false,vertexShader:`
      attribute vec4 aInfo;            // x: base tone, y: kind (0 plain, 1 glass, 2 the freeway's deck), z: seed, w: height
      varying vec3 vWorld; varying vec3 vN; varying vec4 vInfo;
      ${PUSH_GLSL}
      void main() {
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vWorld = wp.xyz; vInfo = aInfo;
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        gl_Position = projectionMatrix * pushFar(viewMatrix * wp);
      }`,fragmentShader:`
      uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGround; uniform float uNight;
      varying vec3 vWorld; varying vec3 vN; varying vec4 vInfo;
      ${FOG_GLSL}
      float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      void main() {
        vec3 n = normalize(vN);
        float glass = vInfo.y;
        vec3 base = mix(vec3(0.62, 0.58, 0.52) * (0.75 + 0.35 * vInfo.x), vec3(0.30, 0.36, 0.42) * (0.8 + 0.3 * vInfo.x), glass);
        if (n.y > 0.5) base = vec3(0.24, 0.21, 0.19);                          // the roofs: the city's own brown slabs
        float sun = max(0.0, dot(n, uSunDir));
        float hemi = 0.5 + 0.5 * n.y;
        if (glass > 1.5) base = vec3(0.62, 0.60, 0.56);                        // the freeway: pale concrete
        vec3 col = base * (uSunCol * sun * 0.9 + mix(uGround, uSky, hemi) * 0.75);
        // the deck under its own lamps after dark: a sodium-lit ribbon round the city
        if (glass > 1.5) col = mix(col, vec3(0.42, 0.34, 0.24), smoothstep(0.6, 0.95, uNight) * 0.8);
        // WINDOWS on the walls: a storey every 4 m, a bay every 3 m, the pane inset in its cell
        if (abs(n.y) < 0.5 && glass < 1.5) {
          float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
          vec2 cell = vec2(u / 3.0, (vWorld.y - 1.0) / 4.0);
          vec2 f = fract(cell);
          float pane = step(0.18, f.x) * step(f.x, 0.82) * step(0.22, f.y) * step(f.y, 0.78) * step(4.5, vWorld.y) * step(vWorld.y, vInfo.w - 1.0);
          vec2 id = floor(cell) + vec2(vInfo.z * 17.0, n.x * 3.0 + n.z * 7.0);
          float r = h21(id);
          float lit = step(1.0 - mix(0.04, 0.34, uNight), r);
          vec3 warm = mix(vec3(1.0, 0.72, 0.42), vec3(0.85, 0.9, 1.0), step(0.86, h21(id + 3.1)));
          vec3 glassDay = mix(col * 0.55, uSky * 0.6, 0.35 + 0.3 * glass);
          col = mix(col, glassDay, pane * (1.0 - uNight));
          col = mix(col, col * 0.35, pane * uNight);
          col += pane * lit * warm * (0.15 + 1.25 * uNight);
        }
        gl_FragColor = vec4(fogged(col), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}function ridgeMaterial(U,color){return new THREE.ShaderMaterial({uniforms:{...U,uColor:{value:color.clone()}},fog:false,lights:false,side:THREE.DoubleSide,vertexShader:`
      varying vec3 vN;
      ${PUSH_GLSL}
      void main() {
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * pushFar(viewMatrix * modelMatrix * vec4(position, 1.0));
      }`,fragmentShader:`
      uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uColor;
      varying vec3 vN;
      ${FOG_GLSL}
      void main() {
        vec3 n = normalize(vN); if (n.y < 0.0) n = -n;
        vec3 col = uColor * (uSunCol * max(0.0, dot(n, uSunDir)) * 0.9 + mix(uGround, uSky, 0.5 + 0.5 * n.y) * 0.75);
        gl_FragColor = vec4(fogged(col), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}function groundMaterial(U){const plan=blockPlan();const roads=plan.centres.slice(0,11);while(roads.length<11)roads.push(1e6);const ring=(ringPlan()?.ringCentres||[]).slice(0,10);while(ring.length<10)ring.push(1e6);return new THREE.ShaderMaterial({uniforms:{...U,uRoads:{value:roads},uRing:{value:ring},uRoadW:{value:plan.ROAD},uHalf:{value:HALF_WORLD},uWater:{value:new THREE.Vector4(WATER_X0,WATER_X1,WATER_Z,0)},uSea:{value:new THREE.Vector4(SEA_Z0,SEA_Z1,SEA_X,0)}},fog:false,lights:false,side:THREE.DoubleSide,vertexShader:`
      varying vec3 vWorld;
      ${PUSH_GLSL}
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * pushFar(viewMatrix * wp);
      }`,fragmentShader:`
      uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSky; uniform float uNight;
      uniform float uRoads[11]; uniform float uRing[10]; uniform float uRoadW; uniform float uHalf; uniform vec4 uWater; uniform vec4 uSea;
      varying vec3 vWorld;
      ${FOG_GLSL}
      float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      // distance to the nearest road centre on one axis: the core's grid inside it, the ring's roads past it
      float roadD(float v, bool core) {
        float d = 1e6;
        if (core) { for (int i = 0; i < 11; i++) d = min(d, abs(v - uRoads[i])); }
        else { for (int i = 0; i < 10; i++) d = min(d, abs(v - uRing[i])); }
        return d;
      }
      void main() {
        float x = vWorld.x, z = vWorld.z;
        bool water = (x > uWater.x + 1.0 && x < uWater.y && abs(z) < uWater.z) || (z > uSea.x + 1.0 && z < uSea.y && abs(x) < uSea.z);
        vec3 light = uSunCol * max(0.0, uSunDir.y) * 0.6 + uSky * 0.45;
        // the lamps come on with the night proper, not at the first warmth of the evening
        float dark = smoothstep(0.6, 0.95, uNight);
        vec3 col;
        if (water) {
          col = mix(vec3(0.05, 0.16, 0.22), uSky * 0.8, 0.45) * (0.6 + 0.4 * (1.0 - uNight));
          // the city's lights on the swell
          col += dark * vec3(1.0, 0.6, 0.3) * 0.12 * step(0.985, h21(floor(vWorld.xz / 3.0)));
        } else if (abs(x) > uHalf + 24.0 || abs(z) > uHalf + 24.0) {
          col = vec3(0.30, 0.25, 0.19) * light;                                // the beach and the scrub past the city
        } else {
          bool core = max(abs(x), abs(z)) < uRoads[10] + 8.0;
          float rx = roadD(x, core), rz = roadD(z, core), r = min(rx, rz);
          float hw = uRoadW * 0.5;
          vec3 block = core ? vec3(0.24, 0.20, 0.17) : vec3(0.21, 0.19, 0.14), walk = vec3(0.34, 0.31, 0.27), asphalt = vec3(0.11, 0.11, 0.12);
          col = r < hw - 2.6 ? asphalt : r < hw + 1.0 ? walk : block;
          // the blocks are not bare: roofs, yards and trees break them up
          col *= 0.8 + 0.4 * h21(floor(vWorld.xz / 9.0));
          col *= light;
          // the lamps: a pool every 24 m along each kerb, sodium after dark
          float along = r == rx ? z : x;
          float lamp = (1.0 - smoothstep(0.0, 4.5, abs(r - (hw - 1.5)))) * (1.0 - smoothstep(0.0, 6.0, abs(mod(along, 24.0) - 12.0)));
          col += dark * lamp * vec3(1.0, 0.62, 0.28) * (core ? 0.38 : 0.22);
          // the street's own glow: headlights and shopfronts, a warm haze over the asphalt
          col += dark * (1.0 - smoothstep(hw - 3.0, hw + 2.0, r)) * vec3(0.30, 0.20, 0.12) * (core ? 0.12 : 0.04);
          // the houses past the core: a lit window here and there
          if (!core) col += dark * vec3(1.0, 0.7, 0.4) * 0.5 * step(0.992, h21(floor(vWorld.xz / 5.0)));
        }
        gl_FragColor = vec4(fogged(col), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}function groundRings(cx,cz,r0,r1,seg=144,k=1.07){const radii=[];for(let r=r0;r<r1;r*=k)radii.push(r);radii.push(r1);const pos=[],idx=[];for(const r of radii)for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2;pos.push(cx+Math.cos(a)*r,.02,cz+Math.sin(a)*r)}const row=seg+1;for(let j=0;j<radii.length-1;j++)for(let i=0;i<seg;i++){const a=j*row+i,b=a+1,c=a+row,d=c+1;idx.push(a,c,b,b,c,d)}const g=new THREE.BufferGeometry;g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);return g}export function buildCrownSkyline(scene,world,P){const U={uFar:{value:FAR},uSunDir:{value:new THREE.Vector3(0,1,0)},uSunCol:{value:new THREE.Color(1,1,1)},uSky:{value:new THREE.Color(.5,.6,.7)},uGround:{value:new THREE.Color(.3,.28,.25)},uNight:{value:0},uFogColor:{value:new THREE.Color},uFogDensity:{value:0}};const far=(x,z)=>Math.hypot(x-P.cx,z-P.cz)>NEAR_R;const boxes=[];const v3=world.v3TowersPlan||[];const v3At=(x,z)=>v3.find(t=>Math.abs(t.x-x)<3&&Math.abs(t.z-z)<3);const recs=world.city?.buildingRecs||[];for(const r of recs){if(!far(r.lotX,r.lotZ))continue;const t=v3At(r.lotX,r.lotZ);if(t){for(const m2 of t.masses)boxes.push([t.x,t.z,m2.w,m2.d,m2.y0,m2.y1,1]);const last=t.masses[t.masses.length-1];if(t.top>last.y1+1)boxes.push([t.x,t.z,last.w*.7,last.d*.7,last.y1,t.top,1]);continue}let y0=0;for(const[w,d,top]of r.tiers||[[r.w,r.d,r.hgt]]){boxes.push([r.lotX,r.lotZ,w,d,y0,top+.2,r.kind==="glass"?1:0]);y0=top+.2}}const inRec=(x,z)=>recs.some(r=>Math.abs(x-r.lotX)<r.w/2+1&&Math.abs(z-r.lotZ)<r.d/2+1);for(const c of world.city?.colliders||[]){if(c.crown||c.crownAir||c.floor||(c.h??0)<8||c.x1-c.x0<5||c.z1-c.z0<5)continue;const x=(c.x0+c.x1)/2,z=(c.z0+c.z1)/2;if(!far(x,z)||inRec(x,z))continue;boxes.push([x,z,c.x1-c.x0,c.z1-c.z0,0,c.h-.3,c.h>=40?1:0])}const fw=world.city?.freewayLoop?.plan;if(fw&&fw.pointAt){const STEP=12;for(let s0=0;s0<fw.total;s0+=STEP){const a=fw.pointAt(s0),b=fw.pointAt(Math.min(fw.total,s0+STEP));const x=(a.x+b.x)/2,z=(a.z+b.z)/2;if(!far(x,z))continue;boxes.push([x,z,fw.deckW||24,Math.hypot(b.x-a.x,b.z-a.z)+.6,(fw.deckY||13.5)-1.4,(fw.deckY||13.5)+.9,2,Math.atan2(b.x-a.x,b.z-a.z)])}}const box=new THREE.BoxGeometry(1,1,1,1,4,1);box.translate(0,.5,0);box.deleteAttribute("uv");const mat=skylineMaterial(U);const n=Math.max(1,boxes.length);const im=new THREE.InstancedMesh(box,mat,n);const info=new Float32Array(n*4);const m=new THREE.Matrix4,q=new THREE.Quaternion,p=new THREE.Vector3,s=new THREE.Vector3;const Y=new THREE.Vector3(0,1,0);boxes.forEach(([x,z,w,d,y0,y1,glass,yaw=0],i)=>{p.set(x,y0,z);s.set(w,Math.max(.5,y1-y0),d);q.setFromAxisAngle(Y,yaw);im.setMatrixAt(i,m.compose(p,q,s));const seed=Math.abs(Math.sin(x*12.9898+z*78.233)*43758.5453)%1;info.set([seed,glass,seed*97%1,y1],i*4)});im.count=boxes.length;box.setAttribute("aInfo",new THREE.InstancedBufferAttribute(info,4));im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;im.castShadow=false;im.receiveShadow=false;im.renderOrder=-8;const ground=new THREE.Mesh(groundRings(P.cx,P.cz,110,HALF_WORLD+1400),groundMaterial(U));ground.frustumCulled=false;ground.renderOrder=-8;const group=new THREE.Group;group.name="crownview";group.add(nm(im,"crownview:skyline"),nm(ground,"crownview:ground"));const ridges=[];scene.traverse(o=>{if(o.isMesh&&o.userData.ridge)ridges.push(o)});for(const r of ridges){const h=new THREE.Mesh(r.geometry,ridgeMaterial(U,r.material.color));h.frustumCulled=false;h.renderOrder=-8;h.position.copy(r.position);h.quaternion.copy(r.quaternion);h.scale.copy(r.scale);group.add(nm(h,"crownview:ridge"))}group.visible=false;scene.add(group);group.traverse(o=>{o.userData.noMerge=true;if(o.isMesh)o.raycast=()=>{}});return{group,U,boxes:boxes.length}}export function updateCrownView(world,camera,scene,sky,hooks){const R=world.crown;const V=R?.view;if(!V)return;const c=camera.position;const d=Math.hypot(c.x-R.P.cx,c.z-R.P.cz);const up=c.y>R.P.y-8;const want=V.forced!=null?V.forced:V.on?up&&d<OFF_R:up&&d<ON_R;if(want!==V.on){V.on=want;V.skyline.group.visible=want;const k=want?(FAR-20)/860:1;sky.dome.scale.setScalar(k);sky.stars.scale.setScalar(k);if(want){V.farWas=camera.far;camera.far=FAR;hooks.setShadowSpan(ROOF_SHADOW)}else{camera.far=V.farWas||hooks.farRest;hooks.setShadowSpan(hooks.shadowRest())}camera.updateProjectionMatrix();V.switches=(V.switches||0)+1}if(!want)return;if(camera.far!==FAR){camera.far=FAR;camera.updateProjectionMatrix()}sky.dome.position.copy(camera.position);sky.stars.position.copy(camera.position);const U=V.skyline.U,sd=world.sunDir;if(sd)U.uSunDir.value.copy(sd).normalize();const sunI=hooks.sun?hooks.sun.intensity:1;if(hooks.sun)U.uSunCol.value.copy(hooks.sun.color).multiplyScalar(Math.min(1.6,sunI)*(U.uSunDir.value.y>0?1:0));if(hooks.hemi){U.uSky.value.copy(hooks.hemi.color).multiplyScalar(hooks.hemi.intensity);U.uGround.value.copy(hooks.hemi.groundColor).multiplyScalar(hooks.hemi.intensity)}U.uNight.value=Math.max(0,Math.min(1,(Number(world.nightGlow)||0)*1.25-.1));if(scene.fog){U.uFogColor.value.copy(scene.fog.color);U.uFogDensity.value=scene.fog.density||0}}export function initCrownView(scene,world,P){const skyline=buildCrownSkyline(scene,world,P);return{on:false,forced:null,skyline,far:FAR,nearR:NEAR_R,boxes:skyline.boxes}}
