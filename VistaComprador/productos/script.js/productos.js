const shopContent = document.getElementById("contenedor-catproductos");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === RENDER DESDE ARCHIVO JS ===
function renderizarProductos(productosARenderizar) {
  shopContent.innerHTML = "";
  productosARenderizar.forEach((product) => {
    const content = document.createElement("div");
    content.classList.add("product");
    content.innerHTML = `
      <img src="${product.img}" alt="${product.productName}">
      <h3>${product.productName}</h3>
      <p class="precio">${formatoCOP.format(product.price)}</p>
      <p class="origen">${product.community} | ${product.region}</p>
      <div class="estrellas">
        <span class="estrella">&#9733;</span><span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span><span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
      </div>
      <a href="#" class="agregar-carrito btn-2">Agregar</a>
    `;
    shopContent.appendChild(content);

    const button = content.querySelector(".agregar-carrito");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      agregarAlCarrito(product);
    });
  });
}
// 🔁 Formateador de moneda COP
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

// === FUNCIONES CARRITO ===
function agregarAlCarrito(product) {
  const repeat = cart.some((prod) => prod.id === product.id);
  if (repeat) {
    cart = cart.map((prod) => {
      if (prod.id === product.id) prod.quanty++;
      return prod;
    });
  } else {
    cart.push({
      ...product,
      price: parseFloat(product.price),
      quanty: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartCounter();
}

// === FILTROS ===
function obtenerFiltros() {
  const comunidades = new Set();
  const regiones = new Set();
  const precios = [];

  productos.forEach((producto) => {
    comunidades.add(producto.community);
    regiones.add(producto.region);
    precios.push(parseFloat(producto.price));
  });

  return {
    categorias: ["Joyería", "Cestería", "Ropa", "Tejidos", "Cerámica"],
    comunidades: Array.from(comunidades),
    regiones: Array.from(regiones),
    precioMin: Math.min(...precios),
    precioMax: Math.max(...precios),
  };
}

function renderizarFiltros() {
  const listaFiltros = document.getElementById("lista-filtros");
  listaFiltros.innerHTML = "";

  const { categorias, comunidades, regiones, precioMin, precioMax } =
    obtenerFiltros();

  function crearGrupoFiltro(titulo, items, tipo) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = titulo;
    details.appendChild(summary);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => filtrarProductos(tipo, item));
      details.appendChild(li);
    });

    listaFiltros.appendChild(details);
  }

  crearGrupoFiltro("Categoría", categorias, "categoria");
  crearGrupoFiltro("Comunidad", comunidades, "community");
  crearGrupoFiltro("Región", regiones, "region");

  // PRECIO
  const precioDetails = document.createElement("details");
  const precioSummary = document.createElement("summary");
  precioSummary.textContent = "Precio";
  precioDetails.appendChild(precioSummary);

  const inputMin = document.createElement("input");
  const inputMax = document.createElement("input");
  const btnPrecio = document.createElement("button");

  inputMin.type = inputMax.type = "number";
  inputMin.placeholder = `Desde ${precioMin}`;
  inputMax.placeholder = `Hasta ${precioMax}`;
  inputMin.id = "precio-min";
  inputMax.id = "precio-max";

  btnPrecio.textContent = "Filtrar";
  btnPrecio.addEventListener("click", () => {
    const min = parseFloat(inputMin.value);
    const max = parseFloat(inputMax.value);
    filtrarProductos("precio", { min, max });
  });

  precioDetails.appendChild(inputMin);
  precioDetails.appendChild(inputMax);
  precioDetails.appendChild(btnPrecio);
  listaFiltros.appendChild(precioDetails);

  // BOTÓN LIMPIAR
  const limpiarBtn = document.createElement("button");
  limpiarBtn.textContent = "Limpiar filtros";
  limpiarBtn.style.marginTop = "15px";
  limpiarBtn.addEventListener("click", () => {
    renderizarProductos(productos);
  });
  listaFiltros.appendChild(limpiarBtn);

  if (window.innerWidth <= 870) {
    const sidebar = document.getElementById("sidebar");
    const filtrosInteractivos = sidebar.querySelectorAll("li, button");

    filtrosInteractivos.forEach((elemento) => {
      elemento.addEventListener("click", () => {
        sidebar.classList.remove("show");
      });
    });
  }
}

function filtrarProductos(tipo, valor) {
  let productosFiltrados = productos;

  if (tipo === "categoria") {
    productosFiltrados = productos.filter((p) => p.category === valor);
  } else if (tipo === "community") {
    productosFiltrados = productos.filter((p) => p.community === valor);
  } else if (tipo === "region") {
    productosFiltrados = productos.filter((p) => p.region === valor);
  } else if (tipo === "precio") {
    productosFiltrados = productos.filter((p) => {
      const price = parseFloat(p.price);
      return price >= valor.min && price <= valor.max;
    });
  }

  renderizarProductos(productosFiltrados);
}

// === INICIALIZACIÓN PARA GRID 1 ===
renderizarProductos(productos);
renderizarFiltros();

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
             <p class="origen">${product.community} | ${product.region}</p>	
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

      // Buscar si el producto ya está en el carrito
      const existingProduct = cart.find((p) => p.id === product.producto_id);

      if (existingProduct) {
        // Solo incrementar cantidad
        existingProduct.quanty++;
      } else {
        // Agregar nuevo producto al carrito con cantidad inicial 1
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
}

// 👇 Llamada inicial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosDesdeBackend();
});
function getCategoryDisplayName(category) {
  const categoryMap = {
    joyeria: "Joyería",
    ceramica: "Cerámica",
    cesteria: "Cestería",
    tejidos: "Tejidos",
    ropa: "Ropa",
  };
  return categoryMap[category.toLowerCase()] || category;
}
