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
          <header className="flex justify-end items-center p-4 gap-4 h-16 bg-black/50 backdrop-blur-md sticky top-0 z-50">
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
          </header>
          {/* Children (Main content) header के नीचे आएगा */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}