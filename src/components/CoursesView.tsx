import React, { useState } from "react";
import { Course } from "../types";

interface CoursesViewProps {
  courses: Course[];
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onAskTutor: (prompt: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onAddCourse,
  onDeleteCourse,
  onAskTutor,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Course Form State: Subject Name ONLY
  const [newTitle, setNewTitle] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ["#0058be", "#6b38d4", "#008096", "#ba1a1a", "#006577"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: Course = {
      id: Date.now().toString(),
      code: newTitle.trim(),
      title: newTitle.trim(),
      instructor: "",
      grade: "",
      progress: 0,
      color: randomColor,
    };

    onAddCourse(created);
    setShowAddModal(false);
    setNewTitle("");
  };

  return (
    <main className="pt-20 pb-20 px-4 md:px-10 max-w-[1280px] mx-auto min-h-screen">
      {/* Header & Center Search Bar */}
      <section className="mb-8 text-center max-w-xl mx-auto space-y-4">
        <div>
          <h1 className="font-bold text-3xl text-[#0b1c30]">My Courses</h1>
          <p className="text-xs text-[#424754] mt-1">
            Manage your subjects and study materials
          </p>
        </div>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727785]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-[#c2c6d6] rounded-2xl focus:ring-2 focus:ring-[#0058be] outline-none text-sm transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Course Grid - Simplified Cards showing Subject Name Only */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group min-h-[140px]"
          >
            {/* Top Color Accent */}
            <div
              className="absolute top-0 left-0 w-full h-1.5"
              style={{ backgroundColor: course.color }}
            ></div>

            {/* Remove / Cross Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteCourse(course.id);
              }}
              title="Remove course"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-400 flex items-center justify-center text-sm font-bold transition-colors z-20 cursor-pointer"
            >
              ✕
            </button>

            {/* Subject Name Only */}
            <div className="pr-8 pt-2">
              <h3 className="font-bold text-xl text-[#0b1c30] leading-snug">
                {course.title}
              </h3>
            </div>

            {/* Quick Action Link to AI Tutor */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onAskTutor(
                    `Create a quiz of ${course.title} containing 10 to 15 mcqs`
                  )
                }
                className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1 bg-[#eff4ff] hover:bg-[#dce9ff] px-3 py-1.5 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-sm">quiz</span>
                AI Quiz & Tutor
              </button>
            </div>
          </div>
        ))}

        {/* Add Course Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-[#c2c6d6] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-[#eff4ff] transition-colors cursor-pointer group min-h-[140px]"
        >
          <div className="w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[#0058be] text-2xl">
              add
            </span>
          </div>
          <div>
            <h4 className="font-bold text-base text-[#424754]">
              Add New Course
            </h4>
            <p className="text-xs text-[#727785] mt-0.5">
              Enter subject name to add to My Courses
            </p>
          </div>
        </div>
      </section>

      {/* Modal: Add New Course (Subject Name ONLY) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#0b1c30]">
                Add New Course
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1.5 uppercase tracking-wider">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus II, Physics, Data Structures..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
