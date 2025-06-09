const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");
 
// Asume que 'cart' es una variable global accesible
// let cart = JSON.parse(localStorage.getItem("cart")) || [];
 
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
 
  const total = cart.reduce((acc, elm) => acc + elm.price * elm.quanty, 0);
 
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalFooter.innerHTML = `
    <button class="btn-buy" id="btn-buy">Comprar Ahora</button>
    <div class="total-price">Total: ${formatoCOP.format(total)}</div>
  `;
  modalContainer.append(modalFooter);
 
  // --- INICIO DE LA MODIFICACIÓN ---
  const buyButton = document.getElementById("btn-buy");
  buyButton.addEventListener("click", () => {
    alert("No se puede hacer la compra porque no ha iniciado sesión.");
    window.location.href = "../Registro/login.html";
    return;
 
    const usuarioIdInput = prompt("Ingresa el ID del usuario:");
    if (usuarioIdInput === null) return;
 
    const usuarioId = parseInt(usuarioIdInput);
    if (isNaN(usuarioId) || usuarioId <= 0) {
      alert("Se requiere un ID de usuario válido y numérico positivo.");
      return;
    }
 
    const total = cart.reduce((acc, item) => acc + item.price * item.quanty, 0);
 
    const ventaData = {
      fecha_venta: new Date().toISOString(),
      total: total,
      usuario: {
        usuario_id: usuarioId,
      },
    };
 
    // PRIMERA PETICIÓN
    fetch("https://25kdtzqrsa.us-east-1.awsapprunner.com/ventas/agregarVenta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ventaData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error("Error en agregarVenta: " + text);
          });
        }
        return response.json();
      })
      .then((ventaCreada) => {
        const ventaId = ventaCreada.id;
        if (!ventaId) throw new Error("No se recibió el ID de la venta creada.");
 
        const productosParaEnviar = cart.map((product) => ({
          productoId: parseInt(product.id),
          precioUnitario: parseFloat(product.price),
          cantidad: parseInt(product.quanty),
        }));
 
        const payload = {
          ventaId: ventaId,
          productos: productosParaEnviar,
        };
 
        // SEGUNDA PETICIÓN
        return fetch("https://25kdtzqrsa.us-east-1.awsapprunner.com/venta-productos/agregar-multiples", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error("Error en agregar-multiples: " + text);
          });
        }
        return response.text();
      })
      .then((mensajeFinal) => {
        alert("Venta realizada con éxito:\n" + mensajeFinal);
        cart.length = 0;
        localStorage.setItem("cart", JSON.stringify(cart));
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
        displayCartCounter();
      })
      .catch((error) => {
        console.error("Error en el proceso de venta:", error);
        alert("Error en el proceso de venta: " + error.message);
      });
  });
  // --- FIN DE LA MODIFICACIÓN ---
};
 
// Botón de carrito
cartBtn.addEventListener("click", displayCart);
 
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
 
displayCartCounter();
 
