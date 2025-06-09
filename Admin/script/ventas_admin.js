let ventasGlobales = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://25kdtzqrsa.us-east-1.awsapprunner.com/ventas");
    if (!response.ok) throw new Error("No se pudo cargar ventas");

    ventasGlobales = await response.json();
    mostrarVentas(ventasGlobales);

    const filtroFecha = document.getElementById("filtroFecha");
    if (filtroFecha) {
      filtroFecha.addEventListener("input", () => {
        const fechaSeleccionada = filtroFecha.value;
        if (!fechaSeleccionada) {
          mostrarVentas(ventasGlobales);
        } else {
          const filtradas = ventasGlobales.filter((v) =>
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

  lista.forEach((v) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${v.venta_id ?? "N/A"}</td>
      <td>${v.usuario?.nombre ?? "Sin nombre"}</td>
      <td>$${v.total?.toFixed(2) ?? "0.00"}</td>
      <td>${v.fecha_venta?.split("T")[0] ?? "-"}</td>
      <td>
        <select class="form-select form-select-sm" data-id="${
          v.venta_id
        }" data-field="detalleEnvio">
          <option value="En proceso" ${
            v.detalleEnvio === "En proceso" ? "selected" : ""
          }>En proceso</option>
          <option value="Enviado" ${
            v.detalleEnvio === "Enviado" ? "selected" : ""
          }>Enviado</option>
          <option value="Cancelado" ${
            v.detalleEnvio === "Cancelado" ? "selected" : ""
          }>Cancelado</option>
        </select>
      </td>
      <td>✅ Aprobado</td>
      <td>
        <button class="btn btn-sm btn-outline-primary ver-detalles" data-id="${
          v.venta_id
        }">
          Ver detalles
        </button>
        <button class="btn btn-sm btn-outline-success actualizar-venta" data-id="${
          v.venta_id
        }">
          Guardar
        </button>
      </td>
    `;

    tbody.appendChild(row);

    row
      .querySelector(".ver-detalles")
      ?.addEventListener("click", () => mostrarDetallesVenta(v.venta_id));

    row
      .querySelector(".actualizar-venta")
      ?.addEventListener("click", async () => {
        const selectEnvio = row.querySelector(
          `select[data-field="detalleEnvio"]`
        );
        const nuevaVenta = { detalleEnvio: selectEnvio.value };

        try {
          const res = await fetch(
            `https://25kdtzqrsa.us-east-1.awsapprunner.com/ventas/actualizarEstado/${v.venta_id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(nuevaVenta),
            }
          );

          if (!res.ok) throw new Error("Error al actualizar venta");

          alert("Estado de envío actualizado correctamente");
        } catch (error) {
          console.error(error);
          alert("Error al guardar los cambios");
        }
      });
  });
}

// Exportar a Excel
document.getElementById("btnExportarExcel")?.addEventListener("click", () => {
  const datos = ventasGlobales.map((v) => ({
    "ID Venta": v.venta_id,
    Cliente: v.usuario?.nombre || "Sin nombre",
    Total: v.total?.toFixed(2) || "0.00",
    Fecha: v.fecha_venta?.split("T")[0] || "-",
    "Estado Envío": v.detalleEnvio || "",
    "Estado Pago": "Aprobado",
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  XLSX.writeFile(wb, "ventas.xlsx");
});

// Modal Detalles Venta
async function mostrarDetallesVenta(ventaId) {
  try {
    const response = await fetch(
      `https://25kdtzqrsa.us-east-1.awsapprunner.com/venta-productos/venta/${ventaId}`
    );
    if (!response.ok) throw new Error("No se pudo cargar los detalles");

    const detalles = await response.json();
    const tbody = document.getElementById("detalleVentaBody");
    tbody.innerHTML = "";

    detalles.forEach((item) => {
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

// Validación de token y logout
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

    document.body.style.display = "block";
  } catch (error) {
    console.error("Token inválido o expirado", error);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/home/index.html";
  }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/home/index.html";
    });
  }
});
