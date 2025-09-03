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
// ====================== MESIN KASIR ======================
let keranjang = [];
let riwayatPenjualan = [];
let jumlahTerjual = {};

function tambahProduk(nama, harga) {
  keranjang.push({ nama, harga });
  renderKasir();
}

function renderKasir() {
  let total = 0;
  let html = "<h3>Keranjang:</h3>";
  keranjang.forEach((item, i) => {
    html += `${item.nama} - Rp${item.harga.toLocaleString()} 
      <button onclick="hapusProduk(${i})">❌</button><br>`;
    total += item.harga;
  });
  html += `<p><b>Total: Rp${total.toLocaleString()}</b></p>`;
  html += `<button onclick="checkout('Tunai')">Bayar Tunai</button>
           <button onclick="checkout('QRIS')">Bayar QRIS</button>`;
  document.getElementById("kasir-container").innerHTML = html;
}

function hapusProduk(i) {
  keranjang.splice(i, 1);
  renderKasir();
}

function checkout(metode) {
  if (keranjang.length === 0) return alert("Keranjang kosong!");
  keranjang.forEach(item => {
    riwayatPenjualan.push({ ...item, metode, waktu: new Date().toLocaleString() });
    jumlahTerjual[item.nama] = (jumlahTerjual[item.nama] || 0) + 1;
  });
  alert("Transaksi berhasil via " + metode);
  keranjang = [];
  renderKasir();
}

// ====================== DATA PENJUALAN ======================
function renderPenjualan() {
  let totalSemua = 0;
  let html = "<h3>Riwayat Transaksi:</h3>";
  riwayatPenjualan.forEach(r => {
    html += `${r.waktu} - ${r.nama} Rp${r.harga.toLocaleString()} (${r.metode})<br>`;
    totalSemua += r.harga;
  });
  html += `<p><b>Total Pendapatan: Rp${totalSemua.toLocaleString()}</b></p>`;
  html += "<h3>Jumlah Produk Terjual:</h3>";
  for (let nama in jumlahTerjual) {
    html += `${nama}: ${jumlahTerjual[nama]}x<br>`;
  }
  document.getElementById("penjualan-container").innerHTML = html;
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


