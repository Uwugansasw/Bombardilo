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

  // Render products
  const productContainer = document.querySelector(".produk-container");
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("produk-item");
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.alt}" />
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button>Tambahkan ke Keranjang</button>
    `;
    productContainer.appendChild(productElement);
  });

  // IntersectionObserver for slide-down animation
  const productItems = document.querySelectorAll(".produk-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Tambahkan kelas visible dengan delay untuk animasi
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100); // Delay bertambah 0.1s per produk
        } else {
          // Hapus kelas visible saat elemen keluar dari viewport
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.2, // Animasi jalan saat 20% produk kelihatan
      rootMargin: "0px 0px -50px 0px", // Margin untuk memicu lebih awal
    }
  );

  // Amati setiap item produk
  productItems.forEach((item) => observer.observe(item));

  // Cart functionality
  const cartIcon = document.querySelector(".cart-icon");
  const cartCount = document.querySelector(".cart-count");
  let cartItems = 0;

  productContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      cartItems++;
      cartCount.textContent = cartItems;
      // Gunakan SweetAlert2 untuk alert yang lebih cantik
      const productName =
        e.target.parentElement.querySelector("h3").textContent;
      Swal.fire({
        title: "Berhasil!",
        text: `${productName} telah ditambahkan ke keranjang!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937", // Sesuaikan dengan bg-gray-800
      });
    }
  });

  // Smooth scroll for Lihat Produk button
  document.querySelector("#lihat-produk").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#produk").scrollIntoView({ behavior: "smooth" });
  });
});
