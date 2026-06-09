import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Grid3x3, List, Star, Download, Trash2, Plus, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";


export const Route = createFileRoute("/app/notes")({
  component: Notes,
});

const subjects = ["All", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"];

type Note = {
  _id: string;
  question: string;
  answer: string;
  subject: string;
  created_at: string;
};

function Notes() {
  const [view, setView] = useState("grid");
  const [subject, setSubject] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
 const email = localStorage.getItem(
  "user_email"
);

fetch(
  `https://studygenie-backend-w9am.onrender.com/notes/user/${email}`
)
    .then((res) => res.json())
    .then((data) => {
      setNotes(data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

const filtered = notes.filter((note) => {

  const matchesSearch =
    note.question
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    note.answer
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesSubject =
    subject === "All" ||
    note.subject === subject;

  return (
    matchesSearch &&
    matchesSubject
  );
});

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notes Library</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} notes</p>
        </div>
        <Button className="bg-gradient-primary"><Plus className="h-4 w-4 mr-2" /> New Note</Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
  placeholder="Search notes..."
  className="pl-9"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} variant="outline">
          <ToggleGroupItem value="grid"><Grid3x3 className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="list"><List className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex gap-2 flex-wrap">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              subject === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
            }`}
          >{s}</button>
        ))}
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((n) => (
  <Card
  key={n._id}
  onClick={() => setSelectedNote(n)}
  className="cursor-pointer overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all"
>
    <div className="h-20 bg-gradient-primary" />

    <div className="p-4">

      <div className="flex justify-end">
  <Button
    size="icon"
    variant="ghost"
    onClick={async (e) => {

      e.stopPropagation();

     const confirmDelete = window.confirm(
  "Delete this note?"
);

if (!confirmDelete) return;

await fetch(
  `https://studygenie-backend-w9am.onrender.com/notes/${n._id}`,
  {
    method: "DELETE",
  }
);

setNotes(
  notes.filter(
    note => note._id !== n._id
  )
);

    }}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>

      <Badge className="mb-2">
  {n.subject}
</Badge>

<h3 className="font-semibold">
  {n.question}
</h3>

      <p className="text-sm text-muted-foreground mt-2 line-clamp-4">
        {n.answer}
      </p>

      <p className="text-xs text-muted-foreground mt-3">
        {new Date(n.created_at).toLocaleDateString()}
      </p>

    </div>
  </Card>
))}
        </div>
      ) : (
        <Card className="divide-y">
          {filtered.map((n) => (
           <div
  key={n._id}
  className="p-4 hover:bg-accent/50 transition"
>
  <p className="font-medium">
    {n.question}
  </p>

  <p className="text-sm text-muted-foreground mt-1">
    {n.answer.substring(0, 150)}...
  </p>

  <p className="text-xs text-muted-foreground mt-2">
    {new Date(n.created_at).toLocaleDateString()}
  </p>
</div>
          ))}
        </Card>
      )}

{selectedNote && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setSelectedNote(null)}
  >
    <div
      className="bg-card p-6 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">
        {selectedNote.question}
      </h2>

      <div className="whitespace-pre-wrap text-sm">
        {selectedNote.answer}
      </div>

      <Button
        className="mt-4"
        onClick={() => setSelectedNote(null)}
      >
        Close
      </Button>
    </div>
  </div>
)}
    </div>
  );
}