let keranjang = [];
let riwayatPenjualan = [];
let jumlahTerjual = {};

// ====================== NAVIGASI + PASSWORD ======================
function showPage(page) {
  if (page === 'kasir' || page === 'penjualan') {
    let pass = prompt("Masukkan password:");
    if (pass !== "KELOMPOK19A2") {
      alert("Password salah!");
      return;
    }
  }

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(page).style.display = 'block';

  if (page === 'kasir') renderKasir();
  if (page === 'penjualan') renderPenjualan();
}

// ====================== MESIN KASIR ======================
function tambahProduk(nama, harga) {
  keranjang.push({ nama, harga });
  renderKasir();
}

function renderKasir() {
  let total = 0;
  let html = "<h3>Keranjang:</h3>";
  if (keranjang.length === 0) {
    html += "<p>Keranjang kosong.</p>";
  } else {
    keranjang.forEach((item, i) => {
      html += `${item.nama} - Rp${item.harga.toLocaleString()} 
        <button onclick="hapusProduk(${i})">❌</button><br>`;
      total += item.harga;
    });
    html += `<p><b>Total: Rp${total.toLocaleString()}</b></p>`;
    html += `<button onclick="checkout('Tunai')">Bayar Tunai</button>
             <button onclick="checkout('QRIS')">Bayar QRIS</button>`;
    html += `<div id="qris-section" style="margin-top:10px; display:none;">
               <img src="img/qris.png" alt="QRIS" width="200">
             </div>`;
  }
  document.getElementById("kasir-container").innerHTML = html;
}

function hapusProduk(i) {
  keranjang.splice(i, 1);
  renderKasir();
}

function checkout(metode) {
  if (keranjang.length === 0) return alert("Keranjang kosong!");
  
  if (metode === 'QRIS') {
    document.getElementById("qris-section").style.display = "block";
  }

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
  if (riwayatPenjualan.length === 0) {
    html += "<p>Belum ada transaksi.</p>";
  } else {
    riwayatPenjualan.forEach(r => {
      html += `${r.waktu} - ${r.nama} Rp${r.harga.toLocaleString()} (${r.metode})<br>`;
      totalSemua += r.harga;
    });
  }

  html += `<p><b>Total Pendapatan: Rp${totalSemua.toLocaleString()}</b></p>`;
  html += "<h3>Jumlah Produk Terjual:</h3>";
  for (let nama in jumlahTerjual) {
    html += `${nama}: ${jumlahTerjual[nama]}x<br>`;
  }
  document.getElementById("penjualan-container").innerHTML = html;
}

function hapusRiwayat() {
  if (confirm("Yakin mau hapus semua riwayat penjualan?")) {
    riwayatPenjualan = [];
    jumlahTerjual = {};
    renderPenjualan();
  }
}

