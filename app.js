const $ = (s, r=document) => r.querySelector(s);
const cities = [...new Map(PARKS.map(p => [p.citySlug, p.city]))];
const parkUrl = p => `park.html?p=${p.slug}`;
const cityParks = cs => PARKS.filter(p => p.citySlug === cs);
let chosen = localStorage.getItem('park');
const getPark = () => PARKS.find(p => p.slug === chosen);

const fmtPhone=w=>w?`+${w[0]} ${w.slice(1,4)} ${w.slice(4,7)} ${w.slice(7,9)} ${w.slice(9)}`:'';
const gmap=p=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.city+' '+p.addr)}`;
const multi=p=>cityParks(p.citySlug).length>1;
const pname=p=>`My Kids - ${p.city}${multi(p)?', '+p.name:''}`;
function waLink(p, text){ return `https://wa.me/${p.wa}?text=${encodeURIComponent(text)}`; }
function bookText(p){ return p ? `Здравствуйте! Хочу забронировать в My Kids (${p.city}${cityParks(p.citySlug).length>1?', '+p.name:''}).` : 'Здравствуйте! Хочу забронировать посещение My Kids.'; }

// ---- Данные из xlsx маркетинга: график, цены, скидки, пакеты, допуслуги (см. data.js, scripts/build-prices.py)
const hoursText=s=>s[0]===s[1]&&s[1]===s[2]?`Ежедневно, ${s[0]}`:s[0]===s[2]?`Пн, ср по вс: ${s[0]}. Вт (санитарный день, открытие позже): ${s[1]}`:`Пн: ${s[0]}. Вт (санитарный день): ${s[1]}. Ср по вс: ${s[2]}`;
PARKS.forEach(p=>{const s=SCHED[p.slug]; if(s) p.hours=hoursText(s)});
const money=n=>typeof n==='number'?(n===0?'бесплатно':n.toLocaleString('ru-RU')+' ₸'):String(n).replace(/\d{4,}/g,m=>(+m).toLocaleString('ru-RU'))+' ₸';
const br=t=>String(t).replace(/\n+/g,'<br>');
const cname=p=>p.city+(multi(p)?', '+p.name:'');
const noData=`<p style="color:var(--mut)">Цены для этого парка уточняются.</p>`;
const TROWS=[
 ['Ребёнок','от 3 до 17 лет','Будний Безлимит','Выходной Безлимит'],
 ['Играющий взрослый','от 18 лет','Безлимит Родитель Будни','Безлимит Родитель Выходной'],
 ['Ребёнок из многодетной семьи','от 3 до 17 лет, нужно удостоверение многодетной семьи','Многодетные Будни','Многодетные Выходные'],
 ['Малыш','от 1 до 2 лет, нужен документ о возрасте','Безлимит Малыш Будний','Безлимит Малыш Выходной'],
 ['Ребёнок до 1 года','нужен документ о возрасте','Дети до 1 года','Дети до 1 года'],
 ['Особенный ребёнок','от 3 до 17 лет, нужен документ, подтверждающий льготу','Особенные дети','Особенные дети'],
 ['Именинник','в день рождения, нужен документ','Именинник Парк Будни','Именинник Парк Выходной'],
 ['Сопровождающий взрослый','от 18 лет, только для сопровождения','Сопровождение','Сопровождение']];
