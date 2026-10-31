import type { ChipTabItem } from "../ui/ChipTabs";
import {
  priorityConfig,
  priorityList,
  repeatList,
  statusConfig,
  statusList,
} from "../../constants/taskConfig";
import type { RepeatRule, TodoPriority, TodoStatus } from "../../types/todo";

/** Chip rows shared by TaskForm and TaskDetailFields so both stay identical. */
export const statusChips: ChipTabItem<TodoStatus>[] = statusList.map((item) => ({
  id: item.value,
  label: item.label,
  icon: item.icon,
  iconClassName: statusConfig[item.value].color,
}));

export const priorityChips: ChipTabItem<TodoPriority>[] = priorityList.map(
  (item) => ({
    id: item.value,
    label: item.label,
    icon: item.icon,
    iconClassName: priorityConfig[item.value].color,
  }),
);

export const repeatChips: ChipTabItem<RepeatRule>[] = repeatList.map((item) => ({
  id: item.value,
  label: item.label,
  icon: item.icon,
}));
