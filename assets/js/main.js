/* ---------- Sample offers (Unsplash) ---------- */
const OFFERS = [
  { id:'o1', title:'Romantic night + spa', city:'Barcelona', tags:['romantic','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id:'o2', title:'Resort with pool & breakfast', city:'Valencia', tags:['family'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id:'o3', title:'Rural house & mountain trail', city:'Madrid', tags:['adventure'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id:'o4', title:'Boutique hotel + massage', city:'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id:'o5', title:'Gastronomic escape', city:'Valencia', tags:['foodie'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id:'o6', title:'Multi-activity adventure', city:'Andorra', tags:['adventure'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

/* ---------- Language & Currency ---------- */
const DEFAULT_LANG='en', DEFAULT_CUR='GBP';
const curSymbol = c => c==='EUR'?'€':c==='USD'?'$':'£';
const langFlag  = l => l==='es'?'🇪🇸':'🇬🇧';
const getLang=()=>localStorage.getItem('unique_lang')||DEFAULT_LANG;
const setLang=v=>{localStorage.setItem('unique_lang',v); const el=document.getElementById('lang-current'); if(el) el.textContent=langFlag(v);};
const getCur =()=>localStorage.getItem('unique_cur')||DEFAULT_CUR;
const setCur =v=>{localStorage.setItem('unique_cur',v); const el=document.getElementById('cur-current'); if(el) el.textContent=curSymbol(v); rerenderPrices();};
function fmt(n){ const c=getCur(); const loc=c==='EUR'?'es-ES':c==='USD'?'en-US':'en-GB'; return new Intl.NumberFormat(loc,{style:'currency',currency:c}).format(n); }
function rerenderPrices(){ renderFeatured(); renderListing(); renderDetail(); renderCart(); }

/* ---------- Cart ---------- */
const $ = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
function getCart(){ try{return JSON.parse(localStorage.getItem('unique_cart')||'[]')}catch{return[]} }
function setCart(x){ localStorage.setItem('unique_cart',JSON.stringify(x)); updateCartCount(); }
function addToCart(id){ const xs=getCart(); const f=xs.find(i=>i.id===id); f?f.qty++:xs.push({id,qty:1}); setCart(xs); alert('Added to cart'); }
function removeFromCart(id){ setCart(getCart().filter(i=>i.id!==id)); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el=$('#cart-count'); if(el) el.textContent=n; }

/* ---------- Nav ---------- */
function setupNav(){
  const t=$('.nav-toggle'), m=$('#nav-menu'); if(t&&m){ t.addEventListener('click',()=>{ const o=m.classList.toggle('open'); t.setAttribute('aria-expanded',o);});}
  $$('[data-lang]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setLang(a.dataset.lang);} ));
  $$('[data-cur]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); setCur(a.dataset.cur);} ));
  setLang(getLang()); setCur(getCur());
}

/* ---------- Destinations data (your latest list) ---------- */
const DESTINATIONS = {
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

/* ---------- Destination panel in form ---------- */
function setupFormDestinations(){
  const input=$('#destino'), panel=$('#form-destinations'), l1=$('#dest-l1'), l2=$('#dest-l2'), title=$('#dest-l2-title');
  if(!input||!panel) return;

  const allRegions=Object.keys(DESTINATIONS);
  function buildL1(list=allRegions, active=list[0]){
    l1.innerHTML=list.map(r=>`<li><a href="#" data-region="${r}" class="${r===active?'active':''}">${r}</a></li>`).join('');
  }
  function renderL2(region){
    title.textContent=region;
    const areas=DESTINATIONS[region]||[];
    l2.innerHTML=areas.map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('')||'<li><em>No areas</em></li>';
    $$('#dest-l1 a').forEach(a=>a.classList.toggle('active',a.dataset.region===region));
  }

  buildL1(); renderL2(allRegions[0]);

  // keep panel open while mouse in input/panel
  const open=()=>panel.style.display='block', close=()=>panel.style.display='none';
  ['focus','click','mouseenter','input'].forEach(ev=>input.addEventListener(ev,open));
  panel.addEventListener('mouseenter',open);
  panel.addEventListener('mouseleave',()=>setTimeout(()=>{ if(!panel.matches(':hover')&&!input.matches(':hover')&&document.activeElement!==input) close(); },80));
  input.addEventListener('blur',()=>setTimeout(()=>{ if(!panel.matches(':hover')) close(); },120));

  // hover & click change L2
  l1.addEventListener('mouseover', e=>{ const a=e.target.closest('a[data-region]'); if(a) renderL2(a.dataset.region); });
  l1.addEventListener('click', e=>{ const a=e.target.closest('a[data-region]'); if(a){ e.preventDefault(); renderL2(a.dataset.region);} });

  // Type-ahead filter: filter regions/areas by query
  input.addEventListener('input', ()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){ buildL1(allRegions); renderL2(allRegions[0]); return; }
    const matchRegions=allRegions.filter(r=>r.toLowerCase().includes(q) || (DESTINATIONS[r]||[]).some(a=>a.toLowerCase().includes(q)));
    buildL1(matchRegions);
    renderL2(matchRegions[0]||'');
    // Also filter L2 items by q
    if(matchRegions[0]){
      l2.innerHTML=(DESTINATIONS[matchRegions[0]]||[]).filter(a=>a.toLowerCase().includes(q)).map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('')||'<li><em>No matches</em></li>';
    }
  });

  // Fill input when clicking a level-2 area
  l2.addEventListener('click', e=>{
    const a=e.target.closest('a'); if(!a) return;
    input.value=a.textContent.trim();
    close();
  });
}

/* ---------- Date range picker (two months, highlight range) ---------- */
function setupDateRange(){
  const wrap=$('#date-range'), inStart=$('#checkin'), inEnd=$('#checkout');
  if(!wrap||!inStart||!inEnd) return;

  let start=null, end=null; // Date objects
  const today=new Date(); today.setHours(0,0,0,0);
  const add=(d, n)=>{ const x=new Date(d); x.setDate(x.getDate()+n); return x; };
  const firstOf=(y,m)=>new Date(y,m,1);
  const monthName=(d)=>d.toLocaleString('en-GB',{month:'long',year:'numeric'});

  function fmtInput(d){ if(!d) return ''; const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}/${mm}/${yy}`; }

  // Draw two consecutive months starting from current (or selected start)
  function render(baseDate=today){
    const next=firstOf(baseDate.getFullYear(), baseDate.getMonth()+1);
    wrap.innerHTML = `
      <div class="range-cal">
        ${calendarHTML(baseDate)}
        ${calendarHTML(next)}
      </div>
      <div class="range-actions"><button type="button" class="btn" id="clearRange">Clear</button></div>
    `;
    $('#clearRange').onclick=()=>{ start=end=null; updateInputs(); render(baseDate); };

    // day clicks
    $$('.day[data-date]').forEach(d=>{
      d.addEventListener('click', ()=>{
        const val=new Date(d.dataset.date);
        if(!start || (start && end)){ start=val; end=null; }
        else if(val < start){ end=start; start=val; } else { end=val; }
        updateInputs();
        render(start||baseDate);
      });
    });
  }

  function calendarHTML(first){
    const y=first.getFullYear(), m=first.getMonth();
    const firstDay=firstOf(y,m);
    const startGrid=add(firstDay, -((firstDay.getDay()+6)%7)); // Monday-first
    let cells='';
    for(let i=0;i<42;i++){
      const cur=add(startGrid,i); const out=cur.getMonth()!==m;
      const classes=['day']; if(out) classes.push('out');
      if(start && sameDay(cur,start)) classes.push('start');
      if(end && sameDay(cur,end)) classes.push('end');
      if(start && end && cur>start && cur<end) classes.push('in-range');
      cells += `<div class="${classes.join(' ')}" data-date="${cur.toISOString()}">${cur.getDate()}</div>`;
    }
    return `
      <div class="cal">
        <header><span class="m">${monthName(first)}</span></header>
        <div class="grid-days">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<div class="dow">${d}</div>`).join('')}
          ${cells}
        </div>
      </div>
    `;
  }

  function sameDay(a,b){ return a&&b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function updateInputs(){ inStart.value=fmtInput(start); inEnd.value=fmtInput(end); }

  // open/close
  const open=()=>{ wrap.style.display='block'; render(start||today); };
  const close=()=>{ wrap.style.display='none'; };
  $('#checkin').addEventListener('focus', open);
  $('#checkin').addEventListener('click', open);
  wrap.addEventListener('mouseleave', ()=> setTimeout(()=>{ if(!wrap.matches(':hover') && document.activeElement!==inStart) close(); }, 80));
}

/* ---------- Guests dropdown ---------- */
function setupGuests(){
  const panel=$('#guests-panel'), field=$('#guests');
  if(!panel||!field) return;

  const state={adults:2, children:0, babies:0};
  function clamp(k){ if(state[k]<0) state[k]=0; if(k==='adults' && state[k]===0) state[k]=1; }
  function update(){
    $('#gv-adults').textContent=state.adults;
    $('#gv-children').textContent=state.children;
    $('#gv-babies').textContent=state.babies;
    field.value = state.adults + state.children + state.babies;
  }
  panel.addEventListener('click', e=>{
    const b=e.target.closest('button[data-k]'); if(!b) return;
    const k=b.dataset.k, delta=parseInt(b.dataset.g,10);
    state[k]+=delta; clamp(k); update();
  });
  $('#guests-ok').addEventListener('click', ()=> panel.style.display='none');
  update();
}

/* ---------- Listing / Featured / Detail / Checkout ---------- */
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
  let rows=OFFERS.filter(o=>(!q||o.title.toLowerCase().includes(q)||o.city.toLowerCase().includes(q)) && (!tag||(o.tags||[]).includes(tag)) && (!city||o.city===city));
  w.innerHTML=rows.map(cardHTML).join('') || '<p>No results.</p>';
}
function renderDetail(){
  const box=$('#detail'); if(!box) return;
  const id=new URLSearchParams(location.search).get('id'); const o=OFFERS.find(x=>x.id===id)||OFFERS[0];
  box.innerHTML=`
  <div class="detail">
    <div>
      <div class="gallery"><img src="${o.img}" alt="${o.title}"></div>
      <section class="section">
        <h1>${o.title}</h1><p class="muted">${o.city}</p>
        <h3>Includes</h3><ul><li>Stay for 2 guests</li><li>Breakfast included</li><li>Spa access (subject to availability)</li></ul>
      </section>
    </div>
    <aside class="sticky">
      <div style="display:flex;justify-content:space-between;align-items:center"><strong>From</strong><span class="price">${fmt(o.price)}</span></div>
      <button class="btn" onclick="addToCart('${o.id}')">Add to cart</button>
    </aside>
  </div>`;
}
function renderCart(){
  const wrap=$('#cart'); if(!wrap) return;
  const items=getCart(); if(items.length===0){ wrap.innerHTML='<p>Your cart is empty.</p>'; return; }
  const rows=items.map(it=>{const o=OFFERS.find(x=>x.id===it.id); const line=it.qty*o.price;
    return `<div class="line"><span>${o.title} × ${it.qty}</span><span>${fmt(line)} <button class="btn ghost" onclick="removeFromCart('${it.id}')">Remove</button></span></div>`}).join('');
  const total=items.reduce((s,it)=>{const o=OFFERS.find(x=>x.id===it.id); return s+(it.qty*o.price);},0);
  wrap.innerHTML=rows+`<div class="line"><strong>Total</strong><strong>${fmt(total)}</strong></div>`;
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('unique_lang')) setLang(DEFAULT_LANG);
  if(!localStorage.getItem('unique_cur'))  setCur(DEFAULT_CUR);
  $('#year') && ($('#year').textContent=new Date().getFullYear());
  updateCartCount();

  setupNav();
  setupFormDestinations();
  setupDateRange();
  setupGuests();

  renderFeatured(); renderListing(); renderDetail(); renderCart();
});
