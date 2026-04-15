"use client";

import { useEffect, useMemo, useState } from "react";
import TodoCard from "@/components/TodoCard";
import { CONSTANTS, createSampleTodos } from "@/lib/constants";
import { Priority, Todo } from "@/types";

function getTodayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getHeaderDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getHeaderTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function loadTodosFromStorage(todayKey: string): Todo[] {
  return createSampleTodos(7);
}

export default function Page() {
  const [now, setNow] = useState(() => new Date());
  const todayKey = getTodayKey(now);
  const [todos, setTodos] = useState<Todo[]>(() => loadTodosFromStorage(todayKey));
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [tomorrowTitle, setTomorrowTitle] = useState("");
  const [tomorrowDescription, setTomorrowDescription] = useState("");
  const [tomorrowPriority, setTomorrowPriority] = useState<Priority>("Medium");
  const [tomorrowTags, setTomorrowTags] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);
  const dueSoonCount = useMemo(
    () =>
      todos.filter((todo) => {
        const due = new Date(todo.dueDate).getTime();
        const diffHours = (due - Date.now()) / (1000 * 60 * 60);
        return diffHours > 0 && diffHours <= 24;
      }).length,
    [todos]
  );
  const allCompleted = todos.length > 0 && activeCount === 0;
  const headerDate = getHeaderDate(now);
  const headerTime = getHeaderTime(now);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("todo-board-state");
      if (!saved) return;
      const parsed = JSON.parse(saved) as { dateKey: string; todos: Todo[] };
      if (!parsed?.todos) return;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todos = parsed.todos
        .map((todo) => ({ ...todo, dueDate: new Date(todo.dueDate) }))
        .filter((todo) => new Date(todo.dueDate) >= todayStart);
      if (parsed.dateKey !== todayKey) {
        if (todos.length > 0) setTodos(todos);
        return;
      }
      if (todos.length > 0) setTodos(todos);
    } catch {
      // ignore
    }
  }, [todayKey]);

  useEffect(() => {
    const ticker = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    setShowCongrats(allCompleted);
  }, [allCompleted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "todo-board-state",
      JSON.stringify({ dateKey: todayKey, todos })
    );
  }, [todos, todayKey]);

  const handleToggleComplete = (id: number, completed: boolean) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
    setSelectedTask((prev) => (prev?.id === id && !completed ? null : prev));
  };

  const handleEdit = (id: number) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setSelectedTask(todoToEdit);
    }
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setSelectedTask((prev) => (prev?.id === id ? null : prev));
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    setSelectedTask(null);
    setShowCongrats(false);
  };

  const handleAddTomorrowTodo = () => {
    if (!tomorrowTitle.trim()) return;

    const newTodo: Todo = {
      id: todos.length + 1,
      title: tomorrowTitle.trim(),
      description: tomorrowDescription.trim() || "Prepare the next-day checklist.",
      priority: tomorrowPriority,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
      tags: tomorrowTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTomorrowTitle("");
    setTomorrowDescription("");
    setTomorrowTags("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 py-10 text-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl border border-slate-800 overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start p-8 lg:p-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-indigo-500/10 p-4 text-indigo-200 shadow-sm shadow-indigo-500/10">
                <div className="inline-flex items-center gap-3 font-semibold tracking-wide">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse" />
                  Daily Productivity Hub
                </div>
                <div className="text-sm text-slate-200">
                  <div>{headerDate}</div>
                  <div className="mt-1 text-xs text-slate-300">{headerTime}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  Plan your day with energy.
                </h1>
                <p className="max-w-3xl text-lg text-slate-300 leading-relaxed">
                  Capture more tasks, stay focused, and feel the momentum. This responsive task board scales with your list and keeps every item easy to scan.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-gradient-to-br from-blue-900/80 via-indigo-950 to-purple-900/80 p-5 border border-blue-700/40 shadow-lg shadow-blue-500/10">
                  <div className="text-3xl font-bold text-cyan-300">{todos.length}</div>
                  <div className="text-sm text-slate-400">Tasks today</div>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-950 to-blue-950/80 p-5 border border-slate-700/40 shadow-lg shadow-slate-800/10">
                  <div className="text-3xl font-bold text-emerald-300">{activeCount}</div>
                  <div className="text-sm text-slate-400">Active tasks</div>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-purple-900/80 via-pink-950 to-red-900/80 p-5 border border-red-700/40 shadow-lg shadow-red-500/10">
                  <div className="text-3xl font-bold text-rose-300">{dueSoonCount}</div>
                  <div className="text-sm text-slate-400">Due soon</div>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-950 to-emerald-900/80 p-5 border border-emerald-700/40 shadow-lg shadow-emerald-500/10">
                  <div className="text-3xl font-bold text-emerald-200">{completedCount}</div>
                  <div className="text-sm text-slate-400">Completed</div>
                </div>
              </div>

              {allCompleted && showCongrats && (
                <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/90 p-5 shadow-lg shadow-emerald-500/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.3em] text-emerald-300/70">Congratulations</div>
                      <p className="mt-2 text-lg font-semibold text-white">Congrats! Set up your tomorrow to-do list.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearCompleted}
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Clear completed and start tomorrow
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 p-8 text-white shadow-xl shadow-slate-950/50 border border-white/10">
              <div className="text-sm uppercase tracking-[0.3em] text-fuchsia-200/70">Today's focus</div>
              <h2 className="mt-4 text-3xl font-bold text-white">Tackle a realistic plan.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300/90">
                Add more than 5–10 tasks and keep your workflow smooth. The board grows with you, while each card stays clear, colorful, and easy to act on.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white/5 p-4 border border-white/10 shadow-md shadow-black/10">
                  <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-200">Tip</div>
                  <p className="mt-3 text-sm text-slate-300">Use tags to group tasks, then sort by priority or due date.</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 border border-white/10 shadow-md shadow-black/10">
                  <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-200">Motion</div>
                  <p className="mt-3 text-sm text-slate-300">Hover any card to see subtle lift, color bloom, and extra polish.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Your task board</h2>
              <p className="text-sm text-slate-300">A responsive layout for 5–10+ daily items, with progress at a glance.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 shadow-sm shadow-slate-900/40">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live updates every 30 seconds
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-slate-950/90 p-8 border border-slate-800 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Completed task editor</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Select a completed task to prep it for tomorrow’s list.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {completedCount} completed
                </span>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-900/90 p-6 border border-slate-700/80">
                {selectedTask ? (
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-950/90 p-4 border border-slate-700/80">
                      <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Selected task</div>
                      <h4 className="mt-2 text-xl font-semibold text-white">{selectedTask.title}</h4>
                      <p className="mt-2 text-sm text-slate-300">{selectedTask.description}</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {selectedTask.priority} priority
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Tap edit on any completed card to load it here for tomorrow’s planning.</p>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300 border border-slate-700/70">
                    <p className="text-sm">No completed task selected yet.</p>
                    <p className="mt-3 text-sm text-slate-400">Mark a task as done and then tap Edit to move it into tomorrow’s planning space.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950/90 p-8 border border-slate-800 shadow-2xl shadow-black/30">
              <div className="text-sm uppercase tracking-[0.3em] text-fuchsia-200/70">Tomorrow’s checklist</div>
              <h3 className="mt-4 text-2xl font-bold text-white">Add a next-day task</h3>
              <p className="mt-2 text-sm text-slate-400">Draft one or more tasks for the next day so your workflow starts faster.</p>

              <div className="mt-6 space-y-4">
                <label className="block text-sm text-slate-300">
                  Title
                  <input
                    value={tomorrowTitle}
                    onChange={(event) => setTomorrowTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Tomorrow’s first priority"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Description
                  <textarea
                    value={tomorrowDescription}
                    onChange={(event) => setTomorrowDescription(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    rows={4}
                    placeholder="Brief note for the next day"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Tags (comma-separated)
                  <input
                    value={tomorrowTags}
                    onChange={(event) => setTomorrowTags(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="planning, tomorrow, priority"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Priority
                  <select
                    value={tomorrowPriority}
                    onChange={(event) => setTomorrowPriority(event.target.value as Priority)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleAddTomorrowTodo}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                >
                  Add tomorrow task
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-slate-800/70 pt-8 text-center text-sm text-slate-400">
          Built with motion, clarity, and modern responsive design.
        </footer>
      </div>
    </main>
  );
}