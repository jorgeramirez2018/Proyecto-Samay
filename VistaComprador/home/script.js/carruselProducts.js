function inicializarCarrusel() {
  let currentIndex = 4;

  const carousel = document.querySelector(".carousel");
  const container = document.querySelector(".carousel-container");

  let items = Array.from(carousel.children);
  const originalItems = [...items];

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

  const moveCarousel = (index) => {
    const cardWidth = getCardWidth();
    const containerWidth = container.offsetWidth;
    const offset = (containerWidth - cardWidth) / 2;
    carousel.style.transition = "transform 0.5s ease-in-out";
    carousel.style.transform = `translateX(${-index * cardWidth + offset}px)`;
  };

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

  window.addEventListener("resize", () => {
    moveCarousel(currentIndex);
  });

  const totalCards = carousel.children.length;

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

  let interval = setInterval(() => {
    currentIndex++;
    moveCarousel(currentIndex);
  }, 4000);

  const restartAutoSlide = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      currentIndex++;
      moveCarousel(currentIndex);
    }, 4000);
  };

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
}
