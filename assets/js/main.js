/* util */
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const fmt = (n)=>n.toString().padStart(2,'0');

/* año footer */
$('#year') && ($('#year').textContent = new Date().getFullYear());

/* ===== idioma (por defecto ES) ===== */
const i18n = {
  es:{nav_customize:'Personaliza tu viaje',nav_help:'Ayuda 24/7',cart:'Carrito'},
  en:{nav_customize:'Customize your trip',nav_help:'24/7 Help',cart:'Cart'}
};
function applyLang(lang){
  const flag = lang==='en'?'assets/img/gb-flag.svg':'assets/img/es-flag.svg';
  document.body.dataset.lang = lang;
  $('#langCode') && ($('#langCode').textContent = lang.toUpperCase());
  $('#langFlag') && ($('#langFlag').src = flag);
  $$('[data-i18n]').forEach(n=>{
    const k = n.dataset.i18n;
    if(i18n[lang][k]) n.textContent = i18n[lang][k];
  });
  localStorage.setItem('ux-lang',lang);
}
applyLang(localStorage.getItem('ux-lang')||'es');
$('#langBtn') && $('#langBtn').addEventListener('click',e=>{
  e.currentTarget.parentElement.classList.toggle('open');
});
$$('.lang-option').forEach(b=>{
  b.addEventListener('click',()=>{
    applyLang(b.dataset.lang);
    b.closest('.dropdown').classList.remove('open');
  });
});

/* ===== destino (mega) ===== */
const LVL2 = {
  'Baleares':['Mallorca','Menorca','Ibiza','Formentera'],
  'Canarias':['Gran Canaria','Tenerife','Lanzarote','La Gomera'],
  'Cataluña':['Costa Brava','Barcelona','Sitges'],
  'Andorra':['Andorra'],
  'Galicia':['Rias Baixas','Rias Altas','Ribeira Sacra'],
  'Andalucía':['Sevilla','Granada','Córdoba','Málaga','Marbella','Cádiz']
};
const destInput = $('#destInput');
const destSuggest = $('#destSuggest');
const lvl2 = $('#lvl2');

function openDest(){ if(destSuggest) destSuggest.style.display='grid'; }
function closeDest(){ if(destSuggest) destSuggest.style.display='none'; }

if(destInput){
  destInput.addEventListener('focus',openDest);
  $('.has-suggest').addEventListener('mouseenter',openDest);
  $('.has-suggest').addEventListener('mouseleave',closeDest);
  $$('.lvl1 button',destSuggest).forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{
      const arr = LVL2[btn.dataset.cat]||[];
      lvl2.innerHTML = arr.map(v=>`<button>${v}</button>`).join('');
      $$('#lvl2 button').forEach(b=>{
        b.addEventListener('click',()=>{
          destInput.value = `${btn.dataset.cat} — ${b.textContent}`;
          closeDest();
        });
      });
    });
  });
}

