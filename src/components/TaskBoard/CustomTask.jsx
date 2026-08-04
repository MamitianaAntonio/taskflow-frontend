import { useState } from "react";
import Drawer from "../ui/Drawer";
import TaskForm from "./TaskForm";
import useTodoStore from "../../stores/todoStore";

export default function CustomTask({ onClose }) {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (payload) => {
    setCreating(true);
    try {
      await addTodo(payload.title, payload.dueDate, payload.priority, payload.status);
      onClose?.();
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
