import fetch from "node-fetch";

const runTest = async () => {
  console.log("Using Groq Key:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: "Hello! What is phishing?" }],
    }),
  });

  const data = await response.json();
  console.log("Groq response:", data);
};

runTest().catch(console.error);
