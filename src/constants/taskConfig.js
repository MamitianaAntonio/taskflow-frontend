import {
  faCircle,
  faCircleHalfStroke,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export const priorityConfig = {
  low: { color: "text-(--text-muted)", bg: "bg-(--bg-secondary)", label: "Low" },
  medium: { color: "text-(--text-secondary)", bg: "bg-(--border-color)/30", label: "Medium" },
  high: { color: "text-(--color-error)", bg: "bg-(--color-error)/10", label: "High" },
};

export const statusConfig = {
  todo: {
    label: "Todo",
    icon: faCircle,
    color: "text-(--text-muted)",
  },
  doing: {
    label: "Doing",
    icon: faCircleHalfStroke,
    color: "text-(--accent-color)",
  },
  done: {
    label: "Done",
    icon: faCircleCheck,
    color: "text-(--color-success)",
  },
};

export const columns = [
  {
    id: "todo",
    label: "To do",
    icon: faCircle,
    color: "text-(--color-warning)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--border-color)/50",
  },
  {
    id: "doing",
    label: "In progress",
    icon: faCircleHalfStroke,
    color: "text-(--accent-color)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--border-color)/50",
  },
  {
    id: "done",
    label: "Done",
    icon: faCircleCheck,
    color: "text-(--color-success)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--border-color)/50",
  },
];
