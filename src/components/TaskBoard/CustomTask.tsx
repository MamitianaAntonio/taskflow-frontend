import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Modal from "../ui/Modal";
import TaskForm from "./TaskForm";
import useTodoStore from "../../stores/todoStore";
import type { CreateTodoPayload } from "../../types/todo";

interface CustomTaskProps {
  onClose: () => void;
  projectId?: string;
  /** Form values pre-filled on open, e.g. `dueDate` picked on the calendar. */
  initial?: Partial<CreateTodoPayload>;
}

export default function CustomTask({ onClose, projectId, initial }: CustomTaskProps) {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (payload: CreateTodoPayload) => {
    setCreating(true);
    try {
      await addTodo({
        ...payload,
        projectId: projectId ?? payload.projectId,
      });
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="New task"
      icon={<CirclePlus size={18} strokeWidth={1.8} aria-hidden="true" />}
      subtitle="Create a task from scratch"
    >
      <TaskForm
        onSubmit={handleCreate}
        onCancel={onClose}
        loading={creating}
        initial={initial}
      />
    </Modal>
  );
}