// src/components/global/Button.jsx
import React from "react";

export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="au-button"
    >
      {children}
    </button>
  );
}
