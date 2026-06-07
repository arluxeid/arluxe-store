 const adminAccount = {
  email: "admin@arluxe.com",
  password: "admin123",
  role: "admin"
};

function registerUser() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("reg-email");
  const passwordInput = document.getElementById("reg-password");
  const msg = document.getElementById("register-msg");

  if (!nameInput || !emailInput || !passwordInput || !msg) {
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    msg.style.color = "crimson";
    msg.textContent = "Please fill in all fields.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some((user) => user.email === email);

  if (emailExists || email === adminAccount.email) {
    msg.style.color = "crimson";
    msg.textContent = "Email is already registered.";
    return;
  }

  const newUser = {
    name: name,
    email: email,
    password: password,
    role: "user"
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  msg.style.color = "green";
  msg.textContent = "Registration successful!";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const msg = document.getElementById("msg");

  if (!emailInput || !passwordInput || !msg) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    msg.style.color = "crimson";
    msg.textContent = "Please fill in all fields.";
    return;
  }

  if (email === adminAccount.email && password === adminAccount.password) {
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        email: adminAccount.email,
        role: adminAccount.role
      })
    );

    msg.style.color = "green";
    msg.textContent = "Admin login successful!";

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);

    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (foundUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    msg.style.color = "green";
    msg.textContent = "Login successful!";

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  } else {
    msg.style.color = "crimson";
    msg.textContent = "Invalid email or password.";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function addToCart(nama, harga, gambar) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const produk = {
    nama: nama,
    harga: harga,
    gambar: gambar
  };

  cart.push(produk);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(nama + " berhasil ditambahkan ke cart!");
  window.location.href = "cart.html";
}

let selectedProduct = null;

