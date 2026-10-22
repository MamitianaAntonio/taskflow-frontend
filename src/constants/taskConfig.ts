import {
  faBan,
  faCalendar,
  faCalendarDay,
  faCalendarDays,
  faCalendarWeek,
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
import type { RepeatRule, TodoPriority, TodoStatus } from "../types/todo";

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

export const repeatList: SelectOption<RepeatRule>[] = [
  { value: "none", label: "Never", icon: faBan },
  { value: "daily", label: "Daily", icon: faCalendarDay },
  { value: "weekly", label: "Weekly", icon: faCalendarWeek },
  { value: "monthly", label: "Monthly", icon: faCalendarDays },
  { value: "yearly", label: "Yearly", icon: faCalendar },
];

/** Short hint under the repeat chips, and the sentence shown on a task. */
export const repeatHint: Record<RepeatRule, string> = {
  none: "Completing it closes the task for good.",
  daily: "The next one is created the day after.",
  weekly: "The next one is created a week later.",
  monthly: "The next one is created a month later, on the same day.",
  yearly: "The next one is created a year later, on the same day.",
};

export const repeatPhrase: Record<RepeatRule, string> = {
  none: "Does not repeat",
  daily: "Repeats daily",
  weekly: "Repeats weekly",
  monthly: "Repeats monthly",
  yearly: "Repeats yearly",
};

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

export const statusCardColor: Record<
  TodoStatus,
  { bg: string; hover: string }
> = {
  todo: {
    bg: "bg-(--color-warning-soft)",
    hover: "hover:border-(--color-warning-hover)",
  },
  doing: {
    bg: "bg-(--accent-soft)",
    hover: "hover:border-(--accent-muted)",
  },
  done: {
    bg: "bg-(--color-success-soft)",
    hover: "hover:border-(--color-success-hover)",
  },
};