import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias para la carpeta `src`
    },
  },
  server: {
    port: 3000, // Puerto de desarrollo
  },
  build: {
    outDir: 'dist', // Directorio de salida
    emptyOutDir: true, // Limpia el directorio antes de construir
  },
  define: {
    'process.env': {}, // Asegura compatibilidad con código que usa `process.env`
  },
});
