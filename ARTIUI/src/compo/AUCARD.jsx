// src/components/global/Card.jsx
import React from "react";

export default function AUCARD({ children, className = "", style = {}, ...rest }) {
  const classes = ["au-card", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
} 
