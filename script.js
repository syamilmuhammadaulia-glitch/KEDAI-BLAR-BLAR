const PASSWORD = "KELOMPOK29A1";
let cart = [];
let sales = JSON.parse(localStorage.getItem("salesData")) || [];

// === Navigasi antar halaman ===
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const target = this.getAttribute("href").substring(1);
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
    document.getElementById(target).classList.remove("hide");
  });
});

// tampilkan home saat awal
document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
document.getElementById("home").classList.remove("hide");

const PASSWORD = "1234";

// === EVENT LISTENER ===
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const qrisBox = document.getElementById("qris-box");
  const qrisDoneBtn = document.getElementById("qris-done-btn");

  // Event: pilih metode pembayaran
  document.querySelectorAll("#kasir input[name=payment]").forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "QRIS") {
        qrisBox.classList.remove("hide");
      } else {
        qrisBox.classList.add("hide");
      }
    });
  });

  // Event: checkout
  checkoutBtn.addEventListener("click", () => {
    const items = [];
    let total = 0;

    document.querySelectorAll("#kasir input[type=checkbox]:checked").forEach(cb => {
      items.push({ name: cb.value });
      total += Number(cb.dataset.price);
    });

    const paymentMethod = document.querySelector("#kasir input[name=payment]:checked");
    if (!paymentMethod) {
      alert("Pilih metode pembayaran!");
      return;
    }

    if (items.length === 0) {
      alert("Pilih minimal 1 produk!");
      return;
    }

    // kalau QRIS harus klik "sudah bayar"
    if (paymentMethod.value === "QRIS") {
      alert("Silakan scan QR dulu, lalu klik 'Saya sudah bayar'.");
      return;
    }

    simpanTransaksi(items, total, paymentMethod.value);
    alert("Transaksi berhasil disimpan!");
  });

  // Event: QRIS selesai bayar
  qrisDoneBtn.addEventListener("click", () => {
    const items = [];
    let total = 0;

    document.querySelectorAll("#kasir input[type=checkbox]:checked").forEach(cb => {
      items.push({ name: cb.value });
      total += Number(cb.dataset.price);
    });

    if (items.length === 0) {
      alert("Pilih minimal 1 produk!");
      return;
    }

    simpanTransaksi(items, total, "QRIS");
    alert("Transaksi QRIS berhasil disimpan!");
    qrisBox.classList.add("hide");
    document.querySelectorAll("#kasir input[type=checkbox]").forEach(cb => cb.checked = false);
  });

  // Unlock Data Penjualan
  document.getElementById("sales-unlock-btn").addEventListener("click", unlockPenjualan);
  document.getElementById("clear-sales-btn").addEventListener("click", clearAllSales);
});

// === Simpan Transaksi ===
function simpanTransaksi(items, total, payment) {
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  sales.push({
    date: new Date().toLocaleString("id-ID"),
    items: items,
    total: total,
    payment: payment
  });
  localStorage.setItem("salesData", JSON.stringify(sales));
}

// === Unlock Data Penjualan ===
function unlockPenjualan() {
  const pass = document.getElementById("sales-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("sales-lock").classList.add("hide");
    document.getElementById("sales-content").classList.remove("hide");
    renderSalesData();
  } else {
    alert("Password salah!");
  }
}

// === Render Data ===
function renderSalesData() {
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  const salesListEl = document.getElementById("salesList");
  salesListEl.innerHTML = "";
  let total = 0;

  sales.forEach((sale, index) => {
    total += sale.total;
    const div = document.createElement("div");
    div.className = "sale-item";
    const itemsText = sale.items.map(i => i.name).join(", ");
    div.innerHTML = `
      <span>${sale.date} - ${itemsText} - Rp ${formatRupiah(sale.total)} (${sale.payment})</span>
      <button onclick="removeSale(${index})">Hapus</button>
    `;
    salesListEl.appendChild(div);
  });

  document.getElementById("salesTotal").innerText = formatRupiah(total);
}

// === Hapus Satu Data ===
function removeSale(index) {
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  sales.splice(index, 1);
  localStorage.setItem("salesData", JSON.stringify(sales));
  renderSalesData();
}

// === Hapus Semua Data ===
function clearAllSales() {
  if (confirm("Yakin mau hapus semua data penjualan?")) {
    localStorage.setItem("salesData", JSON.stringify([]));
    renderSalesData();
  }
}

// === Format Rupiah ===
function formatRupiah(n) {
  return Number(n).toLocaleString("id-ID");
}
// === UNLOCK ===
function unlockPenjualan() {
  const pass = document.getElementById("sales-pass").value;
  if (pass === PASSWORD) {
    document.getElementById("sales-lock").classList.add("hide");
    document.getElementById("sales-content").classList.remove("hide");
    renderSalesData();
  } else {
    alert("Password salah!");
  }
}

// === RENDER LIST DATA ===
function renderSalesData() {
  const salesListEl = document.getElementById("salesList");
  salesListEl.innerHTML = "";

  // Selalu muat terbaru dari localStorage
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  let total = 0;

  sales.forEach((sale, index) => {
    total += Number(sale.total) || 0;

    const div = document.createElement("div");
    div.className = "sale-item";

    const itemsText = Array.isArray(sale.items)
      ? sale.items.map(i => (i?.name ?? i)).join(", ")
      : "-";

    div.innerHTML = `
      <span>${sale.date ?? "-"} - ${itemsText} - Rp ${formatRupiah(sale.total)} (${sale.payment ?? "-"})</span>
      <button onclick="removeSale(${index})">Hapus</button>
    `;
    salesListEl.appendChild(div);
  });

  document.getElementById("salesTotal").innerText = formatRupiah(total);
}

// === HAPUS SATU DATA ===
function removeSale(index) {
  const sales = JSON.parse(localStorage.getItem("salesData")) || [];
  sales.splice(index, 1);
  localStorage.setItem("salesData", JSON.stringify(sales));
  renderSalesData();
}

// === HAPUS SEMUA DATA ===
function clearAllSales() {
  if (confirm("Yakin mau hapus semua data penjualan?")) {
    localStorage.setItem("salesData", JSON.stringify([]));
    renderSalesData();
  }
}

// === UTIL: FORMAT RUPIAH ===
function formatRupiah(nominal) {
  const n = Number(nominal) || 0;
  return n.toLocaleString("id-ID");
}
</script>
{
  date: "03/09/2025 16.40.00",
  items: [{ name: "Bakso" }, { name: "Es Teh" }],
  total: 15000,
  payment: "QRIS"
}

// === QRIS toggle ===
document.getElementById("payment").addEventListener("change", function() {
  if (this.value === "qris") {
    document.getElementById("qris-box").classList.remove("hide");
  } else {
    document.getElementById("qris-box").classList.add("hide");
  }
});
function hideAllSections() {
  document.querySelectorAll('section').forEach(s => s.classList.add('hide'));
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const id = this.getAttribute('href').substring(1);
    if (document.getElementById(id)) {
      e.preventDefault();
      hideAllSections();
      document.getElementById(id).classList.remove('hide');
    }
  });
});







