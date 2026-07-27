import React, { useState } from "react";
import { Task, Course } from "../types";

interface AssignmentsViewProps {
  tasks: Task[];
  courses: Course[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  tasks,
  courses,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Task form state: Selected Subject from My Courses + Task Name + Due Date
  const [selectedSubject, setSelectedSubject] = useState(
    courses.length > 0 ? courses[0].title : "General"
  );
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("2 Days Left");

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "pending") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  // Sort by due date
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fullTaskTitle = selectedSubject.trim()
      ? `${selectedSubject}: ${newTitle.trim()}`
      : newTitle.trim();

    const newTask: Task = {
      id: Date.now().toString(),
      title: fullTaskTitle,
      courseCode: selectedSubject.trim() || "General Task",
      dueDate: newDueDate.trim() || "2 Days Left",
      priority: "HIGH",
      progress: 0,
      completed: false,
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setNewTitle("");
    setNewDueDate("2 Days Left");
  };

  // Helper to check if a due date is today or overdue
  const isDueSoon = (dueDateStr: string) => {
    const lower = dueDateStr.toLowerCase();
    return (
      lower.includes("today") ||
      lower.includes("tomorrow") ||
      lower.includes("urgent") ||
      lower.includes("oct 29") ||
      lower.includes("due")
    );
  };

  return (
    <main className="pt-20 pb-20 px-4 md:px-10 max-w-3xl mx-auto min-h-screen">
      {/* Tab Controls Centered */}
      <section className="flex flex-col items-center gap-4 mb-8">
        <div className="flex p-1 bg-[#e5eeff] rounded-2xl">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "pending"
                ? "bg-white shadow-xs text-[#0058be]"
                : "text-[#424754] hover:bg-[#dce9ff]"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "completed"
                ? "bg-white shadow-xs text-[#0058be]"
                : "text-[#424754] hover:bg-[#dce9ff]"
            }`}
          >
            Completed
          </button>
        </div>
      </section>

      {/* Main Task List Centered */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-bold text-2xl text-[#0b1c30]">
            {activeTab === "pending" ? "Pending Tasks" : "Completed Tasks"}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0058be] hover:bg-[#004395] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const hasNotification = isDueSoon(task.dueDate);

            return (
              <div
                key={task.id}
                className={`group flex items-center gap-4 p-4.5 bg-white rounded-2xl shadow-2xs hover:shadow-md transition-all border border-slate-200/80 ${
                  task.completed ? "opacity-60 bg-slate-50/80" : ""
                }`}
              >
                {/* Unchecked / Checked Box */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  title={
                    task.completed
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                  className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-[#0058be] border-[#0058be] text-white"
                      : "border-[#c2c6d6] hover:border-[#0058be] bg-white"
                  }`}
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-sm font-bold">
                      check
                    </span>
                  )}
                </button>

                {/* Subject Name & Due Date */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-base text-[#0b1c30] truncate ${
                      task.completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-[#727785]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        event
                      </span>
                      {task.dueDate}
                    </span>
                  </div>
                </div>

                {/* Due Date Notification Bell */}
                {!task.completed && hasNotification && (
                  <div
                    title="Task due date approaching!"
                    className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-xl text-xs font-bold animate-pulse"
                  >
                    <span className="material-symbols-outlined text-sm">
                      notifications_active
                    </span>
                    <span>Due Soon</span>
                  </div>
                )}

                {/* Cross Option to Remove Task */}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-400 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {sortedTasks.length === 0 && (
            <div
              onClick={() => setShowAddModal(true)}
              className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#0058be] hover:bg-[#eff4ff]/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#e5eeff] text-[#0058be] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  add_task
                </span>
              </div>
              <p className="text-base font-bold text-[#0b1c30]">
                {activeTab === "pending"
                  ? "Click here to add new task"
                  : "No completed tasks yet"}
              </p>
              <p className="text-xs text-[#727785] mt-1">
                Keep your assignments and study goals on schedule.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal: Add New Task (Simplified: Subject + Due Date) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#0b1c30]">Add New Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1 uppercase tracking-wider">
                  Select Subject (From My Courses)
                </label>
                {courses.length > 0 ? (
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none bg-white font-medium text-[#0b1c30]"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Enter subject name"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1 uppercase tracking-wider">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Practice Problems or Lab Assignment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1 uppercase tracking-wider">
                  Due Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Days Left, 3 Days Left, or Tomorrow"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#c2c6d6] rounded-xl text-sm text-[#424754]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0058be] text-white rounded-xl text-sm font-semibold hover:bg-[#004395] transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
