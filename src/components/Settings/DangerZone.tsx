import { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import SettingsSection from "./SettingsSection";
import { deleteUserAccount } from "../../services/user";
import { useLogout } from "../../hooks/useLogout";

export default function DangerZone() {
  const logout = useLogout();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete your account, projects and tasks permanently?"))
      return;
    setDeleting(true);
    try {
      await deleteUserAccount();
      toast.success("Account deleted");
      logout();
    } catch (error) {
      setDeleting(false);
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <SettingsSection
      title="Danger zone"
      description="Irreversible actions — proceed with care."
      footer={
        <>
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
          <Button
            variant="outline"
            className="hover:border-(--color-error) hover:text-(--color-error)"
            loading={deleting}
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1 text-xs" />
            Delete account
          </Button>
        </>
      }
    />
  );
}