import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { saveSession } from '@/lib/db/sessionSaver';

export async function POST(request: Request) {
  try {
    // Step 1: Get the logged-in user's ID using Clerk auth
    const { userId } = await auth();

    // Step 2: If no userId, return 401 Unauthorized
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to save your session.' },
        { status: 401 }
      );
    }

    // Step 3: Destructure topic and sessionData from request body
    const body = await request.json();
    const { topic, sessionData } = body;

    // Validate required fields
    if (!topic || !sessionData) {
      return NextResponse.json(
        { error: 'Missing required fields: topic and sessionData' },
        { status: 400 }
      );
    }

    // Step 4: Call saveSession with userId
    const result = await saveSession(topic, sessionData, userId);

    // Step 5: Return 200 success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Session saved successfully',
        data: result.data 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in save session API:', error);
    return NextResponse.json(
      { error: 'Failed to save session. Please try again.' },
      { status: 500 }
    );
  }
}
