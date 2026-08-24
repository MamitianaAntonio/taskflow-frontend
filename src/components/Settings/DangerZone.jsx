import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import SettingsSection from "./SettingsSection";
import useUserStore from "../../stores/userStore";
import { deleteUserAccount } from "../../services/user";

export default function DangerZone() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const [deleting, setDeleting] = useState(false);

  const goToLogin = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your account, projects and tasks permanently?"))
      return;
    setDeleting(true);
    try {
      await deleteUserAccount();
      toast.success("Account deleted");
      goToLogin();
    } catch (error) {
      setDeleting(false);
      toast.error(error.message);
    }
  };

  return (
    <SettingsSection
      title="Danger zone"
      description="Irreversible actions — proceed with care."
      footer={
        <>
          <Button variant="outline" onClick={goToLogin}>
            Log out
          </Button>
          <Button
            variant="outline"
            className="hover:border-(--color-error) hover:text-(--color-error)"
            loading={deleting}
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs mr-1" />
            Delete account
          </Button>
        </>
      }
    />
  );
}
