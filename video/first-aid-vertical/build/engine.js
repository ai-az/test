/* ---------- deterministic, time-seekable animation engine ---------- */
const FPS = 30, TD = 0.95;                 // transition duration (s)
const DUR = [13.0, 13.5, 15.5, 15.0, 14.0, 12.0, 13.0];
const TRANS = ['iris','pushUp','curtain','zoom','pushX','blurIris'];

const START = []; let acc = 0;
for (let i = 0; i < DUR.length; i++) { START.push(acc); acc += DUR[i]; }
const TOTAL = acc;
/* a scene becomes visible TD early (it enters during the previous scene's tail),
   so its content clock starts there — otherwise it slides in empty. */
const APPEAR = START.map((s,i) => i === 0 ? 0 : s - TD);
const SPAN   = DUR.map((d,i) => i === 0 ? d : d + TD);

const clamp = (v,a,b)=>v<a?a:v>b?b:v;
const E = {
  outCubic: t => 1 - Math.pow(1-t,3),
  outQuint: t => 1 - Math.pow(1-t,5),
  outQuart: t => 1 - Math.pow(1-t,4),
  outBack : t => { const c=1.70158+1, s=1.70158; return 1 + c*Math.pow(t-1,3) + s*Math.pow(t-1,2); },
  inOut   : t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2,
};
// progress of an element: local scene time -> 0..1
function pr(local, delay, dur, ease){ return E[ease||'outCubic'](clamp((local-delay)/(dur||0.9),0,1)); }

const scenes = [...document.querySelectorAll('.scene')];
const inners = scenes.map(s => s.querySelector('.inner'));
const items  = scenes.map(s => [...s.querySelectorAll('[data-a]')].map(el => ({
  el, a: el.dataset.a, d: parseFloat(el.dataset.d||0), t: parseFloat(el.dataset.t||0.9)
})));
const flash = document.getElementById('flash');
const curtain = document.getElementById('curtain');
const s1kit = document.getElementById('s1kit');

/* element entrance animations */
function applyItem(it, local){
  const {el,a,d,t} = it;
  const p = pr(local, d, t, a==='pop'||a==='thanks' ? 'outBack' : 'outQuint');
  const f = pr(local, d, t*0.85, 'outCubic');           // opacity ramp
  let tr = '';
  switch(a){
    case 'fadeUp':   tr = `translate3d(0,${(1-p)*42}px,0)`; break;
    case 'fadeDown': tr = `translate3d(0,${(1-p)*-34}px,0)`; break;
    case 'rise':     tr = `translate3d(0,${(1-p)*64}px,0) scale(${0.965+0.035*p})`; break;
    case 'slideR':   tr = `translate3d(${(1-p)*72}px,0,0)`; break;
    case 'slideL':   tr = `translate3d(${(1-p)*-72}px,0,0)`; break;
    case 'pop':      tr = `scale(${0.62+0.38*p})`; break;
    case 'thanks':   tr = `scale(${0.80+0.20*p})`; break;
    case 'drawX':    tr = `scaleX(${p})`; el.style.transformOrigin='right center'; break;
    case 'drawY':    tr = `scaleY(${p})`; el.style.transformOrigin='top center'; break;
    default:         tr = 'none';
  }
  el.style.transform = tr;
  el.style.opacity = (a==='drawX'||a==='drawY') ? 1 : f.toFixed(4);
}

/* ambient life inside a scene (subtle, continuous) */
function ambient(i, local, dur){
  const inner = inners[i];
  const k = clamp(local/dur, 0, 1);
  const kb = 1.0 + 0.026*k;                       // slow ken-burns
  let extra = '';
  if (i===0 && s1kit){                            // floating first-aid kit
    const fy = Math.sin(local*0.85)*11, rot = Math.sin(local*0.62)*1.5;
    s1kit.style.transform = (s1kit.style.transform||'') ;
    s1kit.dataset.float = `translate3d(0,${fy}px,0) rotate(${rot}deg)`;
  }
  inner.style.transform = `scale(${kb.toFixed(5)})${extra}`;
}

