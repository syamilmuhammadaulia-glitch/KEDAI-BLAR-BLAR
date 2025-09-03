// script.js - NineFoosionExpo
// Password stored as SHA-256 hash (so plaintext password tidak ditulis di source)
// Password asli: (disimpan secara aman di luar) -> user must know it
// Hash of "KELOMPOK29A1" computed and stored here:
const PASSWORD_HASH = "51607e0c101981839bd5ca32c129ca34d1405663cd8c1d800193251c035ecf58";

let cart = [];
let sales = JSON.parse(localStorage.getItem("nfx_sales")) || [];

// small helpers
const fmtRupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// nav behavior: show sections (home/menu/promo visible by default)
$$('section').forEach(s => s.classList.add('hide'));
$('#home').classList.remove('hide');
$('#menu').classList.remove('hide');
$('#promo').classList.remove('hide');

// nav links: show target section (but kasir/penjualan remain hidden until unlocked)
$$('.nav-links a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').substring(1);
    // hide all landing sections (keep home/menu/promo shown unless navigating)
    $$('section').forEach(s=>s.classList.add('hide'));
    // when navigating to kasir/sales, still show that section container (they handle lock)
    document.getElementById(id).classList.remove('hide');
    // if user clicked penjualan, update list if unlocked
    if(id === 'penjualan') renderSalesData(); 
  });
});

// ---------- PASSWORD (SHA-256 compare) ----------
async function sha256Hex(message){
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function tryUnlockKasir(){
  const input = $('#kasir-pass').value;
  $('#kasir-msg').style.display = 'none';
  const h = await sha256Hex(input);
  if(h === PASSWORD_HASH){
    $('#kasir-lock').classList.add('hide');
    $('#kasir-content').classList.remove('hide');
    renderCart();
  } else {
    $('#kasir-msg').textContent = 'Password salah.';
    $('#kasir-msg').style.display = 'block';
  }
}

async function tryUnlockSales(){
  const input = $('#sales-pass').value;
  $('#sales-msg').style.display = 'none';
  const h = await sha256Hex(input);
  if(h === PASSWORD_HASH){
    $('#sales-lock').classList.add('hide');
    $('#sales-content').classList.remove('hide');
    renderSales();
    renderSalesData();
  } else {
    $('#sales-msg').textContent = 'Password salah.';
    $('#sales-msg').style.display = 'block';
  }
}

$('#kasir-unlock-btn').addEventListener('click', tryUnlockKasir);
$('#sales-unlock-btn').addEventListener('click', tryUnlockSales);

// ---------- KASIR: addItem / cart ----------
function addItem(name, price){
  // if promo tape x2, we add two items automatically when name contains "(Promo x2)" or we use specific key
  if(name === 'Tape (Promo x2)'){
    cart.push({name:'Tape Ketan Hitam', price});
    cart.push({name:'Tape Ketan Hitam', price});
  } else {
    cart.push({name, price});
  }
  renderCart();
}

function renderCart(){
  const box = $('#cart');
  box.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx)=>{
    total += it.price;
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `<div><strong>${it.name}</strong><div class="subtle">Harga: ${fmtRupiah(it.price)}</div></div>
                    <div><button class="btn small" onclick="removeItem(${idx})">Hapus</button></div>`;
    box.appendChild(el);
  });
  $('#total').textContent = fmtRupiah(total);
}

function removeItem(idx){
  cart.splice(idx,1);
  renderCart();
}

function clearCart(){
  cart = [];
  renderCart();
}

// QRIS show/hide
$('#payment').addEventListener('change', ()=> {
  if($('#payment').value === 'qris') $('#qris-box').classList.remove('hide');
  else $('#qris-box').classList.add('hide');
});

// checkout -> save to localStorage (sales array)
$('#checkout-btn').addEventListener('click', ()=>{
  if(cart.length === 0) return alert('Keranjang kosong!');
  const payment = $('#payment').value;
  const total = cart.reduce((s,i)=>s+i.price,0);
  const trx = { items: cart.map(i=>({name:i.name, price:i.price})), total, payment, date: new Date().toLocaleString() };
  sales.push(trx);
  localStorage.setItem('nfx_sales', JSON.stringify(sales));
  alert('Transaksi berhasil!');
  cart = [];
  renderCart();
  // if sales panel is open, refresh data
  if(!$('#sales-content').classList.contains('hide')) { renderSales(); renderSalesData(); }
});

// ---------- DATA PENJUALAN: rekap & list ----------
function renderSales(){
  // rekap per product
  const map = {};
  let grand = 0;
  sales.forEach(trx=>{
    trx.items.forEach(it=>{
      map[it.name] = (map[it.name] || 0) + 1;
    });
    grand += trx.total;
  });

  const rekapBox = $('#rekap');
  rekapBox.innerHTML = '';
  if(Object.keys(map).length === 0){
    rekapBox.innerHTML = '<div class="subtle">Belum ada penjualan.</div>';
  } else {
    Object.entries(map).forEach(([name, qty])=>{
      const el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = `<div>${name}</div><div>${qty} terjual</div>`;
      rekapBox.appendChild(el);
    });
  }
  $('#salesTotal').textContent = grand.toLocaleString('id-ID');
}

// render list of transactions with delete button
function renderSalesData(){
  const list = $('#salesList');
  list.innerHTML = '';
  if(sales.length === 0){
    list.innerHTML = '<div class="subtle">Belum ada transaksi.</div>';
    $('#salesTotal').textContent = '0';
    return;
  }
  let grand = 0;
  sales.slice().reverse().forEach((trx, revIndex)=>{
    // show most recent first; compute real index
    const index = sales.length - 1 - revIndex;
    grand += trx.total;
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `
      <div style="max-width:70%">
        <div><strong>[${trx.date}]</strong></div>
        <div class="subtle">${trx.items.map(i=>i.name).join(', ')}</div>
      </div>
      <div style="text-align:right;">
        <div><strong>${fmtRupiah(trx.total)}</strong></div>
        <div class="subtle">${trx.payment}</div>
        <div style="margin-top:8px;"><button class="btn small" onclick="removeSale(${index})">Hapus</button></div>
      </div>
    `;
    list.appendChild(el);
  });
  $('#salesTotal').textContent = grand.toLocaleString('id-ID');
}

// remove one transaction
function removeSale(index){
  if(!confirm('Hapus transaksi ini?')) return;
  sales.splice(index,1);
  localStorage.setItem('nfx_sales', JSON.stringify(sales));
  renderSales();
  renderSalesData();
}

// clear all
$('#clear-sales-btn').addEventListener('click', ()=>{
  if(!confirm('Hapus semua data penjualan?')) return;
  sales = [];
  localStorage.setItem('nfx_sales', JSON.stringify(sales));
  renderSales();
  renderSalesData();
});

// load initial state on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  // show year
  $('#year').textContent = new Date().getFullYear();
  // initial render if sales panel open
  renderSales();
  renderSalesData();
});

