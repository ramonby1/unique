/* ===== Util ===== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toString().padStart(2, "0");

/* ===== Idiomas ===== */
const i18n = {
  es:{
    nav_customize:"Personaliza tu viaje",
    nav_help:"Ayuda 24/7",
    cart:"Carrito",

    f_destination:"Destino",
    f_dates:"Fechas",
    f_theme:"Temática",
    f_guests:"Personas",

    ph_where:"¿A dónde quieres viajar?",
    theme_any:"Cualquier temática",

    btn_search:"Buscar",
    btn_confirm:"Confirmar",
    btn_apply:"Aplicar",
    btn_clear:"Borrar",

    g_adults:"Adultos",
    g_12plus:"12+ años",
    g_children:"Niños",
    g_under12:"Menos de 12",
    g_babies:"Bebés",
    g_under2:"Menos de 2",

    sec_dest:"Principales destinos",
    sec_exp:"Actividades más destacadas",
    sec_hotels:"Hoteles",

    see_all:"Ver todos",

    footer_about:"Quiénes somos",
    footer_faq:"Preguntas frecuentes",
    footer_gift:"Regala Civitatis",
    footer_insp:"INSPIRACIÓN",
    footer_hotels:"Hoteles",
    footer_dests:"Destinos",
    footer_exp:"Experiencias",
    footer_work:"TRABAJA CON NOSOTROS",
    footer_suppliers:"Proveedores de actividades",
    footer_hotels2:"Hoteles",
    footer_transport:"Transporte",

    act_boat:"Navegación",
    act_flamenco:"Tablao flamenco",
    act_cave:"Espeleología",
    act_dolphins:"Avistamiento de delfines",
  },
  en:{
    nav_customize:"Customize your trip",
    nav_help:"24/7 Help",
    cart:"Cart",

    f_destination:"Destination",
    f_dates:"Dates",
    f_theme:"Theme",
    f_guests:"Guests",

    ph_where:"Where do you want to travel?",
    theme_any:"Any theme",

    btn_search:"Search",
    btn_confirm:"Confirm",
    btn_apply:"Apply",
    btn_clear:"Clear",

    g_adults:"Adults",
    g_12plus:"12+ years",
    g_children:"Children",
    g_under12:"Under 12",
    g_babies:"Babies",
    g_under2:"Under 2",

    sec_dest:"Top destinations",
    sec_exp:"Top experiences",
    sec_hotels:"Hotels",

    see_all:"See all",

    footer_about:"About us",
    footer_faq:"FAQ",
    footer_gift:"Gift cards",
    footer_insp:"INSPIRATION",
    footer_hotels:"Hotels",
    footer_dests:"Destinations",
    footer_exp:"Experiences",
    footer_work:"WORK WITH US",
    footer_suppliers:"Activity suppliers",
    footer_hotels2:"Hotels",
    footer_transport:"Transport",

    act_boat:"Boating",
    act_flamenco:"Flamenco show",
    act_cave:"Caving",
    act_dolphins:"Dolphin watching",
  }
};

let lang = 'es';
function applyI18n(){
  $$('[data-i18n]').forEach(n => n.textContent = i18n[lang][n.dataset.i18n] || n.textContent);
  $$('[data-i18n-ph]').forEach(n => n.placeholder = i18n[lang][n.dataset.i18nPh] || n.placeholder);
  // Botón idioma
  $('#langBtn').textContent = lang.toUpperCase();
}
document.addEventListener('DOMContentLoaded', applyI18n);

// Toggle idioma
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-lang]');
  if(btn){
    lang = btn.dataset.lang;
    applyI18n();
  }
});

/* ===== Menús (dropdowns) ===== */
function setupDropdown(root){
  const btn = root.querySelector('button, .select-btn');
  const menu = root.querySelector('.menu');
  if(!btn || !menu) return;

  btn.addEventListener('click', ()=>{
    root.classList.toggle('open');
  });

  root.addEventListener('mouseleave', ()=>{
    root.classList.remove('open');
  });
}
$$('.dropdown').forEach(setupDropdown);

