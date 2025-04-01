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
    state.bottomContent.classList.remove("hero__content--show-text"); // Удаляем класс показа текста
    state.bottomContent.classList.add("hero__content--hidden");
  }

  if (state.topContent) {
    state.topContent.classList.remove("hero__content--top");
    state.topContent.classList.remove("hero__content--show-text"); // Удаляем класс показа текста
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
  content.classList.remove("hero__content--show-text"); // Удаляем класс показа текста, если он был добавлен ранее
  content.classList.add("hero__content--top");

  // Сброс стилей для анимации в полный размер
  content.style.transition = "";
  content.style.left = "";
  content.style.top = "";
  content.style.width = "";
  content.style.height = "";
  content.style.borderRadius = "";

  // Упрощенная анимация текста - используем таймер вместо события transitionend
  
  // Используем таймер для показа текста после завершения анимации увеличения
  // Длительность анимации увеличения указана в CSS как --transition-duration: 1000ms
  setTimeout(() => {
    // Добавляем класс для показа текста
    content.classList.add("hero__content--show-text");
  }, 1100); // Задержка 1100мс (время анимации + небольшой запас)
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
  
  // Добавляем показ текста для первого слайда с задержкой
  setTimeout(() => {
    content.classList.add("hero__content--show-text");
  }, 500);
}

// Инициализация Swiper для фотографий гостевого дома и номеров
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация слайдера Swiper для размещения
  const accommodationSwiper = new Swiper('.accommodation-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    speed: 800,
    
    // Добавляем возможность зума
    zoom: {
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
    },
    
    // Навигация
    navigation: {
      nextEl: '.accommodation-button-next',
      prevEl: '.accommodation-button-prev',
    },
    
    // Пагинация
    pagination: {
      el: '.accommodation-pagination',
      clickable: true,
    },
    
    // Адаптивные настройки
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
  
  // Получаем ссылки на модальное окно и его элементы
  const modal = document.querySelector('.accommodation-modal');
  const modalImg = document.querySelector('.accommodation-modal-image');
  const closeBtn = document.querySelector('.accommodation-modal-close');
  const prevBtn = document.querySelector('.modal-prev-btn');
  const nextBtn = document.querySelector('.modal-next-btn');
  const counter = document.querySelector('.modal-counter');
  const slides = document.querySelectorAll('.accommodation-slide img');
  const roomImages = document.querySelectorAll('.room-image');
  const dayImages = document.querySelectorAll('.gallery-img');
  
  // Переменная для хранения текущего индекса изображения
  let currentImageIndex = 0;
  
  // Функция обновления счетчика изображений
  function updateCounter() {
    const totalImages = allImages.length;
    counter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
  }
  
  // Добавляем обработчики событий для каждого изображения гостевого дома
  slides.forEach((img, index) => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      currentImageIndex = index;
      updateCounter();
      
      // Синхронизируем Swiper с текущим изображением
      accommodationSwiper.slideTo(index);
      
      // Останавливаем автоматическую прокрутку слайдера
      if (accommodationSwiper.autoplay && accommodationSwiper.autoplay.running) {
        accommodationSwiper.autoplay.stop();
      }
    });
  });
  
  // Создаем массив всех изображений, которые могут быть открыты в модальном окне
  let allImages = [...slides, ...roomImages, ...dayImages];
  
  // Добавляем обработчики событий для изображений номеров
  roomImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      // Для изображений номеров смещаем индекс на количество изображений дома
      currentImageIndex = slides.length + index;
      updateCounter();
      
      // Останавливаем автоматическую прокрутку слайдера, если он запущен
      if (accommodationSwiper.autoplay && accommodationSwiper.autoplay.running) {
        accommodationSwiper.autoplay.stop();
      }
    });
  });
  
  // Добавляем обработчики событий для изображений дней
  dayImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      // Для изображений дней смещаем индекс на количество изображений дома и номеров
      currentImageIndex = slides.length + roomImages.length + index;
      updateCounter();
      
      // Останавливаем автоматическую прокрутку слайдера, если он запущен
      if (accommodationSwiper.autoplay && accommodationSwiper.autoplay.running) {
        accommodationSwiper.autoplay.stop();
      }
    });
  });
  
  function showPrevImage() {
    const totalImages = allImages.length;
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    
    if (currentImageIndex < slides.length) {
      // Если это изображение дома
      modalImg.src = slides[currentImageIndex].src;
      // Синхронизируем Swiper с текущим изображением
      accommodationSwiper.slideTo(currentImageIndex);
    } else if (currentImageIndex < slides.length + roomImages.length) {
      // Если это изображение номера
      const roomIndex = currentImageIndex - slides.length;
      modalImg.src = roomImages[roomIndex].src;
    } else {
      // Если это изображение дня
      const dayIndex = currentImageIndex - slides.length - roomImages.length;
      modalImg.src = dayImages[dayIndex].src;
    }
    
    updateCounter();
  }
  
  function showNextImage() {
    const totalImages = allImages.length;
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    
    if (currentImageIndex < slides.length) {
      // Если это изображение дома
      modalImg.src = slides[currentImageIndex].src;
      // Синхронизируем Swiper с текущим изображением
      accommodationSwiper.slideTo(currentImageIndex);
    } else if (currentImageIndex < slides.length + roomImages.length) {
      // Если это изображение номера
      const roomIndex = currentImageIndex - slides.length;
      modalImg.src = roomImages[roomIndex].src;
    } else {
      // Если это изображение дня
      const dayIndex = currentImageIndex - slides.length - roomImages.length;
      modalImg.src = dayImages[dayIndex].src;
    }
    
    updateCounter();
  }
  
  // Обработчики кликов по кнопкам навигации
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  
  // Закрытие модального окна при клике на крестик
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    
    // Возобновляем автоматическую прокрутку слайдера
    if (accommodationSwiper.autoplay && !accommodationSwiper.autoplay.running) {
      accommodationSwiper.autoplay.start();
    }
  });
  
  // Закрытие модального окна при клике вне изображения
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      
      // Возобновляем автоматическую прокрутку слайдера
      if (accommodationSwiper.autoplay && !accommodationSwiper.autoplay.running) {
        accommodationSwiper.autoplay.start();
      }
    }
  });
  
  // Добавляем обработчик клавиш для навигации и закрытия
  document.addEventListener('keydown', function(event) {
    if (modal.style.display === 'block') {
      if (event.key === 'Escape') {
        // Закрытие модального окна по Escape
        modal.style.display = 'none';
        
        // Возобновляем автоматическую прокрутку слайдера
        if (accommodationSwiper.autoplay && !accommodationSwiper.autoplay.running) {
          accommodationSwiper.autoplay.start();
        }
      } else if (event.key === 'ArrowLeft') {
        // Переключение на предыдущее изображение по стрелке влево
        showPrevImage();
      } else if (event.key === 'ArrowRight') {
        // Переключение на следующее изображение по стрелке вправо
        showNextImage();
      }
    }
  });
  
  // Добавляем обработчик свайпа для мобильных устройств
  let touchStartX = 0;
  let touchEndX = 0;
  
  modalImg.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  modalImg.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    if (touchEndX < touchStartX) {
      // Свайп влево - следующее изображение
      showNextImage();
    } else if (touchEndX > touchStartX) {
      // Свайп вправо - предыдущее изображение
      showPrevImage();
    }
  }
});

