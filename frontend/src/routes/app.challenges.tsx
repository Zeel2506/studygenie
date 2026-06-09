import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute(
  "/app/challenges"
)({
  component: ChallengesPage,
});

function ChallengesPage() {

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    fetch(
      "https://studygenie-backend-w9am.onrender.com/challenges/today"
    )
      .then((res) => res.json())
      .then((data) =>
        setData(data)
      );

  }, []);

  if (!data)
    return <p>Loading...</p>;

  return (

    <div className="max-w-5xl mx-auto space-y-6">

      <div>

        <h1
          className="
          flex
          items-center
          gap-3
          text-4xl
          font-bold
          "
        >

          <Flame />

          Daily Challenges

        </h1>

        <p className="text-muted-foreground">

          Complete challenges and earn XP

        </p>

      </div>

      {data.challenges.map(
        (
          challenge:any,
          index:number
        ) => (

          <Card
            key={index}
            className="p-5"
          >

            <h2 className="font-bold">

              {challenge.title}

            </h2>

            <p>

              Progress:
              {" "}
              {challenge.current}
              /
              {challenge.target}

            </p>

          </Card>

        )
      )}

      <Card className="p-6">

        <h2 className="text-2xl font-bold">

          XP Rewards

        </h2>

        <p className="mt-3">

          {data.xp}
          XP Earned

        </p>

      </Card>

    </div>

  );
}