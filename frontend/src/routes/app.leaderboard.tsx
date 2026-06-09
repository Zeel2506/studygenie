import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute(
  "/app/leaderboard"
)({
  component: LeaderboardPage,
});

function LeaderboardPage() {

  const [leaders, setLeaders] =
    useState<any[]>([]);

  useEffect(() => {

    fetch(
      "https://studygenie-backend-w9am.onrender.com/leaderboard/all"
    )
      .then((res) => res.json())
      .then((data) =>
        setLeaders(data)
      );

  }, []);

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

          <Trophy />

          Leaderboard

        </h1>

        <p className="text-muted-foreground">

          Compete with other students
          and climb the rankings

        </p>

      </div>

      <Card className="p-6">

        <h2
          className="
          text-2xl
          font-bold
          mb-6
          "
        >

          🏆 Global Rankings

        </h2>

        {leaders.map(
          (user, index) => (

            <Card
              key={index}
              className="
              p-4
              mb-4
              "
            >

              <div
                className="
                flex
                justify-between
                items-center
                "
              >

                <div>

                  #{index + 1}
                  {" "}
                  {user.name}

                </div>

                <div
                  className="
                  font-bold
                  text-purple-400
                  "
                >

                  {user.points}
                  pts

                </div>

              </div>

            </Card>

          )
        )}

      </Card>

    </div>

  );
}