document.addEventListener("DOMContentLoaded", () => {
  fetch("/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      activarHamburguesa();
    });
});

//boton hamburguesa

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
