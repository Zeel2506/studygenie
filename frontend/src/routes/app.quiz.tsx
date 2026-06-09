import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect} from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/quiz")({
  component: QuizPage,
});

const parseQuiz = (text: string) => {

  const questions = [];

  const blocks = text.split("Q:");

  for (const block of blocks) {

    if (!block.trim()) continue;

    const lines = block
      .trim()
      .split("\n");

    const question = lines[0];

    const options = lines
      .filter(
        (line) =>
          line.startsWith("A)") ||
          line.startsWith("B)") ||
          line.startsWith("C)") ||
          line.startsWith("D)")
      );

    const answerLine = lines.find(
      (line) =>
        line.includes("ANSWER:")
    );

   if (options.length === 4) {

  questions.push({
    question,
    options,
    answer:
      answerLine
        ?.replace(
          "ANSWER:",
          ""
        )
        .trim() || "",
  });
   }
}

  return questions;
};

function QuizPage() {

  const [quiz, setQuiz] =
  useState<any[]>([]);

const [current, setCurrent] =
  useState(0);

const [selectedAnswer, setSelectedAnswer] =
  useState("");

const [score, setScore] =
  useState(0);

const [showResult, setShowResult] =
  useState(false);

const [selectedSubject, setSelectedSubject] =
  useState("");

const [notes, setNotes] =
  useState<any[]>([]);

 const loadNotes = async () => {

  const email =
    localStorage.getItem(
      "user_email"
    );

  const response = await fetch(
    `http://127.0.0.1:8000/notes/user/${email}`
  );

  const data = await response.json();

  setNotes(data);

};
useEffect(() => {
  loadNotes();
}, []);

  const generateQuiz = async () => {

    if (!selectedSubject) {

  alert(
    "Please select a subject"
  );

  return;

}

const content = notes
  .filter(
    (note) =>
      note.subject
        ?.trim()
        .toLowerCase() ===
      selectedSubject
        .trim()
        .toLowerCase()
  )
  .map(
  (note) =>
    note.question +
    "\n" +
    note.answer
)
  .join("\n");

console.log("SELECTED SUBJECT:", selectedSubject);
console.log("FILTERED NOTES:",
  notes.filter(
    (note) =>
      note.subject
        ?.trim()
        .toLowerCase() ===
      selectedSubject
        .trim()
        .toLowerCase()
  )
);
console.log("CONTENT SENT TO OLLAMA:");
console.log(content);

    const response = await fetch(
      "http://127.0.0.1:8000/quiz/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content:
  notes
  .filter(
    (note) =>
      note.subject
        ?.trim()
        .toLowerCase() ===
      selectedSubject
        .trim()
        .toLowerCase()
  )
    .map(
      (note) =>
        note.answer
    )
    .join("\n")
        }),
      }
    );

   const data = await response.json();

setQuiz(
  parseQuiz(
    data.quiz
  )
);

setCurrent(0);

setScore(0);

setShowResult(false);

setSelectedAnswer("");

console.log(
  parseQuiz(
    data.quiz
  )
);
  };

if (showResult) {

  return (

    <div className="max-w-4xl mx-auto">

      <Card className="p-8 text-center">

        <h1 className="text-4xl font-bold mb-4">

          Quiz Completed 🎉

        </h1>

        <p className="text-2xl">

          Score:
          {" "}
          {score}
          {" / "}
          {quiz.length}

        </p>

      </Card>

    </div>

  );

}

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Quiz Generator
        </h1>

        <p className="text-muted-foreground">
          Generate quizzes from notes
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">

  {[...new Set(
    notes.map(
      (note) => note.subject
    )
  )].map((subject, index) => (

    <Button
     key={`${subject}-${index}`}
      variant={
        selectedSubject === subject
          ? "default"
          : "outline"
      }
      onClick={() =>
        setSelectedSubject(subject)
      }
    >
      {subject}
    </Button>

  ))}

</div>

      <Button
        onClick={generateQuiz}
      >
        <Target className="mr-2 h-4 w-4" />
        Generate Quiz
      </Button>

      <Card className="p-6">

      {quiz.length > 0 && (

  <Card className="p-6">

    <h2 className="text-xl font-bold mb-4">

      Question {current + 1}
      {" / "}
      {quiz.length}

    </h2>

    <p className="mb-6">

      {quiz[current].question}

    </p>

    <div className="space-y-3">

      {quiz[current].options.map(
        (
          option: string,
          index: number
        ) => (

         <Button
  key={index}
  variant={
    selectedAnswer === option
      ? "default"
      : "outline"
  }
  className="w-full justify-start"
  onClick={() =>
    setSelectedAnswer(option)
  }
>
  {option}
</Button>

        )
      )}

    </div>

  </Card>

  

)}

      </Card>

{quiz.length > 0 && (

  <Button
   onClick={async () => {

  if (!selectedAnswer) {

    alert(
      "Select an answer first"
    );

    return;
  }

  const correctLetter =
    quiz[current]
      .answer
      .trim();

  const selectedLetter =
    selectedAnswer
      .charAt(0);

  if (
    correctLetter ===
    selectedLetter
  ) {
    setScore(
      (prev) =>
        prev + 1
    );
  }

  setSelectedAnswer("");

 if (
  current ===
  quiz.length - 1
) {

  const email =
    localStorage.getItem(
      "user_email"
    );

  const finalScore =
    correctLetter === selectedLetter
      ? score + 1
      : score;

  await fetch(
    "http://127.0.0.1:8000/quiz-analytics/save",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        subject:
          selectedSubject,
        score:
          finalScore,
        total:
          quiz.length,
        user_email:
          email
      })
    }
  );

  setShowResult(true);

} else {

  setCurrent(
    current + 1
  );

}

}}
  >
    Next Question
  </Button>

)}

    </div>
  );
}