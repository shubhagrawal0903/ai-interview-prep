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
          <header className="flex justify-between items-center p-4 gap-4 h-16 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
            {/* Left side - Navigation Links */}
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
              </SignedIn>
            </div>

            {/* Right side - Auth Buttons */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  {/* Sign In button को स्टाइल करें (optional) */}
                  <button className="text-gray-300 hover:text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer border border-gray-600 rounded-full transition">
                    Sign In
                  </button>
                </SignInButton>

              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a38e0] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {/* Logged in user के लिए User Profile button */}
              <UserButton afterSignOutUrl="/" /> 
            </SignedIn>
            </div>
          </header>
          {/* Children (Main content) header के नीचे आएगा */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}