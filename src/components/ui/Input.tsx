import type { ChangeEvent, InputHTMLAttributes } from "react";
import "./style/Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`input w-full px-3 py-2 rounded-lg text-sm outline-none
        bg-(--bg-primary) text-(--text-primary)
        border border-(--border-color)
        transition-colors duration-200
        focus:border-(--accent-color)
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...rest}
    />
  );
}