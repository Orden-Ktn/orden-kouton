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


/* ══ GALERIES PAR CARTE ══ */
document.querySelectorAll('.pc-gallery').forEach(gallery => {
  const imgs = JSON.parse(gallery.dataset.imgs || '[]');
  if (!imgs.length) return;

  const track   = gallery.querySelector('.pc-gallery-track');
  const dotsEl  = gallery.querySelector('.pc-gallery-dots');
  const prevBtn = gallery.querySelector('.pc-nav.prev');
  const nextBtn = gallery.querySelector('.pc-nav.next');
  const countEl = gallery.querySelector('.pc-img-count');

  let current = 0;

  // Créer les images
  imgs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Capture ${i + 1}`;
    img.loading = 'lazy';
    // Clic → lightbox
    img.addEventListener('click', () => {
      document.getElementById('lbImg').src = src;
      document.getElementById('lb').classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    track.appendChild(img);
  });

  // Dots
  imgs.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'pc-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
    dotsEl.appendChild(dot);
  });

  // Masquer les contrôles si 1 seule image
  if (imgs.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dotsEl.style.display  = 'none';
    countEl.style.display = 'none';
  } else {
    countEl.textContent = `1 / ${imgs.length}`;
  }

  function goTo(n) {
    current = (n + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.pc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    if (imgs.length > 1) countEl.textContent = `${current + 1} / ${imgs.length}`;
  }

  prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

  // Swipe mobile
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  }, {passive:true});
});

/* ══ FILTRES ══ */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.pc');
const noResults  = document.getElementById('noResults');
const resultsInfo = document.getElementById('resultsInfo');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let count = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags || '';
      const match = filter === 'all' || tags.includes(filter);
      card.hidden = !match;
      if (match) count++;
    });

    resultsInfo.textContent = count + ' projet' + (count > 1 ? 's' : '');
    noResults.classList.toggle('show', count === 0);
  });
});

/* ══ SCROLL REVEAL ══ */
const ioP = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      ioP.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.pc').forEach((el, i) => {
  el.style.transitionDelay = (i % 3 * 0.07) + 's';
  ioP.observe(el);
});
