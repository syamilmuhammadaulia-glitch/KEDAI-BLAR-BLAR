// Password proteksi halaman kasir & data penjualan
function checkPassword() {
  let input = prompt("Masukkan Password:");
  if (input !== "KELOMPOK29A1") {
    alert("Password salah!");
    window.location.href = "index.html";
  }
}

// Simpan data penjualan di localStorage
let penjualan = JSON.parse(localStorage.getItem("penjualan")) || [];

// Tambah transaksi ke data penjualan
function tambahPenjualan(item, harga) {
  penjualan.push({ item, harga });
  localStorage.setItem("penjualan", JSON.stringify(penjualan));
  alert("Pesanan ditambahkan!");
}

// Tampilkan data penjualan
function renderPenjualan() {
  let container = document.getElementById("dataPenjualan");
  if (!container) return;
  container.innerHTML = "";

  let total = 0;
  let count = {};

  penjualan.forEach(p => {
    total += p.harga;
    count[p.item] = (count[p.item] || 0) + 1;
  });

  for (let item in count) {
    let li = document.createElement("li");
    li.textContent = `${item}: ${count[item]} terjual`;
    container.appendChild(li);
  }

  let totalEl = document.createElement("p");
  totalEl.innerHTML = `<strong>Total: Rp ${total}</strong>`;
  container.appendChild(totalEl);
}

// Hapus history
function hapusHistory() {
  localStorage.removeItem("penjualan");
  penjualan = [];
  renderPenjualan();
}
