import React, { useState } from "react";
import { ViewMode } from "../types";
import { FooterPolicyModal, PolicyType } from "./FooterPolicyModal";

interface RegisteredUser {
  name: string;
  email: string;
  pass: string;
}

interface ForgotPasswordViewProps {
  onNavigate: (view: ViewMode) => void;
  registeredUsers: RegisteredUser[];
  onPasswordUpdated: (email: string, newPass: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onNavigate,
  registeredUsers,
  onPasswordUpdated,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  // Modal Password Fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!matched) {
      setErrorMsg("Enter correct email");
      return;
    }

    setErrorMsg("");
    setShowResetModal(true);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setModalError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError("Passwords do not match. Please try again.");
      return;
    }

    onPasswordUpdated(emailInput.trim().toLowerCase(), newPassword);
    alert("Password updated successfully! Please log in with your updated credentials.");
    setShowResetModal(false);
    onNavigate("signin");
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
            <h1 className="font-bold text-3xl text-[#0b1c30]">Reset Password</h1>
            <p className="text-sm text-[#424754] mt-2">
              Enter your email to reset your password.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#424754] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785] text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@university.edu"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
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
              Update Password
            </button>
          </form>

          <p className="text-center text-xs text-[#424754] mt-6">
            Remembered your credentials?{" "}
            <button
              onClick={() => onNavigate("signin")}
              className="font-bold text-[#0058be] hover:underline"
            >
              Back to Log In
            </button>
          </p>
        </div>
      </main>

      {/* Pop-up Modal to Enter New Password */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#0b1c30]">
                Set New Password
              </h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-500"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#424754] mb-4">
              Verified email: <span className="font-semibold text-[#0058be]">{emailInput}</span>
            </p>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setModalError("");
                  }}
                  className="w-full px-3 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#424754] mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setModalError("");
                  }}
                  className="w-full px-3 py-2.5 border border-[#c2c6d6] rounded-xl text-sm focus:ring-2 focus:ring-[#0058be] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 border border-[#c2c6d6] rounded-xl text-sm text-[#424754]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0058be] hover:bg-[#004395] text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
