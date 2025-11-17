"use client";

import React, { useState } from "react";

interface QAPair {
  question: string;
  answer: string;
}

function QACard({ qa }: { qa: QAPair }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  const handleFeedback = async () => {
    if (!userAnswer) {
      setFeedback("Error: Please write your answer first.");
      return;
    }
    
    setIsGettingFeedback(true);
    setFeedback("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: qa.question,
          correctAnswer: qa.answer,
          userAnswer: userAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Frontend: Error fetching feedback:", error);
      setFeedback("Error: Failed to get feedback. Please try again.");
    } finally {
      setIsGettingFeedback(false);
    }
  };

  return (
    // Card padding mobile ke liye chhota (p-4) aur desktop ke liye bada (md:p-6)
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg border border-gray-700 space-y-4">
      {/* Card ka title mobile pe chhota (text-lg) aur desktop pe bada (md:text-xl) */}
      <h3 className="text-lg md:text-xl font-semibold text-blue-400 mb-3">(Q) {qa.question}</h3>
      <p className="text-gray-300">(A) {qa.answer}</p>
      <hr className="border-gray-600" />

      <div className="space-y-2">
        <label className="text-lg font-semibold text-white">Your Answer:</label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={isGettingFeedback}
        />
        <button
          onClick={handleFeedback}
          disabled={isGettingFeedback}
          className="p-3 w-full rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-600"
        >
          {isGettingFeedback ? "Analyzing..." : "Get AI Feedback"}
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg ${
            feedback.startsWith("Error:")
              ? "bg-red-800 border-red-600"
              : "bg-gray-700 border-gray-600"
          }`}
        >
          <h4
            className={`font-semibold mb-2 ${
              feedback.startsWith("Error:")
                ? "text-red-300"
                : "text-green-400"
            }`}
          >
            {feedback.startsWith("Error:") ? "Error:" : "AI Feedback:"}
          </h4>
          <p className="text-white">{feedback.replace("Error: ", "")}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQaPairs([]);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setQaPairs(data);
    } catch (error) {
      setError(
        "Error generating questions. Please try again. (Tip: If this repeats, the AI model might be overloaded. Wait 15 seconds and try again)."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main padding mobile ke liye p-6, desktop ke liye md:p-12
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-gray-900 text-white">
      {/* Title mobile pe chhota (text-3xl) aur desktop pe bada (sm:text-5xl), aur text-center */}
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-center">AI Interview Q&A Generator</h1>
      {/* Subtitle bhi responsive aur center mein */}
      <p className="text-lg sm:text-xl text-gray-400 mb-8 text-center">
        Enter a topic, and get 10 interview questions with answers.
      </p>

      {/* Form ki max-width badha di taaki woh neeche ke cards se match kare */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-12">
        {/* Form layout mobile pe column (flex-col) aur desktop pe row (sm:flex-row) */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., React.js, JavaScript, Node.js"
            // Input mobile pe full width (w-full) aur desktop pe flex-grow
            className="w-full sm:flex-grow p-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            // Button mobile pe full width (w-full) aur desktop pe auto-width (sm:w-auto)
            className="w-full sm:w-auto p-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {error && (
        // Error message ki width bhi max-w-3xl kar di
        <div className="w-full max-w-3xl mb-6 p-4 rounded-lg bg-red-800 border border-red-600 text-white">
          <p>
            <span className="font-bold">Error:</span> {error}
          </p>
        </div>
      )}

      {isLoading && qaPairs.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-400">Generating your questions...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-4"></div>
        </div>
      )}

      {qaPairs.length > 0 && (
        <section className="w-full max-w-3xl space-y-6">
          {/* Section title bhi mobile pe chhota (text-2xl) aur desktop pe bada (sm:text-3xl) */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            Your {topic} Questions
          </h2>
          {qaPairs.map((qa, index) => (
            <QACard key={index} qa={qa} />
          ))}
        </section>
      )}
    </main>
  );
}