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

const form = document.getElementById('formRegistro');
      form.addEventListener('submit', function (e) {
        e.preventDefault();

})

//VALIDACIONES// 

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formRegistro');
  
  // Función para validar el formulario
  function validarFormulario(event) {
    event.preventDefault();
    
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    
    // Validar nombre
    if (nombre.length < 3) {
      mostrarError('Por favor, ingresa un nombre válido (mínimo 3 caracteres)');
      return false;
    }
    
    // Validar teléfono (debe ser 10 dígitos)
    if (!/^\d{10}$/.test(telefono)) {
      mostrarError('Por favor, ingresa un número de teléfono válido (10 dígitos)');
      return false;
    }
    
    // Validar email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      mostrarError('Por favor, ingresa un correo electrónico válido');
      return false;
    }
    
    // Validar contraseña (al menos 6 caracteres, una mayúscula, un número)
    if (password.length < 6) {
      mostrarError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      mostrarError('La contraseña debe incluir al menos una letra mayúscula');
      return false;
    }
    
    if (!/\d/.test(password)) {
      mostrarError('La contraseña debe incluir al menos un número');
      return false;
    }
    
    // Si todo está correcto, guardar en localStorage y redirigir
    guardarUsuario(nombre, telefono, email, password);
    return true;
  }
  
  // Función para mostrar mensajes de error
  function mostrarError(mensaje) {
    // Verificar si ya existe un mensaje de error
    let errorElement = document.querySelector('.error-mensaje');
    
    if (!errorElement) {
      // Crear un nuevo elemento para el mensaje de error
      errorElement = document.createElement('div');
      errorElement.className = 'error-mensaje';
      form.parentNode.insertBefore(errorElement, form);
    }
    
    // Agregar el mensaje y mostrar
    errorElement.textContent = mensaje;
    errorElement.style.color = 'red';
    errorElement.style.marginBottom = '15px';
  }
  
  // Función para guardar los datos del usuario en localStorage
  function guardarUsuario(nombre, telefono, email, password) {
    // Crear objeto con datos del usuario
    const usuario = {
      nombre: nombre,
      telefono: telefono,
      email: email,
      password: password, // En una aplicación real, nunca guardar contraseñas en texto plano
      fechaRegistro: new Date().toISOString()
    };
    
    // Guardar usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    // Establecer sesión activa
    localStorage.setItem('sesionActiva', 'true');
    
    // Redireccionar a la página principal o dashboard (ajustar según sea necesario)
    alert('¡Registro exitoso! Bienvenido/a a Samay.');
    window.location.href = '../home/index.html'; // Cambia esta ruta según tu estructura
  }
  
  // Agregar evento submit al formulario
  form.addEventListener('submit', validarFormulario);
});


//REDIRIGIR AL HOME SI PASA VALIDACIONES

