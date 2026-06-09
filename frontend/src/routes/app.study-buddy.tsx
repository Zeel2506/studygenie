import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Send, Mic, Paperclip, Image as ImageIcon, FileText,
  Copy, ThumbsUp, ThumbsDown, RefreshCw, Sparkles, Brain,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/app/study-buddy")({
  component: StudyBuddy,
});

const prompts = [
  "Explain Newton's Laws like I'm 10",
  "Summarize chapter 5 of my biology notes",
  "Create 10 MCQs from my chemistry notes",
  "Explain photosynthesis with examples",
];

type Msg = { role: "user" | "ai"; text: string };

function StudyBuddy() {
  const [mode, setMode] = useState("detailed");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi Alex! 👋 I'm your AI Study Buddy. Ask me anything — I can explain concepts, summarize notes, generate quizzes, and more." },
  ]);
  const [lastQuestion, setLastQuestion] = useState("");
  const [input, setInput] = useState("");
  
  const [loading, setLoading] = useState(false);

  const send = async (text?: string) => {

  const message = (text ?? input).trim();
  setLastQuestion(message);

  if (!message) return;

  setMessages((m) => [
    ...m,
    {
      role: "user",
      text: message
    }
  ]);

  setInput("");

  try {

    setLoading(true);

    const response = await fetch(
      "https://studygenie-backend-w9am.onrender.com/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
        }),
      }
    );

    const data = await response.json();

    setMessages((m) => [
      ...m,
      {
        role: "ai",
        text: data.answer,
      }
    ]);

  } catch (error) {

    toast.error(
      "Failed to get AI response"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> AI Study Buddy
          </h1>
          <p className="text-sm text-muted-foreground">Your personal tutor, available 24/7</p>
        </div>
        <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v)} size="sm" variant="outline">
          <ToggleGroupItem value="eli10">ELI10</ToggleGroupItem>
          <ToggleGroupItem value="detailed">Detailed</ToggleGroupItem>
          <ToggleGroupItem value="summary">Summary</ToggleGroupItem>
          <ToggleGroupItem value="examples">Examples</ToggleGroupItem>
          <ToggleGroupItem value="steps">Step-by-step</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={m.role === "ai" ? "bg-gradient-primary text-primary-foreground" : ""}>
                  {m.role === "ai" ? <Sparkles className="h-4 w-4" /> : "AJ"}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[80%] space-y-2`}>
                <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>{m.text}</div>
                {m.role === "ai" && (
                  <div className="flex gap-1">
                    {[
  {
    icon: Copy,
    label: "Copy",
    onClick: () => {
      navigator.clipboard.writeText(m.text);
      toast.success("Copied");
    }
  },

  {
    icon: FileText,
    label: "Save",
    onClick: async () => {

      const response = await fetch(
        "https://studygenie-backend-w9am.onrender.com/notes/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         body: JSON.stringify({
  question: lastQuestion,
  answer: m.text,
  user_email: localStorage.getItem("user_email")
}),
        }
      );

      const data = await response.json();

      toast.success("Saved to Notes");
    }
  },

  {
    icon: ThumbsUp,
    label: "Like"
  },

  {
    icon: ThumbsDown,
    label: "Dislike"
  },

  {
    icon: RefreshCw,
    label: "Regenerate"
  },

].map(({ icon: I, label, onClick }) => (
                      <Button key={label} size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground" onClick={onClick}>
                        <I className="h-3.5 w-3.5" />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

           {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                 <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                   <Sparkles className="h-4 w-4" />
                 </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-3 text-sm">
      AI is thinking...
    </div>
        </div>
        )}
        </div>

        {messages.length === 1 && (
          <div className="px-4 md:px-6 pb-3">
            <p className="text-xs text-muted-foreground mb-2">Try these prompts:</p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button key={p} onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 rounded-full border hover:bg-accent transition">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-3 md:p-4">
          <div className="rounded-2xl border bg-background p-2 focus-within:ring-2 focus-within:ring-primary/30 transition">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask your AI study buddy anything…"
              className="border-0 resize-none focus-visible:ring-0 min-h-[44px] max-h-32 shadow-none"
              rows={1}
            />
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8"><Paperclip className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Upload PDF</DropdownMenuItem>
                    <DropdownMenuItem><ImageIcon className="h-4 w-4 mr-2" /> Upload Image</DropdownMenuItem>
                    <DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Upload Notes</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="ghost" className="h-8"><Mic className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="ml-1 text-xs">{mode}</Badge>
              </div>
              <Button
 size="sm"
 onClick={() => send()}
 disabled={loading}
 className="h-8 bg-gradient-primary"
>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}