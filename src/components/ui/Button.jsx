import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 px-4 rounded transition-colors shadow-lg transform cursor-pointer hover:scale-[1.02] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
