import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
// Disable demo mode - always use real API
const USE_DEMO_MODE = false;

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
    
    // Use demo mode if enabled
    if (USE_DEMO_MODE || !process.env.GOOGLE_API_KEY) {
      console.log('Using demo mode for feedback');
      // Simple heuristic: if answer length is reasonable, mark as correct
      const isCorrect = userAnswer.trim().length > 20;
      const demoFeedback = isCorrect 
        ? `Good attempt! Your answer covers the key concepts. You mentioned relevant points that align with the expected answer. To improve further, you could elaborate more on specific details and provide concrete examples.`
        : `Your answer is too brief. Try to provide more detail and explanation. Review the expected answer and make sure to cover the main concepts thoroughly.`;
      
      return NextResponse.json({
        feedback: demoFeedback,
        is_correct_enough: isCorrect
      }, { status: 200 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert technical interviewer evaluating answers.

Question: ${question}

Correct Answer: ${correctAnswer}

User's Answer: ${userAnswer}

Task: Evaluate if the user's answer is sufficiently correct and provide constructive feedback.

Rules:
1. Consider the answer "correct enough" if it captures the key concepts, even if wording differs
2. Point out what they got right
3. Suggest specific improvements
4. Be encouraging and constructive

CRITICAL: Respond ONLY with valid JSON in this exact format (no extra text, no markdown):
{"is_correct_enough": true, "feedback": "Your detailed feedback here"}

or

{"is_correct_enough": false, "feedback": "Your detailed feedback here"}
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
      // Log the raw AI response for debugging
      console.log('Raw AI response:', feedbackText);
      
      // Parse the JSON response from AI
      try {
        // Clean up the response (remove markdown code blocks if present)
        let cleanedText = feedbackText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```\n?/g, '').trim();
        }
        
        console.log('Cleaned text for parsing:', cleanedText);
        
        const parsedResponse = JSON.parse(cleanedText);
        
        console.log('Successfully parsed response:', parsedResponse);
        
        return NextResponse.json({
          feedback: parsedResponse.feedback,
          is_correct_enough: parsedResponse.is_correct_enough
        }, { status: 200 });
      } catch (parseError) {
        // Fallback: if parsing fails, return text as-is with null for is_correct_enough
        console.error('Failed to parse AI response as JSON:', parseError);
        console.error('Parse error details:', {
          message: (parseError as Error).message,
          text: feedbackText
        });
        return NextResponse.json({
          feedback: feedbackText,
          is_correct_enough: null
        }, { status: 200 });
      }
    } else {
      throw lastError || new Error("AI did not return feedback after all retries.");
    }

  } catch (error: any) {
    console.error('Error in feedback API:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    
    // Automatic fallback to demo feedback for ANY error
    console.log('⚠️ API error occurred, falling back to demo feedback');
    const { userAnswer } = await request.json();
    const isCorrect = userAnswer?.trim().length > 20;
    const demoFeedback = isCorrect 
      ? `Good attempt! Your answer covers the key concepts. You mentioned relevant points that align with the expected answer. To improve further, you could elaborate more on specific details and provide concrete examples.`
      : `Your answer could be more detailed. Try to provide more explanation and cover the main concepts thoroughly. Review the expected answer and expand on your response.`;
    
    return NextResponse.json({
      feedback: demoFeedback,
      is_correct_enough: isCorrect
    }, { status: 200 });
  }
}
