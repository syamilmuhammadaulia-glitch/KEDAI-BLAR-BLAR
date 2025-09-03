const PASSWORD = "KELOMPOK19A2";
let cart = [];
let sales = JSON.parse(localStorage.getItem("salesData")) || [];
let currentTarget = null;

// === Navigasi antar halaman ===
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const target = this.getAttribute("href").substring(1);

    if (document.getElementById(target).classList.contains("protected")) {
      currentTarget = target;
      document.getElementById("lockScreen").classList.remove("hide");
    } else {
      showSection(target);
    }
  });
});

// tampilkan home saat awal
showSection("home");

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hide"));
  document.getElementById(id).classList.remove("hide");

  if (id === "penjualan") renderSales();
  if (id === "kasir") renderCart();
}

// === Lock Screen ===
function unlock() {
  const pass = document.getElementById("passwordInput").value;
  if (pass === PASSWORD) {
    document.getElementById("lockScreen").classList.add("hide");
    showSection(currentTarget);
    document.getElementById("passwordInput").value = "";
  } else {
    alert("Password salah!");
  }
}

// === Kasir ===
function addToCart(item, price) {
  cart.push({ item, price });
  renderCart();
}

function addBundle() {
  cart.push({ item: "Paket Hemat", price: 18000 });
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((c, i) => {
    total += c.price;
    const li = document.createElement("li");
    li.textContent = `${c.item} - Rp${c.price}`;
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.style.background = "var(--danger)";
    btn.onclick = () => { cart.splice(i,1); renderCart(); };
    li.appendChild(btn);
    list.appendChild(li);
  });
  document.getElementById("total").textContent = "Total: Rp" + total;
}

function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }
  const total = cart.reduce((sum, c) => sum + c.price, 0);
  const record = { items: cart.map(c => c.item).join(", "), total, time: new Date().toLocaleString() };
  sales.push(record);
  localStorage.setItem("salesData", JSON.stringify(sales));
  cart = [];
  renderCart();
  alert("Pembayaran berhasil via QRIS!");
}

// === Data Penjualan ===
function renderSales() {
  const list = document.getElementById("sales");
  list.innerHTML = "";
  sales.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `${s.time} - ${s.items} - Rp${s.total}`;
    const btn = document.createElement("button");
    btn.textContent = "Hapus";
    btn.style.background = "var(--danger)";
    btn.onclick = () => { sales.splice(i,1); localStorage.setItem("salesData", JSON.stringify(sales)); renderSales(); };
    li.appendChild(btn);
    list.appendChild(li);
  });
}
