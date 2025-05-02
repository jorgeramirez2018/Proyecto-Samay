const toggleBtn = document.getElementById("menu-toggle");
const navbar = document.querySelector(".navbar");

toggleBtn.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
