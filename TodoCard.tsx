"use client";

import { useEffect, useState, useCallback } from "react";
import { TodoCardProps } from "@/types";
import { calculateTimeRemaining, formatDate, getISOString } from "@/lib/timeUtils";
import { CONSTANTS } from "@/lib/constants";

export default function TodoCard({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoCardProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const due = new Date(todo.dueDate);
  const formattedDate = formatDate(due);
  const checked = todo.completed;

  const handleToggle = useCallback(() => {
    onToggleComplete?.(todo.id, !checked);
  }, [checked, todo.id, onToggleComplete]);

  const handleEdit = useCallback(() => {
    onEdit?.(todo.id);
  }, [todo.id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(todo.id);
  }, [todo.id, onDelete]);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(todo.dueDate));

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(todo.dueDate));
    }, CONSTANTS.TIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [todo.dueDate]);

  const getPriorityColor = (priority: string) => {
    return (CONSTANTS.PRIORITY_COLORS[priority as keyof typeof CONSTANTS.PRIORITY_COLORS] ||
      "text-gray-600 bg-gray-50"
    );
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <article
      data-testid="test-todo-card"
      role="region"
      aria-label={`Task: ${todo.title}`}
      className={`group relative bg-slate-900/95 text-slate-100 rounded-3xl border border-slate-700/70 shadow-xl shadow-indigo-900/20 transition-all duration-300 ease-out ${checked ? "bg-gradient-to-br from-slate-950 to-slate-800 border-emerald-600/30" : "hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/20"} ${isHovered ? "scale-[1.01]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background pattern for completed tasks */}
      {checked && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl pointer-events-none" />
      )}

      <div className="relative p-6 space-y-5">
        {/* Header with enhanced checkbox and title */}
        <header className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <label
              htmlFor={`todo-${todo.id}-checkbox`}
              className="relative cursor-pointer group/checkbox"
            >
              <input
                id={`todo-${todo.id}-checkbox`}
                type="checkbox"
                data-testid="test-todo-complete-toggle"
                checked={checked}
                onChange={handleToggle}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${checked ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 shadow-lg shadow-green-500/30" : "border-slate-600 group-hover/checkbox:border-cyan-400 group-hover/checkbox:shadow-md group-hover/checkbox:shadow-cyan-500/20"}`}>
                {checked && (
                  <svg
                    className="w-4 h-4 text-white mx-auto mt-0.5 animate-in zoom-in-50 duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </label>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h2
              data-testid="test-todo-title"
              className={`text-xl font-bold leading-tight transition-all duration-300 ${checked ? "text-slate-500 line-through decoration-2 decoration-slate-600" : "text-white group-hover:text-cyan-300"}`}
            >
              {todo.title}
            </h2>

            <p
              data-testid="test-todo-description"
              className={`text-sm leading-relaxed transition-colors duration-200 ${checked ? "text-slate-500" : "text-slate-300"}`}
            >
              {todo.description}
            </p>
          </div>
        </header>

        {/* Enhanced Priority and Status Section */}
        <div className="flex items-center justify-between">
          <div
            data-testid="test-todo-priority"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${getPriorityColor(todo.priority)} ${isHovered ? "scale-105 shadow-xl shadow-cyan-500/20" : ""}`}
          >
            <span className="text-xs" aria-hidden="true">{getPriorityIcon(todo.priority)}</span>
            <span>{todo.priority} Priority</span>
          </div>

          <div
            data-testid="test-todo-status"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${checked ? "bg-gradient-to-r from-emerald-800 to-emerald-700 text-emerald-100 shadow-sm shadow-emerald-500/20" : "bg-gradient-to-r from-blue-950 to-indigo-900 text-blue-100 shadow-sm shadow-blue-500/20"}`}
          >
            <div className={`w-2 h-2 rounded-full ${checked ? "bg-emerald-400" : "bg-blue-400"}`} />
            {checked ? "Completed" : "In Progress"}
          </div>
        </div>

        {checked && (
          <div className="rounded-2xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300 border border-slate-700/70">
            Completed — tap Edit to prepare this item for tomorrow’s list.
          </div>
        )
        }

        {/* Enhanced Time Information */}
        <div className="bg-slate-950/90 rounded-xl p-4 space-y-3 border border-slate-700/80 shadow-inner shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-4 h-4 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Due Date</div>
              <time
                data-testid="test-todo-due-date"
                dateTime={getISOString(due)}
                suppressHydrationWarning
                className="text-sm font-semibold text-slate-100"
              >
                {formattedDate}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${timeRemaining.includes("Overdue") ? "bg-red-800" : "bg-purple-800"}`}>
              <svg className={`w-4 h-4 ${timeRemaining.includes("Overdue") ? "text-red-300" : "text-purple-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Time Remaining</div>
              <p
                data-testid="test-todo-time-remaining"
                className={`text-sm font-semibold ${timeRemaining.includes("Overdue") ? "text-rose-300" : "text-slate-100"}`}
              >
                {timeRemaining}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tags */}
        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <ul
              role="list"
              data-testid="test-todo-tags"
              className="flex flex-wrap gap-2"
            >
              {todo.tags.map((tag) => (
                <li key={tag}>
                  <span
                    data-testid={`test-todo-tag-${tag}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-slate-800 to-slate-900 text-slate-200 border border-slate-700/60 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2" />
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            data-testid="test-todo-edit-button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-100 bg-slate-800 border border-slate-700/80 rounded-xl hover:bg-slate-700 hover:border-slate-600 hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            data-testid="test-todo-delete-button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-100 bg-red-900/80 border border-rose-500/20 rounded-xl hover:bg-red-700 hover:border-red-400 hover:shadow-md hover:shadow-rose-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
