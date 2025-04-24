document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const emailPhoneInput = document.getElementById("email-phone");
  const loginButton = document.getElementById("login-button");
  const togglePassword = document.getElementById("toggle-password");
  const emailPhoneError = document.getElementById("email-phone-error");

  // Password requirement elements
  const reqLength = document.getElementById("req-length");
  const reqUppercase = document.getElementById("req-uppercase");
  const reqNumber = document.getElementById("req-number");
  const reqSpecial = document.getElementById("req-special");

  // Variabel untuk menyimpan status validasi
  let isPasswordValid = false;
  let isEmailPhoneValid = false;

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

  // Validasi password saat input berubah
  passwordInput.addEventListener("input", () => {
    isPasswordValid = validatePassword();
    updateLoginButton();
  });

  // Validasi email/phone saat input berubah
  emailPhoneInput.addEventListener("input", () => {
    isEmailPhoneValid = validateEmailPhone();
    updateLoginButton();
  });

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

  function updateRequirement(element, isValid) {
    const icon = element.querySelector(".check-icon i");

    if (isValid) {
      icon.className = "fas fa-check text-green-500";
    } else {
      icon.className = "fas fa-times text-red-500";
    }
  }

  function validateEmailPhone() {
    const value = emailPhoneInput.value.trim();

    // Validasi email atau nomor telepon
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // Nomor telepon bisa dimulai dengan + (kode negara) diikuti angka, atau hanya angka
    const isValidPhone = /^(\+\d{1,3})?\d{8,15}$/.test(value);

    if (isValidEmail || isValidPhone) {
      emailPhoneError.classList.add("hidden");
      return true;
    } else {
      emailPhoneError.classList.remove("hidden");
      return false;
    }
  }

  function updateLoginButton() {
    if (isPasswordValid && isEmailPhoneValid) {
      loginButton.disabled = false;
      loginButton.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      loginButton.disabled = true;
      loginButton.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  // Validasi form saat submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLoginSubmit();
  });

  function handleLoginSubmit() {
    const emailPhone = emailPhoneInput.value.trim();
    const password = passwordInput.value.trim();

    // Validasi final
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

    if (!isEmailPhoneValid) {
      Swal.fire({
        title: "Gagal!",
        text: "Format email atau nomor telepon tidak valid!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Deteksi apakah input adalah email atau nomor telepon
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPhone);

    // Debug: Pastikan kode ini berjalan
    console.log("Login berhasil, menampilkan SweetAlert");

    // Simulasi login sukses (ganti dengan autentikasi backend nanti)
    localStorage.setItem("isLoggedIn", "true"); // Simpan status login
    localStorage.setItem("userEmailPhone", emailPhone); // Simpan email/phone user

    if (isEmail) {
      localStorage.setItem("userEmail", emailPhone);
    } else {
      localStorage.setItem("userPhone", emailPhone);
    }

    // Tampilkan SweetAlert
    Swal.fire({
      title: "Berhasil!",
      text: "Login berhasil! Selamat datang!",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    }).then(() => {
      // Redirect ke halaman utama
      window.location.href = "../index.html";
    });
  }

  // Pastikan form sudah tervalidasi sejak awal
  isPasswordValid = validatePassword();
  isEmailPhoneValid = validateEmailPhone();
  updateLoginButton();
});
