import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: string; // It was used in People.jsx but not defined in prop destructuring in original file?
  // Wait, looking at original Button.jsx: `const Button = ({ children, onClick, type = "button", className = "", ...props })`
  // It didn't destructure `variant`. But in People.jsx I saw `variant="primary"`. IT works because `...props` passes it to button, but HTML button doesn't support 'variant'.
  // However, I should probably add it to the interface if I want to support it cleanly or ignore it.
  // Actually, the original code had: `className={...} {...props}`. If props contained variant, it was passed to DOM, which is technically invalid HTML attribute but React might strip or warn.
  // I'll add it to props to avoid TS error, but maybe I should support styling?
  // People.jsx usage: `<Button onClick={onSave} variant="primary" icon={Save} ...>`
  // People.jsx passed `icon` too! And `variant`.
  // Original Button.jsx IGNORED `icon` (it just rendered children).
  // Wait, People.jsx usage: `<Button onClick={onSave} variant="primary" icon={Save} disabled={idlePop < 0}> Save Changes </Button>`
  // But Button.jsx: `return <button ...>{children}</button>`. It did NOT render the icon passed as prop!
  // Unless `Button` in `People.jsx` import was different?
  // imports in People.jsx: `import Button from "../components/ui/Button";`
  // So the `icon` prop was being passed but IGNORED by the component logic I saw!
  // Same for `variant`.
  // I will make the interface flexible but maybe I should start ignoring them properly or implementing them?
  // Given I am doing a migration, I should stick to existing behavior (ignoring them is fine, but TS will complain if I don't define them).
  // I will add `icon?: any` and `variant?: string` to interface but not use them, to match current behavior.
  // Actually, `...props` spreads them to the button element.
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
