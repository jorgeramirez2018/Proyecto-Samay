const shopContent = document.getElementById("contenedor-catproductos");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(productos);
productos.forEach((product) => {
  const content = document.createElement("div");
  content.classList.add("product");
  content.innerHTML = `
    <img src="${product.img}" alt="${product.productName}">
    <h3>${product.productName}</h3>
    <p class="precio">${product.price}</p>
    <p class= "origen">${product.community} | ${product.region}</p>
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

loadProducts();

// Función para guardar un producto en localStorage
function saveProduct(product) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  // Recargar la lista de productos
  loadProducts();
}

// Función para cargar los productos desde localStorage
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";

    const categoryDisplay = `<span class="badge category-${product.category}">
                                    ${getCategoryDisplayName(product.category)}
                                 </span>`;

    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p><strong>Comunidad:</strong> ${product.community}</p>
            <p><strong>Categoría:</strong> ${categoryDisplay}</p>
            <p><strong>Cantidad:</strong> ${product.quantity}</p>
            <div class="d-flex gap-2 mt-3">
                <button class="btn-2 edit-btn" data-id="${
                  product.id
                }">Agregar</button>
            </div>
        `;

    container.appendChild(card);
  });
}

// Función para obtener el nombre de visualización de la categoría
function getCategoryDisplayName(category) {
  const categoryMap = {
    joyeria: "Joyería",
    ceramica: "Cerámica",
    cesteria: "Cestería",
    tejidos: "Tejidos",
    ropa: "Ropa",
  };
  return categoryMap[category] || category;
}
