// Исходный дизайн: https://dribbble.com/shots/11012652--Timed-Cards-Opening

// Импорт библиотек
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js';
import splitting from "https://cdn.skypack.dev/splitting@1.0.6";

// Инициализация элементов
const heroEl = document.querySelector(".hero");
const fullSizeWrapEl = heroEl.querySelector(".hero__fullsize");
const contentEls = heroEl.querySelectorAll(".swiper .content");

// Создание клонов контента для полноэкранного режима
const contentFullsizeEls = Array.from(contentEls, (el) => {
  const clone = el.cloneNode(true);
  splitting({ target: clone, by: "words" }); // Разделение текста на слова для анимации
  
  // Добавление необходимых классов
  clone.classList.add("hero__content", "hero__content--hidden", "content--hero");
  clone.classList.remove("content--slide");
  return clone;
});

// Добавление клонов в DOM
contentFullsizeEls.forEach((el) => fullSizeWrapEl.appendChild(el));

// Состояние анимации
const state = {
  topContent: null,    // Текущий активный контент
  bottomContent: null  // Предыдущий активный контент
};

/**
 * Обработчик изменения слайда
 * @param {Swiper} swiper - Экземпляр Swiper
 */
function slideChange(swiper) {
  // Определение активного слайда с учетом цикличности
  const total = swiper.slides.length - swiper.loopedSlides * 2;
  const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;
  const content = contentFullsizeEls[contentIndex];
  
  if (!content) return;

  // Управление предыдущими слайдами
  if (state.bottomContent) {
    state.bottomContent.classList.remove("hero__content--bottom");
    state.bottomContent.classList.add("hero__content--hidden");
  }

  if (state.topContent) {
    state.topContent.classList.remove("hero__content--top");
    state.topContent.classList.add("hero__content--bottom");
  }

  // Обновление состояния
  state.bottomContent = state.topContent;
  state.topContent = content;

  // Позиционирование нового слайда в соответствии с его позицией в карусели
  const slidetRect = swiper.slides[swiper.activeIndex].getBoundingClientRect();
  const parentRect = heroEl.getBoundingClientRect();

  // Установка начальной позиции без анимации
  content.style.transition = "none";
  content.style.left = `${slidetRect.left - parentRect.left}px`;
  content.style.top = `${slidetRect.top - parentRect.top}px`;
  content.style.width = `${slidetRect.width}px`;
  content.style.height = `${slidetRect.height}px`;
  content.style.borderRadius = "var(--border-radius, 0)";

  // Форсирование перерасчета макета для применения стилей
  content.getBoundingClientRect();

  // Активация и подготовка к анимации
  content.classList.remove("hero__content--hidden");
  content.classList.add("hero__content--top", "hero__content--grow");

  // Сброс стилей для анимации в полный размер
  content.style.transition = "";
  content.style.left = "";
  content.style.top = "";
  content.style.width = "";
  content.style.height = "";
  content.style.borderRadius = "";

  // Обработчики анимации
  
  // Обработчик завершения анимации показа текста
  const onShowTextEnd = (event) => {
    if (event.target !== event.currentTarget) {
      event.currentTarget.classList.remove("hero__content--show-text");
      event.currentTarget.removeEventListener("transitionend", onShowTextEnd);
    }
  };

  // Обработчик завершения анимации увеличения
  const onGrowEnd = (event) => {
    event.currentTarget.classList.remove("hero__content--grow");
    event.currentTarget.classList.add("hero__content--show-text");
    event.currentTarget.addEventListener("transitionend", onShowTextEnd);
  };

  // Добавление обработчика для отслеживания завершения анимации
  content.addEventListener("transitionend", onGrowEnd, { once: true });
}

/**
 * Инициализация первого слайда при запуске Swiper
 * @param {Swiper} swiper - Экземпляр Swiper
 */
function swiperInit(swiper) {
  // Определение активного слайда с учетом цикличности
  const total = swiper.slides.length - swiper.loopedSlides * 2;
  const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;
  const content = contentFullsizeEls[contentIndex];
  
  if (!content) return;

  // Установка первого слайда как активного
  content.classList.remove("hero__content--hidden");
  content.classList.add("hero__content--top");
  state.topContent = content;
}

// Инициализация Swiper
const swiper = new Swiper(".swiper", {
  // Основные настройки
  slidesPerView: 3.5,  // Количество видимых слайдов
  spaceBetween: 25,    // Расстояние между слайдами
  loop: true,          // Циклический режим
  speed: 2000,         // Скорость анимации
  simulateTouch: true, // Включение сенсорного управления
  grabCursor: true,    // Курсор захвата при наведении
  slideToClickedSlide: true,  // Переход к слайду при клике

  // Автоматическая прокрутка
  autoplay: {
    delay: 3000, // Увеличенная задержка между слайдами в мс
    disableOnInteraction: false // Продолжать автопрокрутку после взаимодействия пользователя
  },

  // Навигация
  navigation: {
    nextEl: ".swiper-button-next", // Кнопка "Следующий"
    prevEl: ".swiper-button-prev"  // Кнопка "Предыдущий"
  },
  
  // Обработчики событий
  on: { 
    realIndexChange: slideChange, // При изменении слайда
    init: swiperInit            // При инициализации
  }
});

// Примечание: используем встроенный параметр slideToClickedSlide для обработки кликов