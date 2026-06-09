import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Pause, Play, Square, Download, FileDown, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/app/voice-notes")({
  component: VoiceNotes,
});

type RecState = "idle" | "recording" | "paused" | "done";

function VoiceNotes() {
  const [state, setState] = useState<RecState>("idle");
  const [time, setTime] = useState(0);
  const [file, setFile] = useState<File | null>(null);
const [transcript, setTranscript] = useState("");
const [summary, setSummary] = useState("");
const [flashcards, setFlashcards] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state !== "recording") return;
    const i = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [state]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const uploadAudio = async () => {

  if (!file) {
    toast.error("Please select an audio file");
    return;
  }

  try {

    setLoading(true);

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await fetch(
      "https://studygenie-backend-w9am.onrender.com/audio/transcribe",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    setTranscript(
      data.transcript
    );

    setSummary(
  data.summary
);

localStorage.setItem(
  "lecture_summary",
  data.summary
);

setFlashcards(
  data.flashcards
);

localStorage.setItem(
  "lecture_flashcards",
  data.flashcards
);

    setState("done");

  } catch (error) {

    console.error(error);

    toast.error(
      "Audio processing failed"
    );

  } finally {

    setLoading(false);

  }
};

const saveVoiceNote = async () => {

  try {

    await fetch(
      "https://studygenie-backend-w9am.onrender.com/notes/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: file?.name || "Lecture Notes",
          answer: summary,
          user_email: localStorage.getItem(
            "user_email"
          )
        })
      }
    );

    toast.success(
      "Notes Saved Successfully"
    );

  } catch (error) {

    toast.error(
      "Failed To Save Notes"
    );

  }
};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lecture Voice → Notes</h1>
        <p className="text-sm text-muted-foreground">Record any lecture and get structured notes in seconds.</p>
      </div>

      {/* Recorder */}
      <Card className="p-8 text-center bg-gradient-card glass">
       <div className="flex flex-col items-center gap-4 mb-6">
  <label>
    <input
      type="file"
      accept=".mp3,.wav,.m4a"
      hidden
      onChange={(e) => {
        if (e.target.files?.[0]) {
          setFile(e.target.files[0]);
        }
      }}
    />

    <Button
      type="button"
      variant="outline"
      className="cursor-pointer"
      asChild
    >
      <span>
        📁 Upload Audio File
      </span>
    </Button>
  </label>

  {file && (
    <p className="text-sm text-muted-foreground">
      Selected: {file.name}
    </p>
  )}
</div>

{file && (
  <div className="mb-4">
    <Badge variant="secondary">
      🎵 {file.name}
    </Badge>
  </div>
)}
        <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow mb-6">
          {state === "recording" && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
          
          <Mic className="h-10 w-10 text-primary-foreground relative" />
        </div>
        <p className="text-5xl font-mono font-bold tracking-tight">{fmt(time)}</p>
        <Badge variant={state === "recording" ? "destructive" : "secondary"} className="mt-3">
          {state === "idle" && "Ready to record"}
          {state === "recording" && "● Recording"}
          {state === "paused" && "Paused"}
          {state === "done" && "Processing complete"}
        </Badge>

        {/* Visualizer */}
        <div className="mt-6 flex items-end justify-center gap-1 h-16">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ height: state === "recording" ? [10, 30 + Math.random() * 30, 10] : 4 }}
              transition={{ duration: 0.6 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.02 }}
              className="w-1 rounded-full bg-gradient-primary"
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
         {state === "idle" && (
  <Button
    size="lg"
    className="bg-gradient-primary shadow-glow"
    onClick={uploadAudio}
    disabled={loading}
  >
    <Mic className="h-4 w-4 mr-2" />
    <>
  {loading && (
    <span className="animate-spin mr-2">
      ⏳
    </span>
  )}

  {loading
    ? "Generating Notes..."
    : "Generate Notes"}
</>
  </Button>
)}
          {state === "recording" && (
            <>
              <Button size="lg" variant="outline" onClick={() => setState("paused")}>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
              <Button size="lg" variant="destructive" onClick={() => { setState("done"); toast.success("Recording processed!"); }}>
                <Square className="h-4 w-4 mr-2" /> Stop
              </Button>
            </>
          )}
          {state === "paused" && (
            <>
              <Button size="lg" className="bg-gradient-primary" onClick={() => setState("recording")}>
                <Play className="h-4 w-4 mr-2" /> Resume
              </Button>
              <Button size="lg" variant="destructive" onClick={() => { setState("done"); toast.success("Recording processed!"); }}>
                <Square className="h-4 w-4 mr-2" /> Stop
              </Button>
            </>
          )}
          {state === "done" && (
            <Button size="lg" variant="outline" onClick={() => { setState("idle"); setTime(0); }}>
              New Recording
            </Button>
          )}
        </div>
      </Card>

      {/* Results */}
      {state === "done" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Lecture Analysis</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem><FileDown className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem>
                  <DropdownMenuItem><FileDown className="h-4 w-4 mr-2" /> Download DOCX</DropdownMenuItem>
                  <DropdownMenuItem><FileDown className="h-4 w-4 mr-2" /> Download TXT</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs defaultValue="summary">
              <TabsList className="flex flex-wrap h-auto">
                {["transcript", "summary", "flashcards"].map((t) => (
                  <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="transcript" className="prose prose-sm dark:prose-invert max-w-none mt-4">
                <p className="text-sm leading-relaxed">
  {transcript}
</p>
              </TabsContent>
             
               
            <TabsContent value="summary" className="mt-4">
  <div className="whitespace-pre-wrap text-sm">
    {summary}
  </div>

  <Button
    className="mt-4"
    onClick={saveVoiceNote}
  >
    Save To Notes Library
  </Button>
</TabsContent>

<TabsContent
  value="flashcards"
  className="mt-4"
>
  <div className="whitespace-pre-wrap text-sm">
    {flashcards}
  </div>
</TabsContent>
              <TabsContent value="exam" className="mt-4 text-sm space-y-3">
                <p className="font-medium">Likely exam questions:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>State Newton's three laws and give one example of each.</li>
                  <li>A 5 kg object accelerates at 3 m/s². What is the net force?</li>
                  <li>Explain how the third law applies to rocket propulsion.</li>
                </ol>
              </TabsContent>
              <TabsContent value="revision" className="mt-4 text-sm">
                <p>⚡ <strong>30-second recap:</strong> Newton's laws describe motion. 1st = inertia. 2nd = F=ma. 3rd = equal & opposite reactions. Mass × acceleration = net force. Always draw a free body diagram first.</p>
              </TabsContent>
              <TabsContent value="actions" className="mt-4 text-sm space-y-2">
                {["Solve practice problems 4.1 – 4.12 by Friday", "Read chapter 5 before next lecture", "Submit lab report on inertia experiment"].map((a) => (
                  <div key={a} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <input type="checkbox" className="mt-1" /> <span>{a}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="terms" className="mt-4 text-sm space-y-3">
                {[
                  { t: "Inertia", d: "The tendency of an object to resist changes to its motion." },
                  { t: "Net Force", d: "The vector sum of all forces acting on an object." },
                  { t: "Free Body Diagram", d: "A diagram showing all forces acting on a single object." },
                ].map((x) => (
                  <div key={x.t} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-semibold">{x.t}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{x.d}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      )}
    </div>
  );
}