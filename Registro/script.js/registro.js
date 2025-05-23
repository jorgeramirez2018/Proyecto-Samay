document.addEventListener("DOMContentLoaded", () => {
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
  
 function guardarUsuario(nombre, telefono, email, password) {
  const usuario = {
    nombre: nombre,
    telefono: telefono,
    email: email,
    password: password, // ⚠️ Recuerda: esto debe cifrarse en un proyecto real
    fechaRegistro: new Date().toISOString()
  };

  // Obtener usuarios existentes
  const usuariosGuardados = JSON.parse(localStorage.getItem('users')) || [];

  // Verificar si ya hay un usuario con ese email
  const yaRegistrado = usuariosGuardados.some(user => user.email === email);
  if (yaRegistrado) {
    mostrarError("Este correo ya está registrado.");
    return;
  }

  // Agregar el nuevo usuario al array
  usuariosGuardados.push(usuario);

  // Guardar el array actualizado en localStorage
  localStorage.setItem('users', JSON.stringify(usuariosGuardados));

  // Guardar sesión actual
  localStorage.setItem('currentUser', JSON.stringify({
    email: usuario.email,
    name: usuario.nombre
  }));
    
    // Redireccionar a la página principal 
    alert('¡Registro exitoso! Bienvenido/a a Samay.');
    window.location.href = '../home/index.html'; // Cambia esta ruta según tu estructura
  }
  
  // Agregar evento submit al formulario
  form.addEventListener('submit', validarFormulario);
  // Ojito en la contraseña
  document.getElementById('togglePassword').addEventListener('click', function() {
    const password = document.getElementById('password');
    const icon = this;
    
    if (password.type === 'password') {
      password.type = 'text';
      icon.classList.replace('bx-hide', 'bx-show');
    } else {
      password.type = 'password';
      icon.classList.replace('bx-show', 'bx-hide');
    }
  });

});