/* ===== calendario (tipo Civitatis: 2 meses + sombreado) ===== */
function buildCalendar(container, inputEl){
  if(!container || !inputEl) return;
  let start=null,end=null;

  function renderMonth(base){
    const d = new Date(base.getFullYear(), base.getMonth(),1);
    const m = d.getMonth();
    let html = `<div class="mcol"><h4>${d.toLocaleString('es-ES',{month:'long',year:'numeric'})}</h4><div class="grid cal">`;
    const pad = (d.getDay()+6)%7;
    for(let i=0;i<pad;i++) html += `<span></span>`;
    while(d.getMonth()===m){
      const ds = new Date(d);
      const iso = ds.toISOString().slice(0,10);
      html += `<button class="day" data-d="${iso}">${d.getDate()}</button>`;
      d.setDate(d.getDate()+1);
    }
    html += `</div></div>`;
    return html;
  }

  function open(){
    if(container.dataset.ready!=='1'){
      const now = new Date();
      const next = new Date(now.getFullYear(),now.getMonth()+1,1);
      container.innerHTML = `<div class="wrap">${renderMonth(now)}${renderMonth(next)}</div>`;
      container.dataset.ready='1';
      $$('.day',container).forEach(b=>{
        b.addEventListener('click',()=>{
          const dt = new Date(b.dataset.d);
          if(!start || (start && end)){ start=dt; end=null; }
          else if(dt>=start){ end=dt; }
          else { start=dt; end=null; }
          // pintar rango
          $$('.day',container).forEach(x=>{
            const dd = new Date(x.dataset.d);
            x.classList.toggle('sel', +dd===+start || +dd===+end);
            const inrange = start && end && dd>start && dd<end;
            x.classList.toggle('rng', inrange);
          });
          if(start && end){
            inputEl.value = `${fmt(start.getDate())}/${fmt(start.getMonth()+1)}/${start.getFullYear()} - ${fmt(end.getDate())}/${fmt(end.getMonth()+1)}/${end.getFullYear()}`;
            container.style.display='none';
          }
        });
      });
    }
    container.style.display='block';
  }

  inputEl.addEventListener('click',open);
  container.parentElement.addEventListener('mouseleave',()=>container.style.display='none');
}
buildCalendar($('#calendar'), $('#dateRange'));

/* ===== temática ===== */
const themeBtn = $('#themeBtn');
const themeMenu = $('#themeMenu');
themeBtn && themeBtn.addEventListener('click',()=>themeMenu.style.display='block');
themeMenu && themeMenu.addEventListener('mouseleave',()=>themeMenu.style.display='none');
$$('li',themeMenu||document.createElement('div')).forEach(li=>{
  li.addEventListener('click',()=>{
    themeBtn.textContent = li.textContent;
    themeBtn.dataset.value = li.dataset.v;
    themeMenu.style.display='none';
  });
});

/* ===== guests popover ===== */
const guestsBtn = $('#guestsBtn');
const guestsPop = $('#guestsPop');
guestsBtn && guestsBtn.addEventListener('click',()=>guestsPop.style.display='block');
guestsPop && guestsPop.addEventListener('mouseleave',()=>guestsPop.style.display='none');
$$('.qty',guestsPop||document.createElement('div')).forEach(w=>{
  const input = $('input',w);
  $('.minus',w).addEventListener('click',()=>{ input.stepDown(); });
  $('.plus',w).addEventListener('click',()=>{ input.stepUp(); });
});
$('#guestsApply') && $('#guestsApply').addEventListener('click',()=>{
  const total = (+$('#adults').value)+(+$('#kids').value)+(+$('#babies').value);
  guestsBtn.innerHTML = `<span class="ico">👥</span> ${total}`;
  guestsPop.style.display='none';
});

/* ===== búsqueda -> personaliza ===== */
$('#homeSearch') && $('#homeSearch').addEventListener('submit',(e)=>{
  e.preventDefault();
  location.href = 'personaliza.html';
});

/* ===== carrusel hoteles ===== */
(function(){
  const car = $('#hotelCarousel');
  if(!car) return;
  const track = $('.car-track',car);
  $('.car-arrow.left',car).onclick = ()=>track.scrollBy({left:-320,behavior:'smooth'});
  $('.car-arrow.right',car).onclick = ()=>track.scrollBy({left:320,behavior:'smooth'});
})();

/* ===== chatbot ===== */
const chatFab = $('#chatFab'), chatBox = $('#chatBox');
if(chatFab && chatBox){
  chatFab.addEventListener('click',()=>{ chatBox.style.display = 'flex'; chatBox.setAttribute('aria-hidden','false'); });
  $('#chatClose').addEventListener('click',()=>{ chatBox.style.display='none'; chatBox.setAttribute('aria-hidden','true'); });
  $('#chatSend').addEventListener('submit',(e)=>{
    e.preventDefault();
    const v = $('#chatInput').value.trim();
    if(!v) return;
    const row = document.createElement('div');
    row.textContent = v; row.style.margin = '4px 0'; row.style.textAlign='right';
    $('#chatBody').appendChild(row);
    $('#chatInput').value='';
  });
}
