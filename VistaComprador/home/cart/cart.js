const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");

// Función para mostrar el carrito
const displayCart = async () => {
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
    <input type="hidden" id="detalle-envio" placeholder="Detalles de envío (dirección, etc.)" style="width: 100%; margin-bottom: 10px;">
    <button class="btn-buy" id="btn-buy">Comprar Ahora</button>
    <div class="total-price">Total: ${formatoCOP.format(total)}</div>
  `;
  modalContainer.append(modalFooter);

  // Lógica del botón Comprar Ahora
  const buyButton = document.getElementById("btn-buy");
  buyButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token guardado:", token);

    let usuarioId;

    if (token) {
      const decoded = jwt_decode(token);
      console.log("Token decodificado:", decoded);
      console.log("ID del usuario:", decoded.id);

      usuarioId = parseInt(decoded.id);
      if (isNaN(usuarioId) || usuarioId <= 0) {
        alert("Se requiere un ID de usuario válido y numérico positivo.");
        return;
      }
    } else {
      console.log("No hay token guardado en localStorage");
      alert("Debes iniciar sesión para realizar la compra.");
      return;
    }

    console.log("Contenido del carrito:", JSON.stringify(cart));
    const total = cart.reduce((acc, item) => acc + item.price * item.quanty, 0);
    const detalleEnvio = document.getElementById("detalle-envio").value;

    const ventaData = {
      fecha_venta: new Date().toISOString(),
      total: total,
      usuario: {
        usuario_id: usuarioId,
      },
      pagoAprobado: "pendiente",
      detalleEnvio: detalleEnvio || null,
    };

    console.log("Enviando ventaData:", JSON.stringify(ventaData));

    // PRIMERA PETICIÓN - Producción
    fetch("https://25kdtzqrsa.us-east-1.awsapprunner.com/ventas/agregarVenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ventaData),
    })
      .then((response) => {
        console.log("Respuesta de /agregarVenta:", response.status, response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error("Error en agregarVenta: " + text);
          });
        }
        return response.json();
      })
      .then((ventaCreada) => {
        console.log("Venta creada:", ventaCreada);
        const ventaId = ventaCreada.id;
        if (!ventaId)
          throw new Error("No se recibió el ID de la venta creada.");

        const productosParaEnviar = cart.map((product) => ({
          productoId: parseInt(product.id),
          precioUnitario: parseFloat(product.price),
          cantidad: parseInt(product.quanty),
        }));

        const payload = {
          ventaId: ventaId,
          detalleEnvio: detalleEnvio || null,
          productos: productosParaEnviar,
        };

        console.log("Enviando payload a /agregar-multiples:", JSON.stringify(payload));

        // SEGUNDA PETICIÓN - Producción
        return fetch(
          "https://25kdtzqrsa.us-east-1.awsapprunner.com/venta-productos/agregar-multiples",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      })
      .then((response) => {
        console.log("Respuesta de /agregar-multiples:", response.status, response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error("Error en agregar-multiples: " + text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos de /agregar-multiples:", data);
        alert("Pedido Realizado y Enviado Correctamente" + data.message);
        cart.length = 0;
        localStorage.setItem("cart", JSON.stringify(cart));
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
        displayCartCounter();

        if (data.preferenceId) {
          showPaymentModal(data.preferenceId);
        }
      })
      .catch((error) => {
        console.error("Error en el proceso de venta:", error, error.stack);
        alert(
          "Error en el proceso de venta: " +
            error.message +
            "\nDetalles: " +
            JSON.stringify(error)
        );
      });
  });
};

// Función para mostrar el modal de pago
const showPaymentModal = (preferenceId) => {
  const paymentModalContainer = document.getElementById("payment-modal-container");
  const paymentModalOverlay = document.getElementById("payment-modal-overlay");

  if (!paymentModalContainer || !paymentModalOverlay) {
    console.error("No se encontraron los elementos payment-modal-container o payment-modal-overlay en el DOM.");
    alert("Error: No se pudo abrir el modal de pago. Verifica que los contenedores estén en el HTML.");
    return;
  }

  paymentModalContainer.innerHTML = "";
  paymentModalContainer.style.display = "block";
  paymentModalOverlay.style.display = "block";

  const modalHeader = document.createElement("div");
  const modalClose = document.createElement("div");
  modalClose.className = "modal-close";
  modalHeader.append(modalClose);

  modalClose.addEventListener("click", () => {
    paymentModalContainer.style.display = "none";
    paymentModalOverlay.style.display = "none";
  });

  const modalTitle = document.createElement("div");
  modalTitle.className = "modal-title";
  modalHeader.append(modalTitle);
  paymentModalContainer.append(modalHeader);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.id = "checkout-container";
  paymentModalContainer.append(modalBody);

  const mercadopago = new MercadoPago("TEST-257f03fd-7525-43c7-8e1b-1f9b3dd209d0", {
    locale: "es-CO",
  });

  mercadopago.checkout({
    preference: { id: preferenceId },
    autoOpen: true,
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

// Actualizar contador del carrito
const displayCartCounter = () => {
  const totalItems = cart.reduce((acc, product) => acc + product.quanty, 0);
  cartCounter.innerText = totalItems;
};

displayCartCounter();
