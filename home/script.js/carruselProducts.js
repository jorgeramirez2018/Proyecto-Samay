let currentIndex = 4; // hay 4 clones al inicio

const carousel = document.querySelector(".carousel");
const container = document.querySelector(".carousel-container");

// Obtener las tarjetas originales antes de clonar
let items = Array.from(carousel.children);
const originalItems = [...items];

// Clonar 4 al final y 4 al inicio
for (let i = 0; i < 4; i++) {
  carousel.appendChild(originalItems[i].cloneNode(true));
  carousel.insertBefore(
    originalItems[originalItems.length - 1 - i].cloneNode(true),
    carousel.firstChild
  );
}

items = Array.from(carousel.children);

const getCardWidth = () => {
  const itemStyle = getComputedStyle(carousel);
  const gap = parseInt(itemStyle.gap) || 0;
  return items[0].offsetWidth + gap;
};

// Función para centrar la tarjeta activa
const moveCarousel = (index) => {
  const cardWidth = getCardWidth();
  const containerWidth = container.offsetWidth;
  const offset = (containerWidth - cardWidth) / 2;
  carousel.style.transition = "transform 0.5s ease-in-out";
  carousel.style.transform = `translateX(${-index * cardWidth + offset}px)`;
};

// Inicializar posición centrada
const initCarousel = () => {
  const cardWidth = getCardWidth();
  const containerWidth = container.offsetWidth;
  const offset = (containerWidth - cardWidth) / 2;
  carousel.style.transition = "none";
  carousel.style.transform = `translateX(${
    -currentIndex * cardWidth + offset
  }px)`;
};

initCarousel();

// Ajuste automático al cambiar el tamaño de la ventana
window.addEventListener("resize", () => {
  moveCarousel(currentIndex);
});

const totalCards = carousel.children.length;

// Listener para rebobinar al inicio/final real
carousel.addEventListener("transitionend", () => {
  const cardWidth = getCardWidth();
  const containerWidth = container.offsetWidth;
  const offset = (containerWidth - cardWidth) / 2;

  if (currentIndex >= totalCards - 4) {
    carousel.style.transition = "none";
    currentIndex = 4;
    carousel.style.transform = `translateX(${
      -currentIndex * cardWidth + offset
    }px)`;
  }

  if (currentIndex < 4) {
    carousel.style.transition = "none";
    currentIndex = totalCards - 8;
    carousel.style.transform = `translateX(${
      -currentIndex * cardWidth + offset
    }px)`;
  }
});

// Auto-slide
let interval = setInterval(() => {
  currentIndex++;
  moveCarousel(currentIndex);
}, 4000);

// Función para reiniciar auto-slide después de control manual
const restartAutoSlide = () => {
  clearInterval(interval);
  interval = setInterval(() => {
    currentIndex++;
    moveCarousel(currentIndex);
  }, 4000);
};

// Botones de control
document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex++;
  moveCarousel(currentIndex);
  restartAutoSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  currentIndex--;
  moveCarousel(currentIndex);
  restartAutoSlide();
});
