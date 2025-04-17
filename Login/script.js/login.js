document.addEventListener('DOMContentLoaded', function() {
  // Por mejorar el envío del formulario de login
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      
      // lógica para enviar los datos al servidor
      console.log('Intentando iniciar sesión con:', email);
      
      // Simulación de envío
      alert('Iniciando sesión...');
    });
  }
  
  // Para el newsletter
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Lógica para suscripción al newsletter
      console.log('Suscripción al newsletter:', email);
      
      // Simulación de confirmación
      alert('¡Gracias por suscribirte a nuestro newsletter!');
      newsletterForm.reset();
    });
  }
});