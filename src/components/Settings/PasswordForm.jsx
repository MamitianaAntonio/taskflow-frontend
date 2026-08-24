import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faRotate } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import SettingsSection from "./SettingsSection";
import FieldList from "./FieldList";
import usePasswordForm from "../../utils/usePasswordForm";

const FIELDS = [
  {
    label: "Current",
    icon: faLock,
    key: "current",
    placeholder: "Your current password",
    autoComplete: "current-password",
  },
  {
    label: "New",
    icon: faLock,
    key: "next",
    placeholder: "At least 6 characters",
    autoComplete: "new-password",
  },
  {
    label: "Confirm",
    icon: faLock,
    key: "confirm",
    placeholder: "Repeat new password",
    autoComplete: "new-password",
  },
];

export default function PasswordForm() {
  const { password, setField, saving, submit } = usePasswordForm();

  return (
    <form onSubmit={submit}>
      <SettingsSection
        title="Password"
        description="Keep your account safe with a strong, unique password."
        footer={
          <Button type="submit" variant="primary" loading={saving}>
            <FontAwesomeIcon icon={faRotate} /> Update
          </Button>
        }
      >
        <FieldList
          fields={FIELDS}
          values={password}
          onChange={setField}
          type="password"
        />
      </SettingsSection>
    </form>
  );
}
