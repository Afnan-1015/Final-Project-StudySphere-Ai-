import React, { useState, useEffect } from "react";
import { ViewMode, Course, Task, UserProfile } from "./types";
import {
  initialProfile,
  initialCourses,
  initialTasks,
  DEFAULT_AVATAR,
} from "./data";

import { Navigation } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { CoursesView } from "./components/CoursesView";
import { TutorView } from "./components/TutorView";
import { AssignmentsView } from "./components/AssignmentsView";
import { SignInView } from "./components/SignInView";
import { SignUpView } from "./components/SignUpView";
import { ForgotPasswordView } from "./components/ForgotPasswordView";
import { LandingView } from "./components/LandingView";

interface RegisteredUser {
  name: string;
  email: string;
  pass: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tutorPrompt, setTutorPrompt] = useState<string>("");

  // Registered Accounts Database
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    {
      name: "Alex Johnson",
      email: "student@university.edu",
      pass: "password123",
    },
  ]);

  // Enforce authentication guard for main application views
  const handleNavigate = (view: ViewMode) => {
    const isAppView =
      view === "home" ||
      view === "courses" ||
      view === "tutor" ||
      view === "assignments";

    if (!isLoggedIn && isAppView) {
      setCurrentView("signin");
    } else {
      setCurrentView(view);
    }
  };

  const handleReviewNow = (prompt: string) => {
    setTutorPrompt(prompt);
    handleNavigate("tutor");
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              progress: !t.completed ? 100 : t.progress,
            }
          : t
      )
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleDeleteCourse = (courseId: string) => {
    const courseToDelete = courses.find((c) => c.id === courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (courseToDelete) {
      setTasks((prev) =>
        prev.filter(
          (t) =>
            t.courseCode.toLowerCase() !== courseToDelete.title.toLowerCase() &&
            t.courseCode.toLowerCase() !== courseToDelete.code.toLowerCase() &&
            !t.title.toLowerCase().includes(courseToDelete.title.toLowerCase()) &&
            !t.courseCode.toLowerCase().includes(courseToDelete.title.toLowerCase())
        )
      );
    }
  };

  const handleRegisterUser = (newUser: {
    name: string;
    email: string;
    pass: string;
  }) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser((prev) => ({
      ...prev,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: DEFAULT_AVATAR,
    }));
    setIsLoggedIn(true);
    setCurrentView("home");
  };

  const handleLoginSuccess = (loggedInUser: RegisteredUser) => {
    setUser((prev) => ({
      ...prev,
      name: loggedInUser.name,
      email: loggedInUser.email,
    }));
    setIsLoggedIn(true);
    setCurrentView("home");
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentView("signin");
  };

  const handleUpdateAvatar = (avatarUrl: string) => {
    setUser((prev) => ({
      ...prev,
      avatarUrl,
    }));
  };

  const handlePasswordUpdated = (email: string, newPass: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === email.toLowerCase()
          ? { ...u, pass: newPass }
          : u
      )
    );
  };

  const hasOverdueTasks = tasks.some(
    (t) =>
      !t.completed &&
      (t.dueDate.toLowerCase().includes("today") ||
        t.dueDate.toLowerCase().includes("urgent") ||
        t.dueDate.toLowerCase().includes("2 day") ||
        t.dueDate.toLowerCase().includes("3 day"))
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* Fixed Navigation Header across all pages */}
      <Navigation
        currentView={currentView}
        setCurrentView={handleNavigate}
        user={user}
        hasOverdueTasks={hasOverdueTasks}
        isLoggedIn={isLoggedIn}
        onLogOut={handleLogOut}
        onUpdateAvatar={handleUpdateAvatar}
      />

      {/* Screen Routing */}
      {currentView === "landing" && (
        <LandingView onNavigate={handleNavigate} />
      )}

      {currentView === "home" && isLoggedIn && (
        <DashboardView
          user={user}
          courses={courses}
          tasks={tasks}
          onReviewNow={handleReviewNow}
          onNavigate={handleNavigate}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {currentView === "courses" && isLoggedIn && (
        <CoursesView
          courses={courses}
          onAddCourse={handleAddCourse}
          onDeleteCourse={handleDeleteCourse}
          onAskTutor={handleReviewNow}
        />
      )}

      {currentView === "tutor" && isLoggedIn && (
        <TutorView
          user={user}
          initialPrompt={tutorPrompt}
          onClearPrompt={() => setTutorPrompt("")}
        />
      )}

      {currentView === "assignments" && isLoggedIn && (
        <AssignmentsView
          tasks={tasks}
          courses={courses}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {currentView === "signin" && (
        <SignInView
          onNavigate={handleNavigate}
          registeredUsers={registeredUsers}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentView === "signup" && (
        <SignUpView
          onNavigate={handleNavigate}
          onRegisterUser={handleRegisterUser}
        />
      )}

      {currentView === "forgot" && (
        <ForgotPasswordView
          onNavigate={handleNavigate}
          registeredUsers={registeredUsers}
          onPasswordUpdated={handlePasswordUpdated}
        />
      )}
    </div>
  );
}
