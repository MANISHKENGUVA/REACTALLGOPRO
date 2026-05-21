// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Change this if your app is served from a sub-path
  // For example, if hosted at example.com/myapp => base: '/myapp/'
 build: {
    outDir: path.resolve(__dirname, 'dist'),
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/routerEngine.js'),
      name: 'RouterEngine',
      fileName: (format) => `router-engine.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }

})
