import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function cleanGeminiResponse(text: string): string {
  const cleaned = text
    .replace(/^```json\n?/, "")
    .replace(/```$/, "");
  return cleaned.trim();
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert ${topic} interviewer.
      Generate 10 technical interview questions related to ${topic}.
      For each question, provide a concise, accurate answer.
      IMPORTANT: Return the response *only* as a valid JSON array of objects.
      Do NOT include any other text, explanation, or markdown formatting (like \`\`\`json).
      Example format: [{"question": "...", "answer": "..."}]
    `;

    const MAX_RETRIES = 3;
    let aiResponseText: string | null = null;
    let lastError: any = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponseText = response.text();
        
        if (aiResponseText) {
          lastError = null;
          break;
        }
      } catch (error: any) {
        lastError = error;
        if (error.message && error.message.includes("503") && i < MAX_RETRIES - 1) {
          await sleep(Math.random() * 1000 + 1000);
        } else {
          throw error;
        }
      }
    }

    if (aiResponseText) {
      const cleanedText = cleanGeminiResponse(aiResponseText);
      const jsonData = JSON.parse(cleanedText);
      return NextResponse.json(jsonData, { status: 200 });
    } else {
      throw lastError || new Error("AI (Gemini) did not return content after all retries.");
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
