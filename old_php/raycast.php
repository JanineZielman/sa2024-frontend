 <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
<script>
const ALPHA_THRESHOLD = 50;
const RAY_COUNT = 200;
const RAY_STEP = 1.2;
const HEADROOM = 6.0;

// NOTE: add hVis (virtual visible height in level space)
const level = { w:0, h:0, hVis:0, solid:null };
function isSolidLevel(x, y){
  const xi = x|0, yi = y|0;
  const hVis = level.hVis || level.h || 0;

  // out of horizontal bounds or below virtual bottom => solid (stop)
  if (xi < 0 || yi < 0 || xi >= level.w || yi >= hVis) return true;

  // between real image bottom and virtual bottom => empty (paintable)
  if (yi >= level.h) return false;

  // inside the image => use alpha mask
  return level.solid[yi * level.w + xi] === 1;
}

let CSSW = 1, CSSH = 1;
let scale = 1, offsetX = 0, offsetY = 0;
function levelToScreen(p){ return { x: p.x * scale + offsetX, y: p.y * scale + offsetY }; }
function screenToLevel(x, y){ return { x: (x - offsetX) / scale, y: (y - offsetY) / scale }; }

const rayMaskCanvas = document.createElement('canvas');
const rayMaskCtx = rayMaskCanvas.getContext('2d', { willReadFrequently:true });

const appEl = document.getElementById('app') || document.body;

const renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(1, 1, false);
appEl.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);

const fsTriGeo = new THREE.BufferGeometry();
fsTriGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
fsTriGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0,0,2,0,0,2]),2));

const commonGLSL = `
precision highp float;
varying vec2 vUv;
uniform vec2 resolution;
uniform float time;
float hash(vec2 p){ p=fract(p*0.3183099+vec2(0.71,0.113)); return fract(23.3*dot(p,p)); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0));
  float c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p, float oct){
  float amp=0.5, s=0.0;
  for(float i=0.0;i<6.0;i++){ if(i>=oct) break; s+=amp*noise(p); p*=2.02; amp*=0.5; }
  return s;
}
`;

const watercolorFS = `
${commonGLSL}
uniform sampler2D tPrev;
uniform sampler2D tBrush;
uniform sampler2D tRayMask;
uniform float bleed;
uniform float ink;
uniform float inkScale;
uniform float decay;
uniform vec3 baseColor;
uniform int colorIndex;

// Per-pigment airiness (0=thickest, 1=airiest): x=blue, y=grey, z=pink, w=brown
uniform vec4 pigmentAir;
uniform float airMin;

void main(){
  vec2 uv = vUv;
  float allow = texture2D(tRayMask, uv).r;
  vec3  prev  = texture2D(tPrev, uv).rgb;
  float mask  = texture2D(tBrush, uv).r * allow;

  // keep background decay unchanged
  prev = mix(prev, baseColor, decay * (1.0 - mask));

  if (mask <= 0.0001) { gl_FragColor = vec4(prev, 1.0); return; }

  // ---------- EDGE-ONLY CLOUDINESS -----------------------------------------
  vec2 texel = 1.0 / resolution;

  float mX1 = texture2D(tBrush, uv + vec2(texel.x, 0.0)).r;
  float mX2 = texture2D(tBrush, uv - vec2(texel.x, 0.0)).r;
  float mY1 = texture2D(tBrush, uv + vec2(0.0, texel.y)).r;
  float mY2 = texture2D(tBrush, uv - vec2(0.0, texel.y)).r;
  vec2  grad = vec2(mX1 - mX2, mY1 - mY2);
  float edgeG = clamp(length(grad) * 2.0, 0.0, 1.0); // gradient strength

  float ringInner = 0.01;
  float ringOuter = 0.05;
  float ringFade  = 0.38;
  float ring = smoothstep(ringInner, ringOuter, mask) * (1.0 - smoothstep(ringOuter, ringFade, mask));

  float edgeW = clamp(max(edgeG, ring), 0.0, 1.0) * allow;

  vec2  aspect = vec2(1.0, resolution.y / resolution.x);
  vec2  normal = normalize(grad + 1e-6);
  float n = fbm(uv*24.0 + time*0.03, 4.0) - 0.5;
  float spread = bleed * (0.35 + 0.65 * edgeW);
  vec2  offs = normal * n * spread * aspect;

  vec3 cIn  = texture2D(tPrev, uv - offs).rgb;
  vec3 cOut = texture2D(tPrev, uv + offs).rgb;
  vec3 flood = min(prev, min(cIn, cOut));

  float wet = edgeW;
  vec3 base = mix(prev, flood, wet);

  // pigments
  vec3 blue = vec3(0.486, 0.537, 0.969);
  vec3 grey = vec3(0.85);
  vec3 pink = vec3(1.00, 0.53, 0.77);
  vec3 pigment = (colorIndex==0)?blue
               : (colorIndex==1)?grey
               : (colorIndex==2)?pink
               : baseColor;

  float airy = (colorIndex==0)?pigmentAir.x
             : (colorIndex==1)?pigmentAir.y
             : (colorIndex==2)?pigmentAir.z
             : pigmentAir.w;

  float k = mask * ink * inkScale;
  k *= mix(1.0, airMin, clamp(airy, 0.0, 1.0));

  vec3 baseLin = pow(max(base,    0.0), vec3(2.2));
  vec3 pigLin  = pow(max(pigment, 0.0), vec3(2.2));
  vec3 outLin  = mix(baseLin, pigLin, clamp(k, 0.0, 1.0));
  vec3 coated  = pow(outLin, vec3(1.0/2.2));

  gl_FragColor = vec4(coated, 1.0);
}
`;

