import React from "react";

const Select = ({
  label,
  id,
  children,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || props.name}
          className="block text-text-secondary mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <select
        id={id || props.name}
        className={`w-full bg-bg-panel border border-border-light rounded p-3 text-white focus:border-brand focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
      {helperText && (
        <p className="text-xs text-text-muted mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
