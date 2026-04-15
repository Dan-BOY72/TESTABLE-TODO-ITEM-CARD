/**
 * Calculate formatted time remaining or overdue for a given date
 */
export function calculateTimeRemaining(dueDate: Date | string): string {
  const due = new Date(dueDate);
  const now = new Date().getTime();
  const diff = due.getTime() - now;

  if (diff <= 0) {
    const mins = Math.floor(Math.abs(diff) / (1000 * 60));
    if (mins < 60) return `Overdue by ${mins} minute(s)`;

    const hours = Math.floor(mins / 60);
    return `Overdue by ${hours} hour(s)`;
  }

  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `Due in ${mins} minute(s)`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Due in ${hours} hour(s)`;

  const days = Math.floor(hours / 24);
  return `Due in ${days} day(s)`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get ISO string from date
 */
export function getISOString(date: Date | string): string {
  return new Date(date).toISOString();
}
