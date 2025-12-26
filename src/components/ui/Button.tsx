import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: string;
  icon?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 px-4 rounded transition-colors shadow-lg transform cursor-pointer hover:scale-[1.02] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
