/* ====== util ====== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toString().padStart(2,'0');

/* año footer */
$("#year") && ($("#year").textContent = new Date().getFullYear());

/* ====== DATA ====== */

/* Dropdown DESTINOS (formulario) */
const DEST_FORM = {
  "Baleares": ["Mallorca","Menorca","Ibiza","Formentera"],
  "Canarias": ["Gran Canaria","Tenerife","Lanzarote"],
  "Costa Brava": ["Cadaques-Empordá","Sitges"],
  "Barcelona": ["Barcelona"],
  "Ribera del Duero": ["Penyafiel","Burgos"]
};

/* Mosaicos/imagenes por destino “macro” */
const DEST_IMAGES = {
  "Baleares": "assets/img/ibiza-roca.jpg",
  "Canarias": "assets/img/gran-canaria-arguineguin.jpg",
  "Costa Brava": "assets/img/Sitges.jpeg",
  "Barcelona": "assets/img/Sitges.jpeg",
  "Ribera del Duero": "assets/img/Ribera-del-duero.webp",
  "Mallorca":"assets/img/veleros-mallorca.jpg",
  "Menorca":"assets/img/menorca.jpg",
  "Ibiza":"assets/img/ibiza-roca.jpg",
  "Formentera":"assets/img/formentera-ses-illettes.png",
  "Gran Canaria":"assets/img/gran-canaria-arguineguin.jpg",
  "Tenerife":"assets/img/Tenerife.jpg",
  "Lanzarote":"assets/img/Lanzarote.jpg",
  "Cadaques-Empordá":"assets/img/Sitges.jpeg",
  "Sitges":"assets/img/Sitges.jpeg",
  "Barcelona":"assets/img/Sitges.jpeg",
  "Penyafiel":"assets/img/Ribera-del-duero.webp",
  "Burgos":"assets/img/Ribera-del-duero.webp"
};

/* Temáticas recomendadas */
const THEMES = [
  "Deportes","Gastro","Enoturismo","Tour","Eventos","Bienestar","Todo incluido"
];

/* Actividades recomendadas (título + imagen) */
const ACTIVITIES = [
  ["Snorquel","assets/img/ibiza-roca.jpg"],
  ["Moto acuática","assets/img/ibiza-roca.jpg"],
  ["Globo","assets/img/globo-segovia.webp"],
  ["Bodega","assets/img/Ribera-del-duero.webp"],
  ["Avistamiento de cetáceos","assets/img/delfines.jpg"],
  ["Tablao flamenco","assets/img/Flamenca_castanuelas.jpg"],
  ["Spa","assets/img/spa.webp"],
  ["Yoga","assets/img/spa.webp"],
  ["Paseo a caballo","assets/img/Sitges.jpeg"],
  ["Navegación en yate","assets/img/navegacion-lago-mallorca.png"],
  ["Paddle surf","assets/img/paddle surf.jpg"]
];

/* Estilos de hoteles */
const HOTEL_STYLES = [
  ["Boutique","assets/img/Sitges.jpeg"],
  ["Bienestar","assets/img/spa.webp"],
  ["Jacuzzi privado","assets/img/spa.webp"],
  ["Pensión completa","assets/img/Ribera-del-duero.webp"],
  ["Solo adultos","assets/img/ibiza-roca.jpg"],
  ["Gastro","assets/img/Ribera-del-duero.webp"]
];

/* Orígenes (Personaliza) */
const ORIGINS = [
  "Londres-Heathrow (LHR)","Londres-Gatwick (LGW)","London City Airport (LCY)",
  "Manchester (MAN)","Birmingham (BHX)","Liverpool (LPL)"
];

/* ====== HERO: construir dropdown destino ====== */
function buildDestinationMega() {
  const lvl1 = $("#destLvl1");
  const lvl2 = $("#destLvl2");
  if(!lvl1 || !lvl2) return;

  lvl1.innerHTML = Object.keys(DEST_FORM)
    .map(k => `<button type="button" class="mega-l1" data-key="${k}">${k}</button>`).join("");
  lvl2.innerHTML = `<div class="muted">Selecciona una región</div>`;

  lvl1.addEventListener("mouseenter",(e)=>{
    const b = e.target.closest(".mega-l1");
    if(!b) return;
    const key = b.dataset.key;
    lvl2.innerHTML = DEST_FORM[key].map(v=>`<button type="button" class="mega-l2" data-full="${key} - ${v}" data-val="${v}">${v}</button>`).join("");
  });

  lvl2.addEventListener("click",(e)=>{
    const b = e.target.closest(".mega-l2");
    if(!b) return;
    $("#destInput").value = `${b.dataset.val} (${b.dataset.full.split(' - ')[0]})`;
    hideAllDrop();
  });
}

