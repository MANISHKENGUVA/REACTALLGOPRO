// src/components/global/Card.jsx
import React from "react";

export default function Card({ children }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "16px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        maxWidth: "400px"
      }}
    >
      {children}
    </div>
  );
} 
