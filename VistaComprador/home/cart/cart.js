const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

const displayCart = async() => {
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
  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  // Modal Footer
  const total = cart.reduce((acc, elm) => acc + elm.price * elm.quanty, 0);

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalFooter.innerHTML = `
  <button class="btn-buy" id="btn-buy">Comprar Ahora</button>
  <div class="total-price">Total: ${formatoCOP.format(total)} $</div>
`;
  modalContainer.append(modalFooter);

  const buyButton = document.getElementById("btn-buy");
  buyButton.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {

      for (const product of cart) {
        const response = await fetch("http://localhost:8080/articulo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: product.productName,
            precio: product.price,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Error al enviar el producto: ${product.productName}`
          );
        }
      }

      alert("¡Gracias por tu compra!");
      cart.length = 0;
      localStorage.setItem("cart", JSON.stringify(cart));
      modalContainer.style.display = "none";
      modalOverlay.style.display = "none";
      displayCartCounter();
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert(
        "Hubo un error al procesar tu compra. Por favor, intenta nuevamente."
      );
    }
  });
};

// Botón de carrito
cartBtn.addEventListener("click", displayCart);

// Función para eliminar productos
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

displayCartCounter();
