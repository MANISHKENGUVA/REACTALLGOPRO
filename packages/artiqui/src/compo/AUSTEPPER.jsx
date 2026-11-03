import React from "react";

export default function AUSTEPPER({
  steps = [],
  activeStep = 0,
  orientation = "horizontal",
  className = "",
  ...rest
}) {
  const classes = [
    "au-stepper",
    `au-stepper--${orientation}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isPending = index > activeStep;

        const stepClasses = [
          "au-stepper__step",
          isCompleted && "au-stepper__step--completed",
          isActive && "au-stepper__step--active",
          isPending && "au-stepper__step--pending"
        ].filter(Boolean).join(" ");

        return (
          <div key={step.id || index} className={stepClasses}>
            <div className="au-stepper__indicator">
              {isCompleted ? (
                <span className="au-stepper__check">✓</span>
              ) : (
                <span className="au-stepper__number">{index + 1}</span>
              )}
            </div>

            <div className="au-stepper__content">
              <div className="au-stepper__title">{step.title}</div>
              {step.description && (
                <div className="au-stepper__description">{step.description}</div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="au-stepper__connector" />
            )}
          </div>
        );
      })}
    </div>
  );
}