let ventasGlobales = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:8080/ventas");
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
    `;
    tbody.appendChild(row);
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