/* ===== Destinos (2 niveles + búsqueda por texto) ===== */
const DEST_TREE = {
  "Baleares": ["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias": ["Gran Canaria","Tenerife","Lanzarote","La Gomera"],
  "Catalunya": ["Lampurda - Costa Brava","Cadaques - Costa Brava","Sitges - Costa Dorada","Barcelona"],
  "Andorra": ["Andorra"],
  "Baqueira": ["Baqueira"],
  "Sierra Nevada": ["Sierra Nevada"],
  "Rioja": ["Rioja"],
  "Ribera del Duero":["Penyafiel","Burgos"],
  "Galicia":["Rias Baixas","Rias Altas","Ribeira Sacra"],
  "Asturias":["Asturias"],
  "Andalucía":["Sevilla","Granada","Cordoba","Malaga","Marbella","Sotogrande","Cadiz"],
  "Madrid":["Madrid"],
  "Pais Vasco":["Bilbao","San Sebastian","Pamplona"],
  "Navarra":["Pamplona"],
  "Cantabria":["Santander"],
  "Valencia":["Altea","Javea","Denia","Alicante","Benidorm"]
};

const destWrap = $('.dest-wrap');
const destPanel = $('#destPanel');
const destL1 = $('#destL1');
const destL2 = $('#destL2');
const destInput = $('#destInput');

// build L1
function buildL1(filter=''){
  destL1.innerHTML = '';
  Object.keys(DEST_TREE)
    .filter(k => k.toLowerCase().includes(filter))
    .forEach((k,i)=>{
      const b = document.createElement('button');
      b.textContent = k;
      if(i===0) b.classList.add('active');
      b.addEventListener('mouseenter', ()=> buildL2(k));
      b.addEventListener('click', ()=> buildL2(k));
      destL1.appendChild(b);
    });
  const first = destL1.querySelector('button');
  if(first) buildL2(first.textContent);
}

function buildL2(key){
  destL1.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.textContent===key));
  destL2.innerHTML = '';
  (DEST_TREE[key]||[]).forEach(city=>{
    const a = document.createElement('a');
    a.href = "#";
    a.textContent = city;
    a.addEventListener('click',(e)=>{
      e.preventDefault();
      destInput.value = city;
      destWrap.classList.remove('open');
    });
    destL2.appendChild(a);
  });
}

destInput.addEventListener('focus', ()=>{
  buildL1(destInput.value.trim().toLowerCase());
  destWrap.classList.add('open');
});
destInput.addEventListener('input', ()=>{
  const q = destInput.value.trim().toLowerCase();
  buildL1(q);
});
document.addEventListener('click', (e)=>{
  if(!destWrap.contains(e.target)) destWrap.classList.remove('open');
});

/* ===== Date range (dos meses) ===== */
const today = new Date();
let view = new Date(today.getFullYear(), today.getMonth(), 1);
let start = null, end = null;

const dateWrap = $('.date-wrap');
const dateBtn = $('#dateBtn');
const datePanel = $('#datePanel');
const months = $('#months');
const monthLabel = $('#monthLabel');
const prevMonth = $('#prevMonth');
const nextMonth = $('#nextMonth');
const applyDates = $('#applyDates');
const clearDates = $('#clearDates');

dateBtn.addEventListener('click', ()=>{
  renderMonths();
  dateWrap.classList.toggle('open');
});

prevMonth.addEventListener('click', ()=>{
  view.setMonth(view.getMonth()-1);
  renderMonths();
});
nextMonth.addEventListener('click', ()=>{
  view.setMonth(view.getMonth()+1);
  renderMonths();
});
clearDates.addEventListener('click', ()=>{
  start = end = null;
  renderMonths();
  dateBtn.textContent = i18n[lang]['ph_when'] || '¿Cuándo?';
  $('#checkIn').value = '';
  $('#checkOut').value = '';
});
applyDates.addEventListener('click', ()=>{
  if(start && end){
    const label = `${fmt(start.getDate())}/${fmt(start.getMonth()+1)}/${start.getFullYear()} - ${fmt(end.getDate())}/${fmt(end.getMonth()+1)}/${end.getFullYear()}`;
    dateBtn.textContent = label;
    $('#checkIn').value = `${start.getFullYear()}-${fmt(start.getMonth()+1)}-${fmt(start.getDate())}`;
    $('#checkOut').value = `${end.getFullYear()}-${fmt(end.getMonth()+1)}-${fmt(end.getDate())}`;
    dateWrap.classList.remove('open');
  }
});

document.addEventListener('click', (e)=>{
  if(!dateWrap.contains(e.target) && !dateBtn.contains(e.target)){
    dateWrap.classList.remove('open');
  }
});

