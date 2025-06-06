const toggleBtn = document.getElementById("menu-toggle");
const navbar = document.querySelector(".navbar");

toggleBtn.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar a");
  const currentPath = window.location.pathname.replace(/\/$/, ""); // elimina barra final

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

    if (currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }
  });
});

function toggleUserMenu() {
  const menu = document.getElementById("userDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Cerrar si hace clic fuera del menú
window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("userDropdown");
  const button = document.querySelector(".user-icon");
  if (!button.contains(e.target)) {
    dropdown.style.display = "none";
  }
}); 


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Evita que el link intente navegar
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/home/index.html"; // o la ruta donde tengas el login
    });
  }
});
