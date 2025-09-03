// ================= PASSWORD =================
function checkPassword(pageId) {
  const pass = prompt("Masukkan password:");
  if (pass === "KELOMPOK29A2") {
    showPage(pageId);
  } else {
    alert("❌ Password salah!");
  }
}

// ================= NAVIGASI =================
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// ================= MESIN KASIR =================
let cart = [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || {
  bakso: 0,
  tape: 0,
  tapePromo: 0,
  esteh: 0,
  bundling: 0,
  jasuke: 0,
  totalRevenue: 0
};

function addToCart(product, price, key) {
  cart.push({ product, price, key });
  renderCart();
}

function renderCart() {
  let cartList = document.getElementById("cart-list");
  let totalEl = document.getElementById("total");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - Rp ${item.price}`;
    let del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => { cart.splice(i, 1); renderCart(); };
    li.appendChild(del);
    cartList.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = "Rp " + total;
}

function checkout(method) {
  if (cart.length === 0) return alert("Keranjang kosong!");

  let total = cart.reduce((sum, it) => sum + it.price, 0);
  cart.forEach(it => { if (salesData[it.key] !== undefined) salesData[it.key]++; });
  salesData.totalRevenue += total;
  localStorage.setItem("salesData", JSON.stringify(salesData));

  cart = [];
  renderCart();
  renderSalesData();

  if (method === "tunai") alert("✅ Transaksi Tunai Rp " + total);
  if (method === "qris") {
    document.getElementById("qrisModal").style.display = "block";
    alert("✅ Transaksi QRIS Rp " + total);
  }
}

// ================= DATA PENJUALAN =================
function renderSalesData() {
  const d = salesData;
  let div = document.getElementById("sales-data");
  div.innerHTML = `
    <p>Bakso Terjual: ${d.bakso}</p>
    <p>Tape Ketan Hitam: ${d.tape}</p>
    <p>Tape Promo (2 pcs): ${d.tapePromo}</p>
    <p>Es Teh: ${d.esteh}</p>
    <p>Bundling Bakso + Es Teh: ${d.bundling}</p>
    <p>Jasuke: ${d.jasuke}</p>
    <h3>Total Pendapatan: Rp ${d.totalRevenue}</h3>
  `;
}

function clearSalesData() {
  if (confirm("Yakin reset data penjualan?")) {
    salesData = { bakso:0, tape:0, tapePromo:0, esteh:0, bundling:0, jasuke:0, totalRevenue:0 };
    localStorage.setItem("salesData", JSON.stringify(salesData));
    renderSalesData();
  }
}

// ================= MODAL QRIS =================
function closeQris() {
  document.getElementById("qrisModal").style.display = "none";
}

// ================= INIT =================
window.onload = () => {
  showPage("home");
  renderCart();
  renderSalesData();
};

