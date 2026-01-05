// ========================
// Daftar produk utama
// ========================
const produk = [
  { id: 'hoodie', nama: 'Hoodie', harga: 89000, gambar: 'hoodie.png' },
  { id: 'kaos', nama: 'Kaos', harga: 90000, gambar: 'kaos.png' },
  { id: 'tas', nama: 'Tas Bunga', harga: 70000, gambar: 'tas.png' },
  { id: 'sepatu', nama: 'sepatu', harga: 120000, gambar: 'sepatu.png' },
  { id: 'topi', nama: 'topi', harga: 40000, gambar: 'topi.png' },
  { id: 'celana', nama: 'celana', harga: 80000, gambar: 'celana.png' },
];

// ========================
// Data varian produk
// ========================
const produkVarian = {
  hoodie: {
    nama: "Hoodie",
    harga: 89000,
    varian: ["Kuning", "biru"],
    gambar: ["hoodie.png", "hoodie biru.png"]
  },
  kaos: {
    nama: "Kaos",
    harga: 90000,
    varian: ["krem", "Putih", "Hitam"],
    gambar: ["kaos.png", "kaos putih.png", "kaos hitam.png"]
  },
  sepatu: {
    nama: "Sepatu",
    harga: 120000,
    varian: ["Krem", "Merah", "Hitam"],
    gambar: ["sepatu.png", "sepatu merah.png", "sepatu hitam.png"]
  },
  topi: {
    nama: "topi",
    harga: 40000,
    varian: ["Krem", "Merah", "Hitam"],
    gambar: ["topi.png", "topi merah.png", "topi hitam.png"]
  },
  celana: {
    nama: "celana",
    harga: 109000,
    varian: ["Krem", "Putih"],
    gambar: ["celana.png", "celana putih.png"]
  }
};

// ========================
// Render produk ke beranda
// ========================
function renderProduk() {
  const container = document.getElementById('productList');
  if (!container) return;

  container.innerHTML = '';
  produk.forEach(item => {
    const punyaVarian = produkVarian.hasOwnProperty(item.id);
    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card product-card">
          <a href="varian.html?produk=${item.id}">
            <img src="${item.gambar}" class="card-img-top product-img" alt="${item.nama}">
          </a>
          <div class="card-body">
            <h5 class="card-title">${item.nama}</h5>
            <p class="card-text">Produk berkualitas dan cocok untuk semua suasana.</p>
            <p class="text-warning fw-bold">Rp${item.harga.toLocaleString()}</p>
            ${
              punyaVarian
              ? `<a href="varian.html?produk=${item.id}" class="btn btn-sm btn-outline-dark">Pilih Varian</a>`
              : `<button class="btn btn-sm btn-outline-dark" onclick="addToCart('${item.id}')">Tambah</button>`
            }
          </div>
        </div>
      </div>
    `;
  });
}

// ========================
// Tambahkan ke keranjang
// ========================
function addToCart(idProduk, varian = null) {
  const itemUtama = produk.find(p => p.id === idProduk) || produkVarian[idProduk];
  if (!itemUtama) return;

  const namaProduk = varian ? `${itemUtama.nama} - ${varian}` : itemUtama.nama;
  const harga = itemUtama.harga;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ nama: namaProduk, harga });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${namaProduk} ditambahkan ke keranjang.`);
}

// ========================
// Render halaman keranjang
// ========================
function renderCart() {
  const list = document.getElementById('cartItems');
  const total = document.getElementById('cartTotal');
  if (!list || !total) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  list.innerHTML = '';
  let sum = 0;

  if (cart.length === 0) {
    list.innerHTML = `<li class="list-group-item text-center text-muted">Keranjang Anda masih kosong.</li>`;
    total.textContent = '0';
    return;
  }

  cart.forEach(item => {
    sum += item.harga;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.nama}
        <span>Rp${item.harga.toLocaleString()}</span>
      </li>
    `;
  });

  total.textContent = sum.toLocaleString();
}

// ========================
// Proses checkout
// ========================
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert("Keranjang Anda kosong.");
    return;
  }

  localStorage.setItem("lastCheckout", JSON.stringify(cart));
  localStorage.removeItem("cart");
  alert("Terima kasih atas pesanan Anda!");
  window.location.href = "invoice.html";
}

// ========================
// Tampilkan invoice
// ========================
function renderInvoice() {
  const invoiceData = JSON.parse(localStorage.getItem('lastCheckout')) || [];
  const list = document.getElementById('invoiceItems');
  const total = document.getElementById('invoiceTotal');
  if (!list || !total) return;

  list.innerHTML = '';
  let sum = 0;

  if (invoiceData.length === 0) {
    list.innerHTML = `<li class="list-group-item text-center text-muted">Tidak ada data pembelian.</li>`;
    total.textContent = '0';
    return;
  }

  invoiceData.forEach(item => {
    sum += item.harga;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.nama}
        <span>Rp${item.harga.toLocaleString()}</span>
      </li>`;
  });

  total.textContent = sum.toLocaleString();
}

// ========================
// Download PDF invoice
// ========================
function downloadPDF() {
  const element = document.getElementById('invoiceContent');
  if (!element) return;

  const opt = {
    margin: 0.5,
    filename: 'invoice-garet-fashion.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
}

// ========================
// Render halaman produk-detail.html
// ========================
function renderProdukDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("produk");

  const container = document.getElementById("detailProduk");
  const judul = document.getElementById("judulProduk");

  if (!id || !produkVarian[id] || !container || !judul) return;

  const detail = produkVarian[id];
  judul.textContent = detail.nama;

  detail.varian.forEach((warna, i) => {
    container.innerHTML += `
      <div class="col-md-4 text-center mb-4">
        <img src="${detail.gambar[i]}" alt="${warna}" class="img-fluid rounded mb-2">
        <h5>${detail.nama} - ${warna}</h5>
        <p class="text-warning">Rp${detail.harga.toLocaleString()}</p>
        <button class="btn btn-outline-dark btn-sm" onclick="addToCart('${id}', '${warna}')">Tambah ke Keranjang</button>
      </div>
    `;
  });
}