const hasPrices=p=>!!(p&&PRICE[p.slug]);
function tariffTable(p){
 if(!hasPrices(p)) return noData; const pr=PRICE[p.slug];
 return `<div class="tw"><table><tr><th>Тариф и условия</th><th>Будни</th><th>Выходные</th></tr>${TROWS.map(([n,c,a,b])=>`<tr><td>${n}<br><small style="color:var(--mut)">${c}</small></td>${a===b?`<td colspan="2">${money(pr[a])}</td>`:`<td>${money(pr[a])}</td><td>${money(pr[b])}</td>`}</tr>`).join('')}</table></div>
<p style="color:var(--mut);font-size:14px">Билет безлимитный на целый день: посещение парка и игра на аттракционах. Гости и именинник в составе пакета дня рождения проходят по билету пакета, взрослый гость дня рождения: ${money(pr['ДР Сопровождение'])}. Возврат осуществляется в соответствии с законодательством Республики Казахстан.</p>`;
}
const pr2=(e)=>e.any!==undefined?money(e.any):e.wd===e.we?money(e.wd):`Будни ${money(e.wd)} · Выходные ${money(e.we)}`;
function discountCards(p){
 const d=DPRICE[p.slug]; if(!d) return '';
 return `<div class="grid">${Object.keys(d).map(k=>{const m=DISC[k],e=d[k];const desc=k==='combo'?`Один билет даёт право посетить ${e.name.includes('3')?'три':'два'} участвующих парка на установленных условиях.`:m.desc;
 return `<div class="card"><h3>${k==='combo'?e.name:m.name}</h3><p>${desc}</p><p><small>Кому: ${m.who}</small></p><div class="price">${pr2(e)}</div></div>`}).join('')}</div>`;
}
function pkgTiers(p){const out=[];(PKG[p.slug]||[]).forEach(r=>{let t=out.find(x=>x.tier===r.tier);if(!t)out.push(t={tier:r.tier,wd:null,we:null});t[r.day]=r});return out}
function pkgCards(p,btn){
 const ts=pkgTiers(p); if(!ts.length) return noData;
 return `<div class="grid">${ts.map(t=>{const a=t.wd,b=t.we,r=b||a;const same=(f)=>!a||!b||a[f]===b[f];const dayRow=(f,l)=>same(f)?(r[f]?`<p>${l}: ${br(r[f])}</p>`:''):`<p>${l}: будни ${br(a[f]||'нет')}; выходные ${br(b[f]||'нет')}</p>`;
 return `<div class="card"><h3>${t.tier}</h3><p>${r.dur}. Детей в пакете: ${r.kids}, сверх этого: доплата ${a&&b&&a.sur!==b.sur?`${money(a.sur)} в будни, ${money(b.sur)} в выходные`:money(r.sur)} за ребёнка. Максимум детей: ${r.max.toLowerCase()}.</p>
 <details><summary>Что входит</summary>${dayRow('program','Программа')}${dayRow('food','Питание')}${dayRow('extra','Дополнительно')}</details>
 <div class="price">${a?`Будни ${money(a.price)}`:''}${a&&b?'<br>':''}${b?`Выходные ${money(b.price)}`:''}</div>${btn?`<br>${btn(t.tier)}`:''}</div>`}).join('')}</div>`;
}
const exFor=(p,cats)=>EXTRAS.filter(e=>cats.includes(e.cat)&&(!e.parks||e.parks.includes(p.slug)));
function exCards(p,cats){
 const l=exFor(p,cats); if(!l.length) return '';
 return `<div class="grid">${l.map(e=>`<div class="card"><h3>${e.name}</h3>${e.desc?`<p>${e.desc}</p>`:''}<p><small>${e.cat}${typeof e.dur==='number'&&e.dur?`, ${e.dur} мин`:''}</small></p><div class="price">${money(e.price)}</div></div>`).join('')}</div>`;
}
function bookPkg(slug,tier){const p=PARKS.find(x=>x.slug===slug);if(!p||!p.wa){book();return}window.open(waLink(p,`Здравствуйте! Хочу забронировать День рождения в My Kids (${cname(p)}). Пакет: ${tier}. Детей: __. Дата: __.`),'_blank')}

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
 <a class="logo" href="index.html"><img src="logo.webp" alt="My Kids" height="40"></a>
 <button class="burger" aria-label="Меню" onclick="$('nav').classList.toggle('on')">☰</button>
 <nav>
  <a href="index.html">Главная</a>
  <div class="dd"><button class="nb">Парки ▾</button><div class="menu">${parksMenu()}</div></div>
  <div class="dd"><button class="nb">День рождения ▾</button><div class="menu">
    <a href="birthday.html">Пакеты</a><a href="birthday.html#shows">Шоу и программы</a><a href="birthday.html#animators">Аниматоры</a><a href="groups.html">Праздники и группы</a></div></div>
  <a href="prices.html">Цены</a><a href="faq.html">FAQ</a><a href="contacts.html">Контакты</a>
 </nav>
 <span class="lang">RU | KZ</span>
 <button class="btn" onclick="book()">Забронировать</button>
</div></header>`);
  document.body.insertAdjacentHTML('beforeend', (document.body.dataset.nocta?'':`<section class="blk"><div class="wrap" style="text-align:center"><h2>Забронируйте посещение в My Kids</h2><button class="btn wa" onclick="book()">Забронировать в WhatsApp</button></div></section>`)+`
<footer><div class="wrap fcols">
 <div><a class="flogo" href="index.html"><img src="logo.webp" alt="My Kids" height="44"></a>Сеть детских парков Казахстана. 11 парков в 8 городах.</div>
 <div><a href="#">О нас</a><a href="#">Наша команда</a><a href="#">Аттракционы</a><a href="#">Правила и рекомендации</a><a href="#">Вакансии</a></div>
 <div><a href="#">Политика конфиденциальности</a><a href="#">Оферта</a><a href="#">Правила посещения</a><a href="#">Cookie</a></div>
</div></footer>
<button class="btn wa fixwa" onclick="book()">Забронировать в WhatsApp</button>
<div class="modal" id="modal" onclick="if(event.target===this)this.classList.remove('on')"><div class="mbox">
 <h3>Выберите парк</h3><p style="color:var(--mut);margin:0">Бронь откроется в WhatsApp выбранного парка.</p>
 <div class="opts">${PARKS.map(p=>`<button onclick="pick('${p.slug}')" ${p.wa?'':'disabled style="opacity:.5"'}>${p.city}<small>${p.name}</small><small>${p.wa?p.addr+'<br>'+p.hours:'данные уточняются'}</small></button>`).join('')}</div>
</div></div>`);
}
document.addEventListener('DOMContentLoaded', shell);
