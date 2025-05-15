document.addEventListener("DOMContentLoaded", () => {
  // Cargar la navbar
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

  // Footer (si también lo usas)
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

 // manejador del formulario de login
const form = document.getElementById('form-login');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validar campos vacíos
    if (email === "" || password === "") {
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
    
    // Verificar credenciales con localStorage
    authenticateUser(email, password);
  });

/**
 * Valida el formato del correo electrónico
 * @param {string} email 
 * @returns {boolean} 
 *  
 * */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Autentica al usuario verificando contra localStorage
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 */
function authenticateUser(email, password) {
  try {
    // Obtener usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar el usuario por correo electrónico
    const user = storedUsers.find(user => user.email === email);
    
    if (user && user.password === password) {
      // Credenciales correctas
      showAlert("¡Inicio de sesión exitoso!", "success");
      
      //  información de sesión activa
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        name: user.nombre
      }));
      
      // Redireccionar a la página de inicio
      setTimeout(() => {
        window.location.href = '../../home/index.html'; 
      }, 1500);
    } else {
      showAlert("Correo electrónico o contraseña inválidos", "error");
    }
  } catch (error) {
    console.error("Error al autenticar:", error);
    showAlert("Ocurrió un error al intentar iniciar sesión", "error");
  }
}

/**
 * Muestra una alerta al usuario
 * @param {string} message 
 * @param {string} type 
 */

function showAlert(message, type) {
    const prevAlert = document.querySelector('.alert');
  if (prevAlert) {
    prevAlert.remove();
  }
  
  // Crear elemento de alerta
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  
  // Insertar alerta después del formulario
  const formElement = document.getElementById('form-login');
  formElement.insertAdjacentElement('afterend', alertElement);
  
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}

