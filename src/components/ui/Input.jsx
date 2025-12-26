import React from "react";

const Input = ({ label, id, className = "", ...props }) => {
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
      <input
        id={id || props.name}
        className={`w-full bg-bg-panel border border-border-light rounded p-3 text-white focus:border-brand focus:outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
