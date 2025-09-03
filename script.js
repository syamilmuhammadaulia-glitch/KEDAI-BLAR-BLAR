const PASSWORD = "KELOMPOK29A1";
let cart = [];
let sales = JSON.parse(localStorage.getItem("salesData")) || [];

// Navigasi antar section
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const target = this.getAttribute("href").substring(1);

    document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
    document.getElementById(target).classList.remove("hide");

    if (target === "penjualan") renderSalesData();
  });
});

// Unlock kasir
function unlockKasir() {
  const pass = document.getElementById("kasir-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("kasir-lock").classList.add("hide");
    document.getElementById("kasir-content").classList.remove("hide");
  } else {
    alert("Password salah!");
  }
}

// Tambah item
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
      <span>${item.name} - Rp ${item.price}</span>
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

// Checkout
function checkout() {
  if (cart.length === 0) return alert("Keranjang kosong!");
  const payment = document.getElementById("payment").value;
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  sales.push({ items: [...cart], total, payment, date: new Date().toLocaleString() });
  localStorage.setItem("salesData", JSON.stringify(sales));

  alert("Transaksi berhasil!");
  cart = [];
  renderCart();
}

// QRIS toggle
document.getElementById("payment").addEventListener("change", function() {
  if (this.value === "qris") {
    document.getElementById("qris-box").classList.remove("hide");
  } else {
    document.getElementById("qris-box").classList.add("hide");
  }
});

// Data Penjualan
function renderSalesData() {
  const salesList = document.getElementById("salesList");
  salesList.innerHTML = "";
  let total = 0;

  sales.forEach((trx, index) => {
    total += trx.total;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>[${trx.date}] ${trx.items.map(i => i.name).join(", ")} - Rp ${trx.total} (${trx.payment})</span>
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
  if (confirm("Yakin mau hapus semua data penjualan?")) {
    sales = [];
    localStorage.setItem("salesData", JSON.stringify(sales));
    renderSalesData();
  }
}