function renderMonths(){
  months.innerHTML = '';
  const m1 = new Date(view);
  const m2 = new Date(view); m2.setMonth(m2.getMonth()+1);
  monthLabel.textContent = `${m1.toLocaleString(lang, {month:'long', year:'numeric'})} – ${m2.toLocaleString(lang, {month:'long', year:'numeric'})}`;

  months.appendChild(buildCal(m1));
  months.appendChild(buildCal(m2));
}
function buildCal(ref){
  const box = document.createElement('div');
  box.className = 'cal';
  const h = document.createElement('h4');
  h.textContent = ref.toLocaleString(lang,{month:'long', year:'numeric'});
  const grid = document.createElement('div');
  grid.className='grid-days';

  // header semana
  const wd = [...Array(7).keys()].map(i => new Date(1970,0,4+i).toLocaleString(lang,{weekday:'short'}));
  wd.forEach(d=>{
    const x = document.createElement('div');
    x.className='day m';
    x.textContent = d.slice(0,2);
    grid.appendChild(x);
  });

  // días
  const firstDay = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const lastDay  = new Date(ref.getFullYear(), ref.getMonth()+1, 0);
  let pad = (firstDay.getDay()+6)%7; // convertir a Lunes=0
  for(let i=0;i<pad;i++){
    const d = document.createElement('div'); d.className='day m'; grid.appendChild(d);
  }
  for(let d=1; d<=lastDay.getDate(); d++){
    const date = new Date(ref.getFullYear(), ref.getMonth(), d);
    const cell = document.createElement('button');
    cell.type='button'; cell.className='day';
    cell.textContent=d;

    const inRange = (start && end && date>start && date<end);
    const isStart = (start && sameDate(date,start));
    const isEnd   = (end && sameDate(date,end));
    if(inRange) cell.classList.add('inrange');
    if(isStart || isEnd) cell.classList.add('sel');

    cell.addEventListener('click', ()=>{
      if(!start || (start && end)){
        start = date; end=null;
      } else if(date < start){
        end = start; start = date;
      } else {
        end = date;
      }
      renderMonths();
    });

    grid.appendChild(cell);
  }

  box.appendChild(h);
  box.appendChild(grid);
  return box;
}
function sameDate(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

/* ===== Temáticas ===== */
const THEMES = [
  "Deportes","Aventura","Gastro","Tour","Recreativo","Eventos","Bienestar",
  "En familia","Todo incluido","Sol y Playa","Escapadas a ciudad","Montaña y Esquí",
  "Lujo","Icónico","Acuático"
];
const THEMES_EN = [
  "Sports","Adventure","Gastronomy","Tour","Leisure","Events","Wellness",
  "Family","All inclusive","Sun & Beach","City breaks","Mountain & Ski",
  "Luxury","Iconic","Aquatic"
];

const themeBtn = $('#themeBtn');
const themeMenu = $('#themeMenu');
const themeValue = $('#themeValue');

function rebuildThemeMenu(){
  themeMenu.innerHTML = '';
  const list = lang==='en' ? THEMES_EN : THEMES;
  // Opción "Cualquier temática"
  const any = document.createElement('button');
  any.className='menu-item';
  any.textContent = i18n[lang]['theme_any'];
  any.addEventListener('click', ()=>{
    themeBtn.textContent = i18n[lang]['theme_any'];
    themeValue.value='';
    themeMenu.parentElement.classList.remove('open');
  });
  themeMenu.appendChild(any);

  list.forEach(t=>{
    const b = document.createElement('button');
    b.className='menu-item';
    b.textContent=t;
    b.addEventListener('click', ()=>{
      themeBtn.textContent = t;
      themeValue.value=t;
      themeMenu.parentElement.classList.remove('open');
    });
    themeMenu.appendChild(b);
  });
}
rebuildThemeMenu();
document.addEventListener('click', (e)=>{
  if(!themeMenu.parentElement.contains(e.target)){
    themeMenu.parentElement.classList.remove('open');
  }
});

/* ===== Guests (contador) ===== */
let guests = { adults:2, children:0, babies:0 };
function updateGuestsUI(){
  $('#adultsVal').textContent = guests.adults;
  $('#childrenVal').textContent = guests.children;
  $('#babiesVal').textContent = guests.babies;
  $('#guestsBtn').innerHTML = `👥 ${guests.adults+guests.children+babiesSafe()}`;
}
function babiesSafe(){return guests.babies||0}
$$('.guests-menu .plus').forEach(b=>{
  b.addEventListener('click', ()=>{
    const t = b.dataset.target;
    guests[t] = (guests[t]||0)+1;
    updateGuestsUI();
  });
});
$$('.guests-menu .minus').forEach(b=>{
  b.addEventListener('click', ()=>{
    const t = b.dataset.target;
    guests[t] = Math.max(0, (guests[t]||0)-1);
    if(t==='adults') guests.adults = Math.max(1, guests.adults); // mínimo 1 adulto
    updateGuestsUI();
  });
});
$('#confirmGuests').addEventListener('click', ()=>{
  $('#confirmGuests').closest('.dropdown').classList.remove('open');
});
updateGuestsUI();

/* ===== Cerrar dropdowns al hacer click fuera ===== */
document.addEventListener('click', (e)=>{
  $$('.dropdown').forEach(d=>{
    if(!d.contains(e.target)) d.classList.remove('open');
  });
});

/* ===== Chatbot mock ===== */
const chatBubble = $('#chatBubble');
const chatBox = $('#chatBox');
const chatClose = $('#chatClose');
const chatBody = $('#chatBody');
const chatForm = $('#chatForm');
const chatInput = $('#chatInput');

chatBubble.addEventListener('click', ()=>{
  chatBox.hidden = !chatBox.hidden;
});
chatClose.addEventListener('click', ()=> chatBox.hidden = true);
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const txt = chatInput.value.trim();
  if(!txt) return;
  chatBody.appendChild(msg(txt,'me'));
  chatInput.value='';
  setTimeout(()=>{
    chatBody.appendChild(msg(lang==='en'?'Thanks! We will get back to you shortly.':'¡Gracias! Te responderemos en breve.','bot'));
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 400);
});
function msg(t,who='bot'){
  const m = document.createElement('div');
  m.className = `msg ${who}`;
  m.textContent = t;
  return m;
}

/* ===== Reaplicar i18n dinámico (temas, placeholders) al cambiar idioma ===== */
document.addEventListener('click', (e)=>{
  const b = e.target.closest('[data-lang]');
  if(b){
    rebuildThemeMenu();
    dateBtn.textContent = i18n[lang]['ph_when'] || '¿Cuándo?';
  }
});
