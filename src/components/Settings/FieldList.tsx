import type { ChangeEvent } from "react";
import Field from "../form/Field";
import Input from "../ui/Input";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface FieldConfig {
  label: string;
  icon: IconDefinition;
  key: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}

interface FieldListProps<T extends string> {
  fields: FieldConfig[];
  values: Record<T, string>;
  onChange: (key: T) => (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

export default function FieldList<T extends string>({
  fields,
  values,
  onChange,
  type = "text",
}: FieldListProps<T>) {
  return fields.map(
    ({ label, icon, key, placeholder, type: fieldType, autoComplete }) => (
      <Field key={key} label={label} icon={icon}>
        <Input
          type={fieldType ?? type}
          value={values[key as T] ?? ""}
          onChange={onChange(key as T)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      </Field>
    ),
  );
}