/* ====== Dropdown “mantener abierto” ====== */
let keepTimer=null;
function keepOpen(el, menu){
  const show=()=>menu.style.display='block';
  const hide=()=>menu.style.display='none';
  el.addEventListener("focusin",show);
  el.addEventListener("mouseenter",show);
  el.addEventListener("mouseleave",()=>{ keepTimer=setTimeout(hide,180) });
  menu.addEventListener("mouseenter",()=>{ clearTimeout(keepTimer); show(); });
  menu.addEventListener("mouseleave",()=>{ hide(); });
}

function hideAllDrop(){
  $$(".suggest,.select-menu,.calendar,.popover").forEach(m=>m.style.display='none');
}

/* ====== Calendario doble mes rango ====== */
function makeCalendar(containerId,inputId){
  const cont = $(containerId);
  const input = $(inputId);
  if(!cont || !input) return;
  cont.innerHTML = buildTwoMonths(new Date());

  let start=null, end=null;

  cont.addEventListener("click",(e)=>{
    const d = e.target.closest(".day");
    if(!d || d.classList.contains('off')) return;
    const date = new Date(d.dataset.date);

    if(!start || (start && end)){ start = date; end=null; }
    else if(date >= start){ end = date; }
    else { end = start; start = date; }

    paintRange(cont, start, end);
    if(start && end){
      input.value = `${fmt(start.getDate())}/${fmt(start.getMonth()+1)}/${start.getFullYear()} - ${fmt(end.getDate())}/${fmt(end.getMonth()+1)}/${end.getFullYear()}`;
      cont.style.display='none';
    }
  });

  // mantener abierto al pasar
  keepOpen(input.parentElement, cont);
}

function buildTwoMonths(base){
  const next = new Date(base); next.setMonth(base.getMonth()+1);
  return `<div class="cal-wrap">
    ${oneMonth(base)}
    ${oneMonth(next)}
  </div>`;
}

function oneMonth(date){
  const y=date.getFullYear(), m=date.getMonth();
  const first=new Date(y,m,1), start= new Date(first); start.setDate(first.getDay()===0? -5 : 1-first.getDay()+1); // lunes
  let html=`<div class="cal"><h4>${date.toLocaleString('es-ES',{month:'long'})} ${y}</h4><div class="cal-grid">`;
  "LMXJVSD".split('').forEach(ch=> html+=`<span>${ch}</span>`);
  for(let i=0;i<42;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    const off=d.getMonth()!==m;
    html+=`<div class="day${off?' off':''}" data-date="${d.toISOString()}">${d.getDate()}</div>`;
  }
  html+='</div></div>';
  return html;
}

function paintRange(container,start,end){
  $$(".day",container).forEach(el=>el.classList.remove('sel','rng'));
  if(!start) return;
  const sStr = start.toDateString();
  $$(".day",container).forEach(el=>{
    const d=new Date(el.dataset.date);
    if(!end){
      if(d.toDateString()===sStr) el.classList.add('sel');
    }else{
      if(d>=start && d<=end) el.classList.add('rng');
      if(d.toDateString()===start.toDateString() || d.toDateString()===end.toDateString()) el.classList.add('sel');
    }
  });
}

/* ====== Guests ====== */
function initGuests(){
  const btn = $("#guestsBtn"), pop=$("#guestsPop"), label=$("#guestsLabel");
  if(!btn || !pop) return;
  keepOpen(btn.parentElement, pop);
  pop.addEventListener("click",(e)=>{
    if(e.target.classList.contains('plus') || e.target.classList.contains('minus')){
      const t = e.target.dataset.target;
      const inp = $("#"+t);
      let v = parseInt(inp.value||0,10);
      v += e.target.classList.contains('plus')?1: -1;
      if(v<0) v=0;
      inp.value=v;
    }
    if(e.target.id==='guestsOk'){
      const a=parseInt($("#adults").value||0,10),
            k=parseInt($("#kids").value||0,10),
            b=parseInt($("#babies").value||0,10);
      label.textContent = (a+k+b).toString();
      pop.style.display='none';
    }
  });
}

