import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-2xl glass shadow-elegant overflow-hidden"
          >
            <div className="bg-gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold text-sm">StudyGenie Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 max-h-72 overflow-y-auto space-y-3">
              <div className="rounded-xl bg-muted p-3 text-sm">
                Hi Alex! 👋 I can help you navigate, plan study sessions or explain features. What's on your mind?
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Plan my week", "Generate quiz", "Explain dashboard"].map((s) => (
                  <button key={s} className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition">{s}</button>
                ))}
              </div>
            </div>
            <form className="p-3 border-t flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Ask anything…" className="h-9" />
              <Button size="icon" className="h-9 w-9 bg-gradient-primary"><Send className="h-4 w-4" /></Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center text-primary-foreground animate-pulse-glow"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>
    </>
  );
}