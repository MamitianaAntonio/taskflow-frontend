import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import Drawer from "../ui/Drawer";
import TaskDetailFields from "./TaskDetailFields";
import Button from "../ui/Button";

export default function TaskDetailPanel({
  task,
  onClose,
  onSave,
  localTitle,
  setLocalTitle,
  localStatus,
  setLocalStatus,
  localPriority,
  setLocalPriority,
  localDueDate,
  setLocalDueDate,
  dueDateStr,
  saving,
  dirty,
}) {
  return (
    <Drawer
      open
      onClose={onClose}
      title={task.label}
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            size="small"
            className="w-full sm:w-auto"
            onClick={onClose}
            icon={<FontAwesomeIcon icon={faXmark} />}
            text="Cancel"
            disabled={saving}
          />
          <Button
            variant="primary"
            size="small"
            className="w-full sm:w-auto"
            onClick={onSave}
            loading={saving}
            disabled={!dirty}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            text="Save changes"
          />
        </div>
      }
    >
      <TaskDetailFields
        localTitle={localTitle}
        setLocalTitle={setLocalTitle}
        localStatus={localStatus}
        setLocalStatus={setLocalStatus}
        localPriority={localPriority}
        setLocalPriority={setLocalPriority}
        localDueDate={localDueDate}
        setLocalDueDate={setLocalDueDate}
        dueDateStr={dueDateStr}
        saving={saving}
      />
    </Drawer>
  );
}
