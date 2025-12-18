'use client';

import { useState } from 'react';

interface SessionData {
  question: string;
  answer: string;
  userAnswer?: string;
  feedback?: string;
}

interface ScoredSession {
  id: string;
  topic: string;
  score: number;
  date: string;
  data: SessionData[];
}

interface SessionTableProps {
  scoredSessions: ScoredSession[];
}

export function SessionTable({ scoredSessions }: SessionTableProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const toggleExpand = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  if (scoredSessions.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
        <svg className="w-20 h-20 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-300 mb-2">No Sessions Yet</h3>
        <p className="text-gray-400">Start practicing to see your session history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scoredSessions.map((session) => (
        <div
          key={session.id}
          className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden animate-fadeIn"
        >
          {/* Session Header */}
          <div
            className="p-6 cursor-pointer"
            onClick={() => toggleExpand(session.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {session.topic}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreBgColor(session.score)} ${getScoreColor(session.score)}`}>
                    {session.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {session.data.length} questions
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                    expandedSession === session.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedSession === session.id && (
            <div className="border-t border-gray-700/50 bg-gray-900/40 p-6 animate-fadeIn">
              <h4 className="text-lg font-semibold text-gray-200 mb-4">Session Details</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {session.data.map((item, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-300 font-medium">{item.question}</p>
                    </div>
                    {item.userAnswer && (
                      <div className="ml-8 mt-3 space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-400">Your Answer: </span>
                          <span className="text-gray-300">{item.userAnswer}</span>
                        </div>
                        {item.feedback && (
                          <div className="text-sm bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 mt-2">
                            <span className="text-emerald-400 font-semibold">Feedback: </span>
                            <span className="text-gray-300">{item.feedback}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
