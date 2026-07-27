import React from "react";

export type PolicyType = "privacy" | "terms" | "help" | null;

interface FooterPolicyModalProps {
  policyType: PolicyType;
  onClose: () => void;
}

export const FooterPolicyModal: React.FC<FooterPolicyModalProps> = ({
  policyType,
  onClose,
}) => {
  if (!policyType) return null;

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      icon: "security",
      content: (
        <div className="space-y-3 text-sm text-[#424754]">
          <p className="font-semibold text-[#0b1c30]">
            Your Privacy and Student Data Protection
          </p>
          <p>
            At StudySphere AI, we prioritize student confidentiality above all else.
            We adhere strictly to FERPA and international data security standards.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Zero Data Selling:</strong> We never sell your personal or academic information to advertisers or third parties.</li>
            <li><strong>Encrypted Storage:</strong> All course syllabus notes, chat logs with AI Tutor, and assignments are encrypted at rest and in transit using AES-256 protocols.</li>
            <li><strong>AI Training Integrity:</strong> Your submitted assignments and personal notes are never used to train public foundation models.</li>
          </ul>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      icon: "gavel",
      content: (
        <div className="space-y-3 text-sm text-[#424754]">
          <p className="font-semibold text-[#0b1c30]">
            Academic Integrity & Platform Guidelines
          </p>
          <p>
            StudySphere AI is crafted as an intelligent learning companion to help students master complex subjects efficiently.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Academic Honesty:</strong> StudySphere AI is designed for tutoring, concept clarification, and self-quizzing. Users must comply with their institution's academic honor code.</li>
            <li><strong>Account Responsibility:</strong> You are responsible for safeguarding your login credentials and maintaining the security of your account.</li>
            <li><strong>Fair Service Usage:</strong> Excessive automated queries or abuse of the AI service endpoints may lead to temporary session throttling.</li>
          </ul>
        </div>
      ),
    },
    help: {
      title: "Help Center & Support",
      icon: "help_center",
      content: (
        <div className="space-y-3 text-sm text-[#424754]">
          <p className="font-semibold text-[#0b1c30]">
            We're here to support your study flow
          </p>
          <p>
            Have a question, feedback, or technical issue? Our dedicated student success team is ready to assist you.
          </p>
          <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#c2c6d6]/60 space-y-1.5 text-xs">
            <p><strong>Email Support:</strong> <a href="mailto:support@studysphere.ai" className="text-[#0058be] underline">support@studysphere.ai</a></p>
            <p><strong>Live Chat Hours:</strong> Monday – Friday (8:00 AM – 10:00 PM EST)</p>
            <p><strong>Response Time:</strong> Typically under 2 hours during active study sessions.</p>
          </div>
          <p className="text-xs text-slate-500">
            For urgent exam prep troubleshooting, check out our quick starter guide on the Dashboard.
          </p>
        </div>
      ),
    },
  };

  const current = contentMap[policyType];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] text-2xl">
              {current.icon}
            </span>
            <h3 className="font-bold text-xl text-[#0b1c30]">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {current.content}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0058be] hover:bg-[#004395] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
