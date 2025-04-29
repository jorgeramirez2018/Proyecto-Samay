const shopContent = document.querySelector(".products-content");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(productos);
productos.forEach((product) => {
  const content = document.createElement("div");
  content.classList.add("product");
  content.innerHTML = `
    <img src="${product.img}" alt="Imagen de artesania">
    <div class="product-txt">
      <h3>${product.productName}</h3>
      <p class="precio">${product.price}</p>
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
