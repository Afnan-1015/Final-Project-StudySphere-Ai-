import React, { useState, useEffect } from "react";
import { UserProfile, Task, Course, ViewMode } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  courses: Course[];
  tasks: Task[];
  onReviewNow: (prompt: string) => void;
  onNavigate: (view: ViewMode) => void;
  onToggleTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  courses,
  tasks,
  onReviewNow,
  onNavigate,
  onToggleTask,
  onDeleteTask,
}) => {
  // Focus Session Timer State (Editable)
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showEditTimerModal, setShowEditTimerModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState("25");

  // Selected Course for Quiz from My Courses
  const [selectedQuizCourseTitle, setSelectedQuizCourseTitle] = useState(
    courses.length > 0 ? courses[0].title : ""
  );

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  // Score Pop-up Modal State
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [quizScore, setQuizScore] = useState<{
    score: number;
    total: number;
    wrongItems: { question: string; wrongAnswer: string; correctAnswer: string }[];
  }>({ score: 0, total: 10, wrongItems: [] });

  // Sync default course if courses list updates
  useEffect(() => {
    if (courses.length > 0 && !selectedQuizCourseTitle) {
      setSelectedQuizCourseTitle(courses[0].title);
    }
  }, [courses, selectedQuizCourseTitle]);

  // Pomodoro Timer Interval Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            if (minutes === 0) {
              setIsRunning(false);
              setCompletedSessions((prev) => prev + 1);
              alert("🎉 Focus session completed! Great work on deep learning.");
              return 0;
            } else {
              setMinutes((prevMin) => prevMin - 1);
              return 59;
            }
          } else {
            return prevSec - 1;
          }
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(parseInt(customMinutesInput) || 25);
    setSeconds(0);
  };

  const handleSaveTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const newMins = parseInt(customMinutesInput, 10);
    if (!isNaN(newMins) && newMins > 0) {
      setIsRunning(false);
      setMinutes(newMins);
      setSeconds(0);
      setShowEditTimerModal(false);
    }
  };

  const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  // Generate 10 sample MCQs for the selected course
  const generateQuizForCourse = (courseTitle: string) => {
    const sampleQuestions: QuizQuestion[] = [
      {
        id: 1,
        question: `In ${courseTitle}, what is the primary fundamental principle?`,
        options: [
          "Systematic logical analysis",
          "Random trial and error",
          "Strictly visual memorization",
          "Linear regression only",
        ],
        correctIndex: 0,
      },
      {
        id: 2,
        question: `Which approach is most effective for solving core problems in ${courseTitle}?`,
        options: [
          "Ignoring edge cases",
          "Decomposition into modular steps",
          "Brute force calculation",
          "Bypassing verification",
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: `What key concept forms the basis of advanced topics in ${courseTitle}?`,
        options: [
          "Arbitrary constants",
          "Standardized theoretical frameworks",
          "Secondary assumptions",
          "Unbounded variables",
        ],
        correctIndex: 1,
      },
      {
        id: 4,
        question: `How do key components interact within ${courseTitle}?`,
        options: [
          "Through structured protocols",
          "Completely independently",
          "Via non-deterministic noise",
          "Only at compile time",
        ],
        correctIndex: 0,
      },
      {
        id: 5,
        question: `What is a common error to avoid when working with ${courseTitle}?`,
        options: [
          "Double checking work",
          "Confusing initial conditions with steady states",
          "Using standard formulas",
          "Following step-by-step proofs",
        ],
        correctIndex: 1,
      },
      {
        id: 6,
        question: `Which methodology is widely used to evaluate results in ${courseTitle}?`,
        options: [
          "Empirical testing & logical validation",
          "Guessing based on trends",
          "Intuition alone",
          "Static guesswork",
        ],
        correctIndex: 0,
      },
      {
        id: 7,
        question: `In ${courseTitle}, what does optimization typically aim to minimize?`,
        options: [
          "Efficiency and accuracy",
          "Error rate and resource overhead",
          "Code readability",
          "Test coverage",
        ],
        correctIndex: 1,
      },
      {
        id: 8,
        question: `What is the significance of boundary conditions in ${courseTitle}?`,
        options: [
          "They define valid operating limits",
          "They are purely cosmetic",
          "They replace core equations",
          "They increase computational latency",
        ],
        correctIndex: 0,
      },
      {
        id: 9,
        question: `Which real-world application relies heavily on ${courseTitle}?`,
        options: [
          "Automated decision systems & engineering",
          "Manual file sorting",
          "Static web pages",
          "Unformatted plain text logs",
        ],
        correctIndex: 0,
      },
      {
        id: 10,
        question: `What is the recommended strategy when tackling complex exams in ${courseTitle}?`,
        options: [
          "Skip fundamental theorems",
          "Apply core rules and verify edge cases step-by-step",
          "Rush through without reading prompts",
          "Memorize answers without understanding proofs",
        ],
        correctIndex: 1,
      },
    ];

    setQuizQuestions(sampleQuestions);
    setUserAnswers({});
    setShowQuizModal(true);
  };

  // Submit Interactive Quiz Pop-up -> Shows Score Modal
  const handleSubmitQuiz = () => {
    let score = 0;
    const wrongItems: { question: string; wrongAnswer: string; correctAnswer: string }[] = [];

    quizQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctIndex) {
        score++;
      } else {
        const selectedText =
          selected !== undefined ? q.options[selected] : "Not Answered";
        const correctText = q.options[q.correctIndex];
        wrongItems.push({
          question: q.question,
          wrongAnswer: selectedText,
          correctAnswer: correctText,
        });
      }
    });

    setQuizScore({
      score,
      total: quizQuestions.length,
      wrongItems,
    });
    setShowQuizModal(false);
    setShowScoreModal(true);
  };

  const handleShowWrongAnswers = () => {
    setShowScoreModal(false);
    if (quizScore.wrongItems.length === 0) {
      onReviewNow(
        `I scored ${quizScore.score}/${quizScore.total} on my ${selectedQuizCourseTitle} quiz! All answers were correct.`
      );
      return;
    }

    const questionsList = quizScore.wrongItems
      .map((item, idx) => `Question ${idx + 1}: ${item.question}`)
      .join("\n\n");

    const prompt = `${questionsList}\n\nWhat are the correct answers of the above wrong questions?`;

    onReviewNow(prompt);
  };

  // Strict filter: only keep tasks that:
  // 1. Are NOT completed (!task.completed)
  // 2. Belong to an existing course in My Courses
  // 3. Have a 1 or 2 days remaining deadline ("1 day", "2 day", "1-2 day", "1 days", "2 days", etc.)
  const strictDeadlineTasks = tasks.filter((task) => {
    if (task.completed) return false;

    // Check if task belongs to a course that currently exists in My Courses
    const courseExists = courses.some(
      (c) =>
        c.title.toLowerCase() === task.courseCode.toLowerCase() ||
        c.code.toLowerCase() === task.courseCode.toLowerCase() ||
        task.title.toLowerCase().includes(c.title.toLowerCase()) ||
        task.courseCode.toLowerCase().includes(c.title.toLowerCase())
    );

    if (!courseExists) return false;

    const dueStr = task.dueDate.toLowerCase();
    return (
      dueStr.includes("1 day") ||
      dueStr.includes("2 day") ||
      dueStr.includes("1-2 day") ||
      dueStr.includes("1 days") ||
      dueStr.includes("2 days") ||
      dueStr.includes("1-2 days")
    );
  });

  // Dynamic system time greeting (Good morning: 12 AM to 12 PM, Good afternoon: 12 PM to 12 AM)
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : "Good afternoon";

  return (
    <main className="pt-20 pb-20 px-4 md:px-10 max-w-[1280px] mx-auto min-h-screen">
      {/* Welcome Header */}
      <section className="mb-6">
        <h1 className="font-bold text-3xl md:text-4xl text-[#0b1c30]">
          {greeting}, {user.name}!
        </h1>
        <p className="text-base text-[#424754] mt-1">
          Welcome back to your StudySphere dashboard.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Tasks Card (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div
            onClick={() => onNavigate("assignments")}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-t-2 border-[#0058be] border-x border-b border-slate-200/80 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-xs text-[#424754] uppercase tracking-wider group-hover:text-[#0058be] transition-colors">
                Active Tasks
              </h3>
              <span className="material-symbols-outlined text-[#0058be]">
                checklist
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl text-[#0b1c30]">
                {tasks.filter((t) => !t.completed).length}
              </span>
              <span className="text-xs text-[#424754]">due in assignments</span>
            </div>
          </div>
        </div>

        {/* Focus Session & Course Quiz Creator (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Pomodoro Focus Session Card with Timer Edit */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xs font-bold text-[#0058be] uppercase tracking-widest">
                Focus Session
              </h2>
              <button
                onClick={() => {
                  setCustomMinutesInput(minutes.toString());
                  setShowEditTimerModal(true);
                }}
                className="text-xs text-[#0058be] hover:underline flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded-lg font-semibold"
                title="Edit timer duration"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
                Edit Timer
              </button>
            </div>

            <div className="font-bold text-6xl text-[#0b1c30] tracking-tight mb-6 tabular-nums">
              {formattedTime}
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleStartPause}
                className="bg-[#0058be] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-[#004395] transition-all active:scale-95 flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-lg">
                  {isRunning ? "pause" : "play_arrow"}
                </span>
                {isRunning ? "Pause Session" : "Start Session"}
              </button>
              <button
                onClick={handleReset}
                className="bg-[#dce9ff] text-[#0b1c30] px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#d3e4fe] transition-all active:scale-95"
              >
                Reset
              </button>
            </div>

            {completedSessions > 0 && (
              <p className="text-xs text-emerald-600 font-semibold mt-3">
                Completed today: {completedSessions} session(s)
              </p>
            )}
          </div>

          {/* AI Quiz Creator Banner */}
          <div className="p-0.5 rounded-2xl bg-gradient-to-r from-[#0058be] to-[#6b38d4] shadow-md">
            <div className="bg-white p-5 rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#d8e2ff] flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-[#0058be] text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  quiz
                </span>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-xs font-bold text-[#0058be] uppercase tracking-wider">
                    Select Course:
                  </label>
                  {courses.length > 0 ? (
                    <select
                      value={selectedQuizCourseTitle}
                      onChange={(e) =>
                        setSelectedQuizCourseTitle(e.target.value)
                      }
                      className="bg-[#eff4ff] border border-[#c2c6d6] text-[#0b1c30] font-bold text-sm rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-[#0058be]"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.title}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-red-500 font-bold">
                      No courses in My Courses yet
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#424754]">
                  choose a course and i'll create a quiz for you (only 10 or 15
                  questions).
                </p>
              </div>

              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                {/* Take Quiz Button - Opens Interactive MCQ Popup */}
                <button
                  onClick={() => {
                    if (!selectedQuizCourseTitle) {
                      alert("Please add a course in My Courses first!");
                      return;
                    }
                    generateQuizForCourse(selectedQuizCourseTitle);
                  }}
                  className="w-full sm:w-auto bg-[#0058be] text-white font-bold text-sm hover:bg-[#004395] px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">
                    quiz
                  </span>
                  Take Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Course Deadlines (1 to 2 Days Remaining Only) */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">
                  schedule
                </span>
                Upcoming Course Deadlines (1-2 Days Left)
              </h3>
              <button
                onClick={() => onNavigate("courses")}
                className="text-xs font-semibold text-[#0058be] hover:underline"
              >
                My Courses
              </button>
            </div>

            {strictDeadlineTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {strictDeadlineTasks.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-2xs flex justify-between items-center gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {onToggleTask && (
                        <button
                          onClick={() => onToggleTask(item.id)}
                          title="Mark task as completed"
                          className="w-5 h-5 rounded-md border-2 border-amber-400 hover:border-[#0058be] hover:bg-[#0058be] hover:text-white bg-white text-transparent flex items-center justify-center shrink-0 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs font-bold">
                            check
                          </span>
                        </button>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-[#0b1c30] truncate">
                          {item.courseCode || item.title}
                        </h4>
                        <p className="text-xs text-[#424754] mt-0.5 truncate">
                          {item.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-amber-800 font-bold text-xs bg-amber-100 px-2.5 py-1 rounded-lg">
                        {item.dueDate}
                      </span>
                      {onDeleteTask && (
                        <button
                          onClick={() => onDeleteTask(item.id)}
                          title="Delete task deadline"
                          className="w-6 h-6 rounded-full hover:bg-amber-200/60 text-amber-800 flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-[#727785]">
                <p className="font-semibold text-slate-700 text-sm mb-1">
                  No courses with 1 to 2 days remaining deadline.
                </p>
                <p>
                  Only courses with 1 or 2 days remaining are highlighted here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Edit Timer Duration */}
      {showEditTimerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#0b1c30]">
                Edit Timer Duration
              </h3>
              <button
                onClick={() => setShowEditTimerModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTimer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1 uppercase tracking-wider">
                  Session Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={customMinutesInput}
                  onChange={(e) => setCustomMinutesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#c2c6d6] rounded-xl text-base font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2">
                {["15", "25", "30", "45", "60"].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setCustomMinutesInput(mins)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      customMinutesInput === mins
                        ? "bg-[#0058be] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditTimerModal(false)}
                  className="px-4 py-2 border border-[#c2c6d6] rounded-xl text-xs text-[#424754]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0058be] text-white rounded-xl text-xs font-bold hover:bg-[#004395]"
                >
                  Set Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interactive MCQ Quiz Pop-Up */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-xl text-[#0b1c30]">
                  {selectedQuizCourseTitle} Practice Quiz
                </h3>
                <p className="text-xs text-[#727785]">
                  Answer all 10 MCQs below and submit to get score & AI Tutor feedback
                </p>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-500"
              >
                ✕
              </button>
            </div>

            {/* Quiz Questions Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
              {quizQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#f8f9ff] rounded-2xl border border-slate-200/80"
                >
                  <p className="font-bold text-sm text-[#0b1c30] mb-3">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setUserAnswers((prev) => ({
                              ...prev,
                              [q.id]: optIdx,
                            }))
                          }
                          className={`p-3 text-left rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                            isSelected
                              ? "bg-[#0058be] text-white border-[#0058be] shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:border-[#0058be] hover:bg-[#eff4ff]"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full border text-[10px] flex items-center justify-center font-bold shrink-0 ${
                              isSelected
                                ? "border-white bg-white/20 text-white"
                                : "border-slate-300 text-slate-500"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Quiz Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-[#727785] font-semibold">
                Answered {Object.keys(userAnswers).length} / 10 Questions
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 border border-[#c2c6d6] rounded-xl text-xs text-[#424754]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 bg-[#0058be] text-white font-bold text-xs rounded-xl hover:bg-[#004395] transition-colors shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    send
                  </span>
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Quiz Score Results Pop-Up */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0058be] mb-4">
              <span className="material-symbols-outlined text-3xl font-bold">
                emoji_events
              </span>
            </div>

            <h3 className="font-extrabold text-2xl text-[#0b1c30] mb-1">
              Quiz Completed!
            </h3>
            <p className="text-xs text-[#727785] mb-6">
              {selectedQuizCourseTitle} Assessment Results
            </p>

            <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-2xl p-6 w-full mb-6">
              <span className="text-xs font-bold text-[#727785] uppercase tracking-wider block mb-1">
                Your Final Score
              </span>
              <div className="text-5xl font-extrabold text-[#0058be] tracking-tight">
                {quizScore.score}/{quizScore.total}
              </div>
              <p className="text-xs font-semibold text-[#424754] mt-2">
                {Math.round((quizScore.score / quizScore.total) * 100)}% Accuracy
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={handleShowWrongAnswers}
                className="w-full bg-[#0058be] text-white font-bold text-sm hover:bg-[#004395] py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  auto_awesome
                </span>
                See Correct Answers
              </button>

              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="w-full bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 py-2.5 rounded-xl transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
