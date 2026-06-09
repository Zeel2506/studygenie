import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Shapes,
  BookOpen,
  Rocket,
  Lightbulb
} from "lucide-react";

export const Route =
createFileRoute("/app/mind-map")({
  component: MindMapPage,
});

function MindMapPage() {

  const [topic, setTopic] =
    useState("");

  const [branches, setBranches] =
  useState<any[]>([]);

  const [selectedBranch,
setSelectedBranch] =
useState<any>(null);

  const [mindmap, setMindmap] =
  useState<string>("");

 const parseMindMap = (text: string) => {

  const lines = text
    .split("\n")
    .filter(line => line.trim());

  const topic = lines[0];

  const branches: any[] = [];

  let currentBranch: any = null;

  for (const line of lines.slice(1)) {

    // Parent branch
    if (
      line.startsWith("- ")
    ) {

      currentBranch = {
        title: line.replace("- ", "").trim(),
        children: []
      };

      branches.push(
        currentBranch
      );
    }

    // Child item
    else if (
      line.startsWith("  - ")
    ) {

      currentBranch?.children.push(
        line.replace(
          "  - ",
          ""
        ).trim()
      );
    }
  }

  return {
    topic,
    branches
  };
};

  const generate = async () => {

    const response =
      await fetch(
        "http://127.0.0.1:8000/mindmap/generate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            topic,
          }),
        }
      );

    const data =
      await response.json();

    console.log(
      "MINDMAP RESPONSE"
    );

console.log(
  data.mindmap
);

   const parsed =
  parseMindMap(
    data.mindmap
  );

setTopic(
  parsed.topic
);

setBranches(
  parsed.branches
);
  };

const getIcon = (title:string) => {

  const t = title.toLowerCase();

  if (t.includes("formula"))
    return <Calculator size={20} />;

  if (t.includes("type"))
    return <Shapes size={20} />;

  if (t.includes("theorem"))
    return <BookOpen size={20} />;

  if (t.includes("application"))
    return <Rocket size={20} />;

  return <Lightbulb size={20} />;
};

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        AI Mind Maps
      </h1>

      <Card className="p-6 space-y-4">

        <input
          value={topic}
          onChange={(e) =>
            setTopic(
              e.target.value
            )
          }
          placeholder="Enter topic..."
          className="w-full p-3 rounded border bg-background"
        />

        <Button onClick={generate}>
          Generate Mind Map
        </Button>

      </Card>

      {branches.length > 0 && (

<Card className="p-8">

  <div className="flex flex-col items-center">

   <div
 className="
 bg-gradient-to-r
 from-purple-600
 to-pink-500
 text-white
 px-10
 py-4
 rounded-2xl
 font-bold
 text-xl
 shadow-lg
 "
>
  {topic}
</div>

    <div className="h-10 w-1 bg-purple-500" />

   <div
 className="
 grid
 md:grid-cols-2
 lg:grid-cols-3
 gap-8
 mt-8
 "
>

      {branches.map(
        (branch, index) => (

         <Card
  key={index}
  className="
  p-5
  min-h-[220px]
  cursor-pointer
  hover:border-purple-500
  hover:shadow-lg
  transition-all
  duration-300
  "
  onClick={() =>
    setSelectedBranch(branch)
  }
>

            <div className="flex items-center gap-2 mb-3">

  {getIcon(branch.title)}

  <h3
    className="
    font-bold
    text-purple-400
    "
  >
    {branch.title}
  </h3>

</div>

            <ul className="space-y-2">

              {branch.children.map(
                (
                  child: string,
                  idx: number
                ) => (

                  <li key={idx}>
                    • {child}
                  </li>

                )
              )}

            </ul>

          </Card>

        )
      )}

    </div>

  </div>

</Card>

)}


      

    </div>
  );
}