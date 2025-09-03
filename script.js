// ================== KONFIGURASI ==================
const PASSWORD = "KELOMPOK29A1"; // password untuk kasir & penjualan
let cart = [];
let sales = JSON.parse(localStorage.getItem("salesData")) || [];

// ================== NAVIGASI ==================
function hideAllSections() {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
}

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    const id = this.getAttribute("href").substring(1);
    if (document.getElementById(id)) {
      e.preventDefault();
      hideAllSections();
      document.getElementById(id).classList.remove("hide");
    }
  });
});

// tampilkan home saat awal
hideAllSections();
document.getElementById("home").classList.remove("hide");

// ================== KASIR ==================
function unlockKasir() {
  const pass = document.getElementById("kasir-pass").value;
  if (pass === "KELOMPOK29A1") {   // <<< password HARUS sama persis
    document.getElementById("kasir-lock").classList.add("hide");
    document.getElementById("kasir-content").classList.remove("hide");
  } else {
    alert("❌ Password salah!");
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
    div.innerHTML = `
      ${item.name} - Rp ${item.price}
      <button onclick="removeItem(${i})">x</button>
    `;
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

  sales.push({
    items: [...cart],
    total,
    payment,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem("salesData", JSON.stringify(sales));
  alert("✅ Transaksi berhasil!");

  cart = [];
  renderCart();
}
// === PASSWORD KASIR ===
function unlockKasir() {
  const pass = document.getElementById("kasir-pass").value;
  if (pass === "KELOMPOK29A1") { // ubah sesuai password lo
    document.getElementById("kasir-lock").classList.add("hide");
    document.getElementById("kasir-content").classList.remove("hide");
  } else {
    alert("❌ Password salah!");
  }
}

// === KERANJANG & PRODUK ===
let cart = [];
let total = 0;

function addItem(name, price) {
  cart.push({ name, price });
  total += price;
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.innerHTML = "";
  cart.forEach((item, i) => {
    const div = document.createElement("div");
    div.textContent = `${item.name} - Rp ${item.price}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => removeItem(i);
    div.appendChild(btn);
    cartDiv.appendChild(div);
  });
  document.getElementById("total").textContent = total;
}

function removeItem(i) {
  total -= cart[i].price;
  cart.splice(i, 1);
  renderCart();
}

// === CHECKOUT ===
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  const payment = document.getElementById("payment").value;
  let metode = payment === "qris" ? "QRIS" : "Tunai";

  alert(`✅ Transaksi berhasil!\nTotal: Rp ${total}\nMetode: ${metode}`);

  // Reset
  cart = [];
  total = 0;
  renderCart();
}

// === QRIS TOGGLE ===
document.getElementById("payment").addEventListener("change", function () {
  if (this.value === "qris") {
    document.getElementById("qris-box").classList.remove("hide");
  } else {
    document.getElementById("qris-box").classList.add("hide");
  }
});

// ================== DATA PENJUALAN ==================
function unlockPenjualan() {
  const pass = document.getElementById("penjualan-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("penjualan-lock").classList.add("hide");
    document.getElementById("penjualan-content").classList.remove("hide");
    renderSalesData();
  } else {
    alert("❌ Password salah!");
  }
}

function renderSalesData() {
  const salesList = document.getElementById("salesList");
  salesList.innerHTML = "";
  let total = 0;

  sales.forEach((sale, index) => {
    total += sale.total;
    const div = document.createElement("div");
    div.className = "sale-item";
    const itemsText = sale.items.map(i => i.name).join(", ");

    div.innerHTML = `
      <span>${sale.date} - ${itemsText} - Rp ${sale.total} (${sale.payment})</span>
      <button onclick="removeSale(${index})">Hapus</button>
    `;
    salesList.appendChild(div);
  });

  document.getElementById("salesTotal").innerText = total;
}

function removeSale(index) {
  sales.splice(index, 1);
  localStorage.setItem("salesData", JSON.stringify(sales));
  renderSalesData();
}

function clearAllSales() {
  if (confirm("⚠️ Yakin mau hapus semua data penjualan?")) {
    sales = [];
    localStorage.setItem("salesData", JSON.stringify(sales));
    renderSalesData();
  }
}

// ================== QRIS TOGGLE ==================
document.getElementById("payment").addEventListener("change", function () {
  const qrisBox = document.getElementById("qris-box");
  this.value === "qris" ? qrisBox.classList.remove("hide") : qrisBox.classList.add("hide");
});


