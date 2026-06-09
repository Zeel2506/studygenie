import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    const response = await fetch(
      "https://studygenie-backend-w9am.onrender.com/study/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      }
    );

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        user: question,
        ai: data.answer,
      },
    ]);

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          AI Study Buddy
        </h1>

        <p className="text-muted-foreground">
          Ask questions from your saved notes
        </p>
      </div>

      <Card className="p-6 space-y-4">

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask anything..."
          className="w-full h-32 bg-background border rounded-md p-3"
        />

        <Button
          onClick={askAI}
          disabled={loading}
        >
          {loading
            ? "Thinking..."
            : "Ask AI"}
        </Button>

      </Card>

      {messages.map(
        (msg, index) => (
          <Card
            key={index}
            className="p-4 space-y-3"
          >
            <div>
              <strong>You:</strong>
              <p>{msg.user}</p>
            </div>

            <div>
              <strong>AI:</strong>
             <ReactMarkdown>
  {msg.ai}
</ReactMarkdown>
            </div>
          </Card>
        )
      )}
    </div>
  );
}