let currentPage = 'menu';
let cart = [];
let salesHistory = [];
let salesCount = {};

function showPage(page) {
  if (page === 'kasir' || page === 'penjualan') {
    let pass = prompt("Masukkan password:");
    if (pass !== "KELOMPOK29A2") {
      alert("Password salah!");
      return;
    }
  }
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(page).style.display = 'block';
  currentPage = page;

  if (page === 'kasir') renderKasir();
  if (page === 'penjualan') renderPenjualan();
}

function addToCart(name, price) {
  cart.push({ name, price });
  alert(`${name} ditambahkan ke keranjang.`);
}

function renderKasir() {
  let html = '<h3>Keranjang Belanja</h3>';
  let total = 0;
  cart.forEach((item, i) => {
    html += `<p>${item.name} - Rp ${item.price.toLocaleString()} <button onclick="removeFromCart(${i})">❌</button></p>`;
    total += item.price;
  });
  html += `<h4>Total: Rp ${total.toLocaleString()}</h4>`;
  html += `<button onclick="checkout('Tunai')">Bayar Tunai</button>`;
  html += `<button onclick="checkout('QRIS')">Bayar QRIS</button>`;
  document.getElementById('kasir-container').innerHTML = html;
}

function removeFromCart(i) {
  cart.splice(i, 1);
  renderKasir();
}

function checkout(method) {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }
  cart.forEach(item => {
    salesHistory.push({ ...item, method, time: new Date().toLocaleString() });
    salesCount[item.name] = (salesCount[item.name] || 0) + 1;
  });
  cart = [];
  alert(`Transaksi berhasil dengan ${method}`);
  renderKasir();
}

function renderPenjualan() {
  let html = '<h3>Riwayat Transaksi</h3>';
  let totalAll = 0;
  salesHistory.forEach(s => {
    html += `<p>${s.time} - ${s.name} Rp ${s.price.toLocaleString()} (${s.method})</p>`;
    totalAll += s.price;
  });
  html += `<h3>Total Pendapatan: Rp ${totalAll.toLocaleString()}</h3>`;

  html += '<h3>Jumlah Produk Terjual</h3>';
  for (let item in salesCount) {
    html += `<p>${item}: ${salesCount[item]}x</p>`;
  }

  html += `<button onclick="clearHistory()">Hapus History</button>`;
  document.getElementById('penjualan-container').innerHTML = html;
}

function clearHistory() {
  if (confirm("Yakin hapus semua data penjualan?")) {
    salesHistory = [];
    salesCount = {};
    renderPenjualan();
  }
}

function orderNow() {
  const productValue = document.getElementById("order-product").value.split("|");
  const name = productValue[0];
  const price = parseInt(productValue[1]);
  const qty = parseInt(document.getElementById("order-qty").value);
  const total = price * qty;

  document.getElementById("order-result").innerHTML = `
    <p>Anda memesan ${qty} ${name} - Total Rp ${total.toLocaleString()}</p>
  `;
}

