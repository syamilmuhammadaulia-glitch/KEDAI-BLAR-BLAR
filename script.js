// ==========================
// Navigasi Halaman
// ==========================
function showPage(pageId) {
  // Sembunyikan semua section
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });

  // Tampilkan section yang dipilih
  let target = document.getElementById(pageId);
  if (target) target.style.display = "block";
}

// ==========================
// Password Protection
// ==========================
function checkPassword(pageId) {
  const pass = prompt("Masukkan password:");
  if (pass === "KELOMPOK29A2") {
    showPage(pageId);
  } else {
    alert("Password salah!");
  }
}

// ==========================
// Data Kasir & Penjualan
// ==========================
let cart = [];
let salesData = {};

// Tambah produk ke keranjang
function addToCart(product, price) {
  let existing = cart.find(item => item.product === product);
  if (existing) {
    existing.qty++;
    existing.subtotal += price;
  } else {
    cart.push({ product, price, qty: 1, subtotal: price });
  }
  renderCart();
}

// Render keranjang ke tabel
function renderCart() {
  let cartList = document.getElementById("cart-list");
  let total = 0;
  cartList.innerHTML = "";

  cart.forEach(item => {
    total += item.subtotal;
    cartList.innerHTML += `
      <tr>
        <td>${item.product}</td>
        <td>Rp ${item.price}</td>
        <td>${item.qty}</td>
        <td>Rp ${item.subtotal}</td>
      </tr>`;
  });

  document.getElementById("total").textContent = "Rp " + total;
}

// Selesaikan transaksi
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  // Simpan ke data penjualan
  cart.forEach(item => {
    if (!salesData[item.product]) {
      salesData[item.product] = { qty: 0, total: 0 };
    }
    salesData[item.product].qty += item.qty;
    salesData[item.product].total += item.subtotal;
  });

  // Tambah riwayat transaksi
  let history = document.getElementById("sales-history");
  let li = document.createElement("li");
  li.textContent = "Transaksi: " + cart.map(i => `${i.qty}x ${i.product}`).join(", ") + 
                   " | Total Rp " + cart.reduce((sum,i)=>sum+i.subtotal,0);
  history.appendChild(li);

  // Reset keranjang
  cart = [];
  renderCart();
  renderSalesData();
  alert("Transaksi berhasil!");
}

// Render data penjualan
function renderSalesData() {
  let summary = document.getElementById("sales-summary");
  summary.innerHTML = "";
  let totalUang = 0;

  for (let produk in salesData) {
    summary.innerHTML += `
      <tr>
        <td>${produk}</td>
        <td>${salesData[produk].qty}</td>
        <td>Rp ${salesData[produk].total}</td>
      </tr>`;
    totalUang += salesData[produk].total;
  }

  if (Object.keys(salesData).length > 0) {
    summary.innerHTML += `
      <tr style="font-weight:bold;">
        <td colspan="2">TOTAL</td>
        <td>Rp ${totalUang}</td>
      </tr>`;
  }
}

// Hapus semua riwayat & data penjualan
function clearSales() {
  salesData = {};
  document.getElementById("sales-history").innerHTML = "";
  renderSalesData();
}

// ==========================
// Default Page saat load
// ==========================
window.onload = () => {
  showPage("menu"); // langsung buka halaman Menu
  renderCart();
  renderSalesData();
};
