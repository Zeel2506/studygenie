import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Flag, RotateCw, Sparkles, FileText, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
export const Route = createFileRoute("/app/flashcards")({
  component: Flashcards,
});

function Flashcards() {
  console.log("FLASHCARDS PAGE LOADED");
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [deck, setDeck] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [topic, setTopic] = useState("No Topic");
  const [selectedSubject, setSelectedSubject] =
  useState("Biology");

  useEffect(() => {

  const loadNotes = async () => {

    try {

      console.log("FETCHING NOTES...");

      const email =
        localStorage.getItem(
          "user_email"
        );

      const response = await fetch(
        `http://127.0.0.1:8000/notes/user/${email}`
      );

      const data =
        await response.json();

      console.log(
        "NOTES:",
        data
      );

      setNotes(data);

    } catch (err) {

      console.error(
        "FETCH ERROR:",
        err
      );

    }

  };

  loadNotes();

}, []);

  const card =
  deck.length > 0
    ? deck[i]
    : {
        q: "Generate Flashcards",
        a: "No flashcards yet"
      };

  const parseFlashcards = (text: string) => {

  const cards = [];

  const parts = text.split("Q:");

  for (const part of parts) {

    if (!part.trim()) continue;

    const [question, answer] =
      part.split("A:");

    cards.push({
      q: question.trim(),
      a: answer?.trim() || "",
    });
  }

  return cards;
};

const generateFromContent = async (
  content: string
) => {

 
  const response = await fetch(
    "http://127.0.0.1:8000/flashcards/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    }
  );
 

  const data = await response.json();

console.log("API RESPONSE:", data);

const cards = parseFlashcards(
  data.flashcards
);

console.log("PARSED CARDS:", cards);

setDeck(cards);

  setI(0);
  setFlip(false);
};

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <p className="text-sm text-muted-foreground">
  {topic} · {deck.length} cards
</p>
        </div>

    <div className="flex gap-2 mb-4">

  <Button
    variant={
      selectedSubject === "Physics"
        ? "default"
        : "outline"
    }
    onClick={() =>
      setSelectedSubject("Physics")
    }
  >
    Physics
  </Button>

  <Button
    variant={
      selectedSubject === "Chemistry"
        ? "default"
        : "outline"
    }
    onClick={() =>
      setSelectedSubject("Chemistry")
    }
  >
    Chemistry
  </Button>

  <Button
    variant={
      selectedSubject === "Biology"
        ? "default"
        : "outline"
    }
    onClick={() =>
      setSelectedSubject("Biology")
    }
  >
    Biology
  </Button>

  <Button
    variant={
      selectedSubject === "Mathematics"
        ? "default"
        : "outline"
    }
    onClick={() =>
      setSelectedSubject("Mathematics")
    }
  >
    Mathematics
  </Button>

</div>

        <div className="flex gap-2">
          <Button
  variant="outline"
  size="sm"
 onClick={() => {

  const subjectNotes = notes.filter(
    (note) =>
      note.subject === selectedSubject
  );

  if (subjectNotes.length === 0) {

    alert(
      `No ${selectedSubject} notes found`
    );

    return;
  }

  const combinedContent =
    subjectNotes
      .map(
        (note) =>
          note.answer
      )
      .join("\n\n");

  setTopic(selectedSubject);
  console.log(
  "SELECTED SUBJECT:",
  selectedSubject
);

console.log(
  "SUBJECT NOTES:",
  subjectNotes
);

console.log(
  "COMBINED CONTENT:",
  combinedContent
);
  generateFromContent(
    combinedContent
  );

}}
>
  <FileText className="h-4 w-4 mr-2" />
  From Notes
</Button>
          <Button
  variant="outline"
  size="sm"
  onClick={() => {

    const lecture =
      localStorage.getItem(
        "lecture_summary"
      );

    if (!lecture) {

      alert(
        "No lecture found"
      );

      return;
    }

   setTopic(
  "Lecture Flashcards"
);

generateFromContent(
  lecture
);

  }}
>
  <Mic className="h-4 w-4 mr-2" />
  From Lecture
</Button>
         <Button
  size="sm"
  className="bg-gradient-primary"
 onClick={() => {

  setTopic("Newton's Laws of Motion");

  generateFromContent(
    "Newton's Laws of Motion"
  );

}}
><Sparkles className="h-4 w-4 mr-2" /> Generate</Button>
        </div>
      </div>

      <div>
  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">

    <span>
      Card {deck.length === 0 ? 0 : i + 1}
      {" "}of{" "}
      {deck.length}
    </span>

    <span>
      {deck.length === 0
        ? 0
        : Math.round(
            ((i + 1) / deck.length) * 100
          )}
      %
    </span>

  </div>

  <Progress
    value={
      deck.length === 0
        ? 0
        : ((i + 1) / deck.length) * 100
    }
  />
</div>

      <div className="perspective-1000">
        <motion.div
          className="cursor-pointer"
          onClick={() => setFlip((v) => !v)}
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${i}-${flip}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="min-h-[300px] md:min-h-[360px] p-8 md:p-12 flex flex-col items-center justify-center text-center bg-gradient-card glass shadow-elegant">
                <Badge variant="secondary" className="mb-4">{flip ? "Answer" : "Question"}</Badge>
                <p className="text-xl md:text-2xl font-medium">{flip ? card.a : card.q}</p>
                <p className="text-xs text-muted-foreground mt-6">Tap to flip</p>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Button variant="outline" onClick={() => { setFlip(false); setI((p) => Math.max(0, p - 1)); }} disabled={
  deck.length === 0 ||
  i === 0
}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Star className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Flag className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => setFlip((v) => !v)}><RotateCw className="h-4 w-4" /></Button>
        </div>
        <Button className="bg-gradient-primary" onClick={() => { setFlip(false); setI((p) => Math.min(deck.length - 1, p + 1)); }} disabled={
  deck.length === 0 ||
  i === deck.length - 1
}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}