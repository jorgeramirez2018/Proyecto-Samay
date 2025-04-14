// Cargar Navbar
fetch("/Proyecto-Samay/navbar/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
    activarHamburguesa(); 
  });

// Cargar Hamburgesa
function activarHamburguesa() {
  const menuToggle = document.querySelector("#menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("change", () => {
      navbar.classList.toggle("active");
    });
  }
}
