import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tauri 桌面端:dev 端口固定;生产构建相对路径
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'es2022',
  },
});
