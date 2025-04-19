let h1 = document.querySelector('.nosotros h1');

h1.addEventListener('mouseenter', function () {
  h1.style.transform = 'scale(1.1)';
});

h1.addEventListener('mouseleave', function () {
  h1.style.transform = 'scale(1)';
});