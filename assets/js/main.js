/* ===== util ===== */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toString().padStart(2,'0');
$("#year").textContent = new Date().getFullYear();

/* ===== Idiomas (ES por defecto) ===== */
let lang = 'es';
$$('.lang-btn').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  $('.flag.es').style.opacity = (lang==='es'?1:.4);
  $('.flag.en').style.opacity = (lang==='en'?1:.4);
}));

/* ===== Destino: autocompletar simple ===== */
const destInput = $('#f-destination');
const destMega  = $('#destSuggest');
destInput.addEventListener('focus', () => destMega.style.display='grid');
destInput.addEventListener('input', () => destMega.style.display='grid');
destMega.addEventListener('click', (e) => {
  if (e.target.matches('[data-val]')) {
    destInput.value = e.target.dataset.val;
    destMega.style.display = 'none';
  }
});
document.addEventListener('click', (e)=>{
  if (!destMega.contains(e.target) && e.target!==destInput) destMega.style.display='none';
});

/* ===== Temática select ===== */
const themeBtn   = $('#themeBtn');
const themeMenu  = $('#themeMenu');
const themeLabel = $('#themeLabel');

const openTheme = () => themeMenu.style.display='block';
const closeTheme= () => themeMenu.style.display='none';

themeBtn.addEventListener('click', openTheme);
themeBtn.addEventListener('mouseenter', openTheme);
themeMenu.addEventListener('mouseleave', closeTheme);
themeMenu.addEventListener('click', (e)=>{
  if (e.target.matches('li')) {
    themeBtn.dataset.val = e.target.dataset.val;
    themeLabel.textContent = e.target.textContent.trim();
    closeTheme();
  }
});

/* ===== Calendario de rango (2 meses, robusto cambio de mes) ===== */
const dateInput = $('#f-dates');
const cal       = $('#dateCal');
const m1Title   = $('#m1Title'), m1Grid = $('#m1Grid');
const m2Title   = $('#m2Title'), m2Grid = $('#m2Grid');

let startDate = null, endDate = null;

/* helpers */
const firstOf = (y,m)=>new Date(y,m,1);
const daysIn  = (y,m)=>new Date(y,m+1,0).getDate();
const dayName = ['L','M','X','J','V','S','D'];

function drawMonth(baseDate, titleEl, gridEl){
  gridEl.innerHTML = '';
  const y = baseDate.getFullYear();
  const m = baseDate.getMonth();
  titleEl.textContent = baseDate.toLocaleString('es-ES',{month:'long',year:'numeric'});

  // encabezado
  dayName.forEach(d=>{
    const s = document.createElement('span'); s.textContent = d; gridEl.appendChild(s);
  });

  // offset (Lunes=1 … Domingo=0 -> adaptamos a Lunes primero)
  let first = firstOf(y,m).getDay(); if(first===0) first=7;
  for (let i=1;i<first;i++){ gridEl.appendChild(document.createElement('span')); }

  const total = daysIn(y,m);
  for(let d=1; d<=total; d++){
    const btn = document.createElement('button');
    btn.type='button'; btn.className='day'; btn.textContent=d;
    btn.dataset.date = new Date(y,m,d).toISOString().slice(0,10);
    btn.addEventListener('click', onPick);
    gridEl.appendChild(btn);
  }
  paintRange();
}

function onPick(e){
  const iso = e.currentTarget.dataset.date;
  const dt  = new Date(iso);

  if(!startDate || (startDate && endDate)){
    startDate = dt; endDate = null;
  }else if (dt < startDate){
    endDate = startDate; startDate = dt;
  }else{
    endDate = dt;
  }
  paintRange();
}

function paintRange(){
  $$('.day').forEach(d=>d.classList.remove('sel','rng'));
  if (!startDate){ return; }
  const all = $$('.day');
  all.forEach(btn=>{
    const d = new Date(btn.dataset.date);
    if (sameDay(d,startDate) || (endDate && sameDay(d,endDate))) btn.classList.add('sel');
    if (endDate && d > startDate && d < endDate) btn.classList.add('rng');
  });
  if (startDate && endDate){
    dateInput.value = `${fmt(startDate.getDate())}/${fmt(startDate.getMonth()+1)}/${startDate.getFullYear()} — ${fmt(endDate.getDate())}/${fmt(endDate.getMonth()+1)}/${endDate.getFullYear()}`;
  }else{
    dateInput.value = `${fmt(startDate.getDate())}/${fmt(startDate.getMonth()+1)}/${startDate.getFullYear()}`;
  }
}
const sameDay = (a,b)=>a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

/* render inicial: mes actual y siguiente */
(function initCalendar(){
  const now = new Date(); const next = new Date(now.getFullYear(), now.getMonth()+1, 1);
  drawMonth(now, m1Title, m1Grid);
  drawMonth(next, m2Title, m2Grid);
})();
$('#calClear').addEventListener('click', ()=>{
  startDate = endDate = null; dateInput.value=''; paintRange();
});
$('#calApply').addEventListener('click', ()=> cal.style.display='none');
dateInput.addEventListener('focus', ()=> cal.style.display='block');
document.addEventListener('click', (e)=>{ if(!cal.contains(e.target) && e.target!==dateInput) cal.style.display='none'; });

/* ===== Carruseles ===== */
$$('.carousel').forEach(car=>{
  const track = car.querySelector('.car-track');
  car.querySelector('.left').addEventListener('click', ()=> track.scrollBy({left:-600,behavior:'smooth'}));
  car.querySelector('.right').addEventListener('click',()=> track.scrollBy({left: 600,behavior:'smooth'}));
});

/* ===== Persistencia de menus al pasar del input al menú ===== */
['#themeBtn','#themeMenu','#f-destination','#destSuggest','#f-dates','#dateCal'].forEach(sel=>{
  const el = $(sel);
  if(!el) return;
  let ho=0;
  el.addEventListener('mouseenter', ()=>{ clearTimeout(ho); if(el.id==='themeMenu') themeMenu.style.display='block'; if(el.id==='destSuggest') destMega.style.display='grid'; if(el.id==='dateCal') cal.style.display='block'; });
  el.addEventListener('mouseleave', ()=>{ ho=setTimeout(()=>{ if(el.id==='themeMenu') themeMenu.style.display='none'; if(el.id==='destSuggest') destMega.style.display='none'; if(el.id==='dateCal') cal.style.display='none'; },120); });
});

/* ===== Enviar a personaliza ===== */
$('#searchForm').addEventListener('submit', (e)=>{
  // (si quieres pasar params en la URL, aquí)
  // e.g. e.target.action = `./personaliza.html?dest=${encodeURIComponent(destInput.value)}&dates=${encodeURIComponent(dateInput.value)}&theme=${encodeURIComponent(themeBtn.dataset.val||'')}&guests=${encodeURIComponent($('#f-guests').value)}`;
});
