import React, { useState, useRef, useEffect } from "react";

const VARIANTS = ["success", "error", "warning", "info"];
const POSITIONS = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];

export default function AUTOOLTIP({
  children,
  content,
  variant = "info",
  position = "top",
  delay = 300,
  showArrow = true,
  className = "",
  style = {},
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const safeVariant = VARIANTS.includes(variant) ? variant : "info";
  const safePosition = POSITIONS.includes(position) ? position : "top";

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltipClasses = [
    "au-tooltip",
    `au-tooltip--${safeVariant}`,
    `au-tooltip--${safePosition}`,
    showArrow && "au-tooltip--with-arrow",
    className
  ].filter(Boolean).join(" ");

  const triggerClasses = [
    "au-tooltip-trigger"
  ].join(" ");

  return (
    <>
      <span
        ref={triggerRef}
        className={triggerClasses}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        {...rest}
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={tooltipClasses}
          style={{
            ...style,
            "--au-tooltip-left": `${coords.x}px`,
            "--au-tooltip-top": `${coords.y}px`
          }}
          role="tooltip"
        >
          {content}
          {showArrow && <div className="au-tooltip__arrow" />}
        </div>
      )}
    </>
  );
}