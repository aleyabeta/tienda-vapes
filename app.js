{
/* ====== CONFIGURACIÓN: cambiá estos datos ====== */
const STORE = 'Vapes';
const WHATSAPP = '5917393570'; // tu número con código de país, sin + ni espacios
const LINES = [
  {id:'70k', name:'Waka Double 70K', kind:'double', sub:'Hasta 70.000 caladas · pantalla', price:245, flavors:[
    ['Blueberry',4],['Cherry Bomb',10],['Coconut Water',10],['Mix Berries',8],['Passion Fruit',8],['Strawberry Watermelon',10],['Watermelon',3]]},
  {id:'50k', name:'Waka Icon 50K', kind:'icon', sub:'Hasta 50.000 caladas', price:220, flavors:[
    ['Blueberry Mint'],['Bubbaloo Grape'],['Cherry Bomb'],['Cherry Watermelon'],['Grape Strawberry'],['Icy Coconut Water'],['Kiwi Dragon Berry'],['Pineapple'],['Strawberry Watermelon'],['Watermelon Ice']]},
  {id:'20k', name:'Pod 20K', kind:'pod', sub:'Batería recargable + cartucho de 20.000 caladas', price:85, from:true,
    options:[{id:'kit',label:'Kit cartucho + batería',price:235,flavor:true},{id:'cart',label:'Solo cartucho',price:150,flavor:true},{id:'bat',label:'Solo batería',price:85,flavor:false}],
    flavors:[['Grape Ice'],['Icy Mint'],['Passion Guava'],['ST Grape'],['ST Kiwi'],['Watermelon Ice']]}
];
/* ================================================ */

const COLORS = {blueberry:'#3f5bd8',mint:'#2fc7a0',icy:'#5fd3e8',grape:'#7a3fb8',bubbaloo:'#c94fb0',cherry:'#c8102e',bomb:'#c8102e',watermelon:'#ff4d6d',coconut:'#d9c7a3',berries:'#8b1e5a',mix:'#8b1e5a',passion:'#f2a20c',guava:'#ff7a7a',strawberry:'#e8304a',kiwi:'#7cbf2a',dragon:'#e0337f',pineapple:'#f5c518'};
const colorOf = n => { const w = n.toLowerCase().split(' ').reverse(); for (const k of w) if (COLORS[k]) return COLORS[k]; return '#888'; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bs = n => n.toLocaleString('es-BO') + ' Bs';

let gid = 0;
const dark = c => '#' + [1,3,5].map(i => Math.round(parseInt(c.slice(i,i+2),16)*.6).toString(16).padStart(2,'0')).join('');
function device(kind, col, h) {
  const g = 'g' + (gid++);
  const grad = `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${dark(col)}"/></linearGradient></defs>`;
  const shadow = `<ellipse cx="50" cy="206" rx="34" ry="6" fill="#000" opacity=".15"/>`;
  let b = '';
  if (kind === 'double') b = `<rect x="34" y="8" width="32" height="40" rx="10" fill="#1b1b20"/><rect x="14" y="40" width="72" height="160" rx="18" fill="url(#${g})"/><rect x="19" y="48" width="6" height="140" rx="3" fill="#fff" opacity=".35"/><rect x="28" y="70" width="44" height="28" rx="6" fill="#111"/><text x="50" y="89" text-anchor="middle" font-family="Unbounded,sans-serif" font-size="13" font-weight="800" fill="#5ff">70K</text><circle cx="50" cy="170" r="6" fill="#000" opacity=".25"/>`;
  if (kind === 'icon') b = `<rect x="37" y="6" width="26" height="40" rx="10" fill="#1b1b20"/><rect x="20" y="38" width="60" height="162" rx="26" fill="url(#${g})"/><rect x="26" y="52" width="6" height="134" rx="3" fill="#fff" opacity=".35"/><rect x="36" y="74" width="28" height="20" rx="5" fill="#111"/><text x="50" y="89" text-anchor="middle" font-family="Unbounded,sans-serif" font-size="10" font-weight="800" fill="#5ff">50K</text>`;
  if (kind === 'pod') b = `<rect x="38" y="6" width="24" height="32" rx="8" fill="#1b1b20"/><rect x="22" y="30" width="56" height="80" rx="16" fill="url(#${g})"/><rect x="28" y="38" width="6" height="64" rx="3" fill="#fff" opacity=".35"/><rect x="22" y="104" width="56" height="96" rx="16" fill="#2a2a31"/><rect x="28" y="112" width="5" height="78" rx="2.5" fill="#fff" opacity=".18"/><rect x="40" y="150" width="20" height="4" rx="2" fill="#5ff" opacity=".8"/>`;
  return `<svg viewBox="0 0 100 214" aria-hidden="true">${grad}${shadow}${b}</svg>`;
}

/* fotos reales: si existe la imagen se usa; si no, se dibuja el ícono */
const EXT = 'png'; // cambiá a 'jpg' o 'webp' si tus fotos tienen otra extensión
const slug = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function pic(l, name, col) {
  const tries = [];
  if (name) tries.push(`img/${l.id}/${slug(name)}.${EXT}`);
  tries.push(`img/${l.id}.${EXT}`);
  return `<img src="${tries[0]}" data-try="${tries.slice(1).join('|')}" data-k="${l.kind}" data-c="${col}" alt="${esc(l.name + (name ? ' ' + name : ''))}">`;
}
document.addEventListener('error', e => {
  const i = e.target; if (i.tagName !== 'IMG' || !i.dataset.k) return;
  const t = (i.dataset.try || '').split('|').filter(Boolean);
  if (t.length) { i.dataset.try = t.slice(1).join('|'); i.src = t[0]; }
  else i.outerHTML = device(i.dataset.k, i.dataset.c);
}, true);

/* state */
const sel = {}; LINES.forEach(l => sel[l.id] = {opt: l.options ? l.options[0].id : null, flavor: l.flavors[0][0]});
const cart = {}; // key -> qty

const optOf = (l, id) => l.options ? l.options.find(o => o.id === id) : {id: null, label: '', price: l.price, flavor: true};
const keyOf = (l, o, f) => [l.id, o.id || '', o.flavor ? f : ''].join('|');
const stockOf = (l, f) => { const r = l.flavors.find(x => x[0] === f); return r && r[1] != null ? r[1] : Infinity; };
const usedStock = (l, f) => Object.entries(cart).filter(([k]) => { const p = k.split('|'); return p[0] === l.id && p[2] === f; }).reduce((s, [, q]) => s + q, 0);

/* render shelf */
document.getElementById('logo').innerHTML = esc(STORE) + '<b>.</b>';
document.getElementById('ft').textContent = 'Pedidos por WhatsApp: +' + WHATSAPP;
document.getElementById('shelf').innerHTML = LINES.map(l => `<a class="stand" href="#v${l.id}">${pic(l, null, colorOf(l.flavors[0][0]))}<div class="tag"><strong>${esc(l.name)}</strong><span class="price">${l.from ? 'desde ' : ''}${bs(l.price)}</span></div></a>`).join('');

function renderLine(l) {
  const s = sel[l.id], o = optOf(l, s.opt);
  const opts = l.options ? `<div class="opts" role="group" aria-label="Presentación">${l.options.map(x => `<button class="opt" data-l="${l.id}" data-o="${x.id}" aria-pressed="${x.id === s.opt}">${esc(x.label)}<small>${bs(x.price)}</small></button>`).join('')}</div>` : '';
  let body;
  if (!o.flavor) {
    const q = cart[keyOf(l, o, '')] || 0;
    body = `<div class="flavs"><div class="fl sel"><span class="dot" style="background:#2a2a31"></span><span class="nm">${esc(o.label)}<span class="st">Sin sabor · compatible con todos los cartuchos 20K</span></span>${ctrl(l, o, '', q, Infinity)}</div></div>`;
  } else {
    body = `<div class="flavs">${l.flavors.map(([f, st]) => {
      const k = keyOf(l, o, f), q = cart[k] || 0, left = (st == null ? Infinity : st) - usedStock(l, f) + q;
      const stTxt = st == null ? '' : st === 0 ? '<span class="st low">Agotado</span>' : st <= 4 ? `<span class="st low">Quedan ${st}</span>` : `<span class="st">${st} disponibles</span>`;
      return `<div class="fl${f === s.flavor ? ' sel' : ''}${st === 0 ? ' out' : ''}"><span class="dot" style="background:${colorOf(f)}"></span><span class="nm" data-pick="${l.id}" data-f="${esc(f)}">${esc(f)}${stTxt}</span>${ctrl(l, o, f, q, left)}</div>`;
    }).join('')}</div>`;
  }
  const col = o.flavor ? colorOf(s.flavor) : '#2a2a31';
  return `<div class="wrap"><div class="lhead"><div><h2>${esc(l.name)}</h2><p>${esc(l.sub)}</p></div><span class="price">${bs(o.price)}</span></div>
    <div class="pgrid"><div class="preview">${pic(l, o.flavor ? s.flavor : 'bateria', col)}<div class="cur">${o.flavor ? esc(s.flavor) : esc(o.label)}</div></div><div>${opts}${body}</div></div></div>`;
}
function ctrl(l, o, f, q, left) {
  const d = `data-l="${l.id}" data-o="${o.id || ''}" data-f="${esc(f)}"`;
  if (!q) return `<button class="add" ${d} data-d="1" ${left <= 0 ? 'disabled' : ''} aria-label="Agregar ${esc(f || o.label)}">+ Agregar</button>`;
  return `<div class="qty"><button ${d} data-d="-1" aria-label="Quitar uno">−</button><span>${q}</span><button ${d} data-d="1" ${q >= left ? 'disabled' : ''} aria-label="Agregar uno">+</button></div>`;
}

const main = document.getElementById('lines');
main.innerHTML = LINES.map(l => `<section class="band line" id="v${l.id}"></section>`).join('');
const draw = id => { const l = LINES.find(x => x.id === id); document.getElementById('v' + id).innerHTML = renderLine(l); };
const drawAll = () => { LINES.forEach(l => draw(l.id)); drawCart(); };

function lines() {
  return Object.entries(cart).filter(([, q]) => q > 0).map(([k, q]) => {
    const [lid, oid, f] = k.split('|'); const l = LINES.find(x => x.id === lid), o = optOf(l, oid || null);
    return {k, q, l, o, f, sub: o.price * q, txt: l.name + (o.label ? ' (' + o.label + ')' : '') + (f ? ' – ' + f : '')};
  });
}
function message() {
  const ls = lines(); const t = ls.reduce((s, x) => s + x.sub, 0);
  const v = id => document.getElementById(id).value.trim();
  return `¡Hola ${STORE}! Quiero hacer este pedido:\n` + ls.map(x => `• ${x.q} × ${x.txt} = ${bs(x.sub)}`).join('\n') +
    `\n\nTotal: ${bs(t)}\nNombre: ${v('c-name') || '-'}\nEntrega: ${v('c-del')}\nZona/dirección: ${v('c-addr') || '-'}\nPago: ${v('c-pay')}`;
}
function drawCart() {
  const ls = lines(), n = ls.reduce((s, x) => s + x.q, 0), t = ls.reduce((s, x) => s + x.sub, 0);
  document.getElementById('b-n').textContent = n ? `${n} ${n === 1 ? 'producto' : 'productos'}` : 'Tu pedido está vacío';
  document.getElementById('b-t').textContent = bs(t);
  document.getElementById('tot').textContent = bs(t);
  document.getElementById('open').disabled = !n;
  document.getElementById('items').innerHTML = ls.length ? ls.map(x => `<li><span class="dot" style="background:${x.o.flavor ? colorOf(x.f) : '#2a2a31'}"></span><span class="t">${esc(x.l.name)}<small>${esc([x.o.label, x.f].filter(Boolean).join(' · '))}</small></span>
    <div class="qty"><button data-k="${esc(x.k)}" data-d="-1" aria-label="Quitar uno">−</button><span>${x.q}</span><button data-k="${esc(x.k)}" data-d="1" aria-label="Agregar uno">+</button></div><span class="p">${bs(x.sub)}</span></li>`).join('') : '<li class="empty">Todavía no agregaste nada.</li>';
  const wa = document.getElementById('wa');
  wa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message());
  wa.setAttribute('aria-disabled', String(!n));
  if (!n) document.getElementById('sheet').classList.remove('on');
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) {}
}
function change(k, d) {
  const [lid, oid, f] = k.split('|'); const l = LINES.find(x => x.id === lid);
  if (d > 0 && f && usedStock(l, f) >= stockOf(l, f)) return;
  cart[k] = Math.max(0, (cart[k] || 0) + d); if (!cart[k]) delete cart[k];
  draw(lid); drawCart();
}

