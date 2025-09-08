"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { user?: string; bot?: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [apiKey] = useState("gsk_1234567890abcdef1234567890abcdef1234567890abcdef");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


  const sendMessage = async (msg?: string) => {
    const text = msg || question;
    if (!text) return;
    const newMessages = [...messages, { user: text, time: getTime() }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, apiKey }),
      });
      const data = await res.json();
      setMessages([...newMessages, { bot: data.answer, time: getTime() }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { bot: "⚠️ Oops, something went wrong.", time: getTime() },
      ]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 text-blue-500 text-lg mt-1">
      <span className="animate-bounce">•</span>
      <span className="animate-bounce delay-150">•</span>
      <span className="animate-bounce delay-300">•</span>
    </div>
  );

  const suggestions = [
    "💳 What is a credit score?",
    "🏦 Best savings account options?",
    "📈 How do mutual funds work?",
    "💰 Tips to save money monthly?",
  ];

  if (!isClient) {
    return <div className="h-screen bg-white"></div>;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      {/* Chat Container */}
      <div className="w-full max-w-3xl h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
        {/* Header */}
        <header className="bg-blue-600 p-5 text-center text-2xl font-bold text-white shadow-md flex items-center justify-center gap-2">
          🤖 FinChat <span className="font-normal">– Your Financial Chatbot</span> 💰
        </header>


        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-blue-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.user ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-xl shadow ${
                  msg.user
                    ? "bg-blue-600 text-white self-end"
                    : "bg-white text-gray-800 border border-blue-200"
                }`}
              >
                {msg.user || msg.bot}
              </div>
              <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
            </div>
          ))}
          {loading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about finance..."
              className="flex-1 px-4 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <button
              onClick={() => sendMessage()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow transition-all"
            >
              Send
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(s)}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
