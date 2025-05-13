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




//REDIRIGIR AL HOME SI PASA VALIDACIONES