main.addEventListener('click', e => {
  const b = e.target.closest('button,[data-pick]'); if (!b) return;
  if (b.dataset.pick) { sel[b.dataset.pick].flavor = b.dataset.f; draw(b.dataset.pick); return; }
  const l = LINES.find(x => x.id === b.dataset.l);
  if (b.classList.contains('opt')) { sel[l.id].opt = b.dataset.o; draw(l.id); return; }
  if (b.dataset.d) { const o = optOf(l, b.dataset.o || null); if (b.dataset.f) sel[l.id].flavor = b.dataset.f; change(keyOf(l, o, b.dataset.f), +b.dataset.d); }
});
document.getElementById('items').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b) change(b.dataset.k, +b.dataset.d); });
const sheet = document.getElementById('sheet');
document.getElementById('open').addEventListener('click', () => { drawCart(); sheet.classList.add('on'); document.getElementById('close').focus(); });
document.getElementById('close').addEventListener('click', () => sheet.classList.remove('on'));
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.classList.remove('on'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') sheet.classList.remove('on'); });
document.getElementById('f').addEventListener('input', drawCart);
document.getElementById('f').addEventListener('submit', e => e.preventDefault());
document.getElementById('copy').addEventListener('click', async () => {
  const h = document.getElementById('hint');
  try { await navigator.clipboard.writeText(message()); h.textContent = 'Pedido copiado. Pegalo en el chat de WhatsApp.'; }
  catch (err) { h.textContent = 'No se pudo copiar automáticamente.'; }
});

/* age gate */
const gate = document.getElementById('gate');
let ok = false; try { ok = localStorage.getItem('age18') === '1'; } catch (e) {}
if (ok) gate.classList.add('off');
document.getElementById('g-yes').addEventListener('click', () => { gate.classList.add('off'); try { localStorage.setItem('age18', '1'); } catch (e) {} });
document.getElementById('g-no').addEventListener('click', () => { document.getElementById('gt').textContent = 'Lo sentimos'; document.getElementById('gp').textContent = 'Esta tienda es solo para mayores de 18 años.'; document.querySelector('.gate .btns').remove(); });

try { const saved = JSON.parse(localStorage.getItem('cart') || '{}'); for (const k in saved) { const l = LINES.find(x => x.id === k.split('|')[0]); if (l && saved[k] > 0) cart[k] = saved[k]; } } catch (e) {}
drawAll();
}
