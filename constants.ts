/**
 * Application configuration constants
 */

export const CONSTANTS = {
  TIME_UPDATE_INTERVAL: 30000, // 30 seconds
  PRIORITY_COLORS: {
    High: "text-red-600 bg-red-50",
    Medium: "text-yellow-600 bg-yellow-50",
    Low: "text-green-600 bg-green-50",
  },
};

const SAMPLE_TODO_TEMPLATES = [
  {
    title: "Prepare investor pitch deck",
    description: "Gather metrics, update slide visuals, and practice your opening story.",
    priority: "High" as const,
    completed: false,
    tags: ["Business", "Presentation", "Priority"],
  },
  {
    title: "Design mobile onboarding flow",
    description: "Review latest user feedback and polish interaction animations.",
    priority: "Medium" as const,
    completed: false,
    tags: ["Design", "UX", "Mobile"],
  },
  {
    title: "Write weekly product update",
    description: "Summarize progress for the team and share results with stakeholders.",
    priority: "Low" as const,
    completed: false,
    tags: ["Writing", "Planning"],
  },
  {
    title: "Finalize API contract",
    description: "Confirm endpoint shape with backend and update docs.",
    priority: "High" as const,
    completed: false,
    tags: ["Engineering", "Backend"],
  },
  {
    title: "Optimize landing page load time",
    description: "Measure performance and reduce bundle size for first paint.",
    priority: "Medium" as const,
    completed: false,
    tags: ["Performance", "Frontend"],
  },
  {
    title: "Schedule customer demos",
    description: "Book sessions with top prospects and prepare talking points.",
    priority: "Low" as const,
    completed: false,
    tags: ["Sales", "Customer"],
  },
  {
    title: "Review support tickets",
    description: "Triage urgent issues and delegate follow-up tasks to the team.",
    priority: "Medium" as const,
    completed: false,
    tags: ["Support", "Operations"],
  },
];

/**
 * Factory function to create sample todos with current dates
 * Must be called on client side to avoid hydration mismatch
 */
export function createSampleTodos(count = 7) {
  return SAMPLE_TODO_TEMPLATES.slice(0, count).map((template, index) => {
    const offsetHours = [26, 4, 72, -2, 18, 12, 36][index] ?? 24;
    return {
      id: index + 1,
      ...template,
      dueDate: new Date(Date.now() + offsetHours * 1000 * 60 * 60),
    };
  });
}
