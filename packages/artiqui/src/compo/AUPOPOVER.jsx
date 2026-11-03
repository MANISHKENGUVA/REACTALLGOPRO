import React, { useState, useRef, useEffect } from "react";

export default function AUPOPOVER({
  children,
  content,
  trigger = "click",
  position = "bottom",
  showArrow = true,
  className = "",
  style = {},
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const positions = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  };

  const handleTrigger = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const offset = positions[position] || positions.bottom;
      setCoords({
        x: rect.left + rect.width / 2 + offset.x,
        y: rect.top + rect.height / 2 + offset.y
      });
    }
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      handleTrigger();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const popoverClasses = [
    "au-popover",
    `au-popover--${position}`,
    showArrow && "au-popover--with-arrow",
    className
  ].filter(Boolean).join(" ");

  const triggerClasses = [
    "au-popover-trigger"
  ].join(" ");

  return (
    <>
      <span
        ref={triggerRef}
        className={triggerClasses}
        onClick={trigger === "click" ? handleTrigger : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </span>

      {isOpen && (
        <div
          ref={popoverRef}
          className={popoverClasses}
          style={{
            ...style,
            "--au-popover-left": `${coords.x}px`,
            "--au-popover-top": `${coords.y}px`
          }}
          role="dialog"
        >
          {content}
          {showArrow && <div className="au-popover__arrow" />}
        </div>
      )}
    </>
  );
}