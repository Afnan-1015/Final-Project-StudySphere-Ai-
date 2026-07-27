import React, { useState } from "react";
import { ViewMode } from "../types";
import { FooterPolicyModal, PolicyType } from "./FooterPolicyModal";

interface RegisteredUser {
  name: string;
  email: string;
  pass: string;
}

interface SignInViewProps {
  onNavigate: (view: ViewMode) => void;
  registeredUsers: RegisteredUser[];
  onLoginSuccess: (user: RegisteredUser) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onNavigate,
  registeredUsers,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Please fill in both fields.");
      return;
    }

    const cleanInput = identifier.trim().toLowerCase();
    const matchedUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.name.toLowerCase() === cleanInput
    );

    if (!matchedUser) {
      setErrorMsg("Account not found. Please check your username or email.");
      return;
    }

    if (matchedUser.pass !== password) {
      setErrorMsg("Incorrect password. Please try again.");
      return;
    }

    onLoginSuccess(matchedUser);
    onNavigate("home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff]">
      {/* Policy Modal Pop-up */}
      <FooterPolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl my-6">
          <div className="text-center mb-8">
            <h1 className="font-bold text-3xl text-[#0b1c30]">Log In</h1>
            <p className="text-sm text-[#424754] mt-2">
              Log in to your StudySphere workspace
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#424754] mb-1.5 uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-lg">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="Username or email address"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-[#424754] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot")}
                  className="text-xs font-bold text-[#0058be] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-lg">
                  lock
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0058be] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#004395] active:scale-98 transition-all mt-2"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-xs text-[#424754] mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="font-bold text-[#0058be] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-[#727785] space-y-2">
        <div className="flex justify-center gap-5">
          <button
            onClick={() => setActivePolicy("privacy")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActivePolicy("terms")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActivePolicy("help")}
            className="hover:text-[#0058be] hover:underline transition-colors"
          >
            Help Center
          </button>
        </div>
        <p>© 2026 StudySphere AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
