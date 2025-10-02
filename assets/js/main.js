/* ---------- Utils ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---------- Demo offers ---------- */
const OFFERS = [
  { id:'o1', title:'Romantic night + spa', city:'Barcelona', tags:['romantic','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id:'o2', title:'Resort with pool & breakfast', city:'Valencia', tags:['family'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id:'o3', title:'Rural house & mountain trail', city:'Madrid', tags:['adventure'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id:'o4', title:'Boutique hotel + massage', city:'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id:'o5', title:'Gastronomic escape', city:'Valencia', tags:['foodie'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id:'o6', title:'Multi-activity adventure', city:'Andorra', tags:['adventure'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

/* ---------- Currency ---------- */
const DEFAULT_CUR='GBP';
const curSymbol = c => c==='EUR'?'€':c==='USD'?'$':'£';
const getCur = () => localStorage.getItem('unique_cur') || DEFAULT_CUR;
const setCur = v => { localStorage.setItem('unique_cur', v); const el=$('#cur-current'); if(el) el.textContent = curSymbol(v); rerenderPrices(); };
function fmt(n){ const c=getCur(); const loc=c==='EUR'?'es-ES':c==='USD'?'en-US':'en-GB'; return new Intl.NumberFormat(loc,{style:'currency',currency:c}).format(n); }
function rerenderPrices(){ renderFeatured(); renderListing(); renderDetail(); renderCart(); }

/* ---------- Language & i18n ---------- */
const DEFAULT_LANG='en';
const getLang = () => localStorage.getItem('unique_lang') || DEFAULT_LANG;
const setLang = v => { localStorage.setItem('unique_lang', v); $('#lang-current').textContent = v==='es' ? 'ES' : 'GB'; applyI18n(); rebuildDestinations(); renderCalendar(); };

const I18N = {
  en:{
    brand:'Unique',
    'menu.destinations':'Destinations','menu.experiences':'Experiences','menu.help':'24/7 Help','menu.cart':'Cart',
    'help.webchat':'Web chat','help.whatsapp':'WhatsApp','help.phone':'Phone call',
    'auth.register':'Register','auth.signin':'Sign in',
    'hero.title':'Unique getaways at the best price','hero.subtitle':'Find your next experience with stays, spa and more.',
    'form.destination':'Destination','form.dates':'Dates','form.theme':'Theme','form.guests':'Guests',
    'actions.confirm':'Confirm','actions.clear':'Clear','actions.search':'Search','actions.viewAll':'View all',
    'section.highlights':'This week’s highlights','footer.demo':'Demo',
    'qc.romantic':'Romantic','qc.spa':'Spa & Relax','qc.adventure':'Adventure',
    placeholders:{ dest:'Where do you want to travel?', dates:'When?', theme:'Any theme' },
    weekdays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    themes:['Sports','Adventure','Gastro','Tour','Recreational','Events','Wellness','Family','All inclusive','Sun & Beach','City breaks','Mountain & Ski','Luxury','Iconic','Aquatic'],
    // Destinations EN
    dests:{
      "Balearic Islands":["Majorca","Minorca","Ibiza","Formentera"],
      "Canary Islands":["Gran Canaria","Tenerife","Lanzarote"],
      "Catalonia":["Emporda - Costa Brava","Cadaques - Costa Brava","Sitges - Costa Dorada","Barcelona"],
      "Andorra":["Andorra"],
      "Baqueira":["Baqueira"],
      "Sierra Nevada":["Sierra Nevada"],
      "Rioja":["Rioja"],
      "Ribera del Duero":["Penafiel","Burgos"],
      "Galicia":["Rias Baixas","Rias Altas","Ribeira Sacra"],
      "Asturias":["Asturias"],
      "Andalusia":["Seville","Granada","Cordoba","Malaga","Marbella","Sotogrande","Cadiz"],
      "Madrid":["Madrid"],
      "Basque Country":["Bilbao","San Sebastian"],
      "Navarre":["Pamplona"],
      "Cantabria":["Santander"],
      "Valencia":["Altea","Javea","Denia","Alicante","Benidorm"]
    }
  },
  es:{
    brand:'Unique',
    'menu.destinations':'Destinos','menu.experiences':'Experiencias','menu.help':'Ayuda 24/7','menu.cart':'Carrito',
    'help.webchat':'Chat web','help.whatsapp':'WhatsApp','help.phone':'Llamada telefónica',
    'auth.register':'Registrarse','auth.signin':'Iniciar sesión',
    'hero.title':'Escapadas únicas al mejor precio','hero.subtitle':'Encuentra tu próxima experiencia con estancias, spa y más.',
    'form.destination':'Destino','form.dates':'Fechas','form.theme':'Temática','form.guests':'Personas',
    'actions.confirm':'Confirmar','actions.clear':'Borrar','actions.search':'Buscar','actions.viewAll':'Ver todas',
    'section.highlights':'Destacados de la semana','footer.demo':'Demostración',
    'qc.romantic':'Romántico','qc.spa':'Spa & Relax','qc.adventure':'Aventura',
    placeholders:{ dest:'¿A dónde quieres viajar?', dates:'¿Cuándo?', theme:'Cualquier temática' },
    weekdays:['Lun.','Mar.','Mié.','Jue.','Vie.','Sáb.','Dom.'],
    // Destinos ES
    dests:{
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
    }
  }
};

function t(key){ const L=getLang(); return I18N[L][key] ?? key; }

function applyI18n(){
  $$('[data-i18n]').forEach(el => el.innerHTML = t(el.dataset.i18n));
  // Placeholders
  const ph = I18N[getLang()].placeholders;
  $('#destino') && ($('#destino').placeholder = ph.dest);
  $('#dates')   && ($('#dates').placeholder   = ph.dates);
  // Theme options
  const sel = $('#theme');
  if(sel){
    sel.innerHTML = `<option value="">${ph.theme}</option>` +
      I18N[getLang()].themes.map(x=>`<option>${x}</option>`).join('');
  }
}

/* ---------- Nav ---------- */
function setupNav(){
  const tgl=$('.nav-toggle'), menu=$('#nav-menu');
  if(tgl&&menu){ tgl.addEventListener('click',()=>{ const o=menu.classList.toggle('open'); tgl.setAttribute('aria-expanded',o);}); }
  // Currency dropdown items
  $$('[data-cur]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setCur(a.dataset.cur);} ));
  // Language dropdown items
  $$('[data-lang]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setLang(a.dataset.lang);} ));
  // Toggle by clicking GB/ES
  const langBtn = $('#lang-current');
  if(langBtn){
    langBtn.addEventListener('click', e=>{
      e.preventDefault();
      setLang(getLang()==='es'?'en':'es');
    });
  }
  // Set initial icons
  $('#lang-current').textContent = getLang()==='es'?'ES':'GB';
  $('#cur-current').textContent  = curSymbol(getCur());
}

/* ---------- Destinations (2 niveles + búsqueda) ---------- */
let DEST_DATA = I18N[getLang()].dests;
function getRegions(){ return Object.keys(DEST_DATA); }

function rebuildDestinations(){
  DEST_DATA = I18N[getLang()].dests;
  const l1=$('#dest-l1'), l2=$('#dest-l2'), title=$('#dest-l2-title');
  if(!l1||!l2) return;
  const regions=getRegions();
  l1.innerHTML = regions.map((r,i)=>`<li><a href="#" data-region="${r}" class="${i===0?'active':''}">${r}</a></li>`).join('');
  renderL2(regions[0]);
  function renderL2(region){
    if(!region) { l2.innerHTML=''; title.textContent=''; return; }
    title.textContent = region;
    l2.innerHTML = (DEST_DATA[region]||[]).map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('');
    $$('#dest-l1 a').forEach(a=>a.classList.toggle('active',a.dataset.region===region));
  }
  // hover y click en columna 1
  l1.onmouseover = e=>{ const a=e.target.closest('a[data-region]'); if(a) renderL2(a.dataset.region); };
  l1.onclick = e=>{ const a=e.target.closest('a[data-region]'); if(a){ e.preventDefault(); renderL2(a.dataset.region);} };
  // click en columna 2: rellena input
  l2.onclick = e=>{
    const a=e.target.closest('a'); if(!a) return;
    $('#destino').value = a.textContent.trim();
    $('#form-destinations').style.display='none';
  };
}

function setupDestinationPanel(){
  const input=$('#destino'), panel=$('#form-destinations');
  if(!input||!panel) return;
  const open=()=>{ panel.style.display='block'; };
  const close=()=>{ panel.style.display='none'; };
  input.addEventListener('focus', open);
  input.addEventListener('click', open);
  input.addEventListener('input', open);
  panel.addEventListener('mouseenter', open);
  document.addEventListener('click', e=>{
    if(e.target===input || panel.contains(e.target)) return;
    close();
  });
}

/* ---------- Date range (un campo, 2 meses) ---------- */
let startDate=null, endDate=null;
function fmtInput(d){ if(!d) return ''; const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); return `${dd}/${mm}/${d.getFullYear()}`; }
function sameDay(a,b){ return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function monthLabel(d){ const loc=getLang()==='es'?'es-ES':'en-GB'; return d.toLocaleString(loc,{month:'long',year:'numeric'}); }
function weekdayLabels(){ return I18N[getLang()].weekdays; }

function renderCalendar(base){
  const panel=$('#date-range'), display=$('#dates'), inStart=$('#checkin'), inEnd=$('#checkout');
  if(!panel||!display) return;
  const today=new Date(); today.setHours(0,0,0,0);
  base = base || startDate || today;

  function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
  function firstOf(y,m){ return new Date(y,m,1); }

  function monthHTML(first){
    const y=first.getFullYear(), m=first.getMonth(), firstDay=firstOf(y,m);
    const startGrid = addDays(firstDay, -((firstDay.getDay()+6)%7)); // Monday-first
    let cells='';
    for(let i=0;i<42;i++){
      const cur=addDays(startGrid,i), out=cur.getMonth()!==m;
      const cls=['day']; if(out) cls.push('out');
      if(startDate && sameDay(cur,startDate)) cls.push('start');
      if(endDate && sameDay(cur,endDate)) cls.push('end');
      if(startDate && endDate && cur>startDate && cur<endDate) cls.push('in-range');
      cells += `<div class="${cls.join(' ')}" data-date="${cur.toISOString()}">${cur.getDate()}</div>`;
    }
    return `
      <div class="cal">
        <header><span class="m">${monthLabel(first)}</span></header>
        <div class="grid-days">
          ${weekdayLabels().map(x=>`<div class="dow">${x}</div>`).join('')}
          ${cells}
        </div>
      </div>`;
  }

  const next=firstOf(base.getFullYear(), base.getMonth()+1);
  panel.innerHTML = `
    <div class="range-cal">
      ${monthHTML(base)}
      ${monthHTML(next)}
    </div>
    <div class="range-actions">
      <button type="button" class="btn" id="clearRange">${t('actions.clear')}</button>
      <button type="button" class="btn" id="closeRange">${t('actions.confirm')}</button>
    </div>`;

  // Interacciones
  $$('.day[data-date]').forEach(d=>{
    d.onclick = ()=>{
      const v=new Date(d.dataset.date);
      if(!startDate || (startDate && endDate)){ startDate=v; endDate=null; }
      else if(v < startDate){ endDate=startDate; startDate=v; }
      else { endDate=v; }
      renderCalendar(startDate||base);
      updateDateInputs();
    };
  });
  $('#clearRange').onclick = ()=>{ startDate=endDate=null; updateDateInputs(); renderCalendar(base); };
  $('#closeRange').onclick = ()=> panel.style.display='none';

  function updateDateInputs(){
    $('#checkin').value  = fmtInput(startDate);
    $('#checkout').value = fmtInput(endDate);
    const loc=getLang()==='es'?'es-ES':'en-GB';
    if(startDate && endDate){
      const f=d=>d.toLocaleString(loc,{weekday:'short',day:'numeric',month:'short'});
      $('#dates').value = `${f(startDate)} – ${f(endDate)}`;
    }else if(startDate){
      const f=d=>d.toLocaleString(loc,{weekday:'short',day:'numeric',month:'short'});
      $('#dates').value = `${f(startDate)} – …`;
    }else{
      $('#dates').value = '';
    }
  }
}

function setupDateRange(){
  const input=$('#dates'), panel=$('#date-range');
  if(!input||!panel) return;
  const open=()=>{ panel.style.display='block'; renderCalendar(); };
  const close=()=>{ panel.style.display='none'; };
  input.addEventListener('focus', open);
  input.addEventListener('click', open);
  document.addEventListener('click', e=>{ if(e.target===input || panel.contains(e.target)) return; close(); });
}

/* ---------- Guests ---------- */
function setupGuests(){
  const panel=$('#guests-panel'), field=$('#guests');
  if(!panel||!field) return;
  const st={adults:2,children:0,babies:0};
  const clamp=k=>{ if(st[k]<0) st[k]=0; if(k==='adults' && st[k]===0) st[k]=1; };
  const update=()=>{ $('#gv-adults').textContent=st.adults; $('#gv-children').textContent=st.children; $('#gv-babies').textContent=st.babies; field.value=st.adults+st.children+st.babies; };
  panel.addEventListener('click', e=>{
    const b=e.target.closest('button[data-k]'); if(!b) return;
    const k=b.dataset.k, d=parseInt(b.dataset.g,10); st[k]+=d; clamp(k); update();
  });
  $('#guests-ok').onclick = ()=> panel.style.display='none';
  update();
}

/* ---------- Cart ---------- */
function getCart(){ try{return JSON.parse(localStorage.getItem('unique_cart')||'[]')}catch{return[]} }
function setCart(x){ localStorage.setItem('unique_cart',JSON.stringify(x)); updateCartCount(); }
function addToCart(id){ const xs=getCart(); const f=xs.find(i=>i.id===id); f?f.qty++:xs.push({id,qty:1}); setCart(xs); alert('Added to cart'); }
function removeFromCart(id){ setCart(getCart().filter(i=>i.id!==id)); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el=$('#cart-count'); if(el) el.textContent=n; }

/* ---------- Listing / Featured / Detail / Cart ---------- */
function cardHTML(o){
  return `<article class="card">
    <a href="detail.html?id=${o.id}"><img src="${o.img}" alt="${o.title}" loading="lazy"></a>
    <div class="pad"><h3><a href="detail.html?id=${o.id}">${o.title}</a></h3>
    <div class="meta"><span>${o.city}</span><span class="price">${fmt(o.price)}</span></div></div>
  </article>`;
}
function renderFeatured(){ const w=$('#featured'); if(w) w.innerHTML=OFFERS.slice(0,6).map(cardHTML).join(''); }
function renderListing(){
  const w=$('#results'); if(!w) return;
  const p=new URLSearchParams(location.search), q=(p.get('q')||'').toLowerCase(), tag=p.get('tag'), city=p.get('city');
  const rows=OFFERS.filter(o=>(!q||o.title.toLowerCase().includes(q)||o.city.toLowerCase().includes(q)) && (!tag||(o.tags||[]).includes(tag)) && (!city||o.city===city));
  w.innerHTML=rows.map(cardHTML).join('')||'<p>No results.</p>';
}
function renderDetail(){
  const box=$('#detail'); if(!box) return;
  const id=new URLSearchParams(location.search).get('id'); const o=OFFERS.find(x=>x.id===id)||OFFERS[0];
  box.innerHTML=`<div class="detail">
    <div><div class="gallery"><img src="${o.img}" alt="${o.title}"></div>
      <section class="section"><h1>${o.title}</h1><p class="muted">${o.city}</p>
      <h3>Includes</h3><ul><li>Stay for 2 guests</li><li>Breakfast included</li><li>Spa access (subject to availability)</li></ul></section>
    </div>
    <aside class="sticky"><div style="display:flex;justify-content:space-between;align-items:center"><strong>From</strong><span class="price">${fmt(o.price)}</span></div>
      <button class="btn" onclick="addToCart('${o.id}')">Add to cart</button>
    </aside>
  </div>`;
}
function renderCart(){
  const wrap=$('#cart'); if(!wrap) return;
  const items=getCart(); if(items.length===0){ wrap.innerHTML='<p>Your cart is empty.</p>'; return; }
  const rows=items.map(it=>{ const o=OFFERS.find(x=>x.id===it.id); const line=it.qty*o.price;
    return `<div class="line"><span>${o.title} × ${it.qty}</span><span>${fmt(line)} <button class="btn ghost" onclick="removeFromCart('${it.id}')">Remove</button></span></div>`; }).join('');
  const total=items.reduce((s,it)=>{ const o=OFFERS.find(x=>x.id===it.id); return s+(it.qty*o.price); },0);
  wrap.innerHTML = rows + `<div class="line"><strong>Total</strong><strong>${fmt(total)}</strong></div>`;
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('unique_lang')) localStorage.setItem('unique_lang', DEFAULT_LANG);
  if(!localStorage.getItem('unique_cur'))  localStorage.setItem('unique_cur',  DEFAULT_CUR);
  $('#year') && ($('#year').textContent=new Date().getFullYear());

  setupNav();
  applyI18n();

  setupDestinationPanel();
  rebuildDestinations();

  setupDateRange();
  setupGuests();

  updateCartCount();
  renderFeatured(); renderListing(); renderDetail(); renderCart();
});
