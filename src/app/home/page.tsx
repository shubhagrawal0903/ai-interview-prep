'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { hyperspeedPresets } from '@/components/hyperspeedPresets';

// Dynamically import Hyperspeed to avoid SSR issues
const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed effectOptions={hyperspeedPresets.one} />
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 animate-fadeIn">
            AI Interview Prep
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
            Master your interview skills with AI-powered practice questions and instant feedback
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fadeIn">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Smart Questions
              </h3>
              <p className="text-sm text-gray-300">
                AI-generated questions tailored to your topic
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Instant Feedback
              </h3>
              <p className="text-sm text-gray-300">
                Get detailed AI feedback on your answers
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-gray-300">
                Monitor your improvement over time
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/"
              className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              <span className="relative z-10">Start Practicing</span>
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              View Dashboard
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
