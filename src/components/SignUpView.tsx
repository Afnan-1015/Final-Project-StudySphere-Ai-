import React, { useState } from "react";
import { ViewMode } from "../types";
import { FooterPolicyModal, PolicyType } from "./FooterPolicyModal";

interface SignUpViewProps {
  onNavigate: (view: ViewMode) => void;
  onRegisterUser: (user: { name: string; email: string; pass: string }) => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onNavigate,
  onRegisterUser,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    onRegisterUser({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      pass: password,
    });

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
            <h1 className="font-bold text-3xl text-[#0b1c30]">Create Account</h1>
            <p className="text-sm text-[#424754] mt-2">
              Start your journey with StudySphere AI
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
                Full Name / Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-lg">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#424754] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#424754] mb-1.5 uppercase tracking-wider">
                Password
              </label>
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
              Create Account
            </button>
          </form>

          <p className="text-center text-xs text-[#424754] mt-6">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("signin")}
              className="font-bold text-[#0058be] hover:underline"
            >
              Log In
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
