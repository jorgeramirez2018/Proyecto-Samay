const shopContent = document.getElementById("contenedor-catproductos");
let cart = JSON.parse(localStorage.getItem("cart")) || [];


function renderizarProductos(productosARenderizar) {
  shopContent.innerHTML = "";
  productosARenderizar.forEach((product) => {
    const content = document.createElement("div");
    content.classList.add("product");
    content.innerHTML = `
      <img src="${product.img}" alt="${product.productName}">
      <h3>${product.productName}</h3>
      <p class="precio">$${product.price}</p>
      <p class="origen">${product.community} | ${product.region}</p>
      <div class="estrellas">
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
        <span class="estrella">&#9733;</span>
      </div>
      <a href="#" class="agregar-carrito btn-2" id="botonCarrito">Agregar</a>
    `;
    shopContent.appendChild(content);

    const button = content.querySelector(".agregar-carrito");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      agregarAlCarrito(product);
    });
  });
}

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
      quanty: 1
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartCounter();
}

// Obtener opciones de filtros
function obtenerFiltros() {
  const comunidades = new Set();
  const regiones = new Set();
  const precios = [];

  productos.forEach(producto => {
    comunidades.add(producto.community);
    regiones.add(producto.region);
    precios.push(parseFloat(producto.price));
  });

  return {
    categorias: ["Joyería", "Cestería", "Ropa", "Tejidos", "Cerámica"],
    comunidades: Array.from(comunidades),
    regiones: Array.from(regiones),
    precioMin: Math.min(...precios),
    precioMax: Math.max(...precios)
  };
}

// Renderizar filtros
function renderizarFiltros() {
  const listaFiltros = document.getElementById("lista-filtros");
  listaFiltros.innerHTML = ""; // Reset por si ya se cargó antes

  const { categorias, comunidades, regiones, precioMin, precioMax } = obtenerFiltros();

  // Crear grupo desplegable
  function crearGrupoFiltro(titulo, items, tipo) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = titulo;
    details.appendChild(summary);

    items.forEach(item => {
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
  inputMin.type = "number";
  inputMin.placeholder = `Desde ${precioMin}`;
  inputMin.id = "precio-min";
  inputMin.min = precioMin;
  inputMin.max = precioMax;

  const inputMax = document.createElement("input");
  inputMax.type = "number";
  inputMax.placeholder = `Hasta ${precioMax}`;
  inputMax.id = "precio-max";
  inputMax.min = precioMin;
  inputMax.max = precioMax;

  const btnPrecio = document.createElement("button");
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

  // BOTÓN LIMPIAR FILTROS
  const limpiarBtn = document.createElement("button");
  limpiarBtn.textContent = "Limpiar filtros";
  limpiarBtn.style.marginTop = "15px";
  limpiarBtn.addEventListener("click", () => {
    renderizarProductos(productos);
  });
  listaFiltros.appendChild(limpiarBtn);
}

// Lógica de filtrado
function filtrarProductos(tipo, valor) {
  let productosFiltrados = productos;

  if (tipo === "categoria") {
    productosFiltrados = productos.filter(p => p.category === valor);
  } else if (tipo === "community") {
    productosFiltrados = productos.filter(p => p.community === valor);
  } else if (tipo === "region") {
    productosFiltrados = productos.filter(p => p.region === valor);
  } else if (tipo === "precio") {
    productosFiltrados = productos.filter(p => {
      const price = parseFloat(p.price);
      return price >= valor.min && price <= valor.max;
    });
  }

  renderizarProductos(productosFiltrados);
}

// Inicialización
renderizarProductos(productos);
renderizarFiltros();