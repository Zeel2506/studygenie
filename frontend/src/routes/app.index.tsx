import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  FileText, Zap, Target, Flame, ArrowRight, TrendingUp,
  Brain, Mic, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

interface StatItem {
  label: string;
  value: string | number;
  change: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}



const weekData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 3.2 }, { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.1 }, { day: "Fri", hours: 2.9 }, { day: "Sat", hours: 5.2 }, { day: "Sun", hours: 3.5 },
];

const quickActions = [
  { title: "Start a Lecture Recording", desc: "Voice → notes in seconds", icon: Mic, to: "/app/voice-notes", color: "from-purple-500 to-pink-500" },
  { title: "Ask AI Study Buddy", desc: "Get explanations & examples", icon: Brain, to: "/app/study-buddy", color: "from-blue-500 to-cyan-500" },
  { title: "Generate a Quiz", desc: "MCQs from your notes", icon: Target, to: "/app/quiz", color: "from-emerald-500 to-teal-500" },
];

function Dashboard() {
  const [stats, setStats] =
  useState<{ total_notes: number; subjects: Record<string, any> } | null>(null);

const [quizStats, setQuizStats] =
  useState<any>(null);

  const user = { name: "Student" };

  useEffect(() => {

 const token =
  localStorage.getItem(
    "token"
  );

fetch(
  "https://studygenie-backend-w9am.onrender.com/analytics/summary",
  {
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  }
)
  .then(res => res.json())
  .then(data => setStats(data));

 fetch(
  "https://studygenie-backend-w9am.onrender.com/quiz-analytics/summary",
  {
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  }
)
  .then(res => res.json())
  .then(data => setQuizStats(data));
}, []);

if (!stats || !quizStats) {

  return (
    <div className="p-10">
      Loading Dashboard...
    </div>
  );

}

const dashboardStats = [

  {
    label: "Notes Created",
    value: stats.total_notes,
    change: "0%",
    icon: FileText,
    color:
      "from-purple-500 to-pink-500"
  },

  {
    label: "Subjects",
    value:
      Object.keys(
        stats.subjects || {}
      ).length,
    change: "0%",
    icon: Brain,
    color:
      "from-blue-500 to-cyan-500"
  },

  {
    label: "Quiz Attempts",
    value:
      quizStats.quizzes || 0,
    change: "0%",
    icon: Target,
    color:
      "from-emerald-500 to-teal-500"
  },

  {
    label: "Average Score",
    value:
      `${quizStats.average || 0}%`,
    change: "0%",
    icon: TrendingUp,
    color:
      "from-amber-500 to-orange-500"
  }

];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good evening, {user.name} 👋 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your studies today.</p>
        </div>
        <Button className="bg-gradient-primary shadow-glow" asChild>
          <Link to="/app/study-buddy"><Sparkles className="h-4 w-4 mr-2" />New AI Session</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 hover:shadow-glow transition-all">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs gap-1"><TrendingUp className="h-3 w-3" />Live Data</Badge>
              </div>
              <p className="text-3xl font-bold mt-4">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly progress */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Weekly Study Hours</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
           <Badge
 variant="outline"
 className="gap-1"
>

  <Flame
   className="h-3 w-3 text-warning"
  />

  Live Data

</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 290)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="oklch(0.6 0.03 258)" fontSize={12} />
                <YAxis stroke="oklch(0.6 0.03 258)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.03 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="hours" stroke="oklch(0.7 0.2 290)" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Learning streak */}
        <Card className="p-6 bg-gradient-hero text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <Flame className="h-10 w-10" />
            <p className="text-5xl font-bold mt-4">

  {quizStats.quizzes || 0}

</p>

<p className="text-white/90">

  quizzes completed

</p>
            <p className="text-xs text-white/70 mt-4">Study today to keep your streak alive!</p>
            <Progress value={70} className="mt-4 bg-white/20" />
            <p className="text-xs text-white/70 mt-2">3 days until next reward</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-semibold mb-3">Quick actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.to}>
              <Card className="p-5 h-full hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer group">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center mb-3`}>
                  <a.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}