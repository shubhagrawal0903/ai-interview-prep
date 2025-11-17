import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, correctAnswer, userAnswer } = body;

    if (!question || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: "Missing required fields (question, correctAnswer, userAnswer)" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert technical interviewer.
      A user was asked the following question:
      "Question: ${question}"

      The ideal, correct answer is:
      "Correct Answer: ${correctAnswer}"

      The user gave this answer:
      "User's Answer: ${userAnswer}"

      Please provide concise, constructive feedback on the user's answer.
      - Compare the user's answer to the correct answer.
      - Point out what they got right.
      - Suggest improvements in a helpful tone.
      - Do NOT just say "Correct" or "Incorrect".
      - Return the feedback as a single string of text.
    `;

    const MAX_RETRIES = 3;
    let feedbackText: string | null = null;
    let lastError: any = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        feedbackText = response.text();
        
        if (feedbackText) {
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

    if (feedbackText) {
      return NextResponse.json({ feedback: feedbackText }, { status: 200 });
    } else {
      throw lastError || new Error("AI did not return feedback after all retries.");
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