/* transitions: returns css for outgoing (a) and incoming (b) */
function transition(kind, q, A, B){
  const e = E.inOut(q), o = E.outQuart(q);
  A.style.clipPath = ''; B.style.clipPath = '';
  A.style.filter = ''; B.style.filter = '';
  flash.style.opacity = 0; curtain.style.opacity = 0;
  switch(kind){
    case 'iris': {
      const r = 6 + 118*E.outQuint(q);
      B.style.clipPath = `circle(${r}% at 50% 46%)`;
      B.style.opacity = 1;
      A.style.transform = `scale(${1+0.10*e})`;
      A.style.filter = `blur(${10*e}px)`;
      A.style.opacity = 1-0.35*e;
      break;
    }
    case 'pushUp': {
      A.style.transform = `translate3d(0,${-100*e}%,0) scale(${1-0.06*e})`;
      A.style.opacity = 1;
      B.style.transform = `translate3d(0,${100*(1-e)}%,0) scale(${0.94+0.06*e})`;
      B.style.opacity = 1;
      break;
    }
    case 'curtain': {
      const p = E.outQuint(q)*100;
      B.style.clipPath = `polygon(0% ${120-p*1.25}%, 100% ${100-p*1.25}%, 100% 100%, 0% 100%)`;
      B.style.opacity = 1;
      A.style.transform = `scale(${1-0.05*e})`;
      A.style.opacity = 1;
      curtain.style.opacity = (Math.sin(Math.PI*q)*0.22).toFixed(3);
      break;
    }
    case 'zoom': {
      A.style.transform = `scale(${1+0.22*o})`;
      A.style.opacity = (1-o).toFixed(3);
      A.style.filter = `blur(${14*o}px)`;
      B.style.transform = `scale(${0.88+0.12*E.outQuint(q)})`;
      B.style.opacity = E.outCubic(clamp(q*1.5,0,1)).toFixed(3);
      flash.style.opacity = (Math.sin(Math.PI*q)*0.34).toFixed(3);
      break;
    }
    case 'pushX': {   /* RTL push */
      A.style.transform = `translate3d(${100*e}%,0,0) scale(${1-0.05*e})`;
      A.style.opacity = 1;
      B.style.transform = `translate3d(${-100*(1-e)}%,0,0) scale(${0.95+0.05*e})`;
      B.style.opacity = 1;
      break;
    }
    case 'blurIris': {
      const r = 8 + 116*E.outQuint(q);
      B.style.clipPath = `circle(${r}% at 50% 54%)`;
      B.style.opacity = 1;
      B.style.filter = `blur(${10*(1-E.outQuint(q))}px)`;
      A.style.transform = `scale(${1-0.07*e})`;
      A.style.filter = `blur(${8*e}px)`;
      A.style.opacity = 1-0.4*e;
      break;
    }
  }
}

function render(t){
  t = clamp(t, 0, TOTAL - 0.0001);
  // which scene(s) are live
  let cur = 0;
  for (let i=0;i<DUR.length;i++) if (t >= START[i]) cur = i;
  const localCur = t - START[cur];
  const tailStart = DUR[cur] - TD;
  const inTrans = (cur < DUR.length-1) && (localCur >= tailStart);
  const nxt = cur + 1;

  scenes.forEach((s,i)=>{
    const live = (i===cur) || (inTrans && i===nxt);
    s.style.display = live ? 'block' : 'none';
    if (!live) return;
    s.style.zIndex = (i===cur) ? 1 : 2;
    s.style.transform = 'none'; s.style.opacity = 1;
    s.style.clipPath = ''; s.style.filter = '';
    const local = t - APPEAR[i];
    items[i].forEach(it => applyItem(it, local));
    ambient(i, Math.max(local,0), SPAN[i]);
  });

  // kit float composed on top of its entrance transform
  if (scenes[0].style.display !== 'none' && s1kit){
    const it = items[0].find(o=>o.el===s1kit);
    const p = pr(t-APPEAR[0], it.d, it.t, 'outBack');
    const fy = Math.sin((t-APPEAR[0])*0.85)*11, rot = Math.sin((t-APPEAR[0])*0.62)*1.5;
    s1kit.style.transform = `translate3d(0,${fy.toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${(0.62+0.38*p).toFixed(4)})`;
  }

  flash.style.opacity = 0; curtain.style.opacity = 0;
  if (inTrans){
    const q = clamp((localCur - tailStart)/TD, 0, 1);
    transition(TRANS[cur], q, scenes[cur], scenes[nxt]);
  }
}

window.__render = render;
window.__meta = { fps: FPS, total: TOTAL, frames: Math.round(TOTAL*FPS) };
render(0);
