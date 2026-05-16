/* ── THEME TOGGLE ── */
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
// Restore saved theme
const saved = localStorage.getItem('theme');
if(saved) html.setAttribute('data-theme', saved);
themeBtn.addEventListener('click',()=>{
  const cur = html.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll',()=>{ nav.classList.toggle('scrolled', window.scrollY > 60); },{passive:true});

/* ── HAMBURGER ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobNav');
ham.addEventListener('click',()=>{
  const o = mob.classList.toggle('open');
  ham.classList.toggle('open',o);
  ham.setAttribute('aria-expanded',o);
  document.body.style.overflow = o ? 'hidden' : '';
});
function closeMob(){
  mob.classList.remove('open'); ham.classList.remove('open');
  ham.setAttribute('aria-expanded',false);
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeMob(); closeLb(); }});

/* ── HERO FADE IN ── */
const fi = [
  ['.fi-tag', .1],['.fi-h1',.25],['.fi-lead',.42],
  ['.fi-cta',.55],['.fi-stats',.68],['.fi-photo',.18],
];
fi.forEach(([sel,delay])=>{
  const el=document.querySelector(sel);
  if(!el) return;
  el.style.cssText=`opacity:0;transform:translateY(22px);transition:opacity .9s ${delay}s cubic-bezier(.22,1,.36,1),transform .9s ${delay}s cubic-bezier(.22,1,.36,1)`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; }));
});

/* ── SCROLL REVEAL ── */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el=>io.observe(el));

/* ── LIGHTBOX ── */
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
document.querySelectorAll('.p-img').forEach(el=>{
  el.addEventListener('click',()=>{
    const img=el.querySelector('img'); if(!img) return;
    lbImg.src=img.src; lbImg.alt=img.alt||'';
    lb.classList.add('active'); document.body.style.overflow='hidden';
  });
});
function closeLb(){
  lb.classList.remove('active'); document.body.style.overflow='';
  setTimeout(()=>{ lbImg.src=''; },350);
}
lbClose.addEventListener('click',closeLb);
lb.addEventListener('click',e=>{ if(e.target===lb) closeLb(); });
