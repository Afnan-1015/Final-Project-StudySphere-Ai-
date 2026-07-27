import { Course, Task, ScheduleItem, ChatMessage, UserProfile } from "./types";

export const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230058be'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const initialProfile: UserProfile = {
  name: "Alex Johnson",
  email: "student@university.edu",
  avatarUrl: DEFAULT_AVATAR,
  streakDays: 12,
  gpa: 4.0,
  gpaDiff: "+0.2 from midterm",
  studyHoursThisWeek: 24.5,
  studyGoalHours: 35,
};

export const initialCourses: Course[] = [
  {
    id: "c1",
    code: "CS101",
    title: "Computer Science 101",
    instructor: "",
    grade: "",
    progress: 0,
    color: "#0058be",
  },
  {
    id: "c2",
    code: "MATH204",
    title: "Discrete Math",
    instructor: "",
    grade: "",
    progress: 0,
    color: "#6b38d4",
  },
  {
    id: "c3",
    code: "CALC2",
    title: "Calculus II",
    instructor: "",
    grade: "",
    progress: 0,
    color: "#008096",
  },
  {
    id: "c4",
    code: "CHEM201",
    title: "Organic Chemistry",
    instructor: "",
    grade: "",
    progress: 0,
    color: "#ba1a1a",
  },
];

export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Organic Chemistry Problem Set",
    courseCode: "Organic Chemistry",
    dueDate: "1 Day Left",
    priority: "HIGH",
    progress: 0,
    completed: false,
  },
  {
    id: "t2",
    title: "Calculus Integration Quiz Prep",
    courseCode: "Calculus II",
    dueDate: "2 Days Left",
    priority: "HIGH",
    progress: 0,
    completed: false,
  },
  {
    id: "t3",
    title: "Discrete Math Logic Proofs",
    courseCode: "Discrete Math",
    dueDate: "5 Days Left",
    priority: "MEDIUM",
    progress: 0,
    completed: false,
  },
];
