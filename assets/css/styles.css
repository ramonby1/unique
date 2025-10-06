/* ====== util ====== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toString().padStart(2,'0');

/* ====== Año footer ====== */
$('#year').textContent = new Date().getFullYear();

/* ====== Idiomas (ES/EN) ====== */
const i18n = {
  es: {
    nav_customize: "Personaliza tu viaje",
    nav_help: "Ayuda 24/7",
    cart: "Carrito",
    f_destination: "Destino", f_dates: "Fechas", f_theme: "Temática", f_guests: "Personas",
    ph_where: "¿A dónde quieres viajar?", ph_when: "¿Cuándo?",
    theme_any: "Cualquier temática",
    btn_confirm: "Confirmar", btn_search: "Buscar", btn_send: "Enviar",
    g_adults:"Adultos", g_12plus:"12+ años", g_children:"Niños", g_under12:"Menos de 12", g_babies:"Bebés", g_under2:"Menos de 2",
    sec_top_dests: "Principales destinos", sec_top_acts: "Actividades más destacadas", sec_hotels: "Hoteles",
    see_all:"Ver todos",
    footer_insp:"INSPIRACIÓN", footer_work:"TRABAJA CON NOSOTROS", footer_contact:"Contacto",
    act_boat:"Navegación", act_flamenco:"Tablao flamenco", act_dolphins:"Avistamiento de delfines"
  },
  en: {
    nav_customize: "Customize your trip",
    nav_help: "24/7 Help",
    cart: "Cart",
    f_destination:"Destination", f_dates:"Dates", f_theme:"Theme", f_guests:"Guests",
    ph_where:"Where do you want to travel?", ph_when:"When?",
    theme_any:"Any theme",
    btn_confirm:"Confirm", btn_search:"Search", btn_send:"Send",
    g_adults:"Adults", g_12plus:"+12 years", g_children:"Children", g_under12:"Under 12", g_babies:"Babies", g_under2:"Under 2",
    sec_top_dests:"Top destinations", sec_top_acts:"Featured activities", sec_hotels:"Hotels",
    see_all:"See all",
    footer_insp:"INSPIRATION", footer_work:"WORK WITH US", footer_contact:"Contact",
    act_boat:"Boating", act_flamenco:"Flamenco show", act_dolphins:"Dolphin watching"
  }
};
let lang = 'es';
function applyI18n() {
  $$('[data-i18n]').forEach(n=> n.textContent = i18n[lang][n.dataset.i18n] || n.textContent);
  $$('[data-i18n-ph]').forEach(n=> n.placeholder = i18n[lang][n.dataset.i18nPh] || n.placeholder);
  $('#langFlag').textContent = lang.toUpperCase();
}
applyI18n();
$$('.lang-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    lang = btn.dataset.lang;
    applyI18n();
  });
});

