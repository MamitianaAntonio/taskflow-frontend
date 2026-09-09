function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  return isNaN(d.getTime()) ? null : d;
}

export function toLocalDatetime(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return "";
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function formatDate(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return "No date";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export function formatTimeAgo(value: string | Date | null | undefined): string | null {
  const d = toDate(value);
  if (!d) return null;
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatRelativeDate(value: string | Date | null | undefined): string | null {
  const d = toDate(value);
  if (!d) return null;
  const now = new Date();
  const today = now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isToday(value: string | Date | null | undefined): boolean {
  const d = toDate(value);
  return d ? d.toDateString() === new Date().toDateString() : false;
}

export function isOverdue(value: string | Date | null | undefined): boolean {
  const d = toDate(value);
  return d ? d.getTime() < Date.now() && !isToday(d) : false;
}

export function isUpcoming(value: string | Date | null | undefined): boolean {
  const d = toDate(value);
  if (!d) return false;
  const now = Date.now();
  const in3days = now + 3 * 24 * 60 * 60 * 1000;
  return d.getTime() > now && d.getTime() <= in3days;
}