import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {

  const [stats, setStats] =
    useState<any>(null);
  const [quizStats, setQuizStats] =
  useState<any>(null);
  const [recommendation,
setRecommendation] =
useState("");
  const [achievements,
setAchievements] =
useState<any[]>([]);
   const [performance,
setPerformance] =
useState<any>(null);
   const [weakTopics,
setWeakTopics] =
useState<string[]>([]);

  useEffect(() => {

    fetch(
  "http://127.0.0.1:8000/weak-topics/analyze"
)
.then((res) => res.json())
.then((data) =>
  setWeakTopics(
    data.weak_topics
  )
);

    fetch(
  "http://127.0.0.1:8000/performance/predict"
)
.then((res) => res.json())
.then((data) =>
  setPerformance(data)
);

    fetch(
  "http://127.0.0.1:8000/achievements/all"
)
.then((res) => res.json())
.then((data) =>
  setAchievements(data)
);

    fetch(
  "http://127.0.0.1:8000/analytics/recommendation"
)
  .then((res) => res.json())
  .then((data) =>
    setRecommendation(
      data.recommendation
    )
  );

    fetch(
  "http://127.0.0.1:8000/quiz-analytics/summary"
)
  .then((res) => res.json())
  .then((data) =>
    setQuizStats(data)
  );

    fetch(
     "http://127.0.0.1:8000/analytics/summary"
    )
      .then((res) => res.json())
      .then((data) =>
        setStats(data)
      );

  }, []);

  if (!stats)
  return (
    <div className="p-10">
      Loading Analytics...
    </div>
  );

 return (
  <div className="max-w-6xl mx-auto space-y-6">

    <h1 className="text-3xl font-bold">
      Analytics Dashboard
    </h1>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

      <Card className="p-6">
        <h2 className="text-lg font-bold">
          Total Notes
        </h2>

        <p className="text-4xl mt-3">
          {stats.total_notes}
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold">
          Subjects
        </h2>

        <p className="text-4xl mt-3">
          {Object.keys(
            stats.subjects || {}
          ).length}
        </p>
      </Card>

      <Card className="p-6">
       <h2 className="text-lg font-bold">
  Most Studied Subject
</h2>

        <p className="text-xl mt-3">
          {
            Object.entries(
              stats.subjects || {}
            ).sort(
              (a: any, b: any) =>
                b[1] - a[1]
            )[0]?.[0]
          }
        </p>
      </Card>

    <Card className="p-6">
      <h2 className="text-lg font-bold">
        Average Notes / Subject
      </h2>

      <p className="text-4xl mt-3">
        {Object.keys(stats.subjects || {}).length > 0
          ? Math.round(
              stats.total_notes / Object.keys(stats.subjects || {}).length
            )
          : 0}
      </p>
    </Card>

    <Card className="p-6">
      <h2 className="text-lg font-bold">
        Strongest Subject
      </h2>

  <p className="text-xl mt-3">
    {
      Object.entries(
        stats.subjects || {}
      ).sort(
        (a:any,b:any)=>
          b[1]-a[1]
      )[0]?.[0]
    }
  </p>
</Card>

<Card className="p-6">
  <h2 className="text-lg font-bold">
    Weakest Subject
  </h2>

  <p className="text-xl mt-3">
    {
      Object.entries(
        stats.subjects || {}
      ).sort(
        (a:any,b:any)=>
          a[1]-b[1]
      )[0]?.[0]
    }
  </p>
</Card>

<Card className="p-6">
  <h2 className="text-lg font-bold">
    Quiz Attempts
  </h2>

  <p className="text-4xl mt-3">
    {quizStats?.quizzes || 0}
  </p>
</Card>

<Card className="p-6">
  <h2 className="text-lg font-bold">
    Average Score
  </h2>

  <p className="text-4xl mt-3">
    {quizStats?.average || 0}%
  </p>
</Card>

<Card className="p-6">
  <h2 className="text-lg font-bold">
    Best Subject
  </h2>

  <p className="text-xl mt-3">
    {quizStats?.best_subject || "N/A"}
  </p>
</Card>

    </div>

    <Card className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        Subject Mastery
      </h2>

      {Object.entries(
        stats.subjects || {}
      ).map(
        ([subject, count]: any) => {

          const percentage =
  stats.total_notes > 0
    ? Math.round(
        (count / stats.total_notes) * 100
      )
    : 0;

          return (

            <div
              key={subject}
              className="mb-5"
            >

              <div className="flex justify-between mb-2">

                <span>
                  {subject}
                </span>

                <span>
                  {percentage}%
                </span>

              </div>

              <div className="w-full bg-muted h-4 rounded">

                <div
                  className="h-4 rounded bg-purple-500"
                  style={{
                    width:
                      `${percentage}%`
                  }}
                />

              </div>

            </div>

          );
        }
      )}

    </Card>
    <Card className="p-6">

  <h2 className="text-2xl font-bold mb-4">

    🎯 AI Study Recommendation

  </h2>

  <p className="whitespace-pre-line text-lg">

    {recommendation ||
  "No recommendations available yet."}

  </p>

</Card>

<Card className="p-6">

  <h2 className="text-2xl font-bold mb-4">

    🏆 Achievements

  </h2>

  <div className="grid md:grid-cols-2 gap-4">

    {achievements.length === 0 ? (

  <p>
    No achievements unlocked yet.
  </p>

) : (

  achievements.map(
    (achievement, index) => (

      <Card
        key={index}
        className="p-4"
      >
        <h3 className="font-bold">
          {achievement.title}
        </h3>

        <p>
          {achievement.description}
        </p>
      </Card>

    )
  )

)}

  </div>

</Card>

<Card className="p-6">

  <h2 className="text-2xl font-bold mb-4">

    🚀 Exam Readiness

  </h2>

  <p className="text-5xl font-bold">

    {performance?.readiness || 0}%

  </p>

  <p className="mt-4">

    Average Quiz Score:
    {" "}
    {performance?.average_score || 0}%

  </p>

</Card>

<Card className="p-6">

  <h2 className="text-2xl font-bold mb-4">

    🧠 AI Weak Topic Detection

  </h2>

  <div className="space-y-3">

    {weakTopics.map(
      (topic, index) => (

        <div
          key={index}
          className="
          p-3
          rounded
          bg-muted
          "
        >

          ⚠ {topic}

        </div>

      )
    )}

  </div>

</Card>

  </div>
);
}