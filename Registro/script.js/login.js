document.addEventListener("DOMContentLoaded", () => {
  // Cargar navbar con Shadow DOM
  fetch("/navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      const container = document.getElementById("navbar");
      const shadow = container.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <link rel="stylesheet" href="/navbar/style.css/navbar.css">
        ${data}
      `;
    });

  // Cargar footer con Shadow DOM
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

  // Redirigir si ya está logeado
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      if (decoded.role === "admin") {
        window.location.href = "/Admin/vistas/productos.html";
      } else if (decoded.role === "cliente") {
        window.location.href = "/VistaComprador/home/index.html";
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }
  }
});

// Manejador del formulario de login
const form = document.getElementById("form-login");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showAlert("Por favor, completa todos los campos", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showAlert("Por favor, introduce un correo electrónico válido", "error");
    return;
  }

  if (password.length < 6) {
    showAlert("La contraseña debe tener al menos 6 caracteres", "error");
    return;
  }

  authenticateUser(email, password);
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function authenticateUser(email, password) {
  fetch("http://localhost:8080/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, contrasena: password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Correo o contraseña inválidos");
      return res.text(); // ⚠️ Importante si backend devuelve token como texto plano
    })
    .then((token) => {
      const decoded = jwt_decode(token);

      // ✅ Aquí debería guardarse
      localStorage.setItem("token", token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email, role: decoded.role })
      );

      if (decoded.role === "admin") {
        window.location.href = "/Admin/vistas/productos.html";
      } else if (decoded.role === "cliente") {
        window.location.href = "/VistaComprador/home/index.html";
      } else {
        showAlert("Rol no reconocido", "error");
      }
    })
    .catch((err) => {
      showAlert(err.message, "error");
    });
}

function showAlert(message, type) {
  const prevAlert = document.querySelector(".alert");
  if (prevAlert) prevAlert.remove();

  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;

  const formElement = document.getElementById("form-login");
  formElement.insertAdjacentElement("afterend", alertElement);

  setTimeout(() => alertElement.remove(), 3000);
}

// Toggle para mostrar/ocultar contraseña
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const password = document.getElementById("password");
    const icon = this;

    if (password.type === "password") {
      password.type = "text";
      icon.classList.replace("bx-hide", "bx-show");
    } else {
      password.type = "password";
      icon.classList.replace("bx-show", "bx-hide");
    }
  });
