import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, UserProfile } from "../types";
import { DEFAULT_AVATAR } from "../data";

interface TutorViewProps {
  user: UserProfile;
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  user,
  initialPrompt,
  onClearPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "ai",
      text: "Hello! I am your AI Tutor. I can help you review concepts, test your knowledge, or generate quizzes.\n\nWhat's your plan today?",
      time: "10:24 AM",
      authorName: "Lumina",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string } | null>(null);

  const chatScrollerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const handledPromptRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    if (chatScrollerRef.current) {
      chatScrollerRef.current.scrollTo({
        top: chatScrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt && handledPromptRef.current !== initialPrompt) {
      handledPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
      if (onClearPrompt) onClearPrompt();
    }
  }, [initialPrompt]);

  // Web Speech API Voice Recognition setup
  const toggleVoiceInput = () => {
    setVoiceError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice recognition is not supported by your browser. Please type your query below.");
      return;
    }

    if (isMicActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsMicActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsMicActive(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsMicActive(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceError("Microphone access was blocked or denied by your browser settings. You can type your message below.");
        } else if (event.error !== "no-speech") {
          setVoiceError(`Voice input issue (${event.error}). Please try again or type below.`);
        }
      };

      recognition.onend = () => {
        setIsMicActive(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Voice recognition start error:", err);
      setIsMicActive(false);
      setVoiceError("Could not start microphone. Please type your message.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        type: file.type.includes("image") ? "image" : "document",
      });
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (textToSend?: string) => {
    let promptText = textToSend || inputMessage;
    if (!promptText.trim() && !attachedFile) return;

    if (attachedFile) {
      promptText = `[Attachment: ${attachedFile.name}]\n` + promptText;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: promptText,
      time: getCurrentTime(),
      authorName: "You",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setAttachedFile(null);
    setIsTyping(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      let replyText = "";
      const contentType = response.headers.get("content-type");

      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        replyText =
          data.reply ||
          "I'm here to help you master this material! What's the next concept you'd like to dive into?";
      } else {
        // Fallback response if endpoint returned HTML error or non-JSON response
        replyText = `Regarding "${promptText}": Make sure to review the core definitions, step-by-step problem methods, and key terminology in your study material.\n\nWhat next do you want from me?`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        time: getCurrentTime(),
        authorName: "Lumina",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to fetch tutor response:", err);
      const aiErrorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Here is a direct response to your question:\n\nFor learning support and practice, let me know what topic you'd like to work on.\n\nWhat next do you want from me?`,
        time: getCurrentTime(),
        authorName: "Lumina",
      };
      setMessages((prev) => [...prev, aiErrorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    handleSendMessage(chipText);
  };

  const cleanDisplayMessage = (rawText: string) => {
    if (!rawText) return "";
    let txt = rawText;
    txt = txt.replace(/\$\$\$/g, "").replace(/\$\$/g, "").replace(/\$/g, "");
    txt = txt.replace(/\\\$/g, "$");
    txt = txt.replace(/\\log/g, "log");
    txt = txt.replace(/\\cdot/g, " * ");
    txt = txt.replace(/\\Theta/g, "Theta");
    txt = txt.replace(/\\mathcal\{O\}/g, "O");
    txt = txt.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1/$2");
    txt = txt.replace(/\*\*\*/g, "");
    txt = txt.replace(/^###\s+/gm, "");
    txt = txt.replace(/^##\s+/gm, "");
    return txt;
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: "Fresh study session started!\n\nWhat next do you want from me?",
        time: getCurrentTime(),
        authorName: "Lumina",
      },
    ]);
  };

  return (
    <main className="pt-20 pb-20 max-w-[1280px] mx-auto px-4 md:px-10 h-screen flex flex-col justify-between">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center py-2 border-b border-slate-200/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0058be] flex items-center justify-center text-white shadow-md">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#0058be]">AI Tutor</h1>
            <p className="text-xs text-[#424754]">
              Personalized Learning Engine
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="New Chat Session"
          className="p-2 rounded-full hover:bg-slate-200/60 transition-colors text-[#424754]"
        >
          <span className="material-symbols-outlined text-xl">
            add_comment
          </span>
        </button>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatScrollerRef}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 no-scrollbar"
      >
        {/* Capability Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-2">
          <button
            onClick={() =>
              handleChipClick("Can you explain key concepts in CS101?")
            }
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0058be] transition-all active:scale-98 shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[#0058be] mb-1">
              lightbulb
            </span>
            <span className="font-semibold text-xs text-[#0b1c30]">
              Explain a concept
            </span>
          </button>

          <button
            onClick={() =>
              handleChipClick(
                "Generate a 5-question quiz on Discrete Math and Logic."
              )
            }
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#6b38d4] transition-all active:scale-98 shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[#6b38d4] mb-1">
              quiz
            </span>
            <span className="font-semibold text-xs text-[#0b1c30]">
              Quiz me
            </span>
          </button>

          <button
            onClick={() =>
              handleChipClick(
                "Summarize key notes for Psychology exam prep."
              )
            }
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#006577] transition-all active:scale-98 shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[#006577] mb-1">
              description
            </span>
            <span className="font-semibold text-xs text-[#0b1c30]">
              Summarize notes
            </span>
          </button>

          <button
            onClick={() =>
              handleChipClick(
                "Provide step-by-step practice problems for Calculus Integration."
              )
            }
            className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#ba1a1a] transition-all active:scale-98 shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[#ba1a1a] mb-1">
              edit_document
            </span>
            <span className="font-semibold text-xs text-[#0b1c30]">
              Practice problems
            </span>
          </button>
        </div>

        {/* Message Thread */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[88%] md:max-w-[75%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {msg.sender === "ai" ? (
              <div className="w-8 h-8 rounded-lg bg-[#0058be] text-white flex-shrink-0 flex items-center justify-center shadow-xs">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 flex items-center justify-center">
                <img
                  src={user.avatarUrl || DEFAULT_AVATAR}
                  alt={user.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}

            <div
              className={`flex flex-col gap-1 ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-4 rounded-2xl shadow-2xs text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-[#0058be] text-white rounded-tr-none font-normal"
                    : "bg-[#e9ddff] text-[#23005c] rounded-tl-none font-normal"
                }`}
              >
                {cleanDisplayMessage(msg.text)}
              </div>
              <span className="text-[10px] text-slate-400 font-medium px-1">
                {msg.authorName || (msg.sender === "ai" ? "Lumina" : "You")} •{" "}
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] items-end">
            <div className="w-8 h-8 rounded-lg bg-[#0058be] text-white flex-shrink-0 flex items-center justify-center shadow-xs">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                smart_toy
              </span>
            </div>
            <div className="bg-[#d3e4fe] p-3 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#0058be] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#0058be] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-[#0058be] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area (Floating Bottom) */}
      <div className="pt-2 pb-4 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent shrink-0">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />

        {/* Voice Error Banner */}
        {voiceError && (
          <div className="mb-2 flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-medium animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-amber-600">
                mic_off
              </span>
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="text-amber-500 hover:text-amber-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Attached File Chip Preview */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 bg-[#eff4ff] border border-[#adc6ff] text-[#0058be] px-3 py-1.5 rounded-xl text-xs font-semibold self-start w-fit">
            <span className="material-symbols-outlined text-base">
              {attachedFile.type === "image" ? "image" : "description"}
            </span>
            <span>{attachedFile.name}</span>
            <button
              onClick={() => setAttachedFile(null)}
              className="ml-1 text-slate-400 hover:text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          {/* Plus (+) Button to Upload Image or Docs */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image or document"
            className="absolute left-3 w-8 h-8 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0058be] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isMicActive
                ? "Listening... Speak your prompt..."
                : "Ask StudySphere anything..."
            }
            className={`w-full bg-white border-2 ${
              isMicActive ? "border-red-500 ring-2 ring-red-200" : "border-[#d8e2ff] focus:border-[#0058be]"
            } rounded-2xl pl-13 pr-24 py-3.5 text-sm transition-all shadow-lg outline-none placeholder:text-slate-400`}
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {/* Mic Voice Prompt Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isMicActive
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title={isMicActive ? "Click to stop recording" : "Voice input prompt"}
            >
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() && !attachedFile}
              className="w-9 h-9 bg-[#0058be] disabled:opacity-50 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_upward
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
