import React from "react";

export default function AULISTGROUP({
  items = [],
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  emptyState,
  className = "",
  ...rest
}) {
  const handleItemClick = (item) => {
    if (selectable && onSelectionChange) {
      const isSelected = selectedItems.includes(item.id);
      let newSelected;

      if (isSelected) {
        newSelected = selectedItems.filter(id => id !== item.id);
      } else {
        newSelected = [...selectedItems, item.id];
      }

      onSelectionChange(newSelected);
    }

    if (item.onClick) {
      item.onClick(item);
    }
  };

  const renderItem = (item, index, level = 0) => {
    const isSelected = selectable && selectedItems.includes(item.id);
    const itemClasses = [
      "au-list-group__item",
      isSelected && "au-list-group__item--selected",
      item.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${level}`
    ].filter(Boolean).join(" ");

    return (
      <div key={item.id || index} className={itemClasses}>
        <div
          className="au-list-group__item-content"
          onClick={() => handleItemClick(item)}
          role={selectable ? "button" : undefined}
          tabIndex={selectable ? 0 : undefined}
        >
          {item.icon && <span className="au-list-group__item-icon">{item.icon}</span>}
          <div className="au-list-group__item-text">
            <div className="au-list-group__item-title">{item.title}</div>
            {item.description && (
              <div className="au-list-group__item-description">{item.description}</div>
            )}
          </div>
          {item.badge && <span className="au-list-group__item-badge">{item.badge}</span>}
          {selectable && (
            <span className="au-list-group__item-check">
              {isSelected ? '✓' : ''}
            </span>
          )}
        </div>

        {item.children && item.children.length > 0 && (
          <div className="au-list-group__children">
            {item.children.map((child, childIndex) => renderItem(child, childIndex, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const classes = [
    "au-list-group",
    selectable && "au-list-group--selectable",
    className
  ].filter(Boolean).join(" ");

  if (items.length === 0 && emptyState) {
    return (
      <div className={`${classes} au-list-group--empty`} {...rest}>
        <div className="au-list-group__empty">
          {emptyState.icon && <div className="au-list-group__empty-icon">{emptyState.icon}</div>}
          <div className="au-list-group__empty-title">{emptyState.title}</div>
          {emptyState.description && (
            <div className="au-list-group__empty-description">{emptyState.description}</div>
          )}
          {emptyState.action && (
            <button
              className="au-button au-button--primary au-list-group__empty-action"
              onClick={emptyState.action.onClick}
            >
              {emptyState.action.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes} {...rest}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}