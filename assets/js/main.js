/* ===== util ===== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toString().padStart(2,'0');

/* Año footer */
const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

/* ===== Idiomas (texto principal) ===== */
let lang = localStorage.getItem('lang') || 'es';
const i18n = {
  es: {
    nav_customize: 'Personaliza tu viaje',
    nav_help: 'Ayuda 24/7',
    cart: 'Carrito',
    ph_where: '¿A dónde quieres viajar?',
    any_theme: 'Cualquier temática'
  },
  en: {
    nav_customize: 'Customize your trip',
    nav_help: '24/7 Help',
    cart: 'Cart',
    ph_where: 'Where do you want to travel?',
    any_theme: 'Any theme'
  }
};
function applyLang(){
  $$('[data-i18n]').forEach(n=>{
    n.textContent = i18n[lang][n.dataset.i18n] || n.textContent;
  });
  const di = $('#destInput'); if (di) di.placeholder = i18n[lang].ph_where;
  const th = $('#themeLabel'); if (th) th.textContent = i18n[lang].any_theme;
}
applyLang();

$$('.lang-switch').forEach(b=>{
  b.addEventListener('click', ()=>{
    lang = b.dataset.lang;
    localStorage.setItem('lang', lang);
    location.reload();
  });
});

/* ====== Mega destino (Home) ====== */
const DEST_TREE = {
  'Baleares': ['Mallorca','Menorca','Ibiza','Formentera'],
  'Canarias': ['Gran Canaria','Tenerife','Lanzarote'],
  'Catalunya': ['Costa Brava - Cadaqués','Costa Brava - Barquito','Barcelona'],
  'Andorra': ['Andorra'],
  'Galicia': ['Rías Baixas','Rías Altas','Ribeira Sacra'],
  'Andalucía': ['Sevilla','Granada','Córdoba','Málaga','Marbella','Sotogrande','Cádiz'],
  'Valencia': ['Alicante','Benidorm','Javea','Denia','Altea']
};

const destField = $('#destField');
if (destField){
  const lvl2 = $('#destSub');
  $('#destMega').addEventListener('mouseenter', ()=> destField.classList.add('hovering'));
  $('#destMega').addEventListener('mouseleave', ()=> destField.classList.remove('hovering'));
  destField.addEventListener('mouseenter', ()=> destField.classList.add('hovering'));
  destField.addEventListener('mouseleave', ()=> destField.classList.remove('hovering'));

  // clicar categorias
  $$('#destMega .lvl1 button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const items = DEST_TREE[b.dataset.cat] || [];
      lvl2.innerHTML = items.map(v=>`<button type="button" data-val="${v}">${v}</button>`).join('');
      // clic en nivel 2
      $$('#destSub button').forEach(sb=>{
        sb.addEventListener('click', ()=>{
          $('#destInput').value = sb.dataset.val;
          $('#destField').classList.remove('hovering');
        });
      });
    });
  });
}

