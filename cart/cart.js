document.addEventListener("DOMContentLoaded", () => {
  // Elemen-elemen UI
  const checkoutBtn = document.querySelector(".checkout-btn");
  const selectAll = document.getElementById("select-all");
  const cartCount = document.querySelector(".cart-count");
  const hamburger = document.querySelector(".hamburger");
  const navContainer = document.querySelector(".nav-container");
  const cartSection = document.querySelector(".cart-section");
  const cartContainer = document.querySelector(".cart-container");
  const navUl = document.querySelector("nav ul");

  //Hamburger Menu Toggle
  hamburger.addEventListener("click", () => {
    navUl.classList.toggle("active");
    hamburger.textContent = navUl.classList.contains("active") ? "✕" : "☰";
  });

  // Close menu when clicking nav link
  navUl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navUl.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });

  // Minimum pesanan
  const MIN_ORDER = 1;

  // Fungsi untuk memformat angka sebagai mata uang Rupiah
  function formatRupiah(angka) {
    return `Rp ${Number(angka).toLocaleString("id-ID")}`;
  }

  // Fungsi untuk update jumlah minimum yang diperlukan
  function updateQtyLimit(qtyInput, qtyLimit) {
    const qty = parseInt(qtyInput.value) || 1;
    const remaining = Math.max(0, MIN_ORDER - qty);

    if (remaining === 0) {
      qtyLimit.textContent = "";
    } else {
      qtyLimit.textContent = `${remaining} lagi diperlukan untuk checkout`;
    }
  }

  // Fungsi untuk update tampilan harga
  function updateItemPrice(qty, price, itemPriceElement) {
    const total = qty * price;
    itemPriceElement.textContent = formatRupiah(total);

    // Tambahkan efek highlight
    itemPriceElement.classList.add("highlight");
    setTimeout(() => {
      itemPriceElement.classList.remove("highlight");
    }, 1000);

    return total;
  }

  // Fungsi untuk update total harga di ringkasan
  function updateSummaryPrices() {
    // Periksa apakah localStorage memiliki data keranjang
    const cartRaw = localStorage.getItem("cart");
    console.log("Data keranjang mentah dari localStorage:", cartRaw);

    if (!cartRaw) {
      console.error("Tidak ada data keranjang di localStorage");
      renderEmptyCart();
      return;
    }

    let cart = [];
    try {
      cart = JSON.parse(cartRaw) || [];
    } catch (e) {
      console.error("Gagal mem-parsing data keranjang:", e);
      cart = [];
    }

    console.log("Isi keranjang yang diparsing:", cart);

    if (!Array.isArray(cart) || cart.length === 0) {
      console.log("Keranjang kosong atau data tidak valid");
      renderEmptyCart();
      return;
    }

    let subtotal = 0;

    // Hitung subtotal dari semua item
    cart.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        console.error(`Item ${index} tidak valid:`, item);
        return;
      }

      // Konversi harga ke number
      let itemPrice = 0;
      if (typeof item.price === "number") {
        itemPrice = item.price;
      } else if (typeof item.price === "string") {
        // Coba parse dari string (contoh: "Rp 150.000" atau "150000")
        itemPrice = Number(item.price.replace(/[^\d]/g, ""));
      }

      const itemQty = Number(item.quantity) || 1;

      console.log(
        `Item ${index}: ${item.name}, Harga: ${itemPrice}, Jumlah: ${itemQty}`
      );

      if (
        !isNaN(itemPrice) &&
        itemPrice > 0 &&
        !isNaN(itemQty) &&
        itemQty > 0
      ) {
        const itemTotal = itemPrice * itemQty;
        subtotal += itemTotal;
        console.log(`Total Item ${index}: ${itemTotal}`);
      } else {
        console.error(
          `Harga atau jumlah tidak valid untuk item ${index}:`,
          item
        );
      }
    });

    console.log("Subtotal yang dihitung:", subtotal);

    // Peringatkan jika subtotal 0 tetapi ada barang
    if (subtotal === 0 && cart.length > 0) {
      console.warn(
        "Subtotal adalah 0 meskipun ada barang di keranjang. Periksa data harga di localStorage:",
        cart
      );
    }

    // Update subtotal barang - PERBAIKAN AKSES ELEMEN
    const summarySubtotal = document.querySelector(
      '[data-testid="subtotal-value"]'
    );
    if (summarySubtotal) {
      summarySubtotal.textContent = formatRupiah(subtotal);
      console.log("Subtotal berhasil diperbarui:", summarySubtotal.textContent);
    } else {
      console.error("Elemen subtotal tidak ditemukan");
    }

    // Update total akhir - PERBAIKAN AKSES ELEMEN
    const summaryTotal = document.querySelector(
      ".summary-total div:last-child"
    );
    if (summaryTotal) {
      summaryTotal.textContent = formatRupiah(subtotal);
      console.log("Total berhasil diperbarui:", summaryTotal.textContent);
    } else {
      console.error("Elemen total ringkasan tidak ditemukan");
    }

    // Update jumlah item di ringkasan
    const summaryTitle = document.querySelector(".summary-title");
    const totalItems = cart.length;
    if (summaryTitle) {
      summaryTitle.textContent = `Ringkasan pesanan (${totalItems} variasi)`;
    }
  }

  // Fungsi untuk menghapus item dari keranjang
  function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Hapus item dari array
    cart.splice(index, 1);

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Refresh tampilan keranjang
    renderCart();
  }

  // Fungsi untuk memperbarui jumlah item
  function updateItemQuantity(index, newQty) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Update jumlah
    cart[index].quantity = newQty;

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update tampilan
    updateSummaryPrices();
    updateCartCount();
  }

  // Fungsi untuk update jumlah item di ikon keranjang
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    );
    cartCount.textContent = totalItems;
  }

  // Fungsi untuk merender item keranjang
  function renderCartItem(item, index) {
    // Konversi harga ke number dengan metode yang lebih kuat
    let itemPrice = 0;
    if (typeof item.price === "number") {
      itemPrice = item.price;
    } else if (typeof item.price === "string") {
      // Coba parse dari string (contoh: "Rp 150.000" atau "150000")
      itemPrice = Number(item.price.replace(/[^\d]/g, ""));
    }

    if (isNaN(itemPrice) || itemPrice <= 0) {
      console.error(`Harga tidak valid untuk item ${index}:`, item);
      return null;
    }

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.dataset.index = index;

    cartItem.innerHTML = `
      <input type="checkbox" class="checkbox" checked />
      <img src="${item.image}" alt="${item.name}" class="product-image" />
      <div class="product-info">
        <h3 class="product-title">${item.name}</h3>
        <div class="product-meta"><i class="fas fa-fire"></i> Produk terlaris</div>
        <div class="money-back"><i class="fas fa-shield-alt"></i> Jaminan uang kembali</div>
        <div class="delivery-info"><i class="fas fa-truck"></i> Pengiriman estimasi 3-5 hari</div>
        <div class="min-order">Min. pesanan: ${MIN_ORDER} buah</div>
        <div class="price-per-piece">${formatRupiah(itemPrice)} / buah</div>
        <div class="quantity-selector">
          <div class="qty-btn decrease-btn">−</div>
          <input type="text" class="qty-input" value="${item.quantity || 1}" />
          <div class="qty-btn increase-btn">+</div>
          <div class="qty-limit">${
            MIN_ORDER - (item.quantity || 1) > 0
              ? `${
                  MIN_ORDER - (item.quantity || 1)
                } lagi diperlukan untuk checkout`
              : ""
          }</div>
        </div>
      </div>
      <div class="delete-btn"><i class="fas fa-trash"></i></div>
      <div class="item-price">${formatRupiah(
        itemPrice * (item.quantity || 1)
      )}</div>
    `;

    return cartItem;
  }

  // Fungsi untuk merender baris supplier
  function renderSupplierRow(supplierName) {
    const supplierRow = document.createElement("div");
    supplierRow.className = "supplier-row";

    supplierRow.innerHTML = `
      <input type="checkbox" class="checkbox" checked />
      <div class="supplier-name">${supplierName}</div>
    `;

    return supplierRow;
  }

  // Fungsi untuk merender keranjang kosong
  function renderEmptyCart() {
    cartSection.innerHTML = `
      <div class="cart-item" style="justify-content: center; padding: 2rem;">
        <p>Keranjang belanja Anda kosong</p>
      </div>
    `;

    // Update ringkasan
    const summaryTitle = document.querySelector(".summary-title");
    const summarySubtotal = document.querySelector(
      '[data-testid="subtotal-value"]'
    );
    const summaryTotal = document.querySelector(
      ".summary-total div:last-child"
    );

    if (summaryTitle) {
      summaryTitle.textContent = "Ringkasan pesanan (0 variasi)";
    }
    if (summarySubtotal) {
      summarySubtotal.textContent = formatRupiah(0);
      console.log("Subtotal diatur ke 0 untuk keranjang kosong");
    }
    if (summaryTotal) {
      summaryTotal.textContent = formatRupiah(0);
    }

    // Update jumlah di ikon keranjang
    cartCount.textContent = "0";
  }

  // Fungsi untuk memperbarui struktur ringkasan
  function updateSummaryStructure() {
    const summaryContainer = document.querySelector(".cart-summary");

    // Pastikan container ringkasan ditemukan
    if (!summaryContainer) {
      console.error("Container ringkasan tidak ditemukan");
      return;
    }

    console.log("Memperbarui struktur ringkasan");

    // Cari elemen yang ada
    const existingSummary = document.querySelector(
      '[data-testid="subtotal-value"]'
    );
    const existingShipping = document.querySelector(
      ".summary-row:nth-child(2) .summary-value"
    );

    // Jika struktur ringkasan tidak lengkap, buat ulang
    if (!existingSummary || !existingShipping) {
      console.log("Struktur ringkasan tidak lengkap, membuat ulang");

      // Simpan elemen yang ada
      const summaryTitle = summaryContainer
        .querySelector(".summary-title")
        ?.cloneNode(true);
      const summaryTotal = summaryContainer
        .querySelector(".summary-total")
        ?.cloneNode(true);
      const checkoutBtn = summaryContainer
        .querySelector(".checkout-btn")
        ?.cloneNode(true);
      const securePayment = summaryContainer
        .querySelector(".secure-payment")
        ?.cloneNode(true);

      // Kosongkan container
      summaryContainer.innerHTML = "";

      // Tambahkan kembali elemen yang diperlukan
      if (summaryTitle) summaryContainer.appendChild(summaryTitle);

      // Buat baris subtotal
      const subtotalRow = document.createElement("div");
      subtotalRow.className = "summary-row";
      subtotalRow.innerHTML = `
        <div class="summary-label">Subtotal barang</div>
        <div class="summary-value" data-testid="subtotal-value">Rp 0</div>
      `;
      summaryContainer.appendChild(subtotalRow);

      // Buat baris pengiriman
      const shippingRow = document.createElement("div");
      shippingRow.className = "summary-row";
      shippingRow.innerHTML = `
        <div class="summary-label">Biaya pengiriman</div>
        <div class="summary-value">Rp 0</div>
      `;
      summaryContainer.appendChild(shippingRow);

      // Tambahkan kembali total, tombol, dan pembayaran aman
      if (summaryTotal) summaryContainer.appendChild(summaryTotal);
      if (checkoutBtn) summaryContainer.appendChild(checkoutBtn);
      if (securePayment) summaryContainer.appendChild(securePayment);

      console.log("Struktur ringkasan dibuat ulang");
    }

    // Update harga setelah struktur diperbarui
    updateSummaryPrices();
  }

  // Fungsi utama untuk merender keranjang
  function renderCart() {
    const cartRaw = localStorage.getItem("cart");
    console.log("Data keranjang mentah dari localStorage:", cartRaw);

    let cart = [];
    try {
      cart = JSON.parse(cartRaw) || [];
    } catch (e) {
      console.error("Gagal mem-parsing data keranjang:", e);
      cart = [];
    }

    console.log("Isi keranjang yang diparsing:", cart);

    // Clear cart section
    if (cartSection) {
      cartSection.innerHTML = "";
    } else {
      console.error("Elemen cart-section tidak ditemukan");
      return;
    }

    // Cek apakah keranjang kosong
    if (cart.length === 0) {
      renderEmptyCart();
      return;
    }

    // Update jumlah item "Pilih semua"
    const selectAllLabel = document.querySelector("label[for='select-all']");
    if (selectAllLabel) {
      selectAllLabel.textContent = `Pilih semua variasi (${cart.length})`;
    }

    // Render item keranjang (untuk setiap supplier)
    const supplierName = "Toko Baju Fredrik";
    const supplierRow = renderSupplierRow(supplierName);
    cartSection.appendChild(supplierRow);

    // Render setiap item
    cart.forEach((item, index) => {
      const cartItem = renderCartItem(item, index);
      if (cartItem) {
        cartSection.appendChild(cartItem);
      }
    });

    // Tambahkan event listeners untuk item-item baru
    addCartItemEventListeners();

    // Modifikasi struktur ringkasan
    updateSummaryStructure();

    // Update jumlah di ikon keranjang
    updateCartCount();
  }

  // Tambahkan event listeners untuk item-item di keranjang
  function addCartItemEventListeners() {
    // Event listeners untuk tombol kurang
    document.querySelectorAll(".decrease-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const index = parseInt(cartItem.dataset.index);
        const qtyInput = cartItem.querySelector(".qty-input");
        const itemPrice = cartItem.querySelector(".item-price");
        const qtyLimit = cartItem.querySelector(".qty-limit");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        let qty = parseInt(qtyInput.value) || 1;
        if (qty > 1) {
          qty -= 1;
          qtyInput.value = qty;
          updateQtyLimit(qtyInput, qtyLimit);

          // Konversi harga ke number dengan metode yang lebih kuat
          let price = 0;
          if (typeof cart[index].price === "number") {
            price = cart[index].price;
          } else if (typeof cart[index].price === "string") {
            price = Number(cart[index].price.replace(/[^\d]/g, ""));
          }

          updateItemPrice(qty, price, itemPrice);
          updateItemQuantity(index, qty);
        }
      });
    });

    // Event listeners untuk tombol tambah
    document.querySelectorAll(".increase-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const index = parseInt(cartItem.dataset.index);
        const qtyInput = cartItem.querySelector(".qty-input");
        const itemPrice = cartItem.querySelector(".item-price");
        const qtyLimit = cartItem.querySelector(".qty-limit");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        let qty = parseInt(qtyInput.value) || 1;
        qty += 1;
        qtyInput.value = qty;
        updateQtyLimit(qtyInput, qtyLimit);

        // Konversi harga ke number dengan metode yang lebih kuat
        let price = 0;
        if (typeof cart[index].price === "number") {
          price = cart[index].price;
        } else if (typeof cart[index].price === "string") {
          price = Number(cart[index].price.replace(/[^\d]/g, ""));
        }

        updateItemPrice(qty, price, itemPrice);
        updateItemQuantity(index, qty);
      });
    });

    // Event listeners untuk input jumlah
    document.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", function () {
        const cartItem = this.closest(".cart-item");
        const index = parseInt(cartItem.dataset.index);
        const itemPrice = cartItem.querySelector(".item-price");
        const qtyLimit = cartItem.querySelector(".qty-limit");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        let qty = parseInt(this.value);

        // Pastikan nilai valid
        if (isNaN(qty) || qty < 1) {
          qty = 1;
          this.value = 1;
        }

        updateQtyLimit(this, qtyLimit);

        // Konversi harga ke number dengan metode yang lebih kuat
        let price = 0;
        if (typeof cart[index].price === "number") {
          price = cart[index].price;
        } else if (typeof cart[index].price === "string") {
          price = Number(cart[index].price.replace(/[^\d]/g, ""));
        }

        updateItemPrice(qty, price, itemPrice);
        updateItemQuantity(index, qty);
      });
    });

    // Event listeners untuk tombol hapus
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        const index = parseInt(cartItem.dataset.index);

        Swal.fire({
          title: "Hapus Barang",
          text: "Apakah Anda yakin ingin menghapus barang ini dari keranjang?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ef4444",
          cancelButtonText: "Batal",
          confirmButtonText: "Hapus",
        }).then((result) => {
          if (result.isConfirmed) {
            removeCartItem(index);

            Swal.fire(
              "Berhasil Dihapus!",
              "Barang telah dihapus dari keranjang Anda.",
              "success"
            );
          }
        });
      });
    });
  }

  // Handle klik tombol checkout
  checkoutBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Cek apakah keranjang kosong
    if (cart.length === 0) {
      Swal.fire({
        title: "Keranjang Kosong",
        text: "Tidak ada barang di keranjang Anda untuk checkout.",
        icon: "warning",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Cek jumlah minimum
    let minOrderWarning = false;
    cart.forEach((item) => {
      if ((item.quantity || 1) < MIN_ORDER) {
        minOrderWarning = true;
      }
    });

    if (minOrderWarning) {
      Swal.fire({
        title: "Pesanan Minimum",
        text: `Anda perlu memesan minimal ${MIN_ORDER} buah untuk setiap item untuk melanjutkan checkout.`,
        icon: "warning",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Cek apakah pengguna sudah login
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      localStorage.setItem("redirectTo", "./cart.html"); // Simpan halaman tujuan
      Swal.fire({
        title: "Perlu Login!",
        text: "Silakan login terlebih dahulu untuk melanjutkan checkout.",
        icon: "warning",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#1f2937",
      }).then(() => {
        window.location.href = "../loginpage/login.html";
      });
      return;
    }

    // Proses checkout
    Swal.fire({
      title: "Checkout Berhasil!",
      text: "Pesanan Anda sedang diproses. Terima kasih telah berbelanja.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    }).then(() => {
      // Kosongkan keranjang dan redirect
      localStorage.setItem("cart", JSON.stringify([]));
      window.location.href = "../index.html";
    });
  });

  // Handle select all checkbox
  if (selectAll) {
    selectAll.addEventListener("change", () => {
      const isChecked = selectAll.checked;

      document
        .querySelectorAll(".cart-item .checkbox, .supplier-row .checkbox")
        .forEach((checkbox) => {
          checkbox.checked = isChecked;
        });
    });
  }

  // Handle hamburger menu untuk tampilan mobile
  if (hamburger && navContainer) {
    hamburger.addEventListener("click", () => {
      navContainer.classList.toggle("open");
    });
  }

  // Tambahkan log debugging untuk membantu troubleshooting
  console.log("Menginisialisasi halaman keranjang");
  console.log("Elemen cart count:", cartCount);
  console.log("Elemen cart section:", cartSection);

  // Render keranjang saataditional debugging log
  console.log("Menginisialisasi halaman keranjang");
  console.log("Elemen cart count:", cartCount);
  console.log("Elemen cart section:", cartSection);

  // Render keranjang saat halaman dimuat
  renderCart();
});

// Add this to the bottom of your cart.js file, replacing the existing similar code

document.addEventListener("DOMContentLoaded", function () {
  // Select all navigation links that should go back to index page sections
  const homeLink = document.querySelector('a[href="../index.html/#home"]');
  const productLink = document.querySelector('a[href="../index.html/#produk"]');
  const contactLink = document.querySelector('a[href="../index.html/#kontak"]');

  // Function to handle navigation back to index page with smooth scrolling
  function navigateToSection(sectionId, e) {
    e.preventDefault();

    // Store the target section ID in localStorage
    localStorage.setItem("scrollTarget", sectionId);

    // Navigate to index page
    window.location.href = "../index.html";
  }

  // Add event listeners to the links
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      // For home, we want to scroll to the top (0)
      e.preventDefault();
      localStorage.setItem("scrollTarget", "top");
      window.location.href = "../index.html";
    });
  }

  if (productLink) {
    productLink.addEventListener("click", function (e) {
      navigateToSection("produk", e);
    });
  }

  if (contactLink) {
    contactLink.addEventListener("click", function (e) {
      navigateToSection("kontak", e);
    });
  }
});
