// ==== Datos de ejemplo (imágenes libres de Unsplash) ====
const OFFERS = [
  { id: 'o1', title: 'Noche romántica con spa', city: 'Barcelona', tags:['romanticas','spa'], price:119, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o2', title: 'Resort con piscina y desayuno', city: 'Valencia', tags:['familia'], price:89, img:'https://images.unsplash.com/photo-1501117716987-c8e3f8d8e9a5?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o3', title: 'Casa rural y ruta de montaña', city: 'Madrid', tags:['aventura'], price:75, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o4', title: 'Hotel boutique + masaje', city: 'Barcelona', tags:['spa'], price:135, img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o5', title: 'Escapada gastronómica', city: 'Valencia', tags:['gastro'], price:99, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop' },
  { id: 'o6', title: 'Aventura multi-actividad', city: 'Andorra', tags:['aventura'], price:149, img:'https://images.unsplash.com/photo-1516442719524-a603408c90cb?q=80&w=1600&auto=format&fit=crop' }
];

// ==== Utilidades ====
const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);

function getCart(){
  try{ return JSON.parse(localStorage.getItem('unique_cart')||'[]'); }catch{ return []; }
}
function setCart(items){ localStorage.setItem('unique_cart', JSON.stringify(items)); updateCartCount(); }
function addToCart(id){ const items=getCart(); const item=OFFERS.find(o=>o.id===id); if(!item) return; const found=items.find(i=>i.id===id); if(found){found.qty++} else {items.push({id,qty:1})} setCart(items); alert('Añadido al carrito'); }
function removeFromCart(id){ const items=getCart().filter(i=>i.id!==id); setCart(items); renderCart(); }
function updateCartCount(){ const n=getCart().reduce((a,b)=>a+b.qty,0); const el=qs('#cart-count'); if(el) el.textContent = n; }

// ==== Navegación y menús ====
function setupNav(){
  const toggle = qs('.nav-toggle');
  const menu = qs('#nav-menu');
  if(toggle && menu){
    toggle.addEventListener('click',()=>{
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  qsa('.has-dropdown > a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      if(window.innerWidth<=640){ e.preventDefault(); a.parentElement.classList.toggle('open'); }
    })
  });
}

// ==== Home: destacados ====
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
  </article>`
}

// ==== Listado ====
function renderListing(){
  const wrap = qs('#results');
  if(!wrap) return;
  const params = new URLSearchParams(location.search);
  const q = (params.get('q')||'').toLowerCase();
  const tag = params.get('tag');
  const city = params.get('city');
  let rows = OFFERS.filter(o=>
    (!q || o.title.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)) &&
    (!tag || o.tags.includes(tag)) &&
    (!city || o.city===city)
  );
  wrap.innerHTML = rows.map(cardHTML).join('') || '<p>No hay resultados.</p>';

  const form = qs('#filters');
  if(form){
    form.addEventListener('input', ()=>{
      const qtxt = form.q.value.toLowerCase();
      const sort = form.sort.value;
      const tags = [...form.querySelectorAll('input[name="tag"]:checked')].map(i=>i.value);
      let list = OFFERS.filter(o=>(!qtxt || o.title.toLowerCase().includes(qtxt) || o.city.toLowerCase().includes(qtxt)) && (tags.length===0 || tags.some(t=>o.tags.includes(t))));
      if(sort==='priceAsc') list.sort((a,b)=>a.price-b.price);
      if(sort==='priceDesc') list.sort((a,b)=>b.price-a.price);
      wrap.innerHTML = list.map(cardHTML).join('') || '<p>No hay resultados.</p>';
    });
  }
}

// ==== Detalle ====
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
        <h3>Qué incluye</h3>
        <ul>
          <li>Alojamiento para 2 personas</li>
          <li>Desayuno incluido</li>
          <li>Acceso al spa (según disponibilidad)</li>
        </ul>
        <details class="accord"><summary>Condiciones</summary>
          <p>Cancelación gratuita hasta 48h antes. Impuestos incluidos. Imágenes ilustrativas (Unsplash).</p>
        </details>
      </section>
    </div>
    <aside class="sticky">
      <div style="display:flex;justify-content:space-between;align-items:center"><strong>Desde</strong><span class="price">${fmt(o.price)}</span></div>
      <label style="display:block;margin:10px 0">Fecha
        <input type="date" />
      </label>
      <label style="display:block;margin:10px 0">Personas
        <select><option>2</option><option>1</option><option>3</option><option>4</option></select>
      </label>
      <button class="btn" onclick="addToCart('${o.id}')">Añadir al carrito</button>
    </aside>
  </div>`;
}

