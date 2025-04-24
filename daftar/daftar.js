document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const emailInput = document.getElementById("email");
  const countryCodeSelect = document.getElementById("country-code");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const signupButton = document.getElementById("signup-button");
  const togglePassword = document.getElementById("toggle-password");
  const toggleConfirmPassword = document.getElementById(
    "toggle-confirm-password"
  );

  // Error elements
  const firstNameError = document.getElementById("first-name-error");
  const emailError = document.getElementById("email-error");
  const phoneError = document.getElementById("phone-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  // Password requirement elements
  const reqLength = document.getElementById("req-length");
  const reqUppercase = document.getElementById("req-uppercase");
  const reqNumber = document.getElementById("req-number");
  const reqSpecial = document.getElementById("req-special");

  // Variabel untuk menyimpan status validasi
  let isFirstNameValid = false;
  let isEmailValid = false;
  let isPhoneValid = false;
  let isPasswordValid = false;
  let isConfirmPasswordValid = false;

  // Check if user is already logged in, redirect if true
  if (localStorage.getItem("isLoggedIn") === "true") {
    Swal.fire({
      title: "Sudah Login!",
      text:
        "Anda sudah login dengan akun " +
        localStorage.getItem("userEmailPhone"),
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    }).then(() => {
      window.location.href = "../index.html";
    });
    return;
  }

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle eye icon
    const icon = togglePassword.querySelector("i");
    if (type === "password") {
      icon.className =
        "fas fa-eye-slash text-gray-400 hover:text-cyan-500 transition-colors";
    } else {
      icon.className =
        "fas fa-eye text-cyan-500 hover:text-cyan-600 transition-colors";
    }
  });

  // Toggle confirm password visibility
  toggleConfirmPassword.addEventListener("click", () => {
    const type =
      confirmPasswordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    confirmPasswordInput.setAttribute("type", type);

    // Toggle eye icon
    const icon = toggleConfirmPassword.querySelector("i");
    if (type === "password") {
      icon.className =
        "fas fa-eye-slash text-gray-400 hover:text-cyan-500 transition-colors";
    } else {
      icon.className =
        "fas fa-eye text-cyan-500 hover:text-cyan-600 transition-colors";
    }
  });

  // Validasi nama depan
  firstNameInput.addEventListener("input", () => {
    isFirstNameValid = validateFirstName();
    updateSignupButton();
  });

  // Validasi email
  emailInput.addEventListener("input", () => {
    isEmailValid = validateEmail();
    updateSignupButton();
  });

  // Validasi nomor telepon
  phoneInput.addEventListener("input", () => {
    isPhoneValid = validatePhone();
    updateSignupButton();
  });

  // Validasi password
  passwordInput.addEventListener("input", () => {
    isPasswordValid = validatePassword();
    // Jika konfirmasi password sudah diisi, validasi lagi
    if (confirmPasswordInput.value) {
      isConfirmPasswordValid = validateConfirmPassword();
    }
    updateSignupButton();
  });

  // Validasi konfirmasi password
  confirmPasswordInput.addEventListener("input", () => {
    isConfirmPasswordValid = validateConfirmPassword();
    updateSignupButton();
  });

  function validateFirstName() {
    const firstName = firstNameInput.value.trim();

    if (firstName.length > 0) {
      firstNameError.classList.add("hidden");
      return true;
    } else {
      firstNameError.classList.remove("hidden");
      return false;
    }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isValid) {
      emailError.classList.add("hidden");
      return true;
    } else {
      emailError.classList.remove("hidden");
      return false;
    }
  }

  function validatePhone() {
    const phone = phoneInput.value.trim();
    // Validasi nomor telepon: hanya angka, min 8 digit, max 15 digit
    const isValid = /^\d{8,15}$/.test(phone);

    if (isValid) {
      phoneError.classList.add("hidden");
      return true;
    } else {
      phoneError.classList.remove("hidden");
      return false;
    }
  }

  function validatePassword() {
    const password = passwordInput.value;

    // Validasi panjang minimal 6 karakter
    const hasLength = password.length >= 6;
    updateRequirement(reqLength, hasLength);

    // Validasi minimal 1 huruf besar
    const hasUppercase = /[A-Z]/.test(password);
    updateRequirement(reqUppercase, hasUppercase);

    // Validasi minimal 1 angka
    const hasNumber = /[0-9]/.test(password);
    updateRequirement(reqNumber, hasNumber);

    // Validasi minimal 1 karakter khusus
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    updateRequirement(reqSpecial, hasSpecial);

    return hasLength && hasUppercase && hasNumber && hasSpecial;
  }

  function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password === confirmPassword) {
      confirmPasswordError.classList.add("hidden");
      return true;
    } else {
      confirmPasswordError.classList.remove("hidden");
      return false;
    }
  }

  function updateRequirement(element, isValid) {
    const icon = element.querySelector(".check-icon i");

    if (isValid) {
      icon.className = "fas fa-check text-green-500";
    } else {
      icon.className = "fas fa-times text-red-500";
    }
  }

  function updateSignupButton() {
    if (
      isFirstNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      signupButton.disabled = false;
      signupButton.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      signupButton.disabled = true;
      signupButton.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  // Validasi form saat submit
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSignupSubmit();
  });

  function handleSignupSubmit() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const countryCode = countryCodeSelect.value;
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;

    // Validasi final
    if (!isFirstNameValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Nama depan tidak boleh kosong!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    if (!isEmailValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Format email tidak valid!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    if (!isPhoneValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Format nomor telepon tidak valid!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    if (!isPasswordValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Password tidak memenuhi persyaratan keamanan!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    if (!isConfirmPasswordValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Konfirmasi password tidak cocok!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Gabungkan kode negara dan nomor telepon
    const fullPhoneNumber = countryCode + phone;

    // Simpan data pengguna (simulasi)
    localStorage.setItem("userFirstName", firstName);
    localStorage.setItem("userLastName", lastName);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", fullPhoneNumber);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmailPhone", email); // Untuk kompatibilitas dengan login.js

    // Debug
    console.log("Pendaftaran berhasil, menampilkan SweetAlert");

    // Tampilkan SweetAlert
    Swal.fire({
      title: "Berhasil!",
      text: `Selamat ${firstName}! Akun Anda berhasil dibuat!`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    }).then(() => {
      // Redirect ke halaman utama
      window.location.href = "../index.html";
    });
  }

  // Inisialisasi validasi
  isFirstNameValid = validateFirstName();
  isEmailValid = validateEmail();
  isPhoneValid = validatePhone();
  isPasswordValid = validatePassword();
  isConfirmPasswordValid = validateConfirmPassword();
  updateSignupButton();
});
