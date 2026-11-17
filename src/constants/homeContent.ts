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
    title: "About · TaskFlow",
    description:
      "TaskFlow is a task and project manager. Your tasks, projects and deadlines live in one place.",
  },
  contact: {
    title: "Contact · TaskFlow",
    description:
      "Questions, ideas or bug reports: write to TaskFlow by email, phone or post.",
  },
};

export const homeSpecs = [
  "Tasks",
  "Projects",
  "Calendar",
  "Notifications",
];

export const contactDetails = [
  {
    label: "Support",
    value: "support@taskflow.app",
    href: "mailto:support@taskflow.app",
  },
  {
    label: "Phone",
    value: "+33 1 23 45 67 89",
    href: "tel:+33123456789",
  },
  {
    label: "Post",
    value: "12 rue du Flow, 75011 Paris",
  },
] as const;
