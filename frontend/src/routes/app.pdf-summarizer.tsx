import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  FileText,
  Loader2,
  Sparkles,
  Brain,
  BookOpen
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/app/pdf-summarizer"
)({
  component: PDFSummarizerPage,
});

function PDFSummarizerPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [fileName, setFileName] =
  useState("");

  const [summary, setSummary] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const summarizePDF =
    async () => {

      if (!file) return;

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "http://127.0.0.1:8000/pdf/summarize",
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

  alert(
    "Failed to summarize PDF"
  );

  setLoading(false);

  return;
}

const data =
  await response.json();

setSummary(
  data.summary
);

      setLoading(false);
    };

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

    <FileText />

    PDF Summarizer

  </h1>

  <p className="text-muted-foreground">

    Turn textbooks and PDFs into
    exam-ready notes instantly

  </p>

</div>

     <Card
  className="
  p-10
  border-2
  border-dashed
  text-center
  space-y-6
  "
>

  <FileText
  className="
  h-20
  w-20
  mx-auto
  text-purple-500
  "
/>

  <div>

    <h2 className="text-2xl font-bold">

      Upload PDF

    </h2>

    <p className="text-muted-foreground">

      Select any chapter,
      notes or research paper

    </p>

  </div>

  <input
    type="file"
    
    accept=".pdf"
    onChange={(e) => {

      const selected =
        e.target.files?.[0];

      setFile(selected || null);

      setFileName(
        selected?.name || ""
      );

    }}
    className="
block
mx-auto
cursor-pointer
"
  />

  <Button
    onClick={summarizePDF}
    disabled={loading}
  >

    {loading ? (

      <>

        <Loader2
          className="
          animate-spin
          mr-2
          h-4
          w-4
          "
        />

        Analyzing PDF...

      </>

    ) : (

      <>
        <Sparkles
          className="
          mr-2
          h-4
          w-4
          "
        />

        Generate Summary
      </>

    )}

  </Button>

</Card>

{fileName && (

<Card className="p-4">

  <div
    className="
    flex
    items-center
    gap-3
    "
  >

    <FileText />

    <div>

      <p
  className="
  font-bold
  break-all
  "
>
  {fileName}
</p>

      <p
        className="
        text-sm
        text-muted-foreground
        "
      >

        Ready to summarize

      </p>

    </div>

  </div>

</Card>

)}

      {summary && (

        <Card className="p-8">

  <h2
    className="
    flex
    items-center
    gap-2
    text-2xl
    font-bold
    mb-6
    "
  >

    <Brain />

    AI Summary

  </h2>

  <div
    className="
    whitespace-pre-wrap
    leading-8
    text-base
    "
  >

    {summary}

  </div>
<Card className="mt-8 p-4">

  <h3 className="font-bold text-lg mb-3">
    📊 PDF Insights
  </h3>

  <div className="grid md:grid-cols-3 gap-4">

    <div>
      <p className="text-muted-foreground">
        Summary Length
      </p>
      <p className="font-bold">
        {summary.length} chars
      </p>
    </div>

    <div>
      <p className="text-muted-foreground">
        Reading Time
      </p>
      <p className="font-bold">
        {Math.ceil(summary.split(" ").length / 200)} min
      </p>
    </div>

    <div>
      <p className="text-muted-foreground">
        AI Status
      </p>
      <p className="font-bold text-green-500">
        Complete
      </p>
    </div>

  </div>

</Card>
</Card>



      )}

    </div>

  );
}