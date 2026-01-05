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
  variant = "primary",
  ...props
}) => {
  const isDisabled = props.disabled;

  const baseStyles = isDisabled
    ? "w-auto font-bold py-3 px-4 rounded shadow-none transform-none cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
    : "w-auto font-bold py-3 px-4 rounded transition-colors shadow-lg transform cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2";

  const variants = {
    primary: isDisabled
      ? "bg-brand text-white"
      : "bg-brand hover:bg-brand-hover text-white",
    secondary: isDisabled
      ? "bg-bg-panel text-text-main border border-border-light"
      : "bg-bg-panel hover:bg-bg-main text-text-main border border-border-light",
    outline: isDisabled
      ? "bg-transparent text-accent border border-accent"
      : "bg-transparent text-accent border border-accent hover:bg-accent/10",
    danger: isDisabled
      ? "bg-danger text-white"
      : "bg-danger hover:bg-red-600 text-white",
    ghost: isDisabled
      ? "bg-transparent text-text-secondary shadow-none"
      : "bg-transparent text-text-secondary hover:text-text-main hover:bg-white/5 shadow-none",
  };

  // @ts-ignore
  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