// ==== Carrito & Checkout ====
function renderCart(){
  const wrap = qs('#cart');
  if(!wrap) return;
  const items = getCart();
  if(items.length===0){ wrap.innerHTML = '<p>Tu carrito está vacío.</p>'; return; }
  const rows = items.map(it=>{
    const o = OFFERS.find(x=>x.id===it.id); const line = it.qty*o.price;
    return `<div class="line"><span>${o.title} × ${it.qty}</span><span>${fmt(line)} <button class="btn ghost" onclick="removeFromCart('${it.id}')">Quitar</button></span></div>`;
  }).join('');
  const total = items.reduce((s,it)=>{ const o=OFFERS.find(x=>x.id===it.id); return s + (it.qty*o.price); },0);
  wrap.innerHTML = rows + `<div class="line"><strong>Total</strong><strong>${fmt(total)}</strong></div>`;
}

function setupCheckout(){
  const s1 = qs('#step1'), s2=qs('#step2'), s3=qs('#step3');
  if(!s1) return;
  renderCart();
  qs('#toStep2').addEventListener('click', ()=>{ if(getCart().length===0){ alert('Añade algo al carrito.'); return;} s1.classList.remove('active'); s2.classList.add('active'); qsa('.steps li')[0].classList.remove('active'); qsa('.steps li')[1].classList.add('active'); });
  qs('#back1').addEventListener('click', ()=>{ s2.classList.remove('active'); s1.classList.add('active'); qsa('.steps li')[1].classList.remove('active'); qsa('.steps li')[0].classList.add('active'); });
  qs('#toStep3').addEventListener('click', ()=>{ if(!qs('#customer').checkValidity()){ qs('#customer').reportValidity(); return;} s2.classList.remove('active'); s3.classList.add('active'); qsa('.steps li')[1].classList.remove('active'); qsa('.steps li')[2].classList.add('active'); });
  const terms = qs('#terms'); const payBtn = qs('#payBtn');
  if(terms && payBtn){
    terms.addEventListener('change', ()=> payBtn.disabled = !terms.checked);
    payBtn.addEventListener('click', ()=>{ location.href = 'success.html'; });
  }
}

// ===== Sugerencias para "Destino" (demo sin backend) =====
const DESTS = ["Barcelona", "Madrid", "Valencia", "Andorra", "Girona", "Sevilla", "Bilbao", "Granada"];
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
    if(!q) { render(DESTS.slice(0,6)); return; }
    render(DESTS.filter(x=>x.toLowerCase().includes(q)).slice(0,8));
  }

  input.addEventListener('focus', ()=> filter(input.value));
  input.addEventListener('input', ()=> filter(input.value));
  input.addEventListener('blur', ()=> setTimeout(()=>panel.classList.remove('open'), 120));
  input.addEventListener('mouseenter', ()=> filter(input.value));
  panel.addEventListener('mouseenter', ()=> panel.classList.add('open'));
  panel.addEventListener('mouseleave', ()=> panel.classList.remove('open'));
}

// ==== Inicialización por página ====
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  updateCartCount();

  setupNav();
  renderFeatured();
  renderListing();
  renderDetail();
  setupCheckout();
  setupDestinationSuggest();
});
