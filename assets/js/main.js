// ===== Sample data (Unsplash images) =====
const OFFERS = [
  { id: 'o1', title: 'Romantic night + spa', city: 'Barcelona', tags:['romantic','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o2', title: 'Resort with pool & breakfast', city: 'Valencia', tags:['family'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o3', title: 'Rural house & mountain trail', city: 'Madrid', tags:['adventure'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o4', title: 'Boutique hotel + massage', city: 'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o5', title: 'Gastronomic escape', city: 'Valencia', tags:['foodie'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o6', title: 'Multi-activity adventure', city: 'Andorra', tags:['adventure'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

// ===== Language & currency (persist in localStorage) =====
const DEFAULT_LANG = 'en';
const DEFAULT_CUR  = 'GBP';

function getLang(){ return localStorage.getItem('unique_lang') || DEFAULT_LANG; }
function setLang(v){ localStorage.setItem('unique_lang', v); updateLangIcon(); }
function getCur() { return localStorage.getItem('unique_cur') || DEFAULT_CUR; }
function setCur(v){ localStorage.setItem('unique_cur', v); updateCurIcon(); rerenderPrices(); }

function curSymbol(c){ return c==='EUR'?'€':c==='USD'?'$':'£'; }
function langFlag(l){ return l==='es'?'🇪🇸':'🇬🇧'; }

// ===== Formatting =====
function fmt(n){
  const cur = getCur();
  const loc = (cur==='EUR')?'es-ES':(cur==='USD')?'en-US':'en-GB';
  return new Intl.NumberFormat(loc,{style:'currency',currency:cur}).format(n);
}

function updateLangIcon(){
  const a = document.getElementById('lang-current');
  if(a) a.textContent = langFlag(getLang());
}
function updateCurIcon(){
  const a = document.getElementById('cur-current');
  if(a) a.textContent = curSymbol(getCur());
}
function rerenderPrices(){
  // Re-render cards & detail totals to reflect new currency
  renderFeatured(); renderListing(); renderDetail(); renderCart();
}

// ===== Cart =====
function getCart(){ try{ return JSON.parse(localStorage.getItem('unique_cart')||'[]'); }catch{ return []; } }
function setCart(items){ localStorage.setItem('unique_cart', JSON.stringify(items)); updateCartCount(); }
function addToCart(id){ const items=getCart(); const item=OFFERS.find(o=>o.id===id); if(!item) return; const found=items.find(i=>i.id===id); if(found){found.qty++} else {items.push({id,qty:1})} setCart(items); alert('Added to cart'); }
function removeFromCart(id){ const items=getCart().filter(i=>i.id!==id); setCart(items); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el= document.getElementById('cart-count'); if(el) el.textContent = n; }

// ===== Nav / mobile =====
function setupNav(){
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if(toggle && menu){
    toggle.addEventListener('click',()=>{
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  // Language & currency clicks
  document.querySelectorAll('[data-lang]').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); setLang(a.dataset.lang); });
  });
  document.querySelectorAll('[data-cur]').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); setCur(a.dataset.cur); });
  });
  updateLangIcon(); updateCurIcon();
}

