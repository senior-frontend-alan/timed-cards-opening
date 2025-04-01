import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Указываем корневую директорию для сервера и разработки
  root: 'dist',
  
  // Базовый путь для GitHub Pages
  base: '/timed-cards-opening/',
  
  // Настройка сервера разработки
  server: {
    // Открывать браузер при запуске
    open: true,
    // Наблюдение за файлами в директории dist
    watch: {
      usePolling: true
    }
  },
  
  // Настройка для сборки (если понадобится)
  build: {
    // Использовать ту же директорию dist для сборки
    outDir: './',
    emptyOutDir: false
  },
  
  // Отключаем предварительную обработку ресурсов
  // чтобы работать напрямую с файлами в dist
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif']
})
