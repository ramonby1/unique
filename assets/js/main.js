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
// Dropdown en mobile
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


});
