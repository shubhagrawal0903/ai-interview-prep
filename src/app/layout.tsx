import type { Metadata } from "next";
// Clerk से ज़रूरी components और Provider import करें
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // मैंने आपका original metadata रखा है
  title: "AI Interview Prep - Master Your Interview Skills",
  description: "Generate AI-powered interview questions and get instant feedback on your answers. Practice makes perfect!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Step 1: पूरे application को ClerkProvider से wrap करें
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Step 2: Header जोड़ें जिसमें Sign In/Sign Up और UserButton हो */}
          <header className="flex justify-between items-center px-4 py-3 sm:p-4 gap-2 sm:gap-4 h-14 sm:h-16 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
            {/* Left side - Logo/Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-100 hover:text-white font-bold text-base sm:text-lg transition-colors duration-200 flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="hidden xs:inline">AI Interview</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 flex-1 ml-8">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link 
                href="/practice" 
                className="text-gray-300 hover:text-white font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Practice
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </Link>
            </div>

            {/* Right side - Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white font-medium text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 cursor-pointer border border-gray-600 rounded-full transition whitespace-nowrap">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4 cursor-pointer hover:bg-[#5a38e0] transition whitespace-nowrap hidden xs:block">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" /> 
              </SignedIn>
            </div>
          </header>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800/50 z-50">
            <div className="flex justify-around items-center h-16 px-2">
              <Link 
                href="/" 
                className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white transition-colors duration-200 flex-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs font-medium">Home</span>
              </Link>
              <Link 
                href="/practice" 
                className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white transition-colors duration-200 flex-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-medium">Practice</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white transition-colors duration-200 flex-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs font-medium">Dashboard</span>
              </Link>
            </div>
          </nav>
          {/* Children (Main content) header के नीचे आएगा */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}