const passVS = `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,1.0); }
`;

// wider radial gradient brush
const brushFS = `
precision highp float;
varying vec2 vUv;
uniform vec2 brushPos;
uniform float brushSize;
uniform float down;
uniform vec2 resolution;
uniform float innerMul; // ~0.15
uniform float outerMul; // ~1.80

void main(){
  vec2 st=clamp(vUv,0.0,1.0);
  vec2 d=st-brushPos;
  d.x*=resolution.x/resolution.y;
  float dist=length(d);

  float inner = brushSize * innerMul;
  float outer = brushSize * outerMul;
  float m = smoothstep(inner, outer, dist);
  float a = (1.0 - m) * down;

  gl_FragColor=vec4(a,a,a,1.0);
}
`;

const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, type: THREE.UnsignedByteType, depthBuffer:false, stencilBuffer:false };
let rtA = new THREE.WebGLRenderTarget(4,4,rtOpts);
let rtB = new THREE.WebGLRenderTarget(4,4,rtOpts);
let brushRT = new THREE.WebGLRenderTarget(4,4,rtOpts);

const brushMat = new THREE.ShaderMaterial({
  uniforms: {
    brushPos: { value: new THREE.Vector2(-10,-10) },
    brushSize: { value: 0.08 },
    down: { value: 0 },
    resolution: { value: new THREE.Vector2(4,4) },
    innerMul: { value: 0.15 },
    outerMul: { value: 1.8 }
  },
  vertexShader: passVS, fragmentShader: brushFS, depthTest:false, depthWrite:false
});
const brushMesh = new THREE.Mesh(fsTriGeo, brushMat);
const brushScene = new THREE.Scene(); brushScene.add(brushMesh);

const tRayMask = new THREE.CanvasTexture(rayMaskCanvas);
tRayMask.minFilter = THREE.LinearFilter;
tRayMask.magFilter = THREE.LinearFilter;
tRayMask.wrapS = tRayMask.wrapT = THREE.ClampToEdgeWrapping;
tRayMask.flipY = true;

const waterMat = new THREE.ShaderMaterial({
  uniforms: {
    tPrev: { value: rtA.texture },
    tBrush: { value: brushRT.texture },
    tRayMask: { value: tRayMask },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(4,4) },
    bleed: { value: 0.05 },
    ink: { value: 0.12 },
    inkScale: { value: 1.0 },
    decay: { value: 0 },
    baseColor: { value: new THREE.Color(0x7a3700) }, // brown
    colorIndex: { value: 0 },
    pigmentAir: { value: new THREE.Vector4(0.1, 0.1, 0.9, 0.9) },
    airMin: { value: 1.0 }
  },
  vertexShader: passVS, fragmentShader: watercolorFS, depthTest:false, depthWrite:false
});
const waterMesh = new THREE.Mesh(fsTriGeo, waterMat);
scene.add(waterMesh);

const displayMat = new THREE.MeshBasicMaterial({ map: rtB.texture });
const displayMesh = new THREE.Mesh(fsTriGeo, displayMat);
const displayScene = new THREE.Scene(); displayScene.add(displayMesh);

function castRay(px, py, angle){
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const maxDist = Math.hypot(level.w, level.hVis || level.h || 0);
  let x = px, y = py;
  for (let d = 0; d <= maxDist; d += RAY_STEP) {
    x = px + cos * d; y = py + sin * d;
    if (isSolidLevel(x, y)) {
      const back = HEADROOM;
      return { x: x - cos * back, y: y - sin * back };
    }
  }
  return { x, y };
}
const ANGLES = Array.from({length:RAY_COUNT},(_,i)=>(i/RAY_COUNT)*Math.PI*2);

