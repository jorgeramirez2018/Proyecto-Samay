  const form = document.getElementById('form-submit');
  const message = document.getElementById('mensaje-newsletter');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    message.textContent = "¡Gracias por unirte! Muy pronto recibirás novedades que honran nuestras raíces.";
    message.style.color = "#789064";
    message.style.fontWeight = "500";

    // Opcional: limpiar el campo de correo
    form.reset();
  });