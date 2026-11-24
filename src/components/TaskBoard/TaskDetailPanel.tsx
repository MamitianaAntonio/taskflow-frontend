import {
  Circle,
  CircleCheck,
  CircleDashed,
  Repeat,
  Save,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import Modal from "../ui/Modal";
import ProjectBadge from "../ui/ProjectBadge";
import TaskDetailFields from "./TaskDetailFields";
import SubtaskList from "./SubtaskList";
import Button from "../ui/Button";
import { repeatPhrase, statusConfig } from "../../constants/taskConfig";
import type { Project } from "../../types/project";
import type { BoardTask, RepeatRule, TodoPriority, TodoStatus } from "../../types/todo";

const statusIcons: Record<TodoStatus, LucideIcon> = {
  todo: Circle,
  doing: CircleDashed,
  done: CircleCheck,
};

interface TaskDetailPanelProps {
  task: BoardTask;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  localTitle: string;
  setLocalTitle: (value: string) => void;
  localDescription: string;
  setLocalDescription: (value: string) => void;
  localStatus: TodoStatus;
  setLocalStatus: (value: TodoStatus) => void;
  localPriority: TodoPriority;
  setLocalPriority: (value: TodoPriority) => void;
  localDueDate: string;
  setLocalDueDate: (value: string) => void;
  localRepeat: RepeatRule;
  setLocalRepeat: (value: RepeatRule) => void;
  localProjectId: string | null;
  setLocalProjectId: (value: string | null) => void;
  projects: Project[];
  projectName?: string | null;
  dueDateStr?: string;
  saving: boolean;
  dirty: boolean;
  onAddSubtask?: (title: string) => Promise<void>;
  onToggleSubtask?: (id: string, done: boolean) => Promise<void>;
  onDeleteSubtask?: (id: string) => Promise<void>;
}

const metaSeparator = <span className="text-(--text-muted)">·</span>;

export default function TaskDetailPanel({
  task,
  onClose,
  onSave,
  onDelete,
  localTitle,
  setLocalTitle,
  localDescription,
  setLocalDescription,
  localStatus,
  setLocalStatus,
  localPriority,
  setLocalPriority,
  localDueDate,
  setLocalDueDate,
  localRepeat,
  setLocalRepeat,
  localProjectId,
  setLocalProjectId,
  projects,
  projectName,
  dueDateStr,
  saving,
  dirty,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskDetailPanelProps) {
  const StatusIcon = statusIcons[localStatus];

  return (
    <Modal
      open
      onClose={onClose}
      widthClass="max-w-3xl"
      title={task.label}
      icon={
        <StatusIcon size={18} strokeWidth={1.8} aria-hidden="true" />
      }
      subtitle={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`inline-flex items-center gap-1.5 font-interface text-xs font-semibold ${statusConfig[localStatus].color}`}
          >
            <StatusIcon size={12} strokeWidth={2} aria-hidden="true" />
            {statusConfig[localStatus].label}
          </span>
          {dueDateStr && (
            <>
              {metaSeparator}
              <span>{dueDateStr}</span>
            </>
          )}
          {localRepeat !== "none" && (
            <>
              {metaSeparator}
              <span className="inline-flex items-center gap-1.5">
                <Repeat
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-(--accent-color)"
                />
                {repeatPhrase[localRepeat]}
              </span>
            </>
          )}
          {projectName && (
            <>
              {metaSeparator}
              <ProjectBadge name={projectName} />
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
              icon={<Trash2 size={14} strokeWidth={2} aria-hidden="true" />}
              text="Delete"
            />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="small"
              className="w-full sm:w-auto"
              onClick={onClose}
              icon={<X size={14} strokeWidth={2} aria-hidden="true" />}
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
              icon={<Save size={14} strokeWidth={2} aria-hidden="true" />}
              text="Save changes"
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <TaskDetailFields
          localTitle={localTitle}
          setLocalTitle={setLocalTitle}
          localDescription={localDescription}
          setLocalDescription={setLocalDescription}
          localStatus={localStatus}
          setLocalStatus={setLocalStatus}
          localPriority={localPriority}
          setLocalPriority={setLocalPriority}
          localDueDate={localDueDate}
          setLocalDueDate={setLocalDueDate}
          localRepeat={localRepeat}
          setLocalRepeat={setLocalRepeat}
          localProjectId={localProjectId}
          setLocalProjectId={setLocalProjectId}
          projects={projects}
          dueDateStr={dueDateStr}
          saving={saving}
        />

        {onAddSubtask && onToggleSubtask && onDeleteSubtask && (
          <div className="border-t border-(--border-color) px-4 py-4 sm:px-5 sm:py-5">
            <SubtaskList
              subtasks={task.subtasks ?? []}
              disabled={saving}
              onAdd={onAddSubtask}
              onToggle={onToggleSubtask}
              onDelete={onDeleteSubtask}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
