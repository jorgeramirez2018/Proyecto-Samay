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
  fetch("/VistaComprador/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      activarHamburguesa();
      marcarEnlaceActivo();
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
  fetch("/VistaComprador/navbar/navbar.html")
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

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

// ✅ Nueva función para cargar productos desde el backend
async function cargarProductosDesdeBackend() {
  try {
    const response = await fetch("http://localhost:8080/productos");
    if (!response.ok) throw new Error("No se pudieron obtener los productos");

    const productos = await response.json();

    renderizarProductos(productos.slice(0, 8)); // solo los primeros 8
  } catch (error) {
    console.error("Error al cargar productos:", error);
    shopContent.innerHTML = `<p class="error">No se pudieron cargar los productos.</p>`;
  }
}

// ✅ Función reutilizable para renderizar los productos en el DOM
function renderizarProductos(productos) {
  shopContent.innerHTML = ""; // Limpiar antes de insertar

  productos.forEach((product) => {
    const content = document.createElement("div");
    content.classList.add("product");

    content.innerHTML = `
      <img src="${
        product.img || "https://via.placeholder.com/150"
      }" alt="Imagen de artesanía">
      <div class="product-txt">
        <h3>${product.productName}</h3>
        <p class="precio">${formatoCOP.format(product.price || 0)}</p>
        <div class="estrellas">
          <span class="estrella">&#9733;</span>
          <span class="estrella">&#9733;</span>
          <span class="estrella">&#9733;</span>
          <span class="estrella">&#9733;</span>
          <span class="estrella">&#9733;</span>
        </div>
        <a href="#" class="agregar-carrito btn-2">Agregar</a>
      </div>
    `;

    shopContent.appendChild(content);

    const button = content.querySelector(".agregar-carrito");
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const existingProduct = cart.find((p) => p.id === product.producto_id);

      if (existingProduct) {
        existingProduct.quanty++;
      } else {
        cart.push({
          id: product.producto_id,
          productName: product.productName,
          price: parseFloat(product.price),
          quanty: 1,
          img: product.img,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      displayCartCounter();
    });
  });

  // ⬇️ Aquí llamas a la función del carrusel
  inicializarCarrusel();
}




// 👇 Llamada inicial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosDesdeBackend();
});
