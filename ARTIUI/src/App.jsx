// src/App.jsx
import React from "react";
import { AUCARD, AUBUTTON } from "./routerEngine";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <AUCARD>
        <h2>Hello World</h2>
        <p>This is inside a card.</p>
        <AUBUTTON onClick={() => alert("Button clicked!")}>Click Me</AUBUTTON>
      </AUCARD>
    </div>
  );
}


// src/App.jsx
// import React from "react";
// import { AUCARD, AUBUTTON } from "./routerEngine";

// export default function App() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <AUCARD>
//         <h2>Hello World</h2>
//         <p>This is inside a card.</p>
//         <AUBUTTON onClick={() => alert("Button clicked!")}>Click Me</AUBUTTON>
//       </AUCARD>
//     </div>
//   );
// }
