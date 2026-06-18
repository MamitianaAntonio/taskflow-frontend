export const isToday = (date) =>
  new Date(date).toDateString() === new Date().toDateString();

export const isOverdue = (date) =>
  new Date(date) < new Date() && !isToday(date);

export const isUpcoming = (date) => {
  const d = new Date(date);
  const now = new Date();
  const in3days = new Date();
  in3days.setDate(now.getDate() + 3);
  return d > now && d <= in3days;
};

export const getCountPhrase = (label, count) => {
  if (label === "Today & Overdue") {
    if (count === 0) return "No tasks due today — enjoy your day!";
    if (count === 1) return "You have 1 task that needs your attention.";
    return `You have ${count} tasks to get through today.`;
  }
  if (label === "Upcoming") {
    if (count === 0) return "No tasks in the next 3 days.";
    if (count === 1) return "1 task is coming up soon.";
    return `${count} tasks are coming up in the next 3 days.`;
  }
  if (label === "Recently Completed") {
    if (count === 0) return "No tasks completed yet.";
    if (count === 1) return "Nice, you completed 1 task!";
    return `Great job — ${count} tasks done!`;
  }
};
