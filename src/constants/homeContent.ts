import type { HomeTabKey } from "./homeTabs";

export const homeMeta: Record<
  HomeTabKey,
  { title: string; description: string }
> = {
  start: {
    title: "TaskFlow",
    description:
      "TaskFlow keeps your tasks, projects, calendar and notifications in one place.",
  },
  about: {
    title: "TaskFlow",
    description:
      "TaskFlow is a task and project manager. Your tasks, projects and deadlines live in one place.",
  },
  contact: {
    title: "TaskFlow",
    description:
      "Questions, ideas or bug reports: write to TaskFlow by email or phone.",
  },
};

export const homeSpecs = [
  "Tasks",
  "Projects",
  "Calendar",
  "Notifications",
];

export const contactEmail = "ratolojanaharyantonio.pro@gmail.com";

export const contactDetails = [
  {
    label: "Phone",
    value: "+261 38 10 488 34",
    href: "tel:+261381048834",
  },
  {
    label: "Location",
    value: "Antananarivo, Madagascar",
  },
] as const;
