const form = document.getElementById('form-submit');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Mostrar alerta
  alert("¡Gracias por unirte! Muy pronto recibirás novedades que honran nuestras raíces.");

  // Limpiar campo de correo
  form.reset();
});