import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/planner")({
  component: PlannerPage,
});

function PlannerPage() {

  const [subject, setSubject] = useState("");

const [days, setDays] = useState(7);

const [plan, setPlan] = useState("");

const [notes, setNotes] =
  useState<any[]>([]);

const [completedDays, setCompletedDays] =
  useState<number[]>([]);

const loadNotes = async () => {

  try {

    const email =
      localStorage.getItem(
        "user_email"
      );

    const response = await fetch(
      `http://127.0.0.1:8000/notes/user/${email}`
    );

    const data =
      await response.json();

    setNotes(data);

  } catch (err) {

    console.error(err);

  }

};

useEffect(() => {
  loadNotes();
}, []);

const generatePlan = async () => {

 const response = await fetch(
  "http://127.0.0.1:8000/planner/generate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        subject,
        days,
      }),
    }
  );

 

  const data =
    await response.json();

  setPlan(data.plan);
  setCompletedDays([]);
};

const daysList = plan
  .split("Day ")
  .filter(Boolean);

const progress =
  daysList.length > 0
    ? Math.round(
        (
          completedDays.length /
          daysList.length
        ) * 100
      )
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Study Planner
      </h1>

     <Card className="p-6 space-y-4">

  <select
    value={subject}
    onChange={(e) =>
      setSubject(e.target.value)
    }
    className="w-full p-3 rounded border bg-background"
  >
    <option value="">
      Select Subject
    </option>

    {[...new Set(
      notes.map(
        (note) => note.subject
      )
    )].map((subject) => (

      <option
        key={subject}
        value={subject}
      >
        {subject}
      </option>

    ))}

  </select>

  <input
    type="number"
    value={days}
    onChange={(e) =>
      setDays(
        Number(e.target.value)
      )
    }
    placeholder="Number of days"
    className="w-full p-3 rounded border bg-background"
  />

  <Button onClick={generatePlan}>
    Generate AI Plan
  </Button>

</Card>
{plan && (

<>

<Card className="p-4">

  <h2 className="font-bold">
    Progress
  </h2>

  <div className="w-full bg-muted h-4 rounded mt-3">

    <div
      className="h-4 rounded bg-green-500"
      style={{
        width: `${progress}%`
      }}
    />

  </div>

  <p className="mt-2">
    {progress}% Complete
  </p>

</Card>

<Card className="p-6">

  <h2 className="text-xl font-bold mb-4">
    Generated Study Plan
  </h2>

  <div className="space-y-3">

    {daysList.map((day, index) => (

      <Card
        key={index}
        className="p-4 flex justify-between"
      >

        <div>

          <h3 className="font-bold">
            Day {index + 1}
          </h3>

          <p>
            {day.split("\n")[1]}
          </p>

        </div>

        <Button
          variant={
            completedDays.includes(index)
              ? "default"
              : "outline"
          }
          onClick={() => {

            if (
              !completedDays.includes(index)
            ) {

              setCompletedDays([
                ...completedDays,
                index
              ]);

            }

          }}
        >
          ✓ Complete
        </Button>

      </Card>

    ))}

  </div>

</Card>

</>

)}

     

    </div>
  );
}