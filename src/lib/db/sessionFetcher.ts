import { supabase } from '@/lib/supabaseClient';

export interface InterviewSession {
  id: string;
  topic: string;
  session_data: Array<{
    question: string;
    answer: string;
    userAnswer?: string;
    feedback?: string;
  }>;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all interview session history from Supabase for a specific user
 * @param userId - The Clerk user ID (optional - if not provided, fetches all sessions)
 * @returns Array of interview sessions, or empty array if error occurs
 */
export async function getPastSessions(userId?: string): Promise<InterviewSession[]> {
  try {
    console.log('Fetching sessions for userId:', userId);
    
    let query = supabase
      .from('interview_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by userId if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // If column doesn't exist, fetch all sessions without filter
      if (error.code === '42703' || error.message?.includes('user_id')) {
        console.warn('user_id column may not exist, fetching all sessions');
        const { data: allData, error: fallbackError } = await supabase
          .from('interview_sessions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Fallback query error:', fallbackError);
          return [];
        }
        
        return allData || [];
      }
      
      return [];
    }

    console.log('Successfully fetched sessions:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('Failed to fetch sessions:', {
      message: error?.message,
      stack: error?.stack,
      error
    });
    return [];
  }
}
