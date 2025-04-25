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
      saludo.textContent = "Por favor revisa los campos: nombre (mín. 2 letras), correo válido, teléfono (solo números), y mensaje (mín. 10 caracteres).";
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

      saludo.textContent = `¡Hola ${nombre}! ⚡ Gracias por enviar tus datos, nos contactaremos pronto contigo.`;
      saludo.style.color = "green";

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