function drawRayMaskAt(mouseCssX, mouseCssY){
  if (!level.w || !(level.h || level.hVis)) return;
  const lvl = screenToLevel(mouseCssX, mouseCssY);
  const raysLvl = new Array(RAY_COUNT);
  for (let i=0;i<RAY_COUNT;i++) raysLvl[i]=castRay(lvl.x,lvl.y,ANGLES[i]);
  const pts = raysLvl.map(levelToScreen);
  rayMaskCtx.clearRect(0,0,rayMaskCanvas.width,rayMaskCanvas.height);
  rayMaskCtx.beginPath();
  rayMaskCtx.moveTo(pts[0].x,pts[0].y);
  for (let i=1;i<pts.length;i++) rayMaskCtx.lineTo(pts[i].x,pts[i].y);
  rayMaskCtx.closePath();
  rayMaskCtx.fillStyle="#fff";
  rayMaskCtx.fill();
  tRayMask.needsUpdate = true;
}

// Load PNG from <img id="background-overlay">
async function loadLevelPNGFromOverlay(){
  const el = document.getElementById('background-overlay');
  if (!el) return Promise.reject(new Error('No #background-overlay <img> found'));
  const src = el.currentSrc || el.src;
  if (!src) return Promise.reject(new Error('background-overlay has no src'));
  return loadLevelPNG(src);
}

async function loadLevelPNG(src){
  const img = new Image();
  img.decoding = "async";
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  level.w = img.naturalWidth;
  level.h = img.naturalHeight;
  const work = document.createElement("canvas");
  work.width = level.w; work.height = level.h;
  const wctx = work.getContext("2d", { willReadFrequently:true });
  wctx.drawImage(img, 0, 0);
  const { data } = wctx.getImageData(0, 0, level.w, level.h);
  level.solid = new Uint8Array(level.w * level.h);
  for (let i=0, p=3; i<level.solid.length; i++, p+=4) level.solid[i] = data[p] >= ALPHA_THRESHOLD ? 1 : 0;
  layoutRay();
}

function layoutRay(){
  CSSW = Math.max(1, window.innerWidth);

  if (level.w && level.h){
    const aspect = level.h / level.w;
    CSSH = Math.max(1, Math.round(CSSW * aspect));
  } else {
    CSSH = Math.max(1, Math.round(CSSW * 0.5625));
  }

  // enforce minimum canvas height equal to window height
  CSSH = Math.max(CSSH, window.innerHeight);

  scale = (level.w ? (CSSW / level.w) : 1);
  offsetX = 0;
  offsetY = 0;

  // NEW: virtual level height so below-image area is paintable
  const canvasLevelH = Math.ceil(CSSH / Math.max(scale, 1e-6));
  level.hVis = Math.max(level.h || 0, canvasLevelH);

  renderer.setSize(CSSW, CSSH, false);

  if (rayMaskCanvas.width !== CSSW || rayMaskCanvas.height !== CSSH){
    rayMaskCanvas.width = CSSW;
    rayMaskCanvas.height = CSSH;
    tRayMask.image = rayMaskCanvas;
    tRayMask.needsUpdate = true;
  }

  const db = new THREE.Vector2();
  renderer.getDrawingBufferSize(db);
  rtA.setSize(db.x, db.y);
  rtB.setSize(db.x, db.y);
  brushRT.setSize(db.x, db.y);
  waterMat.uniforms.resolution.value.set(db.x, db.y);
  brushMat.uniforms.resolution.value.set(db.x, db.y);

  const c = renderer.domElement;
  c.style.width = '100vw';
  c.style.height = CSSH + 'px';
  c.style.minHeight = '100vh';
  c.style.display = 'block';
  c.style.touchAction = 'none';
}

function clearRT(rt, color=0x7a3700){
  const old = renderer.getRenderTarget();
  renderer.setRenderTarget(rt);
  renderer.setClearColor(color, 1);
  renderer.clear(true, true, true);
  renderer.setRenderTarget(old);
}

const SIZE_MIN=0.006, SIZE_MAX=0.12, SLOW_SPEED=40, FAST_SPEED=1600, SIZE_SMOOTH=0.25;
const INK_SLOW_MAX=2.2, INK_FAST_MIN=0.35, PAINT_MIN_SPEED=5;

const COLOR_SEGMENT_PX = 1000;
const COLOR_COUNT = 4; // blue, grey, pink, brown

let traveledPx = 0;

let lastX=null, lastY=null, lastT=null, mouseCssX=0, mouseCssY=0;

