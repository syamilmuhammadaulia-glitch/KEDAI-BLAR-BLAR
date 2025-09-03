// Kasir
let cart = [];
let total = 0;
let salesData = {};

function addItem(name, price) {
  cart.push({ name, price });
  total += price;
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const totalEl = document.getElementById('total');
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Rp ${item.price}`;
    cartItems.appendChild(li);
  });
  totalEl.textContent = total;
}

function checkout() {
  if (cart.length === 0) return alert("Keranjang kosong!");
  cart.forEach(item => {
    if (!salesData[item.name]) salesData[item.name] = { qty: 0, total: 0 };
    salesData[item.name].qty += 1;
    salesData[item.name].total += item.price;
  });
  alert("Transaksi berhasil!");
  cart = [];
  total = 0;
  updateCart();
  updateDataTable();
}

// Login Kasir
document.getElementById('loginBtn').addEventListener('click', () => {
  const pass = document.getElementById('password').value;
  if (pass === "KELOMPOK29A1") {
    document.getElementById('kasirContent').classList.remove('hidden');
    document.querySelector('.login').classList.add('hidden');
  } else {
    alert("Password salah!");
  }
});

// Data Penjualan
function updateDataTable() {
  const tbody = document.getElementById('dataTable');
  tbody.innerHTML = '';
  for (let product in salesData) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${product}</td><td>${salesData[product].qty}</td><td>Rp ${salesData[product].total}</td>`;
    tbody.appendChild(tr);
  }
}

document.getElementById('loginDataBtn').addEventListener('click', () => {
  const pass = document.getElementById('passwordData').value;
  if (pass === "KELOMPOK29A1") {
    document.getElementById('dataContent').classList.remove('hidden');
    document.getElementById('loginData').classList.add('hidden');
    updateDataTable();
  } else {
    alert("Password salah!");
  }
});

function clearData() {
  if(confirm("Hapus semua history penjualan?")) {
    salesData = {};
    updateDataTable();
  }
}

