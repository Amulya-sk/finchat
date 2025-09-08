// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

type ChatResponse = {
  answer: string;
  error?: string;
  details?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { question?: string };
    const question = body.question;

    if (!question) {
      return NextResponse.json(
        { error: "Missing question in request body" },
        { status: 400 }
      );
    }

    console.log(
      "Using Groq Key:",
      process.env.GROQ_API_KEY ? "Loaded" : "Missing"
    );

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful finance assistant. Provide concise and clear answers.",
            },
            { role: "user", content: question },
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Groq API Error:",
        response.status,
        response.statusText,
        errorText
      );
      return NextResponse.json(
        { error: "Groq API error", details: errorText },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    console.log("Groq API raw response:", data);

    const answer = data.choices?.[0]?.message?.content || "No response from Groq.";
    const result: ChatResponse = { answer };
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}