function pxSpeed(x, y, tMs){
  if (lastX===null||lastY===null||lastT===null) return 0;
  const dx=x-lastX, dy=y-lastY, dt=Math.max(1, tMs-lastT);
  return (Math.hypot(dx,dy)/dt)*1000.0;
}
function speedNorm(s){ return Math.min(1, Math.max(0,(s-SLOW_SPEED)/(FAST_SPEED-SLOW_SPEED))); }
function applyDynamicsFromSpeed(speed){
  const n = speedNorm(speed), inv=1.0-n;
  const targetSize = THREE.MathUtils.lerp(SIZE_MAX, SIZE_MIN, n);
  brushMat.uniforms.brushSize.value = THREE.MathUtils.lerp(brushMat.uniforms.brushSize.value, targetSize, SIZE_SMOOTH);
  waterMat.uniforms.inkScale.value = THREE.MathUtils.lerp(INK_SLOW_MAX, INK_FAST_MIN, n);
  const moving = speed > PAINT_MIN_SPEED ? 1.0 : 0.0;
  brushMat.uniforms.down.value = Math.pow(inv, 0.75) * moving;
}

function setBrushFromEvent(e){
  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  mouseCssX = clientX; mouseCssY = clientY;
  if (lastX!==null && lastY!==null){
    const step = Math.hypot(clientX-lastX, clientY-lastY);
    traveledPx += step;
    while (traveledPx >= COLOR_SEGMENT_PX){
      waterMat.uniforms.colorIndex.value = (waterMat.uniforms.colorIndex.value + 1) % COLOR_COUNT;
      traveledPx -= COLOR_SEGMENT_PX;
    }
  }
  const rect = renderer.domElement.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  const y = 1.0 - ((clientY - rect.top) / rect.height);
  brushMat.uniforms.brushPos.value.set(x,y);
  const now = performance.now();
  applyDynamicsFromSpeed(pxSpeed(clientX, clientY, now));
  lastX = clientX; lastY = clientY; lastT = now;
}

window.addEventListener('pointermove', e=> setBrushFromEvent(e), { passive:true });
window.addEventListener('pointerdown', e=>{
  setBrushFromEvent(e);
  brushMat.uniforms.down.value = 1.0;
  traveledPx = 0;
}, { passive:true });
window.addEventListener('pointerup', ()=>{});

function onResize(){
  layoutRay();
  clearRT(rtA, 0x7a3700);
  clearRT(rtB, 0x7a3700);
  clearRT(brushRT, 0x000000);
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

// -------------------- Pause/Resume manager -------------------------------
const clock = new THREE.Clock();

let rafId = null;
let running = false;

let lastScrollY = window.scrollY | 0;
let scrollPauseTimer = null;
const SCROLL_RESUME_DELAY_MS = 150;   // resume shortly after scrolling stops
const SCROLL_THRESHOLD = 1;           // "more than 1 pixel has scrolled"

function tick(){
  if (!running) { rafId = null; return; }

  // ----- original loop body -----
  waterMat.uniforms.time.value = clock.getElapsedTime();
  drawRayMaskAt(mouseCssX, mouseCssY);
  renderer.setRenderTarget(brushRT);
  renderer.setClearColor(0x000000,1);
  renderer.clear(true,false,false);
  renderer.render(brushScene, camera);
  waterMat.uniforms.tPrev.value = rtA.texture;
  renderer.setRenderTarget(rtB);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  renderer.render(displayScene, camera);
  const tmp = rtA; rtA = rtB; rtB = tmp;
  // ------------------------------

  rafId = requestAnimationFrame(tick);
}

function startLoop(){
  if (running) return;
  running = true;
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function stopLoop(){
  running = false;
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}

// Pause when tab is hidden; resume when visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') stopLoop();
  else startLoop();
});

// Pause while actively scrolling by > 1px; resume after it settles
function onScroll(){
  const y = window.scrollY | 0;
  if (Math.abs(y - lastScrollY) > SCROLL_THRESHOLD) {
    stopLoop();
    clearTimeout(scrollPauseTimer);
    scrollPauseTimer = setTimeout(() => {
      lastScrollY = window.scrollY | 0;
      if (document.visibilityState === 'visible') startLoop();
    }, SCROLL_RESUME_DELAY_MS);
  } else {
    lastScrollY = y;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// Optional: also pause on blur; resume on focus (when visible)
window.addEventListener('blur', stopLoop);
window.addEventListener('focus', () => {
  if (document.visibilityState === 'visible') startLoop();
});

// -------------------- boot ----------------------------------------------
(async function start(){
  layoutRay();
  await loadLevelPNGFromOverlay().catch(()=>{});
  layoutRay();
  clearRT(rtA, 0x7a3700);
  clearRT(rtB, 0x7a3700);
  clearRT(brushRT, 0x000000);
  const r = renderer.domElement.getBoundingClientRect();
  drawRayMaskAt((r.width||1)*0.5,(r.height||1)*0.5);

  if (document.visibilityState === 'visible') startLoop();
})();
</script>