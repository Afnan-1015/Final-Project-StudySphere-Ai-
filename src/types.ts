export type ViewMode =
  | "landing"
  | "home"
  | "courses"
  | "tutor"
  | "assignments"
  | "signin"
  | "signup"
  | "forgot";

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  grade: string;
  progress: number;
  color: string; // "primary" | "secondary" | "tertiary" | "error"
  semester?: string;
  syllabusUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string;
  dueTime?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  progress: number;
  completed: boolean;
  attachmentsCount?: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  period: "AM" | "PM";
  title: string;
  location: string;
  isAiBlock?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  authorName?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  gpa: number;
  gpaDiff: string;
  studyHoursThisWeek: number;
  studyGoalHours: number;
}
