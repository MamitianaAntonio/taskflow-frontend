import Field from "../form/Field";
import Input from "../ui/Input";

export default function FieldList({ fields, values, onChange, type = "text" }) {
  return fields.map(
    ({ label, icon, key, placeholder, type: fieldType, autoComplete }) => (
      <Field key={key} label={label} icon={icon}>
        <Input
          type={fieldType ?? type}
          value={values[key]}
          onChange={onChange(key)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      </Field>
    ),
  );
}
