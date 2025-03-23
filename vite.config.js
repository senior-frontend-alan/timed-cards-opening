import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Указываем корневую директорию для сервера
  root: 'dist',
  
  // Настройка сервера разработки
  server: {
    // Открывать браузер при запуске
    open: true
  },
  
  // Настройка для сборки (если понадобится)
  build: {
    // Сохранять исходную структуру директорий
    outDir: '../dist-build',
    emptyOutDir: true
  }
})
