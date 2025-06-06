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


