document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      Swal.fire({
        title: "Gagal!",
        text: "Email dan password harus diisi!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Simulasi login sukses (ganti dengan logika autentikasi backend nanti)
    Swal.fire({
      title: "Berhasil!",
      text: "Login berhasil! Selamat datang!",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#1f2937",
    }).then(() => {
      // Redirect ke halaman utama setelah login sukses
      window.location.href = "../index.html";
    });
  });
});
