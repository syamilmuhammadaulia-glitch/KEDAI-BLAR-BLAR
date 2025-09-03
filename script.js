const PASSWORD = "KELOMPOK29A1";

// handler navigasi
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    showSection(targetId);
  });
});

function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hide'));
  document.getElementById(id).classList.remove('hide');
}

// unlock kasir
document.getElementById('kasir-enter').addEventListener('click', () => {
  const pass = document.getElementById('kasir-pass').value;
  if (pass === PASSWORD) {
    document.getElementById('kasir-lock').classList.add('hide');
    document.getElementById('kasir-content').classList.remove('hide');
  } else alert('Password salah!');
});

// unlock penjualan
document.getElementById('sales-enter').addEventListener('click', () => {
  const pass = document.getElementById('sales-pass').value;
  if (pass === PASSWORD) {
    document.getElementById('sales-lock').classList.add('hide');
    document.getElementById('sales-content').classList.remove('hide');
    renderSales(); // buat fungsi rekap penjualan
  } else alert('Password salah!');
});

// optional: renderSales(), clearSales(), addItem(), checkout() etc. sesuai fitur yang lo butuh.