// ===== Destinations dataset (from your list) =====
const DESTINATIONS = {
  "Baleares": ["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias": ["Gran Canaria","Tenerife","Lanzarote"],
  "Catalunya": ["Costa Brava - Lampurda","Costa Brava - Cadaques","Barcelona"],
  "Andorra": ["Andorra"],
  "Baqueira": ["Baqueira"],
  "Sierra Nevada": ["Sierra Nevada"],
  "Rioja": ["Rioja"],
  "Ribera del Duero": ["Penyafiel","Burgos"],
  "Galicia": ["Rias Baixas","Rias Altas","Ribeira Sacra"],
  "Asturias": ["Asturias"],
  "Andalucía": ["Sevilla","Granada","Cordoba","Malaga","Cadiz"],
  "Madrid": ["Madrid"],
  "Pais Vasco": ["Bilbao","San Sebastian","Pamplona"],
  "Cantabria": ["Santander"]
};

// ===== Form mega dropdown (Tesco-like) =====
function setupFormDestinations(){
  const input = document.getElementById('destino');
  const panel = document.getElementById('form-destinations');
  const l1 = document.getElementById('dest-l1');
  const l2 = document.getElementById('dest-l2');
  const title = document.getElementById('dest-l2-title');
  if(!input || !panel || !l1 || !l2) return;

  // Build level 1
  const regions = Object.keys(DESTINATIONS);
  l1.innerHTML = regions.map((r,i)=>`<li><a href="#" data-region="${r}" class="${i===0?'active':''}">${r}</a></li>`).join('');
  function renderL2(region){
    title.textContent = region;
    const areas = DESTINATIONS[region] || [];
    l2.innerHTML = areas.map(a=>{
      const qs = new URLSearchParams({ city: a });
      return `<li><a href="listing.html?${qs.toString()}">${a}</a></li>`;
    }).join('') || '<li><em>No areas</em></li>';
    l1.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.region===region));
  }
  renderL2(regions[0]);

  // Open/close behaviour: keep open on hover over input or panel
  const openPanel = ()=> panel.style.display = 'block';
  const closePanel = ()=> panel.style.display = 'none';

  input.addEventListener('focus', openPanel);
  input.addEventListener('click', openPanel);
  input.addEventListener('mouseenter', openPanel);

  panel.addEventListener('mouseenter', openPanel);
  panel.addEventListener('mouseleave', ()=> setTimeout(()=>{ if(!panel.matches(':hover') && !input.matches(':hover') && document.activeElement!==input) closePanel(); }, 80));
  input.addEventListener('blur', ()=> setTimeout(()=>{ if(!panel.matches(':hover')) closePanel(); }, 120));

  // L1: open L2 on hover AND click
  l1.querySelectorAll('a').forEach(a=>{
    a.addEventListener('mouseenter', ()=> renderL2(a.dataset.region));
    a.addEventListener('click', (e)=>{ e.preventDefault(); renderL2(a.dataset.region); });
  });

  // When clicking an L2 link, also fill the input
  l2.addEventListener('click', (e)=>{
    const t = e.target.closest('a'); if(!t) return;
    input.value = t.textContent.trim();
    closePanel();
  });
}

// ===== Home: featured =====
function renderFeatured(){
  const wrap = document.getElementById('featured');
  if(!wrap) return;
  wrap.innerHTML = OFFERS.slice(0,6).map(cardHTML).join('');
}

function cardHTML(o){
  return `<article class="card">
    <a href="detail.html?id=${o.id}"><img src="${o.img}" alt="${o.title}" loading="lazy"></a>
    <div class="pad">
      <h3><a href="detail.html?id=${o.id}">${o.title}</a></h3>
      <div class="meta"><span>${o.city}</span><span class="price">${fmt(o.price)}</span></div>
    </div>
  </article>`;
}

// ===== Listing =====
function renderListing(){
  const wrap = document.getElementById('results');
  if(!wrap) return;
  const params = new URLSearchParams(location.search);
  const q = (params.get('q')||'').toLowerCase();
  const tag = params.get('tag');
  const city = params.get('city');
  let rows = OFFERS.filter(o=>
    (!q || o.title.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)) &&
    (!tag || (o.tags||[]).includes(tag)) &&
    (!city || o.city===city)
  );
  wrap.innerHTML = rows.map(cardHTML).join('') || '<p>No results.</p>';

  const form = document.getElementById('filters');
  if(form){
    form.addEventListener('input', ()=>{
      const qtxt = form.q.value.toLowerCase();
      const sort = form.sort.value;
      const tags = [...form.querySelectorAll('input[name="tag"]:checked')].map(i=>i.value);
      let list = OFFERS.filter(o=>(!qtxt || o.title.toLowerCase().includes(qtxt) || o.city.toLowerCase().includes(qtxt)) && (tags.length===0 || tags.some(t=>(o.tags||[]).includes(t))));
      if(sort==='priceAsc') list.sort((a,b)=>a.price-b.price);
      if(sort==='priceDesc') list.sort((a,b)=>b.price-a.price);
      wrap.innerHTML = list.map(cardHTML).join('') || '<p>No results.</p>';
    });
  }
}

// ===== Detail =====
function renderDetail(){
  const box = document.getElementById('detail');
  if(!box) return;
  const id = new URLSearchParams(location.search).get('id');
  const o = OFFERS.find(x=>x.id===id) || OFFERS[0];
  box.innerHTML = `
  <div class="detail">
    <div>
      <div class="gallery"><img src="${o.img}" alt="${o.title}"></div>
      <section class="section">
        <h1>${o.title}</h1>
        <p class="muted">${o.city}</p>
        <h3>Includes</h3>
        <ul>
          <li>Stay for 2 guests</li>
          <li>Breakfast included</li>
          <li>Spa access (subject to availability)</li>
        </ul>
        <details class="accord"><summary>Terms</summary>
          <p>Free cancellation up to 48h before. Taxes included. Illustrative images (Unsplash).</p>
        </details>
      </section>
    </div>
    <aside class="sticky">
      <div style="display:flex;justify-content:space-between;align-items:center"><strong>From</strong><span class="price">${fmt(o.price)}</span></div>
      <label style="display:block;margin:10px 0">Date
        <input type="date" />
      </label>
      <label style="display:block;margin:10px 0">Guests
        <select><option>2</option><option>1</option><option>3</option><option>4</option></select>
      </label>
      <button class="btn" onclick="addToCart('${o.id}')">Add to cart</button>
    </aside>
  </div>`;
}

