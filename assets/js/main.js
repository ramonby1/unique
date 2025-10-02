/* ===== Demo data ===== */
const OFFERS = [
  { id:'o1', title:'Romantic night + spa', city:'Barcelona', tags:['romantic','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id:'o2', title:'Resort with pool & breakfast', city:'Valencia', tags:['family'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id:'o3', title:'Rural house & mountain trail', city:'Madrid', tags:['adventure'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id:'o4', title:'Boutique hotel + massage', city:'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id:'o5', title:'Gastronomic escape', city:'Valencia', tags:['foodie'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id:'o6', title:'Multi-activity adventure', city:'Andorra', tags:['adventure'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

/* ===== Language & Currency ===== */
const DEFAULT_LANG='en', DEFAULT_CUR='GBP';
const curSymbol=c=>c==='EUR'?'€':c==='USD'?'$':'£';
const langFlag=l=>l==='es'?'🇪🇸':'🇬🇧';
const getLang=()=>localStorage.getItem('unique_lang')||DEFAULT_LANG;
const setLang=v=>{localStorage.setItem('unique_lang',v); $('#lang-current').textContent=langFlag(v); applyI18n(); rerenderCalendars();};
const getCur =()=>localStorage.getItem('unique_cur')||DEFAULT_CUR;
const setCur =v=>{localStorage.setItem('unique_cur',v); $('#cur-current').textContent=curSymbol(v); rerenderPrices();};
function fmt(n){ const c=getCur(); const loc=c==='EUR'?'es-ES':c==='USD'?'en-US':'en-GB'; return new Intl.NumberFormat(loc,{style:'currency',currency:c}).format(n); }
function rerenderPrices(){ renderFeatured(); renderListing(); renderDetail(); renderCart(); }

/* ===== Helpers ===== */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

/* ===== I18n dictionary ===== */
const I18N={
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
    themeOptions:[
      'Sports','Adventure','Gastro','Tour','Recreational','Events','Wellness','Family',
      'All inclusive','Sun & Beach','City breaks','Mountain & Ski','Luxury','Iconic','Aquatic'
    ],
    weekdays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
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
    themeOptions:[
      'Deportes','Aventura','Gastro','Tour','Recreativo','Eventos','Bienestar','En familia',
      'Todo incluido','Sol y Playa','Escapadas a ciudad','Montaña y Esquí','Lujo','Icónico','Acuático'
    ],
    weekdays:['Lun.','Mar.','Mié.','Jue.','Vie.','Sáb.','Dom.'],
  }
};
function t(key){ const L=getLang(); return I18N[L][key] ?? key; }
function applyI18n(){
  $$('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.dataset.i18n); });
  // Theme options
  const sel=$('#theme'); if(sel){ const opts=I18N[getLang()].themeOptions; sel.innerHTML=opts.map(o=>`<option>${o}</option>`).join(''); }
}

/* ===== Cart ===== */
function getCart(){ try{return JSON.parse(localStorage.getItem('unique_cart')||'[]')}catch{return[]} }
function setCart(x){ localStorage.setItem('unique_cart',JSON.stringify(x)); updateCartCount(); }
function addToCart(id){ const xs=getCart(); const f=xs.find(i=>i.id===id); f?f.qty++:xs.push({id,qty:1}); setCart(xs); alert('Added to cart'); }
function removeFromCart(id){ setCart(getCart().filter(i=>i.id!==id)); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el=$('#cart-count'); if(el) el.textContent=n; }

/* ===== Nav ===== */
function setupNav(){
  const t=$('.nav-toggle'), m=$('#nav-menu'); if(t&&m){ t.addEventListener('click',()=>{ const o=m.classList.toggle('open'); t.setAttribute('aria-expanded',o);});}
  $$('[data-lang]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setLang(a.dataset.lang);} ));
  $$('[data-cur]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setCur(a.dataset.cur);} ));
  $('#lang-current').textContent=langFlag(getLang());
  $('#cur-current').textContent=curSymbol(getCur());
}

/* ===== Destinations dataset ===== */
const DESTINATIONS={
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

/* ===== Destination panel ===== */
function setupFormDestinations(){
  const input=$('#destino'), panel=$('#form-destinations'), l1=$('#dest-l1'), l2=$('#dest-l2'), title=$('#dest-l2-title');
  if(!input||!panel) return;
  const regions=Object.keys(DESTINATIONS);

  function buildL1(list=regions, active=list[0]){
    l1.innerHTML=list.map(r=>`<li><a href="#" data-region="${r}" class="${r===active?'active':''}">${r}</a></li>`).join('');
  }
  function renderL2(region){
    title.textContent=region||'';
    const areas=(DESTINATIONS[region]||[]);
    l2.innerHTML=areas.map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('')||'<li><em>No areas</em></li>';
    $$('#dest-l1 a').forEach(a=>a.classList.toggle('active',a.dataset.region===region));
  }
  buildL1(); renderL2(regions[0]);

  const open=()=>{ panel.style.display='block';};
  const close=()=>{ panel.style.display='none';};
  ['focus','click','mouseenter','input'].forEach(ev=>input.addEventListener(ev,open));
  panel.addEventListener('mouseenter',open);
  document.addEventListener('click',e=>{ if(!panel.contains(e.target) && e.target!==input){ close(); } });

  l1.addEventListener('mouseover', e=>{ const a=e.target.closest('a[data-region]'); if(a) renderL2(a.dataset.region); });
  l1.addEventListener('click', e=>{ const a=e.target.closest('a[data-region]'); if(a){ e.preventDefault(); renderL2(a.dataset.region);} });

  // type-ahead filter
  input.addEventListener('input', ()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){ buildL1(regions); renderL2(regions[0]); return; }
    const matchedRegions=regions.filter(r=>r.toLowerCase().includes(q) || (DESTINATIONS[r]||[]).some(a=>a.toLowerCase().includes(q)));
    buildL1(matchedRegions);
    renderL2(matchedRegions[0]||'');
    if(matchedRegions[0]){
      l2.innerHTML=(DESTINATIONS[matchedRegions[0]]||[]).filter(a=>a.toLowerCase().includes(q)).map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('')||'<li><em>No matches</em></li>';
    }
  });

  l2.addEventListener('click', e=>{
    const a=e.target.closest('a'); if(!a) return;
    input.value=a.textContent.trim();
    close();
  });
}

/* ===== Date range picker (single input, reliable open/close) ===== */
function setupDateRange(){
  const panel=$('#date-range'), display=$('#dates'), inStart=$('#checkin'), inEnd=$('#checkout');
  if(!panel||!display) return;

  let start=null, end=null;
  const today=new Date(); today.setHours(0,0,0,0);
  const add=(d,n)=>{const x=new Date(d); x.setDate(x.getDate()+n); return x;};
  const firstOf=(y,m)=>new Date(y,m,1);
  const same=(a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
  const mName=d=>d.toLocaleString(getLang()==='es'?'es-ES':'en-GB',{month:'long',year:'numeric'});
  const W = ()=>I18N[getLang()].weekdays;
  const fmtInput=d=>{ if(!d) return ''; const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); return `${dd}/${mm}/${d.getFullYear()}`; };
  const fmtLabel=(a,b)=>{
    if(!a&&!b) return '';
    const loc=getLang()==='es'?'es-ES':'en-GB';
    const f=(d)=>d.toLocaleString(loc,{weekday:'short',day:'numeric',month:'short'});
    return b ? `${f(a)} – ${f(b)}` : `${f(a)} – …`;
  };
  function setInputWidth(){ display.style.width = Math.max(10, (display.value||display.placeholder).length) + 'ch'; }

  function calendarHTML(first){
    const y=first.getFullYear(), m=first.getMonth();
    const firstDay=firstOf(y,m);
    const startGrid=add(firstDay,-((firstDay.getDay()+6)%7)); // Monday-first
    let cells='';
    for(let i=0;i<42;i++){
      const cur=add(startGrid,i), out=cur.getMonth()!==m;
      const cls=['day']; if(out) cls.push('out');
      if(start && same(cur,start)) cls.push('start');
      if(end && same(cur,end)) cls.push('end');
      if(start && end && cur>start && cur<end) cls.push('in-range');
      cells += `<div class="${cls.join(' ')}" data-date="${cur.toISOString()}">${cur.getDate()}</div>`;
    }
    return `
      <div class="cal">
        <header><span class="m">${mName(first)}</span></header>
        <div class="grid-days">
          ${W().map(x=>`<div class="dow">${x}</div>`).join('')}
          ${cells}
        </div>
      </div>`;
  }

  function render(base=today){
    const next=firstOf(base.getFullYear(),base.getMonth()+1);
    panel.innerHTML = `
      <div class="range-cal">
        ${calendarHTML(base)}
        ${calendarHTML(next)}
      </div>
      <div class="range-actions">
        <button type="button" class="btn" id="clearRange">${t('actions.clear')}</button>
        <button type="button" class="btn" id="closeRange">${t('actions.confirm')}</button>
      </div>`;
    $('#clearRange').onclick=()=>{ start=end=null; updateInputs(); render(base); };
    $('#closeRange').onclick=close;

    $$('.day[data-date]').forEach(d=>{
      d.addEventListener('click', ()=>{
        const val=new Date(d.dataset.date);
        if(!start || (start && end)){ start=val; end=null; }
        else if(val < start){ end=start; start=val; } else { end=val; }
        updateInputs();
        render(start||base);
      });
    });
  }

  function updateInputs(){
    display.value = fmtLabel(start,end);
    inStart.value = fmtInput(start);
    inEnd.value   = fmtInput(end);
    setInputWidth();
  }

  function open(){ panel.style.display='block'; render(start||today); }
  function close(){ panel.style.display='none'; }

  display.addEventListener('click', open);
  display.addEventListener('focus', open);
  setInputWidth();

  document.addEventListener('click',e=>{
    if(e.target===display || panel.contains(e.target)) return;
    close();
  });

  // re-render on language change
  window.rerenderCalendars = render;
}

/* ===== Guests ===== */
function setupGuests(){
  const panel=$('#guests-panel'), field=$('#guests');
  if(!panel||!field) return;
  const state={adults:2, children:0, babies:0};
  const clamp=k=>{ if(state[k]<0) state[k]=0; if(k==='adults'&&state[k]===0) state[k]=1; };
  function update(){
    $('#gv-adults').textContent=state.adults;
    $('#gv-children').textContent=state.children;
    $('#gv-babies').textContent=state.babies;
    const total=state.adults+state.children+state.babies;
    field.value=total;
    field.style.width = Math.max(3, String(total).length) + 'ch';
  }
  panel.addEventListener('click', e=>{
    const b=e.target.closest('button[data-k]'); if(!b) return;
    const k=b.dataset.k, d=parseInt(b.dataset.g,10); state[k]+=d; clamp(k); update();
  });
  $('#guests-ok').addEventListener('click', ()=> panel.style.display='none');
  update();
}

/* ===== Cards / Listing / Detail / Cart ===== */
function cardHTML(o){ return `<article class="card"><a href="detail.html?id=${o.id}"><img src="${o.img}" alt="${o.title}" loading="lazy"></a><div class="pad"><h3><a href="detail.html?id=${o.id}">${o.title}</a></h3><div class="meta"><span>${o.city}</span><span class="price">${fmt(o.price)}</span></div></div></article>`; }
function renderFeatured(){ const w=$('#featured'); if(w) w.innerHTML=OFFERS.slice(0,6).map(cardHTML).join(''); }
function renderListing(){ const w=$('#results'); if(!w) return; const p=new URLSearchParams(location.search), q=(p.get('q')||'').toLowerCase(), tag=p.get('tag'), city=p.get('city'); let rows=OFFERS.filter(o=>(!q||o.title.toLowerCase().includes(q)||o.city.toLowerCase().includes(q))&&(!tag||(o.tags||[]).includes(tag))&&(!city||o.city===city)); w.innerHTML=rows.map(cardHTML).join('')||'<p>No results.</p>'; }
function renderDetail(){ const box=$('#detail'); if(!box) return; const id=new URLSearchParams(location.search).get('id'); const o=OFFERS.find(x=>x.id===id)||OFFERS[0]; box.innerHTML=`<div class="detail"><div><div class="gallery"><img src="${o.img}" alt="${o.title}"></div><section class="section"><h1>${o.title}</h1><p class="muted">${o.city}</p><h3>Includes</h3><ul><li>Stay for 2 guests
