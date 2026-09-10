import {
  faFloppyDisk,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from "../ui/Drawer";
import TaskDetailFields from "./TaskDetailFields";
import Button from "../ui/Button";
import { statusConfig } from "../../constants/taskConfig";
import type { BoardTask, TodoPriority, TodoStatus } from "../../types/todo";

interface TaskDetailPanelProps {
  task: BoardTask;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  localTitle: string;
  setLocalTitle: (value: string) => void;
  localStatus: TodoStatus;
  setLocalStatus: (value: TodoStatus) => void;
  localPriority: TodoPriority;
  setLocalPriority: (value: TodoPriority) => void;
  localDueDate: string;
  setLocalDueDate: (value: string) => void;
  dueDateStr?: string;
  saving: boolean;
  dirty: boolean;
}

export default function TaskDetailPanel({
  task,
  onClose,
  onSave,
  onDelete,
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
}: TaskDetailPanelProps) {
  return (
    <Drawer
      open
      onClose={onClose}
      title={task.label}
      icon={statusConfig[localStatus].icon}
      subtitle={
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 font-interface text-xs font-semibold ${statusConfig[localStatus].color}`}
          >
            <FontAwesomeIcon icon={statusConfig[localStatus].icon} className="text-[10px]" />
            {statusConfig[localStatus].label}
          </span>
          {dueDateStr && (
            <>
              <span className="text-(--text-muted)">·</span>
              <span>{dueDateStr}</span>
            </>
          )}
        </span>
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          {onDelete && (
            <Button
              variant="outline"
              size="small"
              className="w-full justify-center self-start text-(--color-error) sm:w-auto"
              onClick={onDelete}
              loading={saving}
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              text="Delete"
            />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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