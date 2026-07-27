import React, { useState, useRef } from "react";
import { ViewMode, UserProfile } from "../types";
import { DEFAULT_AVATAR } from "../data";

interface NavigationProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  user: UserProfile;
  hasOverdueTasks?: boolean;
  isLoggedIn: boolean;
  onLogOut: () => void;
  onUpdateAvatar: (avatarUrl: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  user,
  hasOverdueTasks = false,
  isLoggedIn,
  onLogOut,
  onUpdateAvatar,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSimpleNavbar =
    !isLoggedIn ||
    currentView === "signin" ||
    currentView === "signup" ||
    (!isLoggedIn && currentView === "forgot");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Hidden File Input for Profile Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Top Fixed Navbar across all pages */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#f8f9ff]/95 backdrop-blur-md shadow-xs h-16 border-b border-slate-200/80">
        <div className="flex justify-between items-center px-4 md:px-10 h-full max-w-[1280px] mx-auto">
          {/* Unauthenticated / Auth Screen Navbar Mode */}
          {showSimpleNavbar ? (
            <div className="w-full flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentView("landing")}
              >
                <span className="material-symbols-outlined text-[#0058be] text-2xl font-bold">
                  auto_awesome
                </span>
                <span className="font-bold text-xl text-[#0058be] tracking-tight">
                  StudySphere AI
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentView !== "signin" && (
                  <button
                    onClick={() => setCurrentView("signin")}
                    className="text-xs font-bold text-[#0058be] hover:underline px-3 py-1.5"
                  >
                    Log In
                  </button>
                )}
                {currentView !== "signup" && (
                  <button
                    onClick={() => setCurrentView("signup")}
                    className="bg-[#0058be] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#004395] transition-colors"
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Logged-In Navbar Mode: Full Navigation Controls */
            <>
              {/* Brand Logo */}
              <div
                className="flex items-center gap-2 cursor-pointer shrink-0"
                onClick={() => setCurrentView("home")}
              >
                <span className="material-symbols-outlined text-[#0058be] text-2xl font-bold">
                  auto_awesome
                </span>
                <span className="font-bold text-xl text-[#0058be] tracking-tight">
                  StudySphere AI
                </span>
              </div>

              {/* Desktop Center Navigation Links */}
              <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                <button
                  onClick={() => setCurrentView("home")}
                  className={`transition-colors py-1 ${
                    currentView === "home"
                      ? "text-[#0058be] font-bold border-b-2 border-[#0058be]"
                      : "text-[#424754] hover:text-[#0058be]"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentView("tutor")}
                  className={`transition-colors py-1 ${
                    currentView === "tutor"
                      ? "text-[#0058be] font-bold border-b-2 border-[#0058be]"
                      : "text-[#424754] hover:text-[#0058be]"
                  }`}
                >
                  AI Tutor
                </button>
                <button
                  onClick={() => setCurrentView("courses")}
                  className={`transition-colors py-1 ${
                    currentView === "courses"
                      ? "text-[#0058be] font-bold border-b-2 border-[#0058be]"
                      : "text-[#424754] hover:text-[#0058be]"
                  }`}
                >
                  My Courses
                </button>
                <button
                  onClick={() => setCurrentView("assignments")}
                  className={`transition-colors py-1 ${
                    currentView === "assignments"
                      ? "text-[#0058be] font-bold border-b-2 border-[#0058be]"
                      : "text-[#424754] hover:text-[#0058be]"
                  }`}
                >
                  Assignments
                </button>
              </div>

              {/* Right Side Icons & Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Bell Icon Notification */}
                <button
                  onClick={() => setCurrentView("assignments")}
                  title="Notifications & Tasks"
                  className="relative w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center hover:bg-[#dce9ff] transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[#424754] text-xl">
                    notifications
                  </span>
                  {hasOverdueTasks && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                  )}
                  {hasOverdueTasks && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                  )}
                </button>

                {/* Profile Menu Trigger (Default Account Icon) */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full border-2 border-[#adc6ff] bg-[#eff4ff] overflow-hidden active:scale-95 transition-transform flex items-center justify-center"
                    title="User Profile Menu"
                  >
                    <img
                      className="w-full h-full object-cover object-top"
                      src={user.avatarUrl || DEFAULT_AVATAR}
                      alt={user.name}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                          <img
                            src={user.avatarUrl || DEFAULT_AVATAR}
                            alt={user.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        {/* Upload Photo Option */}
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center gap-2 text-slate-700 font-medium"
                        >
                          <span className="material-symbols-outlined text-base text-[#0058be]">
                            add_a_photo
                          </span>
                          Upload Profile Photo
                        </button>

                        {/* Add Another Account Option */}
                        <button
                          onClick={() => {
                            setCurrentView("signup");
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center gap-2 text-slate-700 font-medium"
                        >
                          <span className="material-symbols-outlined text-base">
                            person_add
                          </span>
                          Add another account
                        </button>

                        {/* Log Out Option */}
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onLogOut();
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-xl flex items-center gap-2 text-red-600 font-medium"
                        >
                          <span className="material-symbols-outlined text-base">
                            logout
                          </span>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showMobileNav ? "close" : "menu"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Dropdown Menu for non-auth views */}
        {!showSimpleNavbar && showMobileNav && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 shadow-lg flex flex-col gap-3">
            <button
              onClick={() => {
                setCurrentView("home");
                setShowMobileNav(false);
              }}
              className={`text-left font-semibold py-2 px-3 rounded-xl flex items-center gap-3 ${
                currentView === "home"
                  ? "bg-[#eff4ff] text-[#0058be]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined">home</span>
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("tutor");
                setShowMobileNav(false);
              }}
              className={`text-left font-semibold py-2 px-3 rounded-xl flex items-center gap-3 ${
                currentView === "tutor"
                  ? "bg-[#eff4ff] text-[#0058be]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined">smart_toy</span>
              AI Tutor
            </button>
            <button
              onClick={() => {
                setCurrentView("courses");
                setShowMobileNav(false);
              }}
              className={`text-left font-semibold py-2 px-3 rounded-xl flex items-center gap-3 ${
                currentView === "courses"
                  ? "bg-[#eff4ff] text-[#0058be]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined">book_5</span>
              My Courses
            </button>
            <button
              onClick={() => {
                setCurrentView("assignments");
                setShowMobileNav(false);
              }}
              className={`text-left font-semibold py-2 px-3 rounded-xl flex items-center gap-3 ${
                currentView === "assignments"
                  ? "bg-[#eff4ff] text-[#0058be]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined">checklist</span>
              Assignments
            </button>
          </div>
        )}
      </header>
    </>
  );
};
