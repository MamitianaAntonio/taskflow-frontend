import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faSave } from "@fortawesome/free-solid-svg-icons";
import SettingsSection from "./SettingsSection";
import FieldList, { type FieldConfig } from "./FieldList";
import { useProfileForm } from "../../hooks/useProfileForm";
import Button from "../ui/Button";

const FIELDS = [
  {
    label: "Name",
    icon: faUser,
    key: "name",
    placeholder: "Your name",
    autoComplete: "name",
  },
  {
    label: "Email",
    icon: faEnvelope,
    key: "email",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
] satisfies readonly FieldConfig[];

export default function ProfileForm() {
  const { profile, setField, saving, submit } = useProfileForm();

  return (
    <form onSubmit={submit}>
      <SettingsSection
        title="Profile"
        description="Update your name and email. These show up across your account."
        footer={
          <Button type="submit" variant="primary" loading={saving}>
            <FontAwesomeIcon icon={faSave} /> Save
          </Button>
        }
      >
        <FieldList fields={FIELDS} values={profile} onChange={setField} />
      </SettingsSection>
    </form>
  );
}
