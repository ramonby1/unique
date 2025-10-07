/* ========= util ========= */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
$('#year') && ($('#year').textContent = new Date().getFullYear());

/* ========= datos compartidos ========= */
const DEST = {
  "Baleares": ["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias": ["Gran Canaria","Tenerife","Lanzarote","La Gomera"],
  "Catalunya": ["Costa Brava - Cadaqués","Costa Brava - Lampurdà","Barcelona","Sitges - Costa Dorada"],
  "Andorra": ["Andorra"],
  "Galicia": ["Rías Baixas","Rías Altas","Ribeira Sacra"],
  "Andalucía": ["Sevilla","Granada","Córdoba","Málaga","Marbella","Cádiz"]
};

const THEMES = [
  "Deportes","Aventura","Gastro","Tour","Recreativo","Eventos","Bienestar","En familia",
  "Todo incluido","Sol y Playa","Escapadas a ciudad","Montaña y Esquí","Lujo","Icónico","Acuático"
];

/* ========= Mega destino (home) ========= */
(function buildMegaHome(){
  const l1 = $('#lvl1'), l2 = $('#lvl2');
  if(!l1 || !l2) return;
  l1.innerHTML = Object.keys(DEST).map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('');
  const showL2 = k => l2.innerHTML = DEST[k].map(v => `<button type="button" data-val="${v}">${v}</button>`).join('');
  showL2(Object.keys(DEST)[0]);
  l1.addEventListener('mouseover', e=>{
    if(e.target.matches('button[data-k]')) showL2(e.target.dataset.k);
  });
  l2.addEventListener('click', e=>{
    if(e.target.matches('button[data-val]')){
      $('#destInput').value = e.target.dataset.val;
      $('#destMega').style.display = 'none';
    }
  });
})();

/* ========= Temática (home) ========= */
(function themesHome(){
  const menu = $('#themeMenu'), btn = $('#themeBtn');
  if(!menu || !btn) return;
  menu.innerHTML = THEMES.map(t=>`<li data-theme="${t}">${t}</li>`).join('');
  menu.addEventListener('click', e=>{
    const li = e.target.closest('li[data-theme]'); if(!li) return;
    btn.firstChild.textContent = li.dataset.theme + ' ';
    menu.style.display = 'none';
  });
})();

/* ========= Guests (home) ========= */
(function guestsHome(){
  const pop = $('#guestsPop'), btn = $('#guestsBtn');
  if(!pop || !btn) return;
  pop.addEventListener('click', e=>{
    if(e.target.matches('button[data-target]')){
      const id = e.target.dataset.target, op = e.target.dataset.op;
      const input = $('#qty'+id.charAt(0).toUpperCase()+id.slice(1));
      let v = +input.value || 0; v = op==='+' ? v+1 : Math.max(0, v-1); input.value = v;
    }
    if(e.target.id === 'applyGuests'){
      const tot = (+$('#qtyAdults').value||0)+(+$('#qtyKids').value||0)+(+$('#qtyBabies').value||0);
      $('#guestsBtn span').textContent = String(tot);
      pop.style.display = 'none';
    }
  });
})();

/* ========= Calendario reutilizable (2 meses + rango) ========= */
function initCalendar({inputSel, calSel, wrapSel, locale='es-ES'}){
  const input = $(inputSel), cal = $(calSel), wrap = $(wrapSel);
  if(!input || !cal || !wrap) return;

  const firstDay = d => (new Date(d.getFullYear(), d.getMonth(),1)).getDay();
  const daysIn  = d => (new Date(d.getFullYear(), d.getMonth()+1,0)).getDate();

  let start=null, end=null;

  function drawMonth(baseDate){
    const m = baseDate.getMonth(), y = baseDate.getFullYear();
    const name = baseDate.toLocaleString(locale,{month:'long',year:'numeric'});
    const fd = firstDay(baseDate); const total = daysIn(baseDate);
    let html = `<div class="month"><h4>${name}</h4><div class="grid cal">`;
    const week = locale.startsWith('es') ? ['L','M','X','J','V','S','D'] : ['M','T','W','T','F','S','S'];
    html += week.map(w=>`<span>${w}</span>`).join('');
    const offset = (fd+6)%7; for(let i=0;i<offset;i++) html += `<span></span>`;
    for(let d=1; d<=total; d++){
      const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      html += `<div class="day" data-d="${ds}">${d}</div>`;
    }
    html += `</div></div>`; return html;
  }
  function inRange(ds){
    if(!start || !end) return false;
    const t = new Date(ds).getTime();
    return t>new Date(start).getTime() && t<new Date(end).getTime();
  }
  function paintRange(){
    $$('.day',cal).forEach(el=>{
      el.classList.remove('sel','rng');
      const ds = el.dataset.d;
      if(ds===start || ds===end) el.classList.add('sel');
      if(inRange(ds)) el.classList.add('rng');
    });
  }
  function mount(){
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth()+1, 1);
    wrap.innerHTML = drawMonth(now) + drawMonth(next);
  }
  mount();

  cal.addEventListener('click', e=>{
    const d = e.target.closest('.day'); if(!d) return;
    const ds = d.dataset.d;
    if(!start || (start && end)) { start=ds; end=null; }
    else {
      if(new Date(ds)<new Date(start)){ end=start; start=ds; } else end=ds;
      input.value = `${start} — ${end}`;
    }
    paintRange();
  });

  // mostrar al pasar o foco (ya ayudado por CSS)
  input.addEventListener('focus', ()=> cal.style.display='block');
}

window.initCalendar = initCalendar;

/* ========= montar calendario en HOME si existe ========= */
document.addEventListener('DOMContentLoaded', ()=>{
  if($('#dateInput') && $('#calendar') && $('#calWrap')){
    initCalendar({inputSel:'#dateInput', calSel:'#calendar', wrapSel:'#calWrap', locale:'es-ES'});
  }
});

/* ========= idioma (marcar en el botón) ========= */
$$('.lang-option').forEach(b=>{
  b.addEventListener('click', ()=>{
    const lang = b.dataset.lang;
    // aquí podrías disparar tu i18n; por ahora solo cambia la etiqueta
  });
});
