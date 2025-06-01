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

document.addEventListener("DOMContentLoaded", () => {
  fetch("/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      activarHamburguesa();
      marcarEnlaceActivo();
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

const shopContent = document.querySelector(".products-content");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔁 Formateador de moneda COP
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

productos.slice(0, 8).forEach((product) => {
  const content = document.createElement("div");
  content.classList.add("product");

  content.innerHTML = `
    <img src="${product.img}" alt="Imagen de artesania">
    <div class="product-txt">
      <h3>${product.productName}</h3>
      <p class="precio">${formatoCOP.format(
        product.price
      )}</p> <!-- 💰 Aquí cambia -->
      <div class="estrellas">
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
      </div>
      <a href="#" class="agregar-carrito btn-2" id="botonCarrito" data-1=""></a>
    </div>
  `;

  shopContent.appendChild(content);

  const button = content.querySelector(".agregar-carrito");
  button.innerText = "Agregar";
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const repeat = cart.some(
      (repeatProduct) => repeatProduct.id === product.id
    );

    if (repeat) {
      cart.map((prod) => {
        if (prod.id === product.id) {
          prod.quanty++;
        }
      });
    } else {
      cart.push({
        id: product.id,
        productName: product.productName,
        price: parseFloat(product.price),
        quanty: product.quanty,
        img: product.img,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartCounter();
  });
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
