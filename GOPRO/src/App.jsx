
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';


function App() {


  return (
    <>
    <div style={{ padding: "20px" }}>
      <p className="underline">hhhhhh</p>
      <AUCARD>
        <h2 className='underline'>Hello World</h2>
        <p>This is inside a card.</p>
        <AUBUTTON onClick={() => alert("Button clicked!")}>Click Me</AUBUTTON>
      </AUCARD>
    </div>
     
    </>
  )
}

export default App




// import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';


// function App() {


//   return (
//     <>
//     <div style={{ padding: "20px" }}>
//       <AUCARD>
//         <h2>Hello World</h2>
//         <p>This is inside a card.</p>
//         <AUBUTTON onClick={() => alert("Button clicked!")}>Click Me</AUBUTTON>
//       </AUCARD>
//     </div>
     
//     </>
//   )
// }

// export default App


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import Components from 'unplugin-react-components/vite';

// export default defineConfig({
//   plugins: [
//     react(),
//     Components({
//       dirs: ['artiqui/dist/router-engine.es.js'], // Auto-import from here
//       extensions: ['js'],      // File types to scan
//       deep: true            // Scan subfolders
   
//     })
//   ]
// });
// // 