// ===== Checkout =====
function renderCart(){
  const wrap = document.getElementById('cart');
  if(!wrap) return;
  const items = getCart();
  if(items.length===0){ wrap.innerHTML = '<p>Your cart is empty.</p>'; return; }
  const rows = items.map(it=>{
    const o = OFFERS.find(x=>x.id===it.id); const line = it.qty*o.price;
    return `<div class="line"><span>${o.title} × ${it.qty}</span><span>${fmt(line)} <button class="btn ghost" onclick="removeFromCart('${it.id}')">Remove</button></span></div>`;
  }).join('');
  const total = items.reduce((s,it)=>{ const o=OFFERS.find(x=>x.id===it.id); return s + (it.qty*o.price); },0);
  wrap.innerHTML = rows + `<div class="line"><strong>Total</strong><strong>${fmt(total)}</strong></div>`;
}

function setupCheckout(){
  const s1 = document.getElementById('step1'), s2=document.getElementById('step2'), s3=document.getElementById('step3');
  if(!s1) return;
  renderCart();
  document.getElementById('toStep2').addEventListener('click', ()=>{ if(getCart().length===0){ alert('Add something to the cart.'); return;} s1.classList.remove('active'); s2.classList.add('active'); document.querySelectorAll('.steps li')[0].classList.remove('active'); document.querySelectorAll('.steps li')[1].classList.add('active'); });
  document.getElementById('back1').addEventListener('click', ()=>{ s2.classList.remove('active'); s1.classList.add('active'); document.querySelectorAll('.steps li')[1].classList.remove('active'); document.querySelectorAll('.steps li')[0].classList.add('active'); });
  document.getElementById('toStep3').addEventListener('click', ()=>{ if(!document.getElementById('customer').checkValidity()){ document.getElementById('customer').reportValidity(); return;} s2.classList.remove('active'); s3.classList.add('active'); document.querySelectorAll('.steps li')[1].classList.remove('active'); document.querySelectorAll('.steps li')[2].classList.add('active'); });
  const terms = document.getElementById('terms'); const payBtn = document.getElementById('payBtn');
  if(terms && payBtn){
    terms.addEventListener('change', ()=> payBtn.disabled = !terms.checked);
    payBtn.addEventListener('click', ()=>{ location.href = 'success.html'; });
  }
}

// ===== Destinations page grid =====
function renderDestinationsPage(){
  const grid = document.getElementById('destinations-grid');
  if(!grid) return;
  const cards = [];
  for(const [region, areas] of Object.entries(DESTINATIONS)){
    cards.push(`<article class="card">
      <div class="pad">
        <h3>${region}</h3>
        <ul style="margin:8px 0 0 18px;">${areas.map(a=>`<li><a href="listing.html?city=${encodeURIComponent(a)}">${a}</a></li>`).join('')}</ul>
      </div>
    </article>`);
  }
  grid.innerHTML = cards.join('');
}

// ===== Weekendesk-style date inputs (dd/mm/yyyy auto-format) =====
function setupDateMasks(){
  const onType = (ev)=>{
    let v = ev.target.value.replace(/[^0-9]/g,'');
    if(v.length>8) v = v.slice(0,8);
    if(v.length>4) v = v.slice(0,2) + '/' + v.slice(2,4) + '/' + v.slice(4);
    else if(v.length>2) v = v.slice(0,2) + '/' + v.slice(2);
    ev.target.value = v;
  };
  ['checkin','checkout'].forEach(id=>{
    const el = document.getElementById(id);
    if(el){ el.addEventListener('input', onType); el.placeholder = 'dd/mm/yyyy'; }
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', ()=>{
  // defaults
  if(!localStorage.getItem('unique_lang')) setLang(DEFAULT_LANG);
  if(!localStorage.getItem('unique_cur'))  setCur(DEFAULT_CUR);
  updateLangIcon(); updateCurIcon();

  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  updateCartCount();

  setupNav();
  setupFormDestinations();
  setupDateMasks();

  renderFeatured();
  renderListing();
  renderDetail();
  setupCheckout();
  renderDestinationsPage();
});