function showModal(nama, harga, gambar, bahan, ukuran, deskripsi) {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  modal.style.display = "flex";

  selectedProduct = {
    nama: nama,
    harga: Number(harga),
    gambar: gambar,
    qty: 1
  };

  document.getElementById("modalImg").src = gambar;
  document.getElementById("modalNama").innerText = nama;
  document.getElementById("modalHarga").innerText =
    "Harga: Rp" + Number(harga).toLocaleString("id-ID");
  document.getElementById("modalBahan").innerText = "Bahan: " + bahan;
  document.getElementById("modalUkuran").innerText = "Ukuran: " + ukuran;
  document.getElementById("modalDeskripsi").innerText = "Deskripsi: " + deskripsi;
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function addToCartFromModal() {
  alert("TEZ");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!selectedProduct) {
    alert("Produk belum dipilih.");
    return;
  }

  const existing = cart.find(item => item.nama === selectedProduct.nama);

  if (existing) {
    existing.qty = (Number(existing.qty) || 1) + 1;
  } else {
    cart.push(selectedProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "cart.html";
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  const totalText = document.getElementById("totalHarga");

  if (!container || !totalText) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const harga = Number(item.harga) || 0;
    const qty = Number(item.qty) || 1;

    total += harga * qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.gambar}" alt="${item.nama}">
        <div>
          <h4>${item.nama}</h4>
          <p>Rp${harga.toLocaleString("id-ID")}</p>

          <div>
            <button onclick="decreaseQty(${index})">-</button>
            <span>${qty}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>

          <button onclick="removeItem(${index})">Hapus</button>
        </div>
      </div>
    `;
  });

  totalText.innerText = "Total: Rp" + total.toLocaleString("id-ID");
}

function increaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].qty = (Number(cart[index].qty) || 1) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function decreaseQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const currentQty = Number(cart[index].qty) || 1;

  if (currentQty > 1) {
    cart[index].qty = currentQty - 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function ToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  window.location.href = "checkout.html";
}

function getCartSubtotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  cart.forEach((item) => {
    const harga = Number(item.harga) || 0;
    const qty = Number(item.qty) || 1;
    subtotal += harga * qty;
  });

  return subtotal;
}

function updateCheckoutTotal() {
  const pengiriman = document.getElementById("pengiriman");
  const subtotalText = document.getElementById("subtotalText");
  const ongkirText = document.getElementById("ongkirText");
  const grandTotalText = document.getElementById("grandTotalText");

  if (!pengiriman || !subtotalText || !ongkirText || !grandTotalText) return;

  const subtotal = getCartSubtotal();
  const ongkir = Number(pengiriman.value) || 0;
  const total = subtotal + ongkir;

  subtotalText.innerText = "Subtotal: Rp" + subtotal.toLocaleString("id-ID");
  ongkirText.innerText = "Ongkir: Rp" + ongkir.toLocaleString("id-ID");
  grandTotalText.innerText = "Total: Rp" + total.toLocaleString("id-ID");
}

function buatPesanan() {

  const namaPenerima =
  document.getElementById("namaPenerima").value;

  const noHp =
  document.getElementById("noHp").value;

  const alamat =
  document.getElementById("alamat").value;

  const pembayaran =
  document.getElementById("pembayaran").value;

  if (
    namaPenerima.trim() === "" ||
    noHp.trim() === "" ||
    alamat.trim() === ""
  ) {
    alert("Lengkapi data checkout terlebih dahulu!");
    return;
  }

  const cart =
  JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }
  const subtotal = getCartSubtotal();

const ongkir =
Number(document.getElementById("pengiriman").value) || 0;

const total = subtotal + ongkir;

const pesananBaru = {
  namaPenerima,
  noHp,
  alamat,
  pengiriman: document.getElementById("pengiriman").selectedOptions[0].text,
  pembayaran,
  items: cart,
  subtotal,
  ongkir,
  total,
  status: "Sedang Dikemas"
};

localStorage.setItem(
  "pesanan",
  JSON.stringify(pesananBaru)
);

  let pesan =
`Halo Admin Arluxe,%0A%0ASaya ingin konfirmasi pesanan:%0A%0A`;

  cart.forEach((item) => {
    pesan +=
`${item.nama} x${item.qty}%0A`;
  });

  pesan +=
`%0ANama: ${namaPenerima}%0A`;

  pesan +=
`No HP: ${noHp}%0A`;

  pesan +=
`Alamat: ${alamat}%0A`;

  pesan +=
`Pembayaran: ${pembayaran}`;

  let nomorAdmin = "6281399758850";

  window.open(
   'https://wa.me/6281399758850'
  );
}
function loadPesanan() {
  const pesanan = JSON.parse(localStorage.getItem("pesanan"));
  const pesananKosong = document.getElementById("pesananKosong");
  const pesananContent = document.getElementById("pesananContent");

  if (!pesananKosong || !pesananContent) return;

  if (!pesanan) {
    pesananKosong.style.display = "block";
    pesananContent.style.display = "none";
    return;
  }

  pesananKosong.style.display = "none";
  pesananContent.style.display = "block";

  document.getElementById("pesananNama").innerText =
    "Nama Penerima: " + pesanan.namaPenerima;

  document.getElementById("pesananNoHp").innerText =
    "No. HP: " + pesanan.noHp;

  document.getElementById("pesananAlamat").innerText =
    "Alamat: " + pesanan.alamat;

  document.getElementById("pesananPengiriman").innerText =
    "Jasa Pengiriman: " + pesanan.pengiriman;

  document.getElementById("pesananPembayaran").innerText =
    "Metode Pembayaran: " + pesanan.pembayaran;

  document.getElementById("pesananStatus").innerHTML =
    `Status: <span class="status-badge">${pesanan.status}</span>`;

  document.getElementById("pesananSubtotal").innerText =
    "Subtotal: Rp" + Number(pesanan.subtotal).toLocaleString("id-ID");

  document.getElementById("pesananOngkir").innerText =
    "Ongkir: Rp" + Number(pesanan.ongkir).toLocaleString("id-ID");

  document.getElementById("pesananTotal").innerText =
    "Total: Rp" + Number(pesanan.total).toLocaleString("id-ID");

  const pesananItems = document.getElementById("pesananItems");
  if (!pesananItems) return;

  pesananItems.innerHTML = "";

  pesanan.items.forEach((item) => {
    const harga = Number(item.harga) || 0;
    const qty = Number(item.qty) || 1;

    pesananItems.innerHTML += `
      <div class="pesanan-item">
        <img src="${item.gambar}" alt="${item.nama}">
        <div>
          <h4>${item.nama}</h4>
          <p>Rp${harga.toLocaleString("id-ID")} x ${qty}</p>
        </div>
      </div>
    `;
  });

  updateStatusTracker(pesanan.status);
}
function updateStatusTracker(status) {
  const stepDikemas = document.getElementById("stepDikemas");
  const stepDiantar = document.getElementById("stepDiantar");
  const stepTiba = document.getElementById("stepTiba");

  if (!stepDikemas || !stepDiantar || !stepTiba) return;

  stepDikemas.classList.remove("active");
  stepDiantar.classList.remove("active");
  stepTiba.classList.remove("active");

  if (status === "Sedang Dikemas") {
    stepDikemas.classList.add("active");
  } else if (status === "Sedang Diantar") {
    stepDikemas.classList.add("active");
    stepDiantar.classList.add("active");
  } else if (status === "Pesanan Tiba") {
    stepDikemas.classList.add("active");
    stepDiantar.classList.add("active");
    stepTiba.classList.add("active");
  }
}
function ubahStatusPesanan(statusBaru) {
  const pesanan = JSON.parse(localStorage.getItem("pesanan"));
  if (!pesanan) return;

  pesanan.status = statusBaru;
  localStorage.setItem("pesanan", JSON.stringify(pesanan));
  loadPesanan();
  loadAdminPesanan();
}


window.onload = function (){
  loadCart();
  updateCheckoutTotal();
  loadPesanan();
};
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileRole = document.getElementById("profileRole");

  if (!profileName || !profileEmail || !profileRole) return;

  if (!user) {
    profileName.innerText = "Guest";
    profileEmail.innerText = "Belum login";
    profileRole.innerText = "Role: -";
    return;
  }

  profileName.innerText = user.name || "user";
  profileEmail.innerText = user.email || "-";
  profileRole.innerText = "Role: " + (user.role || "user");
}

window.onload = function (){
  loadCart();
  updateCheckoutTotal();
  loadPesanan();
  loadProfile();
};

function ToOrders() {
  window.location.href = "pesanan.html";
}

function ToAlamat() {
  window.location.href = "alamat.html";
}

function ToSettings() {
  window.location.href = "settings.html";
}
console.log("SCRIPT KELOAD");
function simpanAlamat() {
  const namaInput = document.getElementById("namaAlamat");
  const noHpInput = document.getElementById("noHpAlamat");
  const alamatInput = document.getElementById("alamatLengkap");

  if (!namaInput || !noHpInput || !alamatInput) return;

  const dataAlamat = {
    nama: namaInput.value,
    noHp: noHpInput.value,
    alamat: alamatInput.value
  };

  localStorage.setItem("alamatUser", JSON.stringify(dataAlamat));
  alert("Alamat berhasil disimpan!");
}

function loadAlamat() {
  const data = JSON.parse(localStorage.getItem("alamatUser"));

  const namaInput = document.getElementById("namaAlamat");
  const noHpInput = document.getElementById("noHpAlamat");
  const alamatInput = document.getElementById("alamatLengkap");

  if (!namaInput || !noHpInput || !alamatInput || !data) return;

  namaInput.value = data.nama || "";
  noHpInput.value = data.noHp || "";
  alamatInput.value = data.alamat || "";
}

function updateNama() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  const namaUser = document.getElementById("namaUser");

  if (!user || !namaUser) return;

  user.name = namaUser.value;
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  alert("Nama berhasil diupdate!");
}

window.onload = function (){
  loadCart();
  updateCheckoutTotal();
  loadPesanan();
  loadProfile();
  loadAlamat();
};


function loadSettings() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const namaUser = document.getElementById("namaUser");

  if (!user || !namaUser) return;

  namaUser.value = user.name || "";
}

function updateNama() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  const namaUser = document.getElementById("namaUser");

  if (!user || !namaUser) {
    alert("Data user atau input tidak ditemukan!");
    return;
  }

  if (namaUser.value.trim() === "") {
    alert("Nama tidak boleh kosong!");
    return;
  }

  user.name = namaUser.value.trim();
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  alert("Nama berhasil diupdate!");
}
window.onload = function () {
  loadCart();
  updateCheckoutTotal();
  loadPesanan();
  loadProfile();
  loadAlamat();
  loadSettings(); // 
};

function loadAdminPesanan() {
  const pesanan = JSON.parse(localStorage.getItem("pesanan"));
  const adminKosong = document.getElementById("adminKosong");
  const adminPesanan = document.getElementById("adminPesanan");

  if (!adminKosong || !adminPesanan) return;

  if (!pesanan) {
    adminKosong.style.display = "block";
    adminPesanan.style.display = "none";
    return;
  }

  adminKosong.style.display = "none";
  adminPesanan.style.display = "block";

  document.getElementById("adminNama").innerText =
    "Nama Penerima: " + pesanan.namaPenerima;

  document.getElementById("adminNoHp").innerText =
    "No. HP: " + pesanan.noHp;

  document.getElementById("adminAlamat").innerText =
    "Alamat: " + pesanan.alamat;

  document.getElementById("adminPengiriman").innerText =
    "Jasa Pengiriman: " + pesanan.pengiriman;

  document.getElementById("adminPembayaran").innerText =
    "Metode Pembayaran: " + pesanan.pembayaran;

  document.getElementById("adminStatus").innerHTML =
    `Status: <span class="status-badge">${pesanan.status}</span>`;

  document.getElementById("adminSubtotal").innerText =
    "Subtotal: Rp" + Number(pesanan.subtotal).toLocaleString("id-ID");

  document.getElementById("adminOngkir").innerText =
    "Ongkir: Rp" + Number(pesanan.ongkir).toLocaleString("id-ID");

  document.getElementById("adminTotal").innerText =
    "Total: Rp" + Number(pesanan.total).toLocaleString("id-ID");

  const adminItems = document.getElementById("adminItems");
  adminItems.innerHTML = "";

  pesanan.items.forEach((item) => {
    const harga = Number(item.harga) || 0;
    const qty = Number(item.qty) || 1;

    adminItems.innerHTML += `
      <div class="admin-item">
        <img src="${item.gambar}" alt="${item.nama}">
        <div>
          <h4>${item.nama}</h4>
          <p>Rp${harga.toLocaleString("id-ID")} x ${qty}</p>
        </div>
      </div>
    `;
  });
}
function ToProductPage(){
  window.location.href = "produk.html";
}
window.onload = function (){
  loadCart();
  updateCheckoutTotal();
  loadPesanan();
  loadProfile();
  loadAlamat();
  loadSettings();
  loadAdminPesanan();
};

/* ========================= */
/* VIRTUAL TRY ON CAMERA */
/* ========================= */

/* ========================= */
/* VIRTUAL TRY ON */
/* ========================= */

async function startCamera() {

  const video = document.getElementById("camera");

  if (!video) return;

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;

  } catch (error) {

    alert("Kamera tidak bisa diakses.");
    console.log(error);

  }
}

function changeHijabColor(image) {

  const overlay = document.getElementById("hijabOverlay");

  if (!overlay) return;

  overlay.src = image;
}

function checkoutWA() {

  let phone = "6281399758850";

  let message =
  "Halo Admin Arluxe,Saya ingin konfirmasi pesanan saya.";

  let url = "https://wa.me/081399758850" + phone + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}

function pilihProduk(gambar) {

  localStorage.setItem("gambarProduk", gambar);

  window.location.href = "produk.html";
}

function addToCartDetail() {

  const gambar =
  localStorage.getItem("gambarProduk");

  const produk = {
    nama: "Viscose Arluxe",
    harga: 49000,
    gambar: gambar,
    qty: 1
  };

  let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(produk);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Produk berhasil ditambahkan ke keranjang!");
  window.location.href = "cart.html";
}
