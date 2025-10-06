/* ========= util ========= */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const year = new Date().getFullYear();
$('#year') && ($('#year').textContent = year);

/* ========= datos ========= */
/* Destino (nivel1 -> nivel2) */
const DEST = {
  "Baleares": ["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias": ["Gran Canaria","Tenerife","Lanzarote","La Gomera"],
  "Catalunya": ["Costa Brava - Cadaqués","Costa Brava - Lampurdà","Barcelona","Sitges - Costa Dorada"],
  "Andorra": ["Andorra"],
  "Galicia": ["Rías Baixas","Rías Altas","Ribeira Sacra"],
  "Andalucía": ["Sevilla","Granada","Córdoba","Málaga","Marbella","Cádiz"]
};
/* Temáticas */
const THEMES = [
  "Deportes","Aventura","Gastro","Tour","Recreativo","Eventos","Bienestar","En familia",
  "Todo incluido","Sol y Playa","Escapadas a ciudad","Montaña y Esquí","Lujo","Icónico","Acuático"
];

/* ========= mega destino ========= */
(function buildMega(){
  const l1 = $('#lvl1'), l2 = $('#lvl2');
  if(!l1 || !l2) return;
  l1.innerHTML = Object.keys(DEST).map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('');
  const showL2 = k => {
    l2.innerHTML = DEST[k].map(v => `<button type="button" data-val="${v}">${v}</button>`).join('');
  };
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

/* ========= temática ========= */
(function buildThemes(){
  const menu = $('#themeMenu');
  const btn  = $('#themeBtn');
  if(!menu || !btn) return;
  menu.innerHTML = THEMES.map(t=>`<li data-theme="${t}">${t}</li>`).join('');
  menu.addEventListener('click', e=>{
    const li = e.target.closest('li[data-theme]');
    if(!li) return;
    btn.firstChild.textContent = li.dataset.theme + ' ';
    menu.style.display = 'none';
  });
})();

/* ========= guests ========= */
(function guests(){
  const pop = $('#guestsPop');
  const btn = $('#guestsBtn');
  if(!pop || !btn) return;
  pop.addEventListener('click', e=>{
    if(e.target.matches('button[data-target]')){
      const id = e.target.dataset.target;
      const op = e.target.dataset.op;
      const input = $('#qty'+id.charAt(0).toUpperCase()+id.slice(1));
      let v = +input.value || 0;
      v = op==='+' ? v+1 : Math.max(0, v-1);
      input.value = v;
    }
    if(e.target.id === 'applyGuests'){
      const tot = (+$('#qtyAdults').value||0)+(+$('#qtyKids').value||0)+(+$('#qtyBabies').value||0);
      $('#guestsBtn span').textContent = String(tot);
      pop.style.display = 'none';
    }
  });
})();

/* ========= calendario 2 meses con rango ========= */
(function calendar(){
  const input = $('#dateInput');
  const cal   = $('#calendar');
  if(!input || !cal) return;

  const firstDay = d => (new Date(d.getFullYear(), d.getMonth(),1)).getDay();
  const daysIn  = d => (new Date(d.getFullYear(), d.getMonth()+1,0)).getDate();

  let start=null, end=null;

  function drawMonth(baseDate){
    const m = baseDate.getMonth();
    const y = baseDate.getFullYear();
    const name = baseDate.toLocaleString('es-ES',{month:'long',year:'numeric'});
    const fd = firstDay(baseDate);
    const total = daysIn(baseDate);
    let html = `<div class="month"><h4>${name}</h4><div class="grid cal">`;
    const week = ['L','M','X','J','V','S','D'];
    html += week.map(w=>`<span>${w}</span>`).join('');
    const offset = (fd+6)%7; // semana empieza en L
    for(let i=0;i<offset;i++) html += `<span></span>`;
    for(let d=1; d<=total; d++){
      const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      html += `<div class="day" data-d="${ds}">${d}</div>`;
    }
    html += `</div></div>`;
    return html;
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
    $('#calWrap').innerHTML = drawMonth(now) + drawMonth(next);

    cal.addEventListener('click', e=>{
      const d = e.target.closest('.day');
      if(!d) return;
      const ds = d.dataset.d;
      if(!start || (start && end)) { start=ds; end=null; }
      else {
        if(new Date(ds)<new Date(start)){ end=start; start=ds; }
        else end=ds;
        input.value = `${start} — ${end}`;
      }
      paintRange();
    });
  }
  mount();
})();

/* ========= Form submit ========= */
$('#searchForm')?.addEventListener('submit', e=>{
  // deja que navegue a personaliza.html con query si quieres
});

/* ========= Idioma (solo cambia etiqueta del botón aquí) ========= */
$$('.lang-option').forEach(b=>{
  b.addEventListener('click', ()=>{
    const lang = b.dataset.lang;
    $('#langLabel') && ($('#langLabel').textContent = lang.toUpperCase());
  });
});
