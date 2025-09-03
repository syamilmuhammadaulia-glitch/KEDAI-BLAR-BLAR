// Simple app.js for NineFoosionExpo
// - Produk, order form -> WA
// - Kasir (password protected), payment (tunai/qris), simpan transaksi di localStorage
// - Data penjualan dan export CSV
// Password: KELOMPOK29A1

const PRODUCTS = {
  bakso:  { name: 'Bakso', price: 5000 },
  tape:   { name: 'Tape Ketan Hitam', price: 3000 },
  esteh:  { name: 'Es Teh', price: 5000 },
  jasuke: { name: 'Jasuke', price: 5000 },
  tape2:  { name: 'Promo: Tape Ketan Hitam x2', price: 5000 }, // 2 porsi = 5k
  bundle: { name: 'Bundling: Bakso + Es Teh', price: 8000 }
};

const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
const SALES_KEY = 'nfx_sales';
const PASSWORD = 'KELOMPOK29A1';
let cart = {}; // { key: qty }

// Year
document.getElementById('year').textContent = new Date().getFullYear ? new Date().getFullYear() : new Date().getYear();

// --- Add to cart buttons on menu ---
document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', e => {
    const key = e.currentTarget.getAttribute('data-add');
    addToCart(key, key === 'tape2' ? 1 : 1);
    alert(`Ditambahkan: ${PRODUCTS[key].name}`);
  });
});

// Add to cart logic
function addToCart(key, qty=1){
  cart[key] = (cart[key] || 0) + qty;
  renderCart();
}

// Render cashier items (list of product rows with + / -)
function renderCashierItems(){
  const list = document.getElementById('cashierList');
  list.innerHTML = '';
  Object.entries(PRODUCTS).forEach(([key, p]) => {
    const item = document.createElement('div');
    item.className = 'item';
    const left = document.createElement('div');
    left.innerHTML = `<strong>${p.name}</strong><div class="subtle">${fmt(p.price)}</div>`;
    const right = document.createElement('div');
    right.innerHTML = `
      <div class="qty">
        <button data-minus="${key}">−</button>
        <span id="qty-${key}">${cart[key]||0}</span>
        <button data-plus="${key}">+</button>
      </div>`;
    item.appendChild(left);
    item.appendChild(right);
    list.appendChild(item);
  });

  // hooks
  list.querySelectorAll('[data-plus]').forEach(b => b.addEventListener('click', e => {
    const k = e.currentTarget.getAttribute('data-plus');
    cart[k] = (cart[k]||0) + 1; renderCart();
  }));
  list.querySelectorAll('[data-minus]').forEach(b => b.addEventListener('click', e => {
    const k = e.currentTarget.getAttribute('data-minus');
    cart[k] = Math.max(0, (cart[k]||0) - 1); renderCart();
  }));
}

// Render cart summary area
function renderCart(){
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const cashierQtyEls = Object.keys(PRODUCTS).forEach(k=>{
    const el = document.getElementById(`qty-${k}`);
    if(el) el.textContent = cart[k]||0;
  });

  container.innerHTML = '';
  let total = 0;
  Object.entries(cart).forEach(([key, q])=>{
    if(!q) return;
    const p = PRODUCTS[key];
    const sub = p.price * q;
    total += sub;
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `<div><strong>${p.name}</strong><div class="subtle">× ${q}</div></div><div>${fmt(sub)}</div>`;
    container.appendChild(row);
  });
  totalEl.textContent = fmt(total);
}

// ORDER FORM -> generates WA chat text and opens WA
const orderForm = document.getElementById('orderForm');
const productSelect = document.getElementById('productSelect');
const qtyInput = document.getElementById('qty');
const orderTotal = document.getElementById('orderTotal');

function productPrice(key){ return PRODUCTS[key] ? PRODUCTS[key].price : 0; }
function updateOrderTotal(){
  const key = productSelect.value;
  const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
  orderTotal.textContent = 'Total: ' + fmt(productPrice(key) * qty);
}
productSelect.addEventListener('change', updateOrderTotal);
qtyInput.addEventListener('input', updateOrderTotal);
updateOrderTotal();

orderForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('custName').value.trim() || '-';
  const phone = document.getElementById('custPhone').value.trim();
  const key = productSelect.value;
  const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
  const note = document.getElementById('note').value.trim();
  const unit = productPrice(key);
  const total = unit * qty;
  let text = `Halo, saya ${name}. Ingin pesan ${qty} x ${PRODUCTS[key].name} (Rp ${unit.toLocaleString('id-ID')}), total ${fmt(total)}`;
  if(note) text += `. Catatan: ${note}`;
  if(phone) text += `. Nomor: ${phone}`;
  const url = 'https://wa.me/628996023111?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
});

