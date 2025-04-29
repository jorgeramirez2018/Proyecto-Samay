document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.getElementById("modal-container");
  const modalOverlay = document.getElementById("modal-overlay");
  const cartBtn = document.getElementById("cart-btn");
  const cartCounter = document.getElementById("cart-counter");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // Modal Header
    const modalHeader = document.createElement("div");

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
      modalContainer.style.display = "none";
      modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);
    modalContainer.append(modalHeader);

    // Modal Body
    cart.forEach((product) => {
      const modalBody = document.createElement("div");
      modalBody.className = "modal-body";
      modalBody.innerHTML = `
        <div class="modal-product">
          <img class="product-img" src="${product.img}" />
          <div class="product-info">
            <h4>${product.productName}</h4>
          </div>
          <div class="quantity">
            <span class="quantity-btn-decrese">-</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increse">+</span>
          </div>
          <div class="price">${
            parseFloat(product.price) * parseFloat(product.quanty)
          } $</div>
          <div class="delete-product">❌</div>
        </div>
      `;
      modalContainer.append(modalBody);

      const decrease = modalBody.querySelector(".quantity-btn-decrese");
      decrease.addEventListener("click", () => {
        if (product.quanty !== 1) {
          product.quanty--;
          localStorage.setItem("cart", JSON.stringify(cart));
          displayCart();
          displayCartCounter();
        }
      });

      const increase = modalBody.querySelector(".quantity-btn-increse");
      increase.addEventListener("click", () => {
        product.quanty++;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
        displayCartCounter();
      });

      const deleteProduct = modalBody.querySelector(".delete-product");
      deleteProduct.addEventListener("click", () => {
        deleteCartProduct(product.id);
      });
    });

    // Modal Footer
    const total = cart.reduce((acc, elm) => acc + elm.price * elm.quanty, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
      <button class="btn-buy" id="btn-buy">Comprar Ahora</button>
      <div class="total-price">Total: ${total} $</div>
    `;
    modalContainer.append(modalFooter);

    const buyButton = document.getElementById("btn-buy");
    buyButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      alert("¡Gracias por tu compra!");
      cart.length = 0;
      localStorage.setItem("cart", JSON.stringify(cart));
      modalContainer.style.display = "none";
      modalOverlay.style.display = "none";
      displayCartCounter();
    });
  };

  // Eliminar producto
  const deleteCartProduct = (id) => {
    const foundId = cart.findIndex((element) => element.id === id);
    cart.splice(foundId, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    displayCartCounter();
  };

  const displayCartCounter = () => {
    const totalItems = cart.reduce((acc, product) => acc + product.quanty, 0);
    cartCounter.innerText = totalItems;
  };

  cartBtn.addEventListener("click", displayCart);
  displayCartCounter();
});
