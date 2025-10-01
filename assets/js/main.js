// ===== Sample data (Unsplash images) =====
const OFFERS = [
  { id: 'o1', title: 'Romantic night + spa', city: 'Barcelona', tags:['romantic','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o2', title: 'Resort with pool & breakfast', city: 'Valencia', tags:['family'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o3', title: 'Rural house & mountain trail', city: 'Madrid', tags:['adventure'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o4', title: 'Boutique hotel + massage', city: 'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o5', title: 'Gastronomic escape', city: 'Valencia', tags:['foodie'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o6', title: 'Multi-activity adventure', city: 'Andorra', tags:['adventure'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

// ===== Utilities =====
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR'}).format(n);

// ===== Cart =====
function getCart(){ try{ return JSON.parse(localStorage.getItem('unique_cart')||'[]'); }catch{ return []; } }
function setCart(items){ localStorage.setItem('unique_cart', JSON.stringify(items)); updateCartCount(); }
function addToCart(id){ const items=getCart(); const item=OFFERS.find(o=>o.id===id); if(!item) return; const found=items.find(i=>i.id===id); if(found){found.qty++} else {items.push({id,qty:1})} setCart(items); alert('Added to cart'); }
function removeFromCart(id){ const items=getCart().filter(i=>i.id!==id); setCart(items); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el=qs('#cart-count'); if(el) el.textContent = n; }

// ===== Nav / mobile =====
function setupNav(){
  const toggle = qs('.nav-toggle');
  const menu = qs('#nav-menu');
  if(toggle && menu){
    toggle.addEventListener('click',()=>{
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  // Open mega on mobile via click
  const mega = qs('.mega');
  if(mega){
    mega.querySelector('.mega-trigger').addEventListener('click',(e)=>{
      if(window.innerWidth<=640){ e.preventDefault(); mega.classList.toggle('open'); }
    });
  }
}

// ===== Mega menu data (two-level, Tesco-like) =====
const DESTINATIONS = {
  "Balearic Islands": ["Mallorca","Menorca","Formentera","Ibiza"],
  "Canary Islands": ["Gran Canaria","Tenerife","Lanzarote","La Gomera"],
  "Ski": ["Andorra","Cerler","Formigal"],
  "Galicia": ["Rías Altas","Rías Baixas – Albariño","Ribeira Sacra – Ourense"],
  "Andalusia": ["Seville","Granada","Córdoba"],
  "Asturias": ["Asturias"],
  "Madrid": ["Madrid"],
  "Catalonia": ["Costa Brava","Barcelona"],
  "Valencia": ["Valencia","Alicante"]
};

function setupMegaMenu(){
  const l1 = qs('#dest-l1');
  const l2 = qs('#dest-l2');
  const title = qs('#dest-l2-title');
  if(!l1 || !l2) return;

  // build level 1
  const regions = Object.keys(DESTINATIONS);
  l1.innerHTML = regions.map((r,i)=>`<li><a href="#" data-region="${r}" class="${i===0?'active':''}">${r}</a></li>`).join('');

  function renderL2(region){
    title.textContent = region;
    const areas = DESTINATIONS[region] || [];
    l2.innerHTML = areas.map(a=>{
      const params = new URLSearchParams({ city: a }); // deep link to listing
      return `<li><a href="listing.html?${params.toString()}">${a}</a></li>`;
    }).join('') || '<li><em>No areas</em></li>';
    // highlight active in L1
    l1.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.region===region));
  }

  // initial
  renderL2(regions[0]);

  // interactions
  l1.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      renderL2(a.dataset.region);
    });
  });
}

// ===== Home: featured =====
function renderFeatured(){
  const wrap = qs('#featured');
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
  const wrap = qs('#results');
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

  const form = qs('#filters');
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
  const box = qs('#detail');
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
  const wrap = qs('#cart');
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
  const s1 = qs('#step1'), s2=qs('#step2'), s3=qs('#step3');
  if(!s1) return;
  renderCart();
  qs('#toStep2').addEventListener('click', ()=>{ if(getCart().length===0){ alert('Add something to the cart.'); return;} s1.classList.remove('active'); s2.classList.add('active'); qsa('.steps li')[0].classList.remove('active'); qsa('.steps li')[1].classList.add('active'); });
  qs('#back1').addEventListener('click', ()=>{ s2.classList.remove('active'); s1.classList.add('active'); qsa('.steps li')[1].classList.remove('active'); qsa('.steps li')[0].classList.add('active'); });
  qs('#toStep3').addEventListener('click', ()=>{ if(!qs('#customer').checkValidity()){ qs('#customer').reportValidity(); return;} s2.classList.remove('active'); s3.classList.add('active'); qsa('.steps li')[1].classList.remove('active'); qsa('.steps li')[2].classList.add('active'); });
  const terms = qs('#terms'); const payBtn = qs('#payBtn');
  if(terms && payBtn){
    terms.addEventListener('change', ()=> payBtn.disabled = !terms.checked);
    payBtn.addEventListener('click', ()=>{ location.href = 'success.html'; });
  }
}

// ===== Destination input suggests (simple demo) =====
const DESTS_SUGGEST = ["Barcelona","Madrid","Valencia","Andorra","Girona","Seville","Bilbao","Granada"];
function setupDestinationSuggest(){
  const input = document.getElementById('destino');
  const panel = document.getElementById('destino-suggest');
  if(!input || !panel) return;

  function render(list){
    panel.innerHTML = list.map(x=>`<button type="button" data-v="${x}">${x}</button>`).join('');
    panel.classList.toggle('open', list.length>0);
    panel.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', ()=>{
        input.value = b.dataset.v;
        panel.classList.remove('open');
      });
    });
  }
  function filter(q){
    q = q.trim().toLowerCase();
    if(!q) { render(DESTS_SUGGEST.slice(0,6)); return; }
    render(DESTS_SUGGEST.filter(x=>x.toLowerCase().includes(q)).slice(0,8));
  }
  input.addEventListener('focus', ()=> filter(input.value));
  input.addEventListener('input', ()=> filter(input.value));
  input.addEventListener('blur', ()=> setTimeout(()=>panel.classList.remove('open'), 120));
  input.addEventListener('mouseenter', ()=> filter(input.value));
  panel.addEventListener('mouseenter', ()=> panel.classList.add('open'));
  panel.addEventListener('mouseleave', ()=> panel.classList.remove('open'));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  updateCartCount();

  setupNav();
  setupMegaMenu();
  setupDestinationSuggest();

  renderFeatured();
  renderListing();
  renderDetail();
  setupCheckout();
});
