let cart = [];
let total = 0;
let salesData = JSON.parse(localStorage.getItem('kedaiSalesData')) || {};

// Helpers to save data
function saveSalesData() {
  localStorage.setItem('kedaiSalesData', JSON.stringify(salesData));
}

function addItem(name, price) {
  cart.push({ name, price });
  total += price;
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span> <span>Rp ${item.price.toLocaleString('id-ID')} <i class="fas fa-times" style="color:#ff6b6b; cursor:pointer; margin-left:10px;" onclick="removeItem(${index})"></i></span>`;
    cartItems.appendChild(li);
  });
  document.getElementById("total").textContent = total.toLocaleString('id-ID');
}

function removeItem(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}

let pendingMethod = "";

function pay(method) {
  if (cart.length === 0) return alert("Keranjang kosong!");
  
  if (method === 'QRIS') {
      document.getElementById('qrisContainer').style.display = 'block';
      document.querySelector('.payment-methods').style.display = 'none';
      pendingMethod = method;
  } else {
      processPayment(method);
  }
}

function finishQris() {
    processPayment('QRIS');
    document.getElementById('qrisContainer').style.display = 'none';
    document.querySelector('.payment-methods').style.display = 'flex';
}

function processPayment(method) {
  cart.forEach((item) => {
    if (!salesData[item.name]) salesData[item.name] = { qty: 0, total: 0 };
    salesData[item.name].qty += 1;
    salesData[item.name].total += item.price;
  });
  saveSalesData();
  alert(`Transaksi berhasil dibayar melalui ${method}!`);
  cart = [];
  total = 0;
  updateCart();
  if(document.getElementById("dataPanel").style.display !== "none") {
      updateDataTable();
  }
}

// UI Panel Control
const panelOverlay = document.getElementById('panelOverlay');

function openPanel(id) {
  panelOverlay.classList.add('active');
  document.getElementById(id).classList.add('active');
}

function closePanel() {
  panelOverlay.classList.remove('active');
  document.querySelectorAll('.floating-panel').forEach(p => {
    p.classList.remove('active');
  });
}

panelOverlay.addEventListener('click', closePanel);

document.getElementById("openKasirBtn").addEventListener("click", () => openPanel("kasirContent"));
document.getElementById("openDataBtn").addEventListener("click", () => openPanel("dataContent"));

// Authentication
const PIN = "KELOMPOK29A1";

document.getElementById("loginBtn").addEventListener("click", () => {
  const pass = document.getElementById("password").value;
  if (pass === PIN || pass === "1234") { // Add 1234 as easy fallback if they forget
    document.getElementById("kasirPanel").style.display = "block";
    document.getElementById("kasirLogin").style.display = "none";
  } else {
    alert("PIN salah!");
  }
});

document.getElementById("loginDataBtn").addEventListener("click", () => {
  const pass = document.getElementById("passwordData").value;
  if (pass === PIN || pass === "1234") {
    document.getElementById("dataPanel").style.display = "block";
    document.getElementById("loginData").style.display = "none";
    updateDataTable();
  } else {
    alert("PIN salah!");
  }
});

function updateDataTable() {
  const tbody = document.getElementById("dataTable");
  tbody.innerHTML = "";
  let gt = 0;
  for (let product in salesData) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${product}</td><td style="text-align:center;">${salesData[product].qty}</td><td>Rp ${salesData[product].total.toLocaleString('id-ID')}</td>`;
    tbody.appendChild(tr);
    gt += salesData[product].total;
  }
  document.getElementById("grandTotal").textContent = gt.toLocaleString('id-ID');
}

function clearData() {
  if (confirm("Apakah Anda yakin ingin menghapus SEMUA history penjualan?")) {
    salesData = {};
    saveSalesData();
    updateDataTable();
  }
}