/* ====== DATA: destinos 2 niveles ====== */
const DESTINOS = {
  "Baleares":["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias":["Gran Canaria","Tenerife","Lanzarote"],
  "Catalunya":["Lampurda - Costa Brava","Cadaques - Costa Brava","Sitges - Costa Dorada","Barcelona"],
  "Andorra":["Andorra"],
  "Baqueira":["Baqueira"],
  "Sierra Nevada":["Sierra Nevada"],
  "Rioja":["Rioja"],
  "Ribera del Duero":["Penyafiel","Burgos"],
  "Galicia":["Rias Baixas","Rias Altas","Ribeira Sacra"],
  "Asturias":["Asturias"],
  "Andalucía":["Sevilla","Granada","Cordoba","Malaga","Marbella","Sotogrande","Cadiz"],
  "Madrid":["Madrid"],
  "Pais Vasco":["Bilbao","San Sebastian"],
  "Navarra":["Pamplona"],
  "Cantabria":["Santander"],
  "Valencia":["Altea","Javea","Denia","Alicante","Benidorm"]
};

/* ====== Destinos UI ====== */
const destInput = $('#destInput');
const destPanel = $('#destPanel');
const lvl1 = $('#destLevel1');
const lvl2 = $('#destLevel2');
const destFilter = $('#destFilter');

function fillLevel1(filter='') {
  lvl1.innerHTML = '';
  Object.keys(DESTINOS)
    .filter(r => r.toLowerCase().includes(filter.toLowerCase()))
    .forEach((r,i)=>{
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.textContent = r;
      b.addEventListener('mouseenter', ()=>showLevel2(r, li));
      b.addEventListener('click', ()=>showLevel2(r, li));
      li.appendChild(b);
      if(i===0) li.classList.add('active');
      lvl1.appendChild(li);
    });
  const first = lvl1.querySelector('li');
  if(first) showLevel2(first.textContent, first);
}
function showLevel2(region, li) {
  $$('.lvl1 li').forEach(n=>n.classList.remove('active'));
  li.classList.add('active');
  lvl2.innerHTML = '';
  DESTINOS[region].forEach(city=>{
    const li2 = document.createElement('li');
    const b = document.createElement('button');
    b.textContent = city;
    b.addEventListener('click', ()=>{
      destInput.value = `${city} (${region})`;
      destPanel.classList.remove('open');
    });
    li2.appendChild(b);
    lvl2.appendChild(li2);
  });
}
destInput.addEventListener('focus', ()=>{
  fillLevel1();
  destPanel.classList.add('open');
});
destFilter.addEventListener('input', e=>{
  fillLevel1(e.target.value);
});
document.addEventListener('click', e=>{
  if(!destPanel.contains(e.target) && e.target!==destInput) destPanel.classList.remove('open');
});

/* ====== Temáticas ====== */
const THEMES_ES = ["Deportes","Aventura","Gastro","Tour","Recreativo","Eventos","Bienestar","En familia","Todo incluido","Sol y Playa","Escapadas a ciudad","Montaña y Esquí","Lujo","Icónico","Acuático"];
const THEMES_EN = ["Sports","Adventure","Gastro","Tour","Recreational","Events","Wellness","Family","All inclusive","Sun & Beach","City breaks","Mountain & Ski","Luxury","Iconic","Aquatic"];
const themeBtn = $('#themeBtn');
const themeMenu = $('#themeMenu');
function fillThemes() {
  const list = (lang==='en'?THEMES_EN:THEMES_ES);
  themeMenu.innerHTML = list.map(t=>`<li><button type="button">${t}</button></li>`).join('');
  $$('#themeMenu button').forEach(b=>{
    b.addEventListener('click', ()=>{
      themeBtn.textContent = b.textContent;
      themeMenu.classList.remove('open');
    });
  });
}
fillThemes();
themeBtn.addEventListener('click', ()=>{ fillThemes(); themeMenu.classList.toggle('open'); });
document.addEventListener('click', e=>{
  if(!themeMenu.contains(e.target) && e.target!==themeBtn) themeMenu.classList.remove('open');
});
/* update themes when language changes */
$$('.lang-item').forEach(btn=>{
  btn.addEventListener('click', ()=> setTimeout(fillThemes,0));
});

/* ====== Guests ====== */
const guestsBtn = $('#guestsBtn');
const guestsPanel = $('#guestsPanel');
const counters = {adults:2, children:0, babies:0};
const gAdults = $('#gAdults'), gChildren = $('#gChildren'), gBabies = $('#gBabies');
function refreshGuests(){
  gAdults.textContent = counters.adults;
  gChildren.textContent = counters.children;
  gBabies.textContent = counters.babies;
  $('#guestsText').textContent = counters.adults + counters.children + counters.babies;
}
refreshGuests();
guestsBtn.addEventListener('click', ()=> guestsPanel.classList.toggle('open'));
$('#guestsOk').addEventListener('click', ()=> guestsPanel.classList.remove('open'));
$$('.step').forEach(s=>{
  s.addEventListener('click', ()=>{
    const t = s.dataset.type, op = s.dataset.op;
    counters[t] = Math.max( (t==='adults'?1:0), counters[t] + (op==='+'?1:-1) );
    refreshGuests();
  });
});
document.addEventListener('click', e=>{
  if(!guestsPanel.contains(e.target) && e.target!==guestsBtn) guestsPanel.classList.remove('open');
});

/* ====== Date range picker (2 months) ====== */
const datesInput = $('#datesInput');
const dp = $('#datePicker');
let start=null, end=null, view = new Date(); // current month
function daysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function buildCal(date){
  const y=date.getFullYear(), m=date.getMonth();
  const first = new Date(y,m,1).getDay(); // 0 Sun
  const total = daysInMonth(y,m);
  const wrap = document.createElement('div');
  wrap.className='cal';
  const header = document.createElement('header');
  header.innerHTML = `<strong>${date.toLocaleString(lang, {month:'long'})} ${y}</strong>`;
  wrap.appendChild(header);
  const grid = document.createElement('div'); grid.className='grid';
  // week days
  for(const d of ['L','M','X','J','V','S','D']) {
    const h=document.createElement('div'); h.className='cell muted'; h.textContent=d; grid.appendChild(h);
  }
  // blanks from Monday
  const offset = (first+6)%7;
  for(let i=0;i<offset;i++){ const c=document.createElement('div'); c.className='cell muted'; grid.appendChild(c); }
  for(let d=1; d<=total; d++){
    const c=document.createElement('div'); c.className='cell'; c.textContent=d;
    const dt = new Date(y,m,d);
    c.addEventListener('click', ()=>pickDate(dt));
    grid.appendChild(c);
  }
  wrap.appendChild(grid);
  return wrap;
}
function renderDP(){
  dp.innerHTML='';
  const nav = document.createElement('div'); nav.className='legend';
  const prev = document.createElement('button'); prev.textContent='◀'; prev.className='step';
  prev.addEventListener('click', ()=>{ view.setMonth(view.getMonth()-1); renderDP(); });
  const next = document.createElement('button'); next.textContent='▶'; next.className='step';
  next.addEventListener('click', ()=>{ view.setMonth(view.getMonth()+1); renderDP(); });
  nav.append(prev, document.createTextNode('Seleccione un rango'), next);
  dp.appendChild(nav);

  const wrapper = document.createElement('div'); wrapper.className='dp';
  const d1 = new Date(view), d2 = new Date(view); d2.setMonth(d2.getMonth()+1);
  wrapper.appendChild(buildCal(d1)); wrapper.appendChild(buildCal(d2));
  dp.appendChild(wrapper);
  paintRange();
}
function pickDate(dt){
  if(!start || (start && end)){ start=dt; end=null; }
  else if(dt<start){ end=start; start=dt; }
  else{ end=dt; }
  paintRange();
  if(start && end){
    datesInput.value = `${fmt(start.getDate())}/${fmt(start.getMonth()+1)}/${start.getFullYear()} - ${fmt(end.getDate())}/${fmt(end.getMonth()+1)}/${end.getFullYear()}`;
    dp.classList.remove('open');
  }
}
function paintRange(){
  $$('.dp .cell').forEach(c=>c.classList.remove('sel','in'));
  if(!start) return;
  $$('.dp .cal').forEach((cal,i)=>{
    const year = (new Date(view.getFullYear(), view.getMonth()+i, 1)).getFullYear();
    const month = (new Date(view.getFullYear(), view.getMonth()+i, 1)).getMonth();
    const cells = $$('.cell', cal).slice(7); // skip week letters
    cells.forEach((cell,idx)=>{
      const day = idx+1 - ((new Date(year,month,1).getDay()+6)%7);
      if(day<1 || day>daysInMonth(year,month)) return;
      const d = new Date(year,month,day);
      if(start && d.getTime()===start.getTime()) cell.classList.add('sel');
      if(end && d.getTime()===end.getTime()) cell.classList.add('sel');
      if(start && end && d>start && d<end) cell.classList.add('in');
    });
  });
}
datesInput.addEventListener('click', ()=>{ dp.classList.toggle('open'); renderDP(); });
document.addEventListener('click', e=>{
  if(!dp.contains(e.target) && e.target!==datesInput) dp.classList.remove('open');
});

/* ====== Scroll helpers ====== */
$$('.scroll-next, .scroll-down').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href');
    if(!id) return;
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  });
});

/* ====== Contact form (mock) ====== */
$('#contactForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Gracias, hemos recibido tu mensaje. ✉️');
});

/* ====== Chatbot ====== */
const chatBubble = $('#chatBubble');
const chatBox = $('#chatBox');
chatBubble.addEventListener('click', ()=> chatBox.classList.toggle('open'));
$('#chatClose').addEventListener('click', ()=> chatBox.classList.remove('open'));
$('#chatForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const txt = $('#chatText').value.trim(); if(!txt) return;
  const me = document.createElement('div'); me.className='msg me'; me.textContent = txt;
  $('#chatBody').appendChild(me);
  $('#chatText').value='';
  setTimeout(()=>{
    const bot = document.createElement('div'); bot.className='msg bot';
    bot.textContent = 'Gracias por tu mensaje. Te respondemos enseguida.';
    $('#chatBody').appendChild(bot);
    $('#chatBody').scrollTop = 99999;
  }, 500);
});