/* ====== Calendarios (Home y Customize) ====== */
function buildCalendar(rootId, inputId){
  const root = $(rootId); if (!root) return;
  const input = $(inputId);
  const heads = $$(`${rootId} [data-cal-month]`);
  const grids = $$(`${rootId} .grid.cal`);

  // meses base
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), 1);
  const months = [new Date(base), new Date(base.getFullYear(), base.getMonth()+1, 1)];

  function render(){
    months.forEach((m, idx)=>{
      heads[idx].textContent = m.toLocaleString('es-ES',{month:'long',year:'numeric'});
      const firstDay = new Date(m.getFullYear(),m.getMonth(),1).getDay()||7;
      const lastDate = new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
      const out = [];
      for (let i=1;i<firstDay;i++) out.push('<span></span>');
      for (let d=1; d<=lastDate; d++){
        const id = `${m.getFullYear()}-${fmt(m.getMonth()+1)}-${fmt(d)}`;
        out.push(`<button type="button" class="day" data-date="${id}">${d}</button>`);
      }
      grids[idx].innerHTML = out.join('');
    });
    bindDays();
    paintRange();
  }

  let start=null, end=null;
  function bindDays(){
    $$('.day', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const val = btn.dataset.date;
        if (!start || (start && end)){ start = val; end=null; }
        else if (!end){
          if (new Date(val) < new Date(start)){ end = start; start = val; }
          else end = val;
        }
        paintRange();
        if (start && end){
          const [y1,m1,d1] = start.split('-'); const [y2,m2,d2] = end.split('-');
          input.value = `${d1}/${m1}/${y1} — ${d2}/${m2}/${y2}`;
        }
      });
    });
  }

  function paintRange(){
    $$('.day', root).forEach(d=>{ d.classList.remove('sel','rng'); });
    if (start) $(`.day[data-date="${start}"]`, root)?.classList.add('sel');
    if (end) $(`.day[data-date="${end}"]`, root)?.classList.add('sel');
    if (start && end){
      const a = new Date(start), b = new Date(end);
      $$('.day', root).forEach(d=>{
        const dt = new Date(d.dataset.date);
        if (dt > a && dt < b) d.classList.add('rng');
      });
    }
  }

  // abrir / cerrar por hover o focus
  const host = root.parentElement.closest('.field');
  host.addEventListener('mouseenter', ()=> root.style.display='block');
  host.addEventListener('mouseleave', ()=> root.style.display='none');
  input.addEventListener('focus', ()=> root.style.display='block');

  render();
}

// Home
buildCalendar('#datePicker', '#dateInput');
// Customize
buildCalendar('#cxDatePicker', '#cxDateInput');

/* ===== Selects (mantener abiertos por hover y focus) ===== */
function bindSelect(hostSel, labelSel, menuSel){
  const host = $(hostSel); if (!host) return;
  const label = $(labelSel);
  const menu = $(menuSel);
  host.addEventListener('mouseenter', ()=> menu.style.display='block');
  host.addEventListener('mouseleave', ()=> menu.style.display='none');
  host.addEventListener('focus', ()=> menu.style.display='block');
  $$('#'+menu.id+' li').forEach(li=>{
    li.addEventListener('click', ()=>{
      label.textContent = li.textContent.trim();
      menu.style.display='none';
    });
  });
}
bindSelect('#themeField','#themeLabel','#themeMenu');
bindSelect('#originField','#originLabel','#originMenu');

/* Guests popover */
(function(){
  const field = $('#guestsField'); if (!field) return;
  const pop = $('#guestsPop'), input = $('#guestsInput');
  field.addEventListener('mouseenter', ()=> pop.style.display='block');
  field.addEventListener('mouseleave', ()=> pop.style.display='none');
  $('#gApply').addEventListener('click', ()=> pop.style.display='none');
  $$('#guestsPop [data-qs]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const t = b.dataset.target;
      const inc = parseInt(b.dataset.qs,10);
      const el = $('#g_'+t);
      el.value = Math.max(0, parseInt(el.value||'0',10) + inc);
      input.value = parseInt($('#g_ad').value) + parseInt($('#g_ch').value) + parseInt($('#g_bb').value);
    });
  });
})();

/* ===== Rellenar cards e imágenes ===== */
const IMGS = {
  // destinos
  'Mallorca':'mallorca-ciudad-istock.jpg',
  'Menorca':'menorca.jpg',
  'Ibiza':'ibiza-roca.jpg',
  'Formentera':'formentera-ses-illetes.png',
  'Gran Canaria':'gran-canaria-arguineguin.jpg',
  'Costa Brava - Barquito':'costa-brava-cadaques-barquito.jpg',
  'Costa Brava - Cadaqués':'costa-brava-cadaques-lejos.jpg',

  // actividades
  'Navegación':'navegacion-lago-mallorca.png',
  'Spa':'spa.webp',
  'Tablao flamenco':'Flamenca_castanuelas.jpg',
  'Paddle surf':'paddle surf.jpg',
  'Espeleología':'costa-brava-cadaques-noche.jpg',
  'Avistamiento de delfines':'delfines.jpg',
  'Paseo en globo':'globo-segovia.webp'
};

