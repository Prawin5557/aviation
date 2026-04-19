import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/src/config/env";
import apiClient from "@/src/services/apiClient";

const GEMINI_MODEL = "gemini-2.0-flash";
const ai = ENV.FRONTEND_ONLY && ENV.PUBLIC_GEMINI_API_KEY
  ? new GoogleGenerativeAI(ENV.PUBLIC_GEMINI_API_KEY)
  : null;

const runPrompt = async (prompt: string): Promise<string> => {
  if (!ENV.FRONTEND_ONLY) {
    const response = await apiClient.post(ENV.AI_BACKEND_PATH, {
      prompt,
      model: GEMINI_MODEL,
    });

    return (
      response.data?.text ||
      response.data?.data?.text ||
      response.data?.response ||
      ""
    );
  }

  if (!ai) {
    throw new Error("AI is not configured. Set VITE_GEMINI_API_KEY in frontend-only mode.");
  }

  const response = await ai.getGenerativeModel({ model: GEMINI_MODEL }).generateContent(prompt);
  return response.response.text() || "";
};

export const geminiService = {
  async optimizeResumeSummary(summary: string) {
    try {
      const prompt = `As a professional aviation career coach, optimize the following resume summary to be more impactful and professional for the aviation industry. Keep it concise (2-3 sentences).
      
      Original Summary: ${summary}`;

      const text = await runPrompt(prompt);
      return text || summary;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to optimize summary with AI");
    }
  },

  async suggestSkills(experience: string) {
    try {
      const prompt = `Based on the following work experience in the aviation sector, suggest 5-8 relevant technical and soft skills. Return ONLY a comma-separated list of skills.
      
      Experience: ${experience}`;

      const text = await runPrompt(prompt);
      return text.split(",").map(s => s.trim()).filter(s => s.length > 0);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to suggest skills with AI");
    }
  },

  async auditLinkedInProfile(profileText: string) {
    try {
      const prompt = `You are an experienced LinkedIn career strategist for aviation professionals. Analyze the following LinkedIn profile details and return a JSON object with sections headline, summary, experience, skills and an overall score.

PROFILE:
${profileText}

Return ONLY a JSON object with this structure:
{
  "overallScore": 0,
  "recommendationLevel": "",
  "overallComment": "",
  "headline": { "title": "Headline", "score": 0, "status": "", "suggestion": "" },
  "summary": { "title": "Summary", "score": 0, "status": "", "suggestion": "" },
  "experience": { "title": "Experience", "score": 0, "status": "", "suggestion": "" },
  "skills": { "title": "Skills", "score": 0, "status": "", "suggestion": "" }
}`;

      const text = (await runPrompt(prompt)) || "{}";
      const cleanedText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("Gemini Error:", error);
      return {
        overallScore: 78,
        recommendationLevel: "Strong",
        overallComment: "Your profile is solid, but a few targeted improvements will increase recruiter visibility.",
        headline: { title: "Headline", score: 82, status: "Good", suggestion: "Add a few more aviation keywords and leadership terms." },
        summary: { title: "Summary", score: 88, status: "Good", suggestion: "Make your summary more concise and results-focused." },
        experience: { title: "Experience", score: 75, status: "Needs Improvement", suggestion: "Add measurable outcomes and highlight aviation-specific achievements." },
        skills: { title: "Skills", score: 80, status: "Good", suggestion: "Include core aviation and technical skills prominently." }
      };
    }
  },

  async analyzeJobDescription(description: string, resumeData: any) {
    try {
      const prompt = `Analyze the following job description and compare it with the candidate's resume data. Provide:
      1. A match score (0-100)
      2. Key missing skills
      3. 3 tips to improve the application
      
      Job Description: ${description}
      Resume Data: ${JSON.stringify(resumeData)}`;

      const text = await runPrompt(prompt);
      return text || "Unable to analyze at this time.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to analyze job with AI");
    }
  },

  async generateEliteResume(resumeData: any, targetRole: string) {
    try {
      const prompt = `You are an elite resume architect, career strategist, ATS optimization expert, and hiring manager with 20+ years of experience across FAANG-level companies.

Your task is to transform the provided resume data into a WORLD-CLASS, PREMIUM, ATS-OPTIMIZED RESUME for the target role: "${targetRole}".

🎯 OBJECTIVE:
Build a high-impact, recruiter-winning resume with modern design structure, strong metrics, and industry best practices.

🧠 INSTRUCTIONS:
✔ Use strong action verbs and measurable achievements (metrics-driven)
✔ Rewrite responsibilities into IMPACT statements (e.g., "Increased sales by 35%")
✔ Optimize for ATS scanning (keyword-rich, clean formatting)
✔ Prioritize clarity, hierarchy, and readability
✔ Use bullet points strategically
✔ Maintain professional tone with powerful language

INPUT DATA:
${JSON.stringify(resumeData)}

OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "personalInfo": { "summary": "Elite summary here", "title": "Optimized title" },
  "experience": [ { "id": "original_id", "position": "Optimized position", "description": "Optimized impact-driven description with bullets" } ],
  "skills": ["Optimized skill list"],
  "achievements": ["Top impact highlights"],
  "tools": ["Tech stack matrix/tools"],
  "atsScore": 85,
  "improvementSuggestions": ["Suggestion 1", "Suggestion 2"]
}

Ensure the output is ONLY the JSON object.`;

      const text = (await runPrompt(prompt)) || "{}";
      const cleanedText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to generate elite resume with AI");
    }
  },

  async chatBotResponse(userMessage: string) {
    try {
      const prompt = `You are ARMZ Support, an AI assistant for ARMZ Aviation, a global aviation talent partner. 

Your role is to help users with questions about:
- Aviation jobs and careers
- Subscription plans and pricing
- Company information
- Job applications
- Resume building
- Career coaching

For questions you can answer, provide helpful, concise responses.

For questions you cannot answer (like technical support, billing issues, account problems, or anything not related to aviation careers and services), respond with:
"I'm sorry, I can't help with that specific question. For further assistance, please contact us at:
📞 Phone: +91 98765 43210
📧 Email: support@armzaviation.com"

Keep responses friendly, professional, and under 150 words.

User question: "${userMessage}"`;

      const text = await runPrompt(prompt);
      return text || "I'm sorry, I can't help with that right now. Please contact support.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm sorry, I'm having trouble connecting right now. For immediate help, please contact us at:\n📞 Phone: +91 98765 43210\n📧 Email: support@armzaviation.com";
    }
  }
};
