import { useState } from "react";
import Drawer from "../ui/Drawer";
import TaskForm from "./TaskForm";
import useTodoStore from "../../stores/todoStore";
import type { CreateTodoPayload } from "../../types/todo";

interface CustomTaskProps {
  onClose: () => void;
  projectId?: number;
}

export default function CustomTask({ onClose, projectId }: CustomTaskProps) {
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
    <Drawer open onClose={onClose} title="Custom task">
      <TaskForm onSubmit={handleCreate} onCancel={onClose} loading={creating} />
    </Drawer>
  );
}