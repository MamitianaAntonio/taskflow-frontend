// From Uiverse.io by AbanoubMagdy1 - https://uiverse.io/AbanoubMagdy1/afraid-yak-99
// MIT License, Copyright (c) AbanoubMagdy1 (Abanoub Magdy)
import { useId, type CSSProperties, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import "./style/WaveInput.css";

interface WaveInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "className"> {
  label: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Underline text field with a character-by-character floating label.
 * The label floats on focus or whenever the field holds a value.
 */
export default function WaveInput({
  label,
  icon: Icon,
  hint,
  error,
  containerClassName = "",
  id,
  ...rest
}: WaveInputProps) {
  const autoId = useId();
  const inputId = id ?? `wave-${autoId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const message = error ?? hint;
  const messageId = error ? errorId : hintId;
  const describedBy =
    [message ? messageId : null, rest["aria-describedby"]]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      className={`wave-field ${Icon ? "wave-field--with-icon" : ""} ${
        error ? "wave-field--invalid" : ""
      } ${containerClassName}`}
    >
      <div className="wave-field__line">
        {Icon && (
          <span aria-hidden="true" className="wave-field__icon">
            <Icon size={15} strokeWidth={1.8} />
          </span>
        )}

        <input
          {...rest}
          id={inputId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="wave-field__control"
        />

        <label htmlFor={inputId} className="wave-field__label">
          <span className="sr-only">{label}</span>
          {Array.from(label).map((char, index) => (
            <span
              key={`${char}-${index}`}
              aria-hidden="true"
              className="wave-field__char"
              style={{ "--index": index } as CSSProperties}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </label>

        <span aria-hidden="true" className="wave-field__bar" />
      </div>

      {message && (
        <p
          id={messageId}
          className={`wave-field__message ${
            error ? "wave-field__message--error" : ""
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
