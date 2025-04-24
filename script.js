import { products } from "./produk.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check login status and update UI
  function updateLoginUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");
    const loginBtn = document.querySelector(".btn-login");

    if (isLoggedIn && loginBtn) {
      loginBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i>';
      loginBtn.title = `Logout (${userEmail})`;
      loginBtn.classList.add("btn-logout");
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
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah keluar dari akun",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#1f2937",
        }).then(() => {
          location.reload();
        });
      }
    });
  }

  // Render products
  const productContainer = document.querySelector(".produk-container");
  if (productContainer) {
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
  }

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
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
  );
  productItems.forEach((item) => observer.observe(item));

  // Cart functionality
  const cartCount = document.querySelector(".cart-count");
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    );
    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

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
        price: Number(product.price),
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    if (
      window.location.pathname.includes("cart.html") &&
      typeof renderCart === "function"
    ) {
      renderCart();
    }

    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} telah ditambahkan ke keranjang!`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    });
  }

  if (productContainer) {
    productContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        const productElement = e.target.parentElement;
        const name = productElement.querySelector("h3").textContent;
        const priceText = productElement.querySelector("p").textContent;
        const price = parseInt(priceText.replace(/Rp\s|\./g, ""));
        const image = productElement.querySelector("img").src;
        addToCart({ name, price, image });
      }
    });
  }

  // Initialize AOS
  AOS.init({
    once: true,
    offset: 120,
    delay: 100,
    duration: 1000,
    easing: "ease-in-out",
  });

  // Smooth scrolling function
  function smoothScroll(targetId, offset = 0) {
    if (targetId === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetElement = document.querySelector(targetId);
    const navbar = document.querySelector(".navbar");
    if (targetElement && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - navbarHeight - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    } else {
      console.warn(
        "Target element or navbar not found for smoothScroll:",
        targetId
      );
    }
  }

  // Navigation links
  const navLinks = document.querySelectorAll(
    '.navbar-nav .nav-link[href^="#"]'
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      smoothScroll(targetId, 0);
    });
  });

  // Close navbar on link click (mobile)
  const navbarCollapse = document.getElementById("navbarNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });

  // Produk link and Lihat Produk button with mobile-specific scroll
  const produkLink = document.querySelector('.navbar-nav a[href="#produk"]');
  const lihatProdukBtn = document.getElementById("lihat-produk");

  if (produkLink) {
    produkLink.addEventListener("click", function (e) {
      e.preventDefault();
      const isMobileOrTablet = window.innerWidth < 992;
      if (isMobileOrTablet) {
        window.scrollTo({ top: 855, behavior: "smooth" });
      } else {
        smoothScroll("#produk", 0);
      }
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  }

  if (lihatProdukBtn) {
    lihatProdukBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const isMobileOrTablet = window.innerWidth < 992;
      if (isMobileOrTablet) {
        window.scrollTo({ top: 855, behavior: "smooth" });
      } else {
        smoothScroll("#produk", 0);
      }
    });
  }

  // Handle scroll target from localStorage
  const scrollTarget = localStorage.getItem("scrollTarget");
  if (scrollTarget) {
    localStorage.removeItem("scrollTarget");
    if (scrollTarget === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElement = document.getElementById(scrollTarget);
      const navbar = document.querySelector(".navbar");
      if (targetElement && navbar) {
        setTimeout(() => {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = targetPosition - navbarHeight;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }, 100);
      }
    }
  }

  // Initialize cart count
  updateCartCount();
});
