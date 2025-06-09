let ventasGlobales = [];
const API_BASE_URL = "https://25kdtzqrsa.us-east-1.awsapprunner.com"; 
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ventas`);
    if (!response.ok) throw new Error("No se pudo cargar ventas");

    ventasGlobales = await response.json();
    mostrarVentas(ventasGlobales);

    const filtroFecha = document.getElementById("filtroFecha");
    if (filtroFecha) {
      filtroFecha.addEventListener("input", () => {
        const fechaSeleccionada = filtroFecha.value; // formato: yyyy-mm-dd
        if (!fechaSeleccionada) {
          mostrarVentas(ventasGlobales); // si está vacío, mostrar todas
        } else {
          const filtradas = ventasGlobales.filter(v =>
            v.fechaVenta?.startsWith(fechaSeleccionada)
          );
          mostrarVentas(filtradas);
        }
      });
    }
  } catch (error) {
    console.error(error);
    alert("Error al cargar las ventas: " + error.message);
  }
});

function mostrarVentas(lista) {
  const tbody = document.getElementById("ventasTableBody");
  tbody.innerHTML = "";

  lista.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.venta_id ?? "N/A"}</td>
      <td>${v.usuario?.nombre ?? "Sin nombre"}</td>
      <td>$${v.total?.toFixed(2) ?? "0.00"}</td>
      <td>${v.fecha_venta?.split("T")[0] ?? "-"}</td>
      <td>
    <button class="btn btn-sm btn-outline-primary ver-detalles" data-id="${v.venta_id}">
      Ver detalles
    </button>
  </td>
    `;
    tbody.appendChild(row);
    const btn = row.querySelector(".ver-detalles");
    btn?.addEventListener("click", () => mostrarDetallesVenta(v.venta_id));
  });
}



// FUNCION PARA DESCARGAR EXCEL DE VENTAS

document.getElementById("btnExportarExcel")?.addEventListener("click", () => {
  const datos = ventasGlobales.map(v => ({
    "ID Venta": v.venta_id,
    "Cliente": v.usuario?.nombre || "Sin nombre",
    "Total": v.total?.toFixed(2) || "0.00",
    "Fecha": v.fecha_venta?.split("T")[0] || "-"
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  XLSX.writeFile(wb, "ventas.xlsx");
});

// FUNCION MOSTRAR DETALLES VENTAS - VENTA PRODUCTO

async function mostrarDetallesVenta(ventaId) {
  try {
    const response = await fetch(`${API_BASE_URL}/venta-productos/venta/${ventaId}`);
    if (!response.ok) throw new Error("No se pudo cargar los detalles");

    const detalles = await response.json();
    const tbody = document.getElementById("detalleVentaBody");
    tbody.innerHTML = "";

    detalles.forEach(item => {
      const nombre = item.producto?.productName ?? "Sin nombre";
      const precio = item.precio_unitario ?? 0;
      const cantidad = item.cantidad ?? 0;
      const subtotal = (precio * cantidad).toFixed(2);
      const imagen = item.producto?.img || "https://via.placeholder.com/60";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${imagen}" alt="${nombre}" width="60" height="60" class="img-thumbnail"></td>
        <td>${nombre}</td>
        <td>$${precio.toFixed(2)}</td>
        <td>${cantidad}</td>
        <td>$${subtotal}</td>
      `;
      tbody.appendChild(tr);
    });

    const modalElement = document.getElementById("modalDetallesVenta");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } catch (error) {
    console.error(error);
    alert("Error al cargar los detalles de la venta.");
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