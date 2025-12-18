import { supabase } from '@/lib/supabaseClient';

export interface SessionData {
  question: string;
  answer: string;
  userAnswer?: string;
  feedback?: string;
}

export async function saveSession(topic: string, sessionData: SessionData[], userId?: string) {
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        topic,
        session_data: sessionData,
        user_id: userId || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error saving session to Supabase:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to save session:', error);
    throw error;
  }
}
