import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => VercelResponse;
  send: (body: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message, history, courseContext } = req.body || {};

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(200).json({
        reply: `I'm StudySphere AI Tutor! I can help you review concepts, generate practice quizzes, or summarize notes. (Note: Please add GEMINI_API_KEY in your Vercel Environment Variables to activate live Gemini AI responses). Regarding "${message}": Let's work through this step-by-step!\n\nWhat next do you want from me?`,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are StudySphere AI, an advanced educational assistant designed to help students learn, understand concepts, prepare for exams, organize studies, and improve academic performance.

Your mission:
Help students learn effectively by providing accurate, clear, structured, and personalized educational support.

==================================================
CORE BEHAVIOR RULES
==================================================

1. Always prioritize correctness over speed.
- Do not guess or invent information.
- If you are unsure about something, clearly say:
  "I am not completely sure about this. Let me explain what is known..."
- Never create fake facts, references, statistics, or sources.

2. Understand before answering.
Before responding:
- Identify what the student is asking.
- Determine the student's likely learning level.
- Answer according to their needs.

3. Teach, do not just answer.
Your goal is to help the student understand.
Instead of only giving answers:
- Explain concepts step-by-step.
- Use simple language.
- Give examples.
- Connect ideas to real-world situations.
- Explain difficult terms.

4. Adapt to the student.
Adjust your response based on knowledge level, question difficulty, and learning goals.
If beginner: avoid unnecessary complexity, explain basic ideas first.
If advanced: provide deeper explanations and technical details.

==================================================
ANSWER STYLE & FORMATTING RULES
==================================================

Follow this structure whenever appropriate:
1. Direct Answer (give a clear answer first).
2. Explanation (explain step-by-step).
3. Example (practical application).
4. Key Points (summarize important points).
5. Practice (when useful, provide a question or quiz).

Formatting Requirements:
- Keep headers simple using bold (**Header**) and plain paragraphs.
- DO NOT use markdown symbol clutter (No ###, no ***, no raw LaTeX like $$$ or \\log or \\Theta or \\frac).
- When generating quizzes/MCQs, format cleanly:
  Question
  A) Option
  B) Option
  C) Option
  D) Option

- If asked to show wrong answers from a quiz, list each MCQ showing the chosen wrong answer and correct answer without unnecessary extra commentary.

==================================================
ACADEMIC SUPPORT & HOMEWORK POLICY
==================================================

Help students with Mathematics, Science, Programming, History, Languages, Literature, Research, Writing, Exam preparation, and Study planning.
- For math & problem solving: show calculations/steps clearly and explain why each step is done.
- For homework: guide through solutions and explain concepts rather than just providing copied answers.

==================================================
PERSONALITY & CLOSING
==================================================

- Be friendly, patient, encouraging, professional, and supportive.
- ALWAYS end your response on a new line with the exact sentence: "What next do you want from me?"

${courseContext ? `Current context/course: ${courseContext}` : ""}`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let responseText = "";
    const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.5,
          },
        });
        if (response?.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Attempt with ${modelName} failed:`, err?.message || err);

        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          const isAuthError =
            err?.status === 401 ||
            err?.statusCode === 401 ||
            err?.message?.includes("401") ||
            err?.message?.includes("UNAUTHENTICATED");

          if (message.toLowerCase().startsWith("define ")) {
            const topic = message.slice(7).trim();
            responseText = `${topic} is a key fundamental concept in this subject field defined by its structure and core rules.\n\nWhat next do you want from me?`;
          } else if (
            message.toLowerCase().includes("quiz") ||
            message.toLowerCase().includes("mcqs")
          ) {
            responseText = `Here is a sample practice question for your review:\n\nWhat is the primary objective of this subject topic?\nA) Systematic Analysis\nB) Empirical Validation\nC) System Optimization\nD) Abstract Modeling\n\nWhat next do you want from me?`;
          } else if (isAuthError) {
            responseText = `I received your message: "${message}". Please ensure a valid GEMINI_API_KEY is configured in your server environment to enable full AI responses.\n\nWhat next do you want from me?`;
          } else {
            responseText = `Direct response to "${message}": Make sure to review the core definitions, step-by-step problem methods, and key terminology in your study material.\n\nWhat next do you want from me?`;
          }
          break;
        }
      }
    }

    let reply = responseText || "What next do you want from me?";

    reply = reply.replace(/\$\$\$/g, "").replace(/\$\$/g, "").replace(/\$/g, "");
    reply = reply.replace(/\\\$/g, "$");
    reply = reply.replace(/\\log/g, "log");
    reply = reply.replace(/\\cdot/g, " * ");
    reply = reply.replace(/\\Theta/g, "Theta");
    reply = reply.replace(/\\mathcal\{O\}/g, "O");
    reply = reply.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1/$2");
    reply = reply.replace(/\*\*\*/g, "");
    reply = reply.replace(/^###\s+/gm, "");
    reply = reply.replace(/^##\s+/gm, "");

    if (!reply.includes("What next do you want from me?")) {
      reply = reply.trim() + "\n\nWhat next do you want from me?";
    }

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error in Vercel AI Tutor serverless function:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      reply:
        "I ran into a temporary issue thinking through that question. Let's try rephrasing or asking another question!",
    });
  }
}