// --- Cashier locks and unlocks ---
document.getElementById('unlockCashier').addEventListener('click', function(){
  const v = document.getElementById('cashierPass').value;
  if(v === PASSWORD){
    document.getElementById('cashierLock').classList.add('hide');
    document.getElementById('cashierBody').classList.remove('hide');
    renderCashierItems();
    renderCart();
  } else { alert('Password salah.'); }
});
document.getElementById('unlockSales').addEventListener('click', function(){
  const v = document.getElementById('salesPass').value;
  if(v === PASSWORD){
    document.getElementById('salesLock').classList.add('hide');
    document.getElementById('salesBody').classList.remove('hide');
    renderSales();
  } else { alert('Password salah.'); }
});

// Toggle QRIS box
document.getElementById('paymentMethod').addEventListener('change', function(){
  const m = this.value;
  document.getElementById('qrisBox').classList.toggle('hide', m !== 'qris');
});

// Complete sale -> save to localStorage
document.getElementById('completeSale').addEventListener('click', function(){
  // build items
  const items = [];
  let total = 0;
  Object.entries(cart).forEach(([key, q])=>{
    if(!q) return;
    const p = PRODUCTS[key];
    const sub = p.price * q;
    total += sub;
    items.push({ key, name: p.name, price: p.price, qty: q, subtotal: sub });
  });
  if(items.length === 0){ alert('Keranjang kosong. Tambahkan item terlebih dahulu.'); return; }
  const method = document.getElementById('paymentMethod').value;
  const tx = { id: 'TX' + Date.now(), time: new Date().toISOString(), method, items, total };
  const sales = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
  sales.push(tx);
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  alert('Transaksi tersimpan. Total ' + fmt(total));
  // clear cart
  cart = {};
  renderCart();
  renderCashierItems();
  renderSales();
});

// Clear cart
document.getElementById('clearCart').addEventListener('click', function(){
  if(confirm('Bersihkan keranjang?')){ cart = {}; renderCart(); renderCashierItems(); }
});

// SALES render & export
function renderSales(){
  const sales = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
  // per product summary
  const per = {};
  let grand = 0;
  sales.forEach(tx=>{
    grand += tx.total;
    tx.items.forEach(it=>{
      if(!per[it.key]) per[it.key] = { name: it.name, qty: 0, revenue: 0 };
      per[it.key].qty += it.qty;
      per[it.key].revenue += it.subtotal;
    });
  });

  const summaryBox = document.getElementById('salesSummary');
  summaryBox.innerHTML = '';
  Object.keys(PRODUCTS).forEach(key=>{
    const p = PRODUCTS[key];
    const row = per[key] || { name: p.name, qty: 0, revenue: 0 };
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `<div><strong>${row.name}</strong><div class="subtle">Terjual: ${row.qty}</div></div><div>${fmt(row.revenue)}</div>`;
    summaryBox.appendChild(el);
  });

  document.getElementById('salesGrand').textContent = fmt(grand);

  const tableBox = document.getElementById('salesTable');
  tableBox.innerHTML = '';
  if(sales.length === 0){ tableBox.innerHTML = '<div class="subtle">Belum ada transaksi.</div>'; return; }
  sales.slice().reverse().forEach(tx=>{
    const el = document.createElement('div');
    el.className = 'item';
    const itemsHtml = tx.items.map(it=>`${it.name} × ${it.qty} = ${fmt(it.subtotal)}`).join('<br>');
    el.innerHTML = `<div><strong>${new Date(tx.time).toLocaleString('id-ID')}</strong><div class="subtle">${itemsHtml}</div></div><div><div>${fmt(tx.total)}</div><div class="subtle">${tx.method.toUpperCase()}</div></div>`;
    tableBox.appendChild(el);
  });
}

// export CSV
document.getElementById('exportCsv').addEventListener('click', function(){
  const sales = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
  const rows = [['id','waktu','metode','item','qty','harga','subtotal','total_tx']];
  sales.forEach(tx=>{
    tx.items.forEach(it=>{
      rows.push([tx.id, new Date(tx.time).toLocaleString('id-ID'), tx.method, it.name, it.qty, it.price, it.subtotal, tx.total]);
    });
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'data-penjualan-ninefoosionexpo.csv'; a.click();
  URL.revokeObjectURL(url);
});

// Reset sales
document.getElementById('resetSales').addEventListener('click', function(){
  if(confirm('Hapus semua data penjualan?')){ localStorage.removeItem(SALES_KEY); renderSales(); }
});

// initial small renders
renderCart();