/* ====== Selects sencillos ====== */
function buildSelect(idBtn,idMenu,items,onPick){
  const btn=$(idBtn), menu=$(idMenu);
  if(!btn || !menu) return;
  menu.innerHTML = items.map(v=>`<li><button type="button" class="opt">${v}</button></li>`).join("");
  keepOpen(btn.parentElement, menu);
  menu.addEventListener("click",(e)=>{
    const o = e.target.closest(".opt"); if(!o) return;
    btn.textContent=o.textContent; menu.style.display='none';
    onPick && onPick(o.textContent);
  });
}

/* ====== Carruseles ====== */
function buildCard(href,title,img){
  return `<a class="card hero" href="${href||'#'}">
    <img loading="lazy" src="${img}" alt="${title}" />
    <span>${title}</span>
  </a>`;
}
function mountCarousel(trackId, items){
  const track = $("#"+trackId);
  if(!track) return;
  track.innerHTML = items.map(i=> buildCard("#", i[0], i[1]) ).join("");
  const wrap = track.closest(".carousel");
  $(".car-arrow.left",wrap).onclick = ()=> track.scrollBy({left:-600,behavior:'smooth'});
  $(".car-arrow.right",wrap).onclick = ()=> track.scrollBy({left:600,behavior:'smooth'});
}

/* ====== Navegación ====== */
function goPersonaliza(e){
  e.preventDefault();
  window.location.href = "personaliza.html";
}

/* ====== HOME init ====== */
document.addEventListener("DOMContentLoaded", ()=>{
  // hero video: por si el autoplay móvil necesita play programático
  const v = $(".hero-video"); if(v){ v.muted=true; const p=v.play(); if(p){p.catch(()=>{});} }

  buildDestinationMega();

  // destino keep-open
  const destField = $("#destInput")?.parentElement, destMenu = $("#destMega");
  if(destField && destMenu) keepOpen(destField, destMenu);

  // calendario y guests
  makeCalendar("#calendar","#dateInput");
  initGuests();

  // temática (sin viñetas)
  buildSelect("#themeSel","#themeMenu",THEMES);

  // carruseles
  mountCarousel("carActivities", ACTIVITIES);
  mountCarousel("carThemes", THEMES.map(t=>[t,"assets/img/Sitges.jpeg"]));
  mountCarousel("carDestinos", Object.keys(DEST_FORM).map(k=>[k, DEST_IMAGES[k] || "assets/img/Sitges.jpeg"]));
  mountCarousel("carHotels", HOTEL_STYLES);
});

/* ====== PERSONALIZA ====== */
function renderPanelB(tab){
  const panel=$("#panelB"); if(!panel) return;

  if(tab==="dest"){
    // solo macro destinos
    panel.innerHTML = Object.keys(DEST_FORM)
      .map(k=>`<button class="opt opt-dest" data-dest="${k}">${k}</button>`).join("");
  }
  else if(tab==="hot"){
    panel.innerHTML = HOTEL_STYLES.map(h=>`<button class="opt">${h[0]}</button>`).join("");
  }
  else if(tab==="act"){
    panel.innerHTML = ACTIVITIES.map(a=>`<button class="opt">${a[0]}</button>`).join("");
  }
}

function renderGalleryFromMacro(macro){
  const box=$("#gallery"); if(!box) return;
  // mostrar los entornos/“subdestinos” del macro
  const items = DEST_FORM[macro] || [];
  const html = items.slice(0,9).map(name=>`
    <div class="card tall">
      <img src="${DEST_IMAGES[name] || DEST_IMAGES[macro] || 'assets/img/Sitges.jpeg'}" alt="${name}" />
      <div class="pad"><strong>${name}</strong></div>
    </div>
  `).join("");
  box.innerHTML = html || `<div class="muted">Selecciona un destino</div>`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  // Solo si estamos en personaliza
  if(!$(".personaliza")) return;

  // pestañas
  $$(".tabBtn").forEach(b=>{
    b.addEventListener("click",()=>{
      $$(".tabBtn").forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderPanelB(b.dataset.tab);
    });
  });
  renderPanelB("hot");

  // click en destinos del panel B
  $("#panelB").addEventListener("click",(e)=>{
    const d = e.target.closest(".opt-dest");
    if(d){ renderGalleryFromMacro(d.dataset.dest); }
  });

  // calendario & origen
  makeCalendar("#pCalendar","#pDate");
  buildSelect("#originBtn","#originMenu",ORIGINS);

});

/* ====== mantener abiertos todos los dropdown de la página ====== */
document.addEventListener("DOMContentLoaded", ()=>{
  $$("[data-keepopen]").forEach(f=>{
    const menu = $(".suggest,.select-menu,.calendar,.popover", f);
    if(menu) keepOpen(f, menu);
  });
});
