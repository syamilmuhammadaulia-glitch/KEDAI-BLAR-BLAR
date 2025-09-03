const PASSWORD = "KELOMPOK29A1"; // jangan ditampilin di halaman
let cart = [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// === Simpan ke localStorage ===
function saveSales() {
  localStorage.setItem("sales", JSON.stringify(sales));
}

// === Navigasi antar halaman ===
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = this.getAttribute("href").substring(1);

    // sembunyikan semua section
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));

    // tampilkan section yang dipilih
    document.getElementById(target).classList.remove("hide");
  });
});

// tampilkan home waktu awal
document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
document.getElementById("home").classList.remove("hide");
document.getElementById("menu").classList.remove("hide");
document.getElementById("promo").classList.remove("hide");

// === Kasir ===
function unlockKasir() {
  const pass = document.getElementById("kasir-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("kasir-lock").classList.add("hide");
    document.getElementById("kasir-content").classList.remove("hide");
  } else {
    alert("Password salah!");
  }
}

function addItem(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const cartBox = document.getElementById("cart");
  cartBox.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `${item.name} - Rp ${item.price} <button onclick="removeItem(${i})">x</button>`;
    cartBox.appendChild(div);
  });
  document.getElementById("total").innerText = total;
}

function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}

function checkout() {
  if (cart.length === 0) return alert("Keranjang kosong!");
  const payment = document.getElementById("payment").value;
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  sales.push({ items: [...cart], total, payment, date: new Date() });
  saveSales();

  alert("Transaksi berhasil!");
  cart = [];
  renderCart();
  renderSales();
  renderSalesData();
}

// === Data Penjualan ===
function unlockPenjualan() {
  const pass = document.getElementById("penjualan-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("penjualan-lock").classList.add("hide");
    document.getElementById("penjualan-content").classList.remove("hide");
    renderSales();
    renderSalesData();
  } else {
    alert("Password salah!");
  }
}

// Rekap Penjualan (jumlah produk terjual + total pendapatan)
function renderSales() {
  let rekap = {};
  let totalPendapatan = 0;
  sales.forEach(s => {
    s.items.forEach(i => {
      if (!rekap[i.name]) rekap[i.name] = 0;
      rekap[i.name]++;
    });
    totalPendapatan += s.total;
  });

  let html = "<h3>Rekap Penjualan</h3><ul>";
  for (let [produk, qty] of Object.entries(rekap)) {
    html += `<li>${produk}: ${qty} terjual</li>`;
  }
  html += `</ul><p><b>Total Pendapatan: Rp ${totalPendapatan}</b></p>`;
  document.getElementById("rekap").innerHTML = html;
}

// Daftar transaksi detail
function renderSalesData() {
  const salesList = document.getElementById("salesList");
  salesList.innerHTML = "";
  let total = 0;

  sales.forEach((sale, index) => {
    const div = document.createElement("div");
    div.className = "item";

    let itemsText = sale.items.map(i => i.name).join(", ");
    div.innerHTML = `
      <span>${itemsText} - Rp ${sale.total} (${sale.payment})</span>
      <div class="actions">
        <button class="btn small" onclick="removeSale(${index})">Hapus</button>
      </div>
    `;
    salesList.appendChild(div);

    total += sale.total;
  });

  document.getElementById("salesTotal").innerText = total;
}

// Hapus 1 transaksi
function removeSale(index) {
  sales.splice(index, 1);
  saveSales();
  renderSalesData();
  renderSales();
}

// Hapus semua transaksi
function clearAllSales() {
  if (confirm("Yakin mau hapus semua data penjualan?")) {
    sales = [];
    saveSales();
    renderSalesData();
    renderSales();
  }
}

// === QRIS toggle ===
document.getElementById("payment").addEventListener("change", function () {
  if (this.value === "qris") {
    document.getElementById("qris-box").classList.remove("hide");
  } else {
    document.getElementById("qris-box").classList.add("hide");
  }
});

// Render ulang pas load awal
document.addEventListener("DOMContentLoaded", () => {
  renderSales();
  renderSalesData();
});
