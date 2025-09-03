const PASSWORD = "KELOMPOK29A1";
let cart = [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

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
  sales.push({ items: cart, total, payment, date: new Date() });
  localStorage.setItem("sales", JSON.stringify(sales));
  alert("Transaksi berhasil!");
  cart = [];
  renderCart();
}

// === Data Penjualan ===
function unlockPenjualan() {
  const pass = document.getElementById("penjualan-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("penjualan-lock").classList.add("hide");
    document.getElementById("penjualan-content").classList.remove("hide");
    renderSales();
  } else {
    alert("Password salah!");
  }
}

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

