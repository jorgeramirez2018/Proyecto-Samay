const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

// Inicializar el carrito desde localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log("Carrito inicial:", cart); // Depuración

const displayCart = async () => {
  console.log("Mostrando carrito, contenido:", cart); // Depuración
  if (!modalContainer || !modalOverlay || !cartBtn || !cartCounter) {
    console.error("Elementos del DOM no encontrados:", {
      modalContainer,
      modalOverlay,
      cartBtn,
      cartCounter,
    });
    alert("Error: No se encontraron elementos del carrito en la página.");
    return;
  }

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
  if (cart.length === 0) {
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalBody.innerText = "El carrito está vacío.";
    modalContainer.append(modalBody);
  } else {
    cart.forEach((product, index) => {
      console.log(`Renderizando producto ${index}:`, product); // Depuración
      if (
        !product.id ||
        !product.productName ||
        !product.price ||
        !product.quanty ||
        !product.img
      ) {
        console.warn("Producto incompleto:", product);
        return;
      }
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
  }

  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  // Modal Footer
  const total = cart.reduce(
    (acc, elm) => acc + parseFloat(elm.price) * elm.quanty,
    0
  );

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalFooter.innerHTML = `
    <input type="number" id="usuario-id" placeholder="Ingresa tu ID de usuario" min="1" required>
    <button class="btn-buy" id="btn-buy">Comprar Ahora</button>
    <div class="total-price">Total: ${formatoCOP.format(total)}</div>
  `;
  modalContainer.append(modalFooter);

  const buyButton = document.getElementById("btn-buy");
  buyButton.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Obtener usuario_id desde el input
    const usuarioId = parseInt(document.getElementById("usuario-id").value);
    if (!usuarioId || isNaN(usuarioId) || usuarioId <= 0) {
      alert(
        "Por favor, ingresa un ID de usuario válido (número entero positivo)."
      );
      return;
    }

    try {
      // 1. Crear la venta
      const venta = {
        fecha_venta: new Date().toISOString(),
        total: cart.reduce(
          (acc, elm) => acc + parseFloat(elm.price) * elm.quanty,
          0
        ),
        usuario: {
          usuario_id: usuarioId,
        },
      };

      console.log("Enviando venta:", JSON.stringify(venta, null, 2));

      const ventaResponse = await fetch(
        "http://localhost:8080/ventas/agregarVenta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(venta),
        }
      );

      if (!ventaResponse.ok) {
        const errorText = await ventaResponse.text();
        throw new Error(
          `Error al crear la venta: ${ventaResponse.status} - ${errorText}`
        );
      }

      const ventaResponseData = await ventaResponse.json();
      const ventaId = ventaResponseData.id;
      console.log("Venta creada con ID:", ventaId);

      // 2. Crear VentaConProductosDTO
      const ventaConProductos = {
        ventaId: ventaId,
        productos: cart.map((product) => ({
          productoId: parseInt(product.id),
          cantidad: parseInt(product.quanty),
          precioUnitario: parseFloat(product.price).toFixed(2).toString(), // Enviar como string con 2 decimales
        })),
      };

      console.log(
        "Enviando productos:",
        JSON.stringify(ventaConProductos, null, 2)
      );

      const ventaProductosResponse = await fetch(
        "http://localhost:8080/venta-productos/agregar-multiples",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ventaConProductos),
        }
      );

      if (!ventaProductosResponse.ok) {
        const errorText = await ventaProductosResponse.text();
        console.log("Respuesta de error del servidor:", errorText);
        throw new Error(
          `Error al agregar los productos: ${ventaProductosResponse.status} - ${errorText}`
        );
      }

      const ventaProductosData = await ventaProductosResponse.json();
      console.log(
        "Respuesta de productos:",
        JSON.stringify(ventaProductosData, null, 2)
      );

      // 3. Compra exitosa: vaciar carrito y actualizar UI
      alert("¡Gracias por tu compra!");
      cart.length = 0;
      localStorage.setItem("cart", JSON.stringify(cart));
      modalContainer.style.display = "none";
      modalOverlay.style.display = "none";
      displayCartCounter();
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert(
        `Hubo un error al procesar tu compra: ${error.message}. Por favor, intenta nuevamente.`
      );
    }
  });
};

// Botón de carrito
cartBtn.addEventListener("click", displayCart);

// Función para eliminar productos
const deleteCartProduct = (id) => {
  const foundId = cart.findIndex((element) => element.id === id);
  if (foundId !== -1) {
    cart.splice(foundId, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Producto eliminado, carrito actual:", cart);
    displayCart();
    displayCartCounter();
  }
};

// Actualizar contador del carrito
const displayCartCounter = () => {
  const totalItems = cart.reduce(
    (acc, product) => acc + (product.quanty || 0),
    0
  );
  if (cartCounter) {
    cartCounter.innerText = totalItems;
  }
};

displayCartCounter();
