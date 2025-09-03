<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KEDAI BLAR BLAR</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#" onclick="showPage('menu')">Menu</a></li>
        <li><a href="#" onclick="showPage('promo')">Promo</a></li>
        <li><a href="#" onclick="showPage('kasir')">Kasir</a></li>
        <li><a href="#" onclick="showPage('penjualan')">Data Penjualan</a></li>
      </ul>
    </nav>
  </header>

  <!-- Halaman Menu -->
  <div id="menu" class="page">
    <h2>Daftar Menu</h2>
    <div class="menu-grid">
      <div class="menu-item">
        <img src="bakso.png" alt="Bakso">
        <p><b>Bakso - Rp5.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Bakso', 5000)">+ Tambah ke Kasir</button>
      </div>
      <div class="menu-item">
        <img src="teh.png" alt="Es Teh">
        <p><b>Es Teh - Rp5.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Es Teh', 5000)">+ Tambah ke Kasir</button>
      </div>
      <div class="menu-item">
        <img src="tape.png" alt="Tape Ketan Hitam">
        <p><b>Tape Ketan Hitam - Rp3.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Tape Ketan Hitam', 3000)">+ Tambah ke Kasir</button>
      </div>
      <div class="menu-item">
        <img src="jasuke.png" alt="Jasuke">
        <p><b>Jasuke - Rp5.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Jasuke', 5000)">+ Tambah ke Kasir</button>
      </div>
    </div>
  </div>

  <!-- Halaman Promo -->
  <div id="promo" class="page" style="display:none;">
    <h2>Promo Spesial</h2>
    <div class="menu-grid">
      <div class="menu-item">
        <img src="tape.png" alt="Promo Tape">
        <p><b>Promo Tape (2x) - Rp5.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Promo Tape 2x', 5000)">+ Tambah ke Kasir</button>
      </div>
      <div class="menu-item">
        <div class="promo-images">
          <img src="bakso.png" alt="Bundling Bakso">
          <img src="teh.png" alt="Bundling Teh">
        </div>
        <p><b>Paket Bundling - Rp8.000</b></p>
        <button class="add-to-cart-btn" onclick="tambahProduk('Paket Bundling', 8000)">+ Tambah ke Kasir</button>
      </div>
    </div>
  </div>

  <!-- Halaman Kasir -->
  <div id="kasir" class="page" style="display:none;">
    <h2>Mesin Kasir</h2>
    <div id="kasir-container">
        <!-- Konten kasir akan di-generate oleh JavaScript -->
    </div>
  </div>

  <!-- Halaman Data Penjualan -->
  <div id="penjualan" class="page" style="display:none;">
    <h2>Data Penjualan</h2>
    <div id="penjualan-container">
        <!-- Konten data penjualan akan di-generate oleh JavaScript -->
    </div>
    <button onclick="hapusRiwayat()">Hapus Riwayat</button>
  </div>

  <script src="script.js"></script>
</body>
</html>

