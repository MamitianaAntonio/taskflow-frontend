import {
  faCircle,
  faCircleDot,
  faCircleHalfStroke,
  faCircleCheck,
  faArrowDown,
  faMinus,
  faArrowUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { TodoPriority, TodoStatus } from "../types/todo";

interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon: IconDefinition;
}

interface StatusMeta {
  label: string;
  icon: IconDefinition;
  color: string;
}

interface PriorityMeta {
  label: string;
  color: string;
  bg: string;
}

export interface ColumnConfig {
  id: TodoStatus;
  label: string;
  icon: IconDefinition;
  color: string;
  headerBg: string;
  countBg: string;
}

export const priorityConfig: Record<TodoPriority, PriorityMeta> = {
  low: {
    label: "Low",
    color: "text-(--color-info)",
    bg: "bg-(--color-info-soft)",
  },
  medium: {
    label: "Medium",
    color: "text-(--color-warning)",
    bg: "bg-(--color-warning-soft)",
  },
  high: {
    label: "High",
    color: "text-(--color-error)",
    bg: "bg-(--color-error-soft)",
  },
};

export const statusConfig: Record<TodoStatus, StatusMeta> = {
  todo: {
    label: "Todo",
    icon: faCircle,
    color: "text-(--color-warning)",
  },
  doing: {
    label: "Doing",
    icon: faCircleHalfStroke,
    color: "text-(--accent-strong)",
  },
  done: {
    label: "Done",
    icon: faCircleCheck,
    color: "text-(--color-success)",
  },
};

export const columns: ColumnConfig[] = [
  {
    id: "todo",
    label: "To do",
    icon: faCircle,
    color: "text-(--color-warning)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--color-warning-soft)",
  },
  {
    id: "doing",
    label: "In progress",
    icon: faCircleHalfStroke,
    color: "text-(--accent-strong)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--accent-soft)",
  },
  {
    id: "done",
    label: "Done",
    icon: faCircleCheck,
    color: "text-(--color-success)",
    headerBg: "bg-(--bg-secondary)",
    countBg: "bg-(--color-success-soft)",
  },
];

export const statusList: SelectOption<TodoStatus>[] = [
  { value: "todo", label: "Todo", icon: faCircleDot },
  { value: "doing", label: "Doing", icon: faSpinner },
  { value: "done", label: "Done", icon: faCircleCheck },
];

export const priorityList: SelectOption<TodoPriority>[] = [
  { value: "low", label: "Low", icon: faArrowDown },
  { value: "medium", label: "Medium", icon: faMinus },
  { value: "high", label: "High", icon: faArrowUp },
];

export const statusColor: Record<TodoStatus, string> = {
  todo: "text-(--color-warning) border-(--color-warning-soft) bg-(--color-warning-soft)",
  doing: "text-(--accent-strong) border-(--accent-soft) bg-(--accent-soft)",
  done: "text-(--color-success) border-(--color-success-soft) bg-(--color-success-soft)",
};

export const priorityColor: Record<TodoPriority, string> = {
  low: "text-(--color-info) border-(--color-info-soft) bg-(--color-info-soft)",
  medium:
    "text-(--color-warning) border-(--color-warning-soft) bg-(--color-warning-soft)",
  high: "text-(--color-error) border-(--color-error-soft) bg-(--color-error-soft)",
};