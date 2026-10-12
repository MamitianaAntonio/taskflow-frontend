import { forwardRef, type InputHTMLAttributes } from "react";
import "./style/Input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={`input
        w-full min-w-0 px-3 py-2 sm:px-4 sm:py-2.5
        text-sm rounded-md sm:rounded-xl
        bg-(--bg-primary) text-(--text-primary)
        placeholder:text-(--text-muted)
        border border-(--border-color) shadow-sm outline-none
        transition duration-200
        hover:border-(--accent-muted)
        focus:border-(--accent-color) focus:ring-4 focus:ring-(--accent-soft)
        aria-invalid:border-(--color-error)
        aria-invalid:focus:ring-(--color-error-soft)
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...rest}
    />
  ),
);

Input.displayName = "Input";

export default Input;