function cardHTML(title, img){
  return `
    <a class="card hero" href="listing.html?${encodeURIComponent(title)}">
      <img loading="lazy" src="assets/img/${img}" alt="${title}"/>
      <span>${title}</span>
    </a>`;
}

function fillHomeGrids(){
  const dests = [
    'Mallorca','Menorca','Ibiza','Formentera','Gran Canaria','Costa Brava - Barquito'
  ];
  const acts = [
    'Navegación','Spa','Tablao flamenco','Paddle surf','Avistamiento de delfines','Paseo en globo'
  ];

  const dWrap = $('#destCards'); if (dWrap) dWrap.innerHTML = dests.map(t=>cardHTML(t,IMGS[t])).join('');
  const aWrap = $('#actCards'); if (aWrap) aWrap.innerHTML = acts.map(t=>cardHTML(t,IMGS[t])).join('');

  // hoteles carrusel (6)
  const hWrap = $('#hotelsTrack');
  if (hWrap){
    const hotels = ['Mallorca','Menorca','Ibiza','Formentera','Gran Canaria','Costa Brava - Barquito'];
    hWrap.innerHTML = hotels.map(t=>`
      <article class="vcard">
        <img loading="lazy" src="assets/img/${IMGS[t]}" alt="${t}"/>
        <div class="pad"><strong>${t}</strong><br/><small>Hotel destacado</small></div>
      </article>`).join('');
    $$('[data-car="hotelsTrack"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        hWrap.scrollBy({left: btn.classList.contains('left') ? -320 : 320, behavior:'smooth'});
      });
    });
  }
}
fillHomeGrids();

/* ===== Personaliza: lista + galería ===== */
(function(){
  const list = $('#cxList'), gal = $('#cxGallery'); if (!list || !gal) return;

  function showList(type){
    let items=[];
    if (type==='dest'){ items = Object.values(DEST_TREE).flat(); }
    if (type==='hotels'){ items = ['Boutique','Spa','Lujo','Familiar','Adults Only','Rural','Urban']; }
    if (type==='acts'){ items = ['Navegación','Spa','Tablao flamenco','Paddle surf','Espeleología','Avistamiento de delfines','Paseo en globo']; }
    list.innerHTML = `<ul style="list-style:none;padding:0;margin:0">${items.map(v=>`<li><button class="btn ghost" style="width:100%;margin:6px 0" data-push="${v}">${v}</button></li>`).join('')}</ul>`;
    $$('[data-push]').forEach(b=>{
      b.addEventListener('click', ()=> addCard(b.dataset.push));
    });
  }
  function addCard(title){
    const img = IMGS[title] || IMGS['Mallorca'];
    const el = document.createElement('article');
    el.className = 'vcard';
    el.innerHTML = `<img src="assets/img/${img}" alt="${title}"/><div class="pad"><strong>${title}</strong></div>`;
    gal.prepend(el);
    // limita a 9 elementos
    while (gal.children.length>9) gal.lastElementChild.remove();
  }

  $('#tabHotels')?.addEventListener('click',()=>showList('hotels'));
  $('#tabDest')?.addEventListener('click',()=>showList('dest'));
  $('#tabActs')?.addEventListener('click',()=>showList('acts'));

  // por defecto muestra destinos
  showList('dest');
})();

/* ===== Chat ===== */
(function(){
  const fab = $('#chatFab'), box = $('#chatBox'), close = $('#chatClose');
  if (!fab || !box) return;
  fab.addEventListener('click', ()=> box.style.display = (box.style.display==='flex'?'none':'flex'));
  close.addEventListener('click', ()=> box.style.display='none');
  $('#chatSend')?.addEventListener('click', ()=>{
    const inp = $('#chatInput'), body = $('#chatBody');
    if (!inp.value.trim()) return;
    body.insertAdjacentHTML('beforeend', `<div><strong>Tú:</strong> ${inp.value}</div>`);
    inp.value='';
  });
})();

/* ===== Navegar Personaliza desde Home ===== */
$('#searchHome')?.addEventListener('submit', (e)=>{
  // permite navegación nativa a customize.html con los params que necesites
  // e.preventDefault();
});
