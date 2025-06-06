document.addEventListener("DOMContentLoaded", function () {
  // Configuración del sidebar responsivo
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("show");
    });
  } else {
    console.warn("Elementos sidebarToggle o sidebar no encontrados");
  }

  // Inicialización: cargar productos existentes
  loadProducts();

  // Manejar el envío del formulario para agregar productos
  const addProductForm = document.getElementById("addProductForm");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      // Obtener los valores del formulario
      const productNameInput = document.getElementById("productName");
      const descriptionInput = document.getElementById("description");
      const priceInput = document.getElementById("price");
      const quantityInput = document.getElementById("quantity");
      const communityInput = document.getElementById("community");
      const regionInput = document.getElementById("region");
      const categoryInput = document.getElementById("category");
      const imageUrlInput = document.getElementById("imageUrl");

      if (
        !productNameInput ||
        !descriptionInput ||
        !priceInput ||
        !quantityInput ||
        !communityInput ||
        !regionInput ||
        !categoryInput ||
        !imageUrlInput
      ) {
        console.error(
          "Uno o más campos del formulario de agregar producto no se encuentran"
        );
        alert("Error en el formulario. Por favor, verifica los campos.");
        return;
      }

      try {
        // Crear el objeto producto
        const product = {
          productName: productNameInput.value,
          description: descriptionInput.value,
          price: parseFloat(priceInput.value) || 0,
          quanty: parseInt(quantityInput.value) || 0,
          community: communityInput.value,
          region: regionInput.value,
          category: categoryInput.value,
          img: imageUrlInput.value || "",
        };

        // Guardar el producto en el backend
        await saveProduct(product);

        // Cerrar el modal y resetear el formulario
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addProductModal")
        );
        if (modal) {
          modal.hide();
        } else {
          console.warn("Modal addProductModal no encontrado");
        }
        this.reset();
        this.classList.remove("was-validated");
      } catch (error) {
        console.error("Error al agregar producto:", error);
        alert("Error al agregar el producto: " + error.message);
      }
    });
  } else {
    console.error("Formulario addProductForm no encontrado");
    alert(
      "Formulario para agregar productos no encontrado. Por favor, verifica el HTML."
    );
  }

  // Manejar el envío del formulario para editar productos
  const editProductForm = document.getElementById("editProductForm");
  if (editProductForm) {
    editProductForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      const editProductIdInput = document.getElementById("editProductId");
      if (!editProductIdInput) {
        console.error("Elemento editProductId no encontrado");
        alert(
          "Error en el formulario de edición. Por favor, verifica los campos."
        );
        return;
      }
      const producto_id = editProductIdInput.value;

      try {
        // Crear el objeto producto actualizado
        const updatedProduct = {
          productName: document.getElementById("editProductName")?.value || "",
          description: document.getElementById("editDescription")?.value || "",
          price: parseFloat(document.getElementById("editPrice")?.value || 0),
          quanty: parseInt(document.getElementById("editQuantity")?.value || 0),
          community: document.getElementById("editCommunity")?.value || "",
          region: document.getElementById("editRegion")?.value || "",
          category: document.getElementById("editCategory")?.value || "",
          img: document.getElementById("editImageUrl")?.value || "",
        };

        // Depuración: mostrar el objeto enviado
        console.log("Enviando producto actualizado:", updatedProduct);

        // Actualizar el producto en el backend
        const response = await fetch(
          `http://localhost:8080/productos/editarProducto/${producto_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error al actualizar el producto: ${response.status} - ${errorText}`
          );
        }

        // Recargar productos
        await loadProducts();

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("editProductModal")
        );
        if (modal) {
          modal.hide();
        } else {
          console.warn("Modal editProductModal no encontrado al cerrar");
        }
        this.classList.remove("was-validated");
      } catch (error) {
        console.error("Error al editar producto:", error);
        alert("Error al editar el producto: " + error.message);
      }
    });
  } else {
    console.error("Formulario editProductForm no encontrado");
    alert(
      "Formulario para editar productos no encontrado. Por favor, verifica el HTML."
    );
  }
});

