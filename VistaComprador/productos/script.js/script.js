document.addEventListener("DOMContentLoaded", () => {
  fetch("/VistaComprador/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Lógica que depende del HTML cargado
      activarHamburguesa();
      marcarEnlaceActivo();

      // Agregar manejador de cierre de sesión
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/home/index.html";
        });
      }
    });
});

function marcarEnlaceActivo() {
  const navLinks = document.querySelectorAll(".navbar a");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

    if (currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }
  });
}
function activarHamburguesa() {
  const menuToggle = document.querySelector("#menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  } else {
    console.warn("No se encontró el botón o el navbar");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filtroToggle = document.getElementById("toggle-filtros");
  const sidebar = document.getElementById("sidebar");

  if (filtroToggle && sidebar) {
    filtroToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/footer/footer.html")
    .then((res) => res.text())
    .then((data) => {
      const container = document.getElementById("footer");
      const shadow = container.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <link rel="stylesheet" href="/footer/style/footerstyle.css">
        ${data}
      `;
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
