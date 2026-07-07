import {
  faCircleDot,
  faSpinner,
  faCircleCheck,
  faArrowDown,
  faMinus,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

export const STATUS_OPTIONS = [
  {
    value: "todo",
    label: "To do",
    icon: faCircleDot,
    classes:
      "bg-(--color-warning)/12 border-(--color-warning)/30 text-(--color-warning)",
  },
  {
    value: "doing",
    label: "In progress",
    icon: faSpinner,
    classes:
      "bg-(--accent-color)/12 border-(--accent-color)/30 text-(--accent-color)",
  },
  {
    value: "done",
    label: "Done",
    icon: faCircleCheck,
    classes:
      "bg-(--color-success)/12 border-(--color-success)/30 text-(--color-success)",
  },
];

export const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    icon: faArrowDown,
    classes:
      "bg-green-50 border-green-400 text-green-800 dark:bg-green-950 dark:border-green-500 dark:text-green-200",
  },
  {
    value: "medium",
    label: "Medium",
    icon: faMinus,
    classes:
      "bg-amber-50 border-amber-400 text-amber-800 dark:bg-amber-950 dark:border-amber-500 dark:text-amber-200",
  },
  {
    value: "high",
    label: "High",
    icon: faArrowUp,
    classes:
      "bg-red-50   border-red-400   text-red-800   dark:bg-red-950   dark:border-red-500   dark:text-red-200",
  },
];
