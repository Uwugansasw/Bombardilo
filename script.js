import { products } from "./produk.js";

document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navUl = document.querySelector("nav ul");

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

  // Check login status and update UI
  function updateLoginUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");
    const loginBtn = document.querySelector(".btn-login");

    if (isLoggedIn && loginBtn) {
      // Change login button to logout when user is logged in
      loginBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i>';
      loginBtn.title = `Logout (${userEmail})`;
      loginBtn.classList.add("btn-logout");

      // Remove the login page link and add logout functionality
      loginBtn.href = "#";
      loginBtn.addEventListener("click", handleLogout);
    }
  }

  // Handle logout functionality
  function handleLogout(e) {
    e.preventDefault();

    Swal.fire({
      title: "Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      confirmButtonColor: "#1f2937",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear login data
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");

        // Show success message
        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah keluar dari akun",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#1f2937",
        }).then(() => {
          // Reset login button and reload page
          location.reload();
        });
      }
    });
  }

  // Call function to update login UI when page loads
  updateLoginUI();

  // Render products
  const productContainer = document.querySelector(".produk-container");
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("produk-item");
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.alt}" />
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button class="add-to-cart-btn w-full bg-black text-white px-4 py-2 rounded-lg mt-2 hover:bg-gray-800">Tambahkan ke Keranjang</button>
    `;
    productContainer.appendChild(productElement);
  });

  // IntersectionObserver for slide-down animation
  const productItems = document.querySelectorAll(".produk-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  productItems.forEach((item) => observer.observe(item));

  // Cart functionality
  const cartCount = document.querySelector(".cart-count");

  // Fungsi untuk update cart count berdasarkan localStorage
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    );
    cartCount.textContent = totalItems;
  }

  // Fungsi untuk menambahkan produk ke keranjang
  function addToCart(product) {
    if (!product.name || isNaN(Number(product.price)) || !product.image) {
      console.error("Data produk tidak valid:", product);
      Swal.fire({
        title: "Error!",
        text: "Gagal menambahkan produk ke keranjang. Data tidak valid.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.name === product.name);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        name: product.name,
        price: Number(product.price), // Pastikan harga adalah angka
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Barang ditambahkan ke keranjang:", product);
    console.log("Isi keranjang saat ini:", cart);

    // Update cart count
    updateCartCount();

    // Jika di halaman cart.html, panggil renderCart
    if (window.location.pathname.includes("cart.html")) {
      if (typeof renderCart === "function") {
        renderCart();
      } else {
        console.warn("Fungsi renderCart tidak ditemukan di halaman cart.html");
      }
    }

    // Tampilkan notifikasi
    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} telah ditambahkan ke keranjang!`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    });
  }

  // Inisialisasi cart count saat halaman dimuat
  updateCartCount();

  // Event listener untuk tombol Tambahkan ke Keranjang
  productContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productElement = e.target.parentElement;
      const name = productElement.querySelector("h3").textContent;
      const priceText = productElement.querySelector("p").textContent;
      // Parse harga dari format "Rp 150.000" ke integer
      const price = parseInt(priceText.replace(/Rp\s|\./g, ""));
      const image = productElement.querySelector("img").src;

      addToCart({ name, price, image });
    }
  });

  // Smooth scroll for Lihat Produk button
  document.querySelector("#lihat-produk").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#produk").scrollIntoView({ behavior: "smooth" });
  });
});

// Inisialisasi AOS
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    once: true, // Animasi hanya dijalankan sekali
    offset: 120, // Offset (dalam pixel) dari batas bawah browser untuk memicu animasi
    delay: 100, // Nilai dalam ms
    duration: 1000, // Nilai dalam ms
    easing: "ease-in-out",
  });
});

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll('header a[href^="#"]');
  const lihatProdukBtn = document.getElementById("lihat-produk");

  // Function to handle smooth scrolling
  function smoothScroll(targetId, offset = 0) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;

      // Calculate position considering header height and additional offset
      const offsetPosition = targetPosition - headerHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  // Add event listeners to navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      smoothScroll(targetId, 0); // 16px offset for fine tuning
    });
  });

  // Add event listener for "Lihat Produk" button
  if (lihatProdukBtn) {
    lihatProdukBtn.addEventListener("click", function () {
      smoothScroll("#produk", 0);
    });
  }
});

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Pilih semua link navigasi yang mengarah ke elemen dengan ID
  const navLinks = document.querySelectorAll('header a[href^="#"]');
  const lihatProdukBtn = document.getElementById("lihat-produk");

  // Function to handle smooth scrolling
  function smoothScroll(targetId, offset = 0) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;

      // Calculate position considering header height and additional offset
      const offsetPosition = targetPosition - headerHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
});

// Add this to your existing script.js file, ideally in the DOMContentLoaded event listener section
// where the other navigation link handlers are implemented

document.addEventListener("DOMContentLoaded", function () {
  // Get the Home navigation link
  const homeLink = document.querySelector('header a[href="#home"]');

  // Add event listener to the Home link
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

// Add this to your script.js file after the existing DOMContentLoaded event listeners

document.addEventListener("DOMContentLoaded", function () {
  // Check if there's a scroll target saved in localStorage
  const scrollTarget = localStorage.getItem("scrollTarget");

  if (scrollTarget) {
    // Clear the target so it doesn't affect future page loads
    localStorage.removeItem("scrollTarget");

    // Handle scrolling based on the target
    if (scrollTarget === "top") {
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Find the target element by ID
      const targetElement = document.getElementById(scrollTarget);

      if (targetElement) {
        // Wait a bit for the page to fully load
        setTimeout(() => {
          // Get header height to account for fixed positioning
          const headerHeight = document.querySelector("header").offsetHeight;

          // Calculate the position to scroll to
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = targetPosition - headerHeight;

          // Scroll to the target position
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }
});
