// =============================
// PASSWORD PROTECTION
// =============================
function checkPassword(pageId) {
  const password = prompt("Masukkan password untuk membuka halaman ini:");
  if (password === "KELOMPOK29A1") {
    showPage(pageId);
  } else {
    alert("❌ Password salah!");
  }
}

// =============================
// NAVIGASI HALAMAN
// =============================
function showPage(pageId) {
  // sembunyikan semua halaman
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  // tampilkan halaman yang dipilih
  document.getElementById(pageId).style.display = "block";
}

// =============================
// MESIN KASIR
// =============================
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
  const cartList = document.getElementById("cart-list");
  const totalDisplay = document.getElementById("total");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - Rp ${item.price}`;
    // tombol hapus item
    let delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      cart.splice(index, 1);
      renderCart();
    };
    li.appendChild(delBtn);
    cartList.appendChild(li);

    total += item.price;
  });

  totalDisplay.textContent = "Rp " + total;
}

function checkout(method) {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  // update salesData
  cart.forEach(item => {
    if (item.key && salesData[item.key] !== undefined) {
      salesData[item.key] += 1;
    }
  });
  salesData.totalRevenue += total;

  // simpan ke localStorage
  localStorage.setItem("salesData", JSON.stringify(salesData));

  // reset keranjang
  cart = [];
  renderCart();

  if (method === "tunai") {
    alert("Transaksi berhasil ✅ Dibayar Tunai Rp " + total);
  } else if (method === "qris") {
    alert("Transaksi berhasil ✅ Dibayar via QRIS Rp " + total);
    document.getElementById("qrisModal").style.display = "block";
  }
}

// =============================
// DATA PENJUALAN
// =============================
function renderSalesData() {
  const dataDiv = document.getElementById("sales-data");
  dataDiv.innerHTML = `
    <p>Bakso Terjual: ${salesData.bakso}</p>
    <p>Tape Ketan Hitam Terjual: ${salesData.tape}</p>
    <p>Tape Ketan Hitam Promo (2pcs): ${salesData.tapePromo}</p>
    <p>Es Teh Terjual: ${salesData.esteh}</p>
    <p>Paket Bundling Bakso + Es Teh: ${salesData.bundling}</p>
    <p>Jasuke Terjual: ${salesData.jasuke}</p>
    <h3>Total Pendapatan: Rp ${salesData.totalRevenue}</h3>
  `;
}

function clearSalesData() {
  if (confirm("Apakah yakin ingin menghapus semua data penjualan?")) {
    salesData = {
      bakso: 0,
      tape: 0,
      tapePromo: 0,
      esteh: 0,
      bundling: 0,
      jasuke: 0,
      totalRevenue: 0
    };
    localStorage.setItem("salesData", JSON.stringify(salesData));
    renderSalesData();
    alert("Data penjualan berhasil direset!");
  }
}

// =============================
// MODAL QRIS
// =============================
function closeQris() {
  document.getElementById("qrisModal").style.display = "none";
}

// =============================
// SAAT LOAD AWAL
// =============================
window.onload = function () {
  // default halaman utama
  showPage("home");
  renderCart();
  renderSalesData();
};