// Función para guardar un producto en el backend
async function saveProduct(product) {
  console.log("Guardando producto:", product);
  const response = await fetch(
    "http://localhost:8080/productos/agregarProducto",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al guardar el producto: ${response.status} - ${errorText}`
    );
  }
  await loadProducts();
}

// Función para cargar los productos desde el backend
async function loadProducts() {
  try {
    const response = await fetch("http://localhost:8080/productos");
    if (!response.ok) throw new Error("Error al cargar los productos");
    const products = await response.json();
    const tableBody = document.getElementById("productTableBody");
    if (!tableBody) {
      console.error("Elemento productTableBody no encontrado");
      alert("Tabla de productos no encontrada. Por favor, verifica el HTML.");
      return;
    }
    tableBody.innerHTML = "";

    products.forEach((product) => {
      if (!product.producto_id) {
        console.warn("Producto sin producto_id:", product);
        return;
      }

      console.log("Producto recibido:", product);
      console.log("Imagen en src:", product.img);

      const row = document.createElement("tr");
      const categoryDisplay = `<span class="category-badge category-${
        product.category?.toLowerCase() || ""
      }">${getCategoryDisplayName(product.category)}</span>`;

      row.innerHTML = `
                <td>${product.producto_id.toString().slice(-4)}</td>
                <td>
                    <img src="${product.img || 'https://placehold.co/60x60'}"
                        alt="${product.productName || 'Sin nombre'}"
                        width="50" height="50"
                        class="img-thumbnail"
                        onerror="this.src='https://placehold.co/60x60'">
                  </td>
                <td>${product.productName || "N/A"}</td>
                <td>${product.community || "N/A"}</td>
                <td>${categoryDisplay}</td>
                <td>$${product.price?.toFixed(2) || "0.00"}</td>
                <td>${product.quanty || 0}</td>
                <td>
                    <button class="btn btn-sm btn-secondary rounded-pill px-3 me-1 edit-btn" data-id="${
                      product.producto_id
                    }">
                        <i class='bx bx-edit-alt' style='color: white;'></i>                
                    </button>
                    <button class="btn btn-sm btn-danger rounded-pill px-3 delete-btn" data-id="${
                      product.producto_id
                    }">
                        <i class='bx bx-trash' style='color: white;'></i>
                    </button>
                </td>
            `;

      tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        editProduct(this.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        deleteProduct(this.getAttribute("data-id"));
      });
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    alert("Error al cargar los productos: " + error.message);
  }
}

// Función para obtener el nombre de visualización de la categoría
function getCategoryDisplayName(category) {
  const categoryMap = {
    JOYERIA: "Joyería",
    CERAMICA: "Cerámica",
    CESTERIA: "Cestería",
    TEJIDOS: "Tejidos",
    ROPA: "Ropa",
  };
  return categoryMap[category] || category || "N/A";
}

// Función para editar un producto
async function editProduct(producto_id) {
  try {
    const response = await fetch(
      `http://localhost:8080/productos/buscar/${producto_id}`
    );
    if (!response.ok) throw new Error("Error al obtener el producto");
    const product = await response.json();

    if (product) {
      const editProductIdInput = document.getElementById("editProductId");
      const editProductNameInput = document.getElementById("editProductName");
      const editDescriptionInput = document.getElementById("editDescription");
      const editPriceInput = document.getElementById("editPrice");
      const editQuantityInput = document.getElementById("editQuantity");
      const editCommunityInput = document.getElementById("editCommunity");
      const editRegionInput = document.getElementById("editRegion");
      const editCategoryInput = document.getElementById("editCategory");
      const editImageUrlInput = document.getElementById("editImageUrl");

      if (
        !editProductIdInput ||
        !editProductNameInput ||
        !editDescriptionInput ||
        !editPriceInput ||
        !editQuantityInput ||
        !editCommunityInput ||
        !editRegionInput ||
        !editCategoryInput ||
        !editImageUrlInput
      ) {
        console.error(
          "Uno o más campos del formulario de edición no se encuentran"
        );
        console.error({
          editProductId: !!editProductIdInput,
          editProductName: !!editProductNameInput,
          editDescription: !!editDescriptionInput,
          editPrice: !!editPriceInput,
          editQuantity: !!editQuantityInput,
          editCommunity: !!editCommunityInput,
          editRegion: !!editRegionInput,
          editCategory: !!editCategoryInput,
          editImageUrl: !!editImageUrlInput,
        });
        alert(
          "Error al cargar el formulario de edición. Por favor, verifica los campos."
        );
        return;
      }

      editProductIdInput.value = product.producto_id || "";
      editProductNameInput.value = product.productName || "";
      editDescriptionInput.value = product.description || "";
      editPriceInput.value = product.price || "";
      editQuantityInput.value = product.quanty || "";
      editCommunityInput.value = product.community || "";
      editRegionInput.value = product.region || "";
      editCategoryInput.value = product.category || "";
      editImageUrlInput.value = product.img || "";

      // Depuración: verificar que el modal existe
      const editModalElement = document.getElementById("editProductModal");
      if (!editModalElement) {
        console.error(
          "Modal editProductModal no encontrado al intentar abrirlo"
        );
        alert("Modal de edición no encontrado. Por favor, verifica el HTML.");
        return;
      }

      // Abrir el modal
      const editModal =
        bootstrap.Modal.getInstance(editModalElement) ||
        new bootstrap.Modal(editModalElement);
      editModal.show();
    }
  } catch (error) {
    console.error("Error al editar producto:", error);
    alert("Error al cargar los datos del producto: " + error.message);
  }
}

// Función para eliminar un producto
async function deleteProduct(producto_id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    try {
      const response = await fetch(
        `http://localhost:8080/productos/borrarProducto/${producto_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al eliminar el producto: ${response.status} - ${errorText}`
        );
      }
      await loadProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto: " + error.message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "/Registro/login.html";
    return;
  }

  try {
    const decoded = jwt_decode(token);

    if (decoded.role !== "admin") {
      alert("No tienes permisos para acceder a esta página.");
      window.location.href = "/VistaComprador/home/index.html";
      return;
    }

    // ✅ Si pasa validación, mostrar el contenido
    document.body.style.display = "block";
  } catch (error) {
    console.error("Token inválido o expirado", error);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/home/index.html";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Previene navegación inmediata
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/home/index.html"; // Redirige al home o login
    });
  }
});