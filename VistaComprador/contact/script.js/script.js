function marcarEnlaceActivo() {
  const navLinks = document.querySelectorAll(".navbar a");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

    if (currentPath.endsWith(linkPath)) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/VistaComprador/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Lógica que depende del HTML cargado
      activarHamburguesa();
      marcarEnlaceActivo();

      // Agregar manejador de cierre de sesión
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
});

function toggleUserMenu() {
  const menu = document.getElementById("userDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Cerrar si hace clic fuera del menú
window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("userDropdown");
  const button = document.querySelector(".user-icon");
  if (!button.contains(e.target)) {
    dropdown.style.display = "none";
  }
}); 


//boton hamburguesa

function activarHamburguesa() {
  const menuToggle = document.querySelector("#menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  } else {
    console.warn("No se encontró el botón o el navbar");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetch("/footer/footer.html")
    .then((res) => res.text())
    .then((data) => {
      const container = document.getElementById("footer");
      const shadow = container.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <link rel="stylesheet" href="/footer/style/footerstyle.css">
        ${data}
      `;
    });
});

function emailJs() {
  const formulario = document.querySelector(".form");
  const saludo = document.getElementById("mensaje-saludo");
  const boton = formulario.querySelector("button");

  emailjs.init("_sWjR3k_Nej5xtX5s");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nombre = evento.target.nombre.value.trim();
    const correo = evento.target.correo.value.trim();
    const telefono = evento.target.telefono.value.trim();
    const mensajeTexto = evento.target.mensaje.value.trim();

    // ✅ Validaciones con RegEx
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const telefonoValido = /^\d{7,}$/.test(telefono);

    if (
      nombre.length < 2 ||
      !emailValido ||
      !telefonoValido ||
      mensajeTexto.length < 10
    ) {
      saludo.textContent =
        "Por favor revisa los campos: nombre (mín. 2 letras), correo válido, teléfono (solo números), y mensaje (mín. 10 caracteres).";
      saludo.style.color = "red";
      return;
    }

    const datos = {
      nombre,
      email: correo,
      celular: telefono,
      mensaje: mensajeTexto,
    };

    const serviceID = "service_d40r32g";
    const templateID = "template_qaicui8";

    boton.disabled = true;
    boton.textContent = "Enviando...";

    try {
      await emailjs.send(serviceID, templateID, datos);
      alert("Gracias por contactarnos");

      saludo.textContent = `¡Hola ${nombre}! 🔶 Gracias por enviar tus datos, nos contactaremos pronto contigo.`;
      saludo.style.color = "green";
      saludo.style.marginTop = "10px";

      formulario.reset();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.");
    } finally {
      boton.disabled = false;
      boton.textContent = "Enviar";
    }
  });
}

emailJs();
