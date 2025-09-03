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

