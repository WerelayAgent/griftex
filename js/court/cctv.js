import{ShaderPass}from"three/addons/postprocessing/ShaderPass.js";const SHADER={uniforms:{tDiffuse:{value:null},uFish:{value:.2},uGrain:{value:.06},uWash:{value:.3},uTint:{value:[.93,1,.97]},uVig:{value:.55},uLines:{value:.035},uTime:{value:0},uRes:{value:[1920,1080]}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uFish, uGrain, uWash, uVig, uLines, uTime; uniform vec3 uTint; uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float asp = uRes.x / uRes.y;
      vec2 q = vec2(p.x * asp, p.y);
      float r2 = dot(q, q) / (asp * asp);
      // the barrel: sample further out the further from the centre, scaled so the frame's corners stay filled
      vec2 s = p * (1.0 + uFish * r2) / (1.0 + uFish * 1.6);
      vec2 uv = s * 0.5 + 0.5;
      vec3 c = texture2D(tDiffuse, clamp(uv, 0.0, 1.0)).rgb;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) c = vec3(0.0);
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(c, vec3(l), uWash) * uTint;
      c = (c - 0.5) * 1.08 + 0.5;
      c *= 1.0 - uVig * smoothstep(0.35, 1.45, length(q) / asp * 1.25);
      c *= 1.0 - uLines * step(0.5, fract(vUv.y * uRes.y * 0.5));
      float g = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 113.0) - 0.5;
      c += g * uGrain;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};export function cctvPass(composer){const pass=new ShaderPass(SHADER);pass.name="court:cctv";let on=false;const U=pass.uniforms;return{pass,attach(){if(!on&&composer){composer.addPass(pass);on=true}return this},detach(){if(on&&composer){composer.removePass?.(pass);on=false}return this},set(o={}){if(o.fish!=null)U.uFish.value=o.fish;if(o.grain!=null)U.uGrain.value=o.grain;if(o.wash!=null)U.uWash.value=o.wash;if(o.tint)U.uTint.value=o.tint;if(o.vig!=null)U.uVig.value=o.vig;if(o.lines!=null)U.uLines.value=o.lines;return this},tick(t,w,h){U.uTime.value=t;if(w&&h)U.uRes.value=[w,h]}}}
