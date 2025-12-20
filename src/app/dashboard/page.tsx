'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getPastSessions, InterviewSession } from '@/lib/db/sessionFetcher';
import { calculateSessionScore } from '@/lib/utils/scoreCalculator';
import { DashboardSummary } from '@/components/DashboardSummary';
import { SessionTable } from '@/components/SessionTable';
import Link from 'next/link';

interface ScoredSession {
  id: string;
  topic: string;
  score: number;
  date: string;
  data: any[];
}

export default function DashboardPage() {
  const [scoredSessions, setScoredSessions] = useState<ScoredSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    async function loadSessions() {
      try {
        setIsLoading(true);
        
        // Fetch sessions for the logged-in user
        const sessions = await getPastSessions(userId || undefined);
        
        // Process sessions to add scores
        const processed = sessions.map((session: InterviewSession) => ({
          id: session.id,
          topic: session.topic,
          score: calculateSessionScore(session.session_data),
          date: session.created_at,
          data: session.session_data,
        }));

        setScoredSessions(processed);
      } catch (err) {
        console.error('Error loading sessions:', err);
        setError('Failed to load session history');
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, [userId]);

  // Calculate averageScore and totalSessions from scoredSessions
  const totalSessions = scoredSessions.length;
  const averageScore = totalSessions > 0
    ? Math.round(scoredSessions.reduce((sum, session) => sum + session.score, 0) / totalSessions)
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
      </div>

      <div className="relative flex flex-col items-center p-4 sm:p-6 lg:p-8 min-h-screen pb-20 md:pb-8">
        {/* Header Section */}
        <div className="w-full max-w-6xl mb-8 sm:mb-12 mt-4 sm:mt-8 lg:mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Dashboard
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-300">
                Track your interview practice progress and performance
              </p>
            </div>
            <Link
              href="/practice"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Practice</span>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center mt-16 animate-fadeIn">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-300 text-lg mt-6 font-medium">Loading your sessions...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-xl bg-red-900/30 border border-red-500/50 backdrop-blur-sm text-white animate-fadeIn flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-300">Error</h4>
                <p className="text-sm text-gray-200 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && (
            <>
              {/* Summary Cards */}
              <DashboardSummary averageScore={averageScore} totalSessions={totalSessions} />

              {/* Sessions Table */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 sm:mb-6 px-2">
                  Session History
                </h2>
                <SessionTable scoredSessions={scoredSessions} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