// Инициализация основного Swiper (герой)
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем обработчики для кнопок "Смотреть"
  const viewDayButtons = document.querySelectorAll('.view-day-btn');
  
  viewDayButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Предотвращаем всплытие события
      
      const dayNumber = this.getAttribute('data-day');
      const daySection = document.getElementById(`day${dayNumber}`);
      
      if (daySection) {
        // Плавный скролл к соответствующему дню
        daySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log(`Скролл к дню ${dayNumber}`);
      } else {
        console.log(`Секция дня ${dayNumber} не найдена`);
      }
    });
  });
  
  // Добавляем обработчик для стрелки прокрутки вниз
  const heroElement = document.querySelector('.hero');
  if (heroElement) {
    heroElement.addEventListener('click', function(e) {
      // Проверяем, что клик был по псевдоэлементу стрелки
      const rect = heroElement.getBoundingClientRect();
      const bottomArea = rect.bottom - 100; // Область внизу героя, где находится стрелка
      
      if (e.clientY > bottomArea) {
        // Скролл к первому разделу после героя
        const nextSection = document.querySelector('.journey-divider') || 
                           document.querySelector('.day-details');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  // Инициализируем основной слайдер с уникальным классом
  const heroSwiper = new Swiper(".hero-swiper", {
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
      nextEl: ".hero-swiper .swiper-button-next", // Кнопка "Следующий"
      prevEl: ".hero-swiper .swiper-button-prev"  // Кнопка "Предыдущий"
    },
    
    // Обработчики событий
    on: { 
      realIndexChange: slideChange, // При изменении слайда
      init: swiperInit            // При инициализации
    }
  });
});

// Примечание: используем встроенный параметр slideToClickedSlide для обработки кликов