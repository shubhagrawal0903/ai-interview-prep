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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: qa.question,
          correctAnswer: qa.answer,
          userAnswer: userAnswer,
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback("Error: Failed to get feedback. Please try again.");
    } finally {
      setIsGettingFeedback(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 space-y-4">
      <h3 className="text-lg font-semibold text-blue-400 mb-2">(Q) {qa.question}</h3>
      <p className="text-gray-300 text-sm sm:text-base">(A) {qa.answer}</p>

      <div className="space-y-2">
        <label className="text-base font-semibold text-white">Your Answer:</label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500"
          rows={3}
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
          className={`p-3 rounded-lg text-sm ${
            feedback.startsWith("Error:")
              ? "bg-red-800 border border-red-600"
              : "bg-gray-700 border border-gray-600"
          }`}
        >
          <h4
            className={`font-semibold mb-1 ${
              feedback.startsWith("Error:") ? "text-red-300" : "text-green-400"
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setQaPairs(data);
    } catch {
      setError("Error generating questions. Try again after 10–15 seconds.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-900 text-white">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 text-center">
        AI Interview Q&A Generator
      </h1>

      <p className="text-base sm:text-lg text-gray-400 mb-6 text-center px-2">
        Enter a topic and get 10 interview questions with answers.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mb-10 space-y-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., React.js, JavaScript, Node.js"
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-600"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && (
        <div className="w-full max-w-xl mb-6 p-3 rounded-lg bg-red-800 border border-red-600 text-sm text-white">
          {error}
        </div>
      )}

      {isLoading && qaPairs.length === 0 && (
        <div className="flex flex-col items-center mt-2">
          <p className="text-gray-400 text-sm">Generating your questions...</p>
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-3"></div>
        </div>
      )}

      {qaPairs.length > 0 && (
        <section className="w-full max-w-xl space-y-5 pb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
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
