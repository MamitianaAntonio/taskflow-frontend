import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import CalendarTaskRow from "./CalendarTaskRow";
import { parseDayKey, type DayKey } from "../../utils/calendar";
import { formatDate } from "../../utils/date";
import type { Todo } from "../../types/todo";

interface DayDrawerProps {
  day: DayKey;
  tasks: Todo[];
  projectName: (id: string | null | undefined) => string | null;
  onClose: () => void;
  onOpenTask: (task: Todo) => void;
  onAddTask: () => void;
}

export default function DayDrawer({
  day,
  tasks,
  projectName,
  onClose,
  onOpenTask,
  onAddTask,
}: DayDrawerProps) {
  return (
    <Drawer
      open
      onClose={onClose}
      title={formatDate(parseDayKey(day))}
      icon={faCalendarDays}
      subtitle={
        <span className="font-interface text-xs text-(--text-muted)">
          {tasks.length === 0
            ? "Nothing due"
            : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} due`}
        </span>
      }
      footer={
        <Button
          variant="primary"
          size="small"
          className="w-full sm:w-auto"
          onClick={onAddTask}
          icon={<FontAwesomeIcon icon={faCirclePlus} />}
          text="Add task"
        />
      }
    >
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        {tasks.length === 0 ? (
          <p className="py-6 text-center font-interface text-xs text-(--text-muted)">
            Nothing due on this day.
          </p>
        ) : (
          tasks.map((task) => (
            <CalendarTaskRow
              key={task.id}
              task={task}
              projectName={projectName}
              onOpen={onOpenTask}
            />
          ))
        )}
      </div>
    </Drawer>
  );
}
