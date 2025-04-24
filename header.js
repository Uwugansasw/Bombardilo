// Header navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navContainer = document.querySelector(".nav-container");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    navContainer.classList.toggle("open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      hamburger.contains(event.target) || navContainer.contains(event.target);

    if (!isClickInside && navContainer.classList.contains("open")) {
      navContainer.classList.remove("open");
    }
  });

  // Update active link based on current page
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (currentLocation.includes(linkPath) && !linkPath.includes("#")) {
      link.style.color = "#3b82f6"; // Active link color
    }
  });

  // Update cart count from localStorage
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartCount.textContent = cartItems.length;
  }
});
