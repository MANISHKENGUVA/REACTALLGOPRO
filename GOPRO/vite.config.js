// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();

// const themeName = process.env.VITE_APP_THEME || 'theme1';
// const themePath = path.resolve(
//   __dirname,
//   'node_modules/artiqui/src/assets/sass/themes',
//   themeName
// );

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@theme': themePath,                        // theme alias
//       '@': path.resolve(__dirname, './src'),      // local src alias
//       'artiqui': path.resolve(__dirname, 'node_modules/artiqui'), // alias package root
//     },
//   },
// });





































import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const themeName = process.env.VITE_APP_THEME || 'theme1';
const themePath = path.resolve(__dirname, 'node_modules/artiqui/src/assets/sass/themes', themeName);
console.log('Using theme path:', themePath);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@theme': themePath,  // Alias to the selected theme folder inside the 'artiqui' package
      '@': path.resolve(__dirname, './src'),  // Your local src alias

    },
  },
});




// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config();
// const themeName = process.env.VITE_APP_THEME || 'theme1';
// const themePath = path.resolve(__dirname, 'node_modules/artiqui/src/assets/sass/themes', themeName);
// console.log('Using theme path:', themePath);

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@theme': themePath,  // Alias to the selected theme folder inside the 'artiqui' package
//       '@': path.resolve(__dirname, './src'),  // Your local src alias
//     },
//   },
// });



















// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import Components from 'unplugin-react-components/vite';
// import path from 'path';
// export default defineConfig({
//   plugins: [
//     react(),
//     // Components({
//     //   dirs: ['artiqui/src/compo'], // scan local dev folder
//     //   extensions: ['jsx'],
//     //   deep: true,
    
//     // })
//   ]
// });
