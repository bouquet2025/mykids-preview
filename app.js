const $ = (s, r=document) => r.querySelector(s);
const cities = [...new Map(PARKS.map(p => [p.citySlug, p.city]))];
const parkUrl = p => `park.html?p=${p.slug}`;
const cityParks = cs => PARKS.filter(p => p.citySlug === cs);
let chosen = localStorage.getItem('park');
const getPark = () => PARKS.find(p => p.slug === chosen);

function waLink(p, text){ return `https://wa.me/${p.wa}?text=${encodeURIComponent(text)}`; }
function bookText(p){ return p ? `Здравствуйте! Хочу забронировать в My Kids (${p.city}${cityParks(p.citySlug).length>1?', '+p.name:''}).` : 'Здравствуйте! Хочу забронировать посещение My Kids.'; }

function book(forced){
  const p = forced || getPark();
  if(p && p.wa){ window.open(waLink(p, bookText(p)), '_blank'); return; }
  $('#modal').classList.add('on');
}
function pick(slug){
  chosen = slug; localStorage.setItem('park', slug);
  $('#modal').classList.remove('on');
  book(getPark());
}

function parksMenu(){
  return cities.map(([cs,c]) => {
    const ps = cityParks(cs);
    return ps.length>1
      ? `<a href="city.html?c=${cs}">${c} (${ps.length})</a>`
      : `<a href="${parkUrl(ps[0])}">${c}</a>`;
  }).join('');
}

function shell(){
  document.body.insertAdjacentHTML('afterbegin', `
<header><div class="wrap bar">
 <a class="logo" href="index.html">My Kids</a>
 <button class="burger" aria-label="Меню" onclick="$('nav').classList.toggle('on')">☰</button>
 <nav>
  <a href="index.html">Главная</a>
  <div class="dd"><button class="nb">Парки ▾</button><div class="menu">${parksMenu()}</div></div>
  <div class="dd"><button class="nb">День рождения ▾</button><div class="menu">
    <a href="#">Пакеты</a><a href="#">Шоу и программы</a><a href="#">Аниматоры</a><a href="#">Праздники и группы</a></div></div>
  <a href="#">Цены</a><a href="#">FAQ</a><a href="#">Контакты</a>
 </nav>
 <span class="lang">RU | KZ</span>
 <button class="btn" onclick="book()">Забронировать</button>
</div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
<footer><div class="wrap fcols">
 <div><b>My Kids</b><br>Сеть детских парков Казахстана. 11 парков в 8 городах.</div>
 <div><a href="#">О нас</a><a href="#">Наша команда</a><a href="#">Аттракционы</a><a href="#">Правила и рекомендации</a><a href="#">Вакансии</a></div>
 <div><a href="#">Политика конфиденциальности</a><a href="#">Оферта</a><a href="#">Правила посещения</a><a href="#">Cookie</a></div>
</div></footer>
<button class="btn wa fixwa" onclick="book()">Забронировать в WhatsApp</button>
<div class="modal" id="modal" onclick="if(event.target===this)this.classList.remove('on')"><div class="mbox">
 <h3>Выберите парк</h3><p style="color:var(--mut);margin:0">Бронь откроется в WhatsApp выбранного парка.</p>
 <div class="opts">${PARKS.map(p=>`<button onclick="pick('${p.slug}')" ${p.wa?'':'disabled style="opacity:.5"'}>${p.city}<small>${p.name}${p.wa?'':' (данные уточняются)'}</small></button>`).join('')}</div>
</div></div>`);
}
document.addEventListener('DOMContentLoaded', shell);
