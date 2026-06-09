import {
  createFileRoute,
  Link} 
from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles, Mic, BookOpen, Brain, FileText, Zap, Target,
  MessageSquare, BarChart3, Check, Star, ArrowRight, Play,
  Headphones, GraduationCap, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyGenie AI — Your Personal AI Study Assistant" },
      { name: "description", content: "Convert lectures to notes, generate flashcards and quizzes, and study smarter with AI." },
      { property: "og:title", content: "StudyGenie AI" },
      { property: "og:description", content: "Convert lectures to notes, generate flashcards and quizzes, and study smarter with AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Mic, title: "Voice-to-Notes", desc: "Record lectures and get structured notes, summaries and key points instantly." },
  { icon: Brain, title: "AI Study Buddy", desc: "Ask academic questions and get clear explanations, examples and step-by-step answers." },
  { icon: Zap, title: "Flashcards", desc: "Auto-generate flashcards from any notes, PDF or recorded lecture." },
  { icon: Target, title: "Smart Quizzes", desc: "MCQs, true/false and short answers tailored to your study material." },
  { icon: FileText, title: "PDF Summarizer", desc: "Drop a textbook chapter and get exam-ready summaries in seconds." },
  { icon: BarChart3, title: "Progress Analytics", desc: "Track streaks, study hours and mastery across every subject." },
];



const pricing = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    features: [
      "AI Study Buddy",
      "Voice Notes",
      "Flashcards",
      "Quiz Generator"
    ],
    cta: "Get Started",
    popular: false,
  },

  {
    name: "Premium",
    price: "Soon",
    period: "",
    features: [
      "Mind Maps",
      "PDF Summarizer",
      "Leaderboard",
      "Challenges",
      "Advanced Analytics"
    ],
    cta: "Coming Soon",
    popular: true,
  },

  {
    name: "Campus",
    price: "Soon",
    period: "",
    features: [
      "Everything in Premium",
      "Teacher Dashboard",
      "Class Leaderboards",
      "Shared Notes",
      "Institution Analytics"
    ],
    cta: "Coming Soon",
    popular: false,
  },
];

const faqs = [
  { q: "Is StudyGenie free to start?", a: "Yes. The Starter plan is free forever with generous limits — no credit card needed." },
  { q: "How accurate is the lecture transcription?", a: "Our AI achieves 95%+ accuracy for clear audio across 40+ languages." },
  { q: "Can I use my own notes and PDFs?", a: "Absolutely. Upload PDFs, images and text — we turn them into notes, flashcards and quizzes." },
  { q: "Is my data private?", a: "Your study materials are encrypted, never sold, and never used to train external models." },
];

function Landing() {
  
  const [showDemo, setShowDemo] =
  useState(false);

 

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</a>
           
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by next-gen AI models
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Your Personal{" "}
              <span className="text-gradient">AI Study Assistant</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Convert lectures into notes, understand complex topics instantly, generate quizzes,
              flashcards and study smarter with AI.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow text-base h-12 px-8">
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
             <Button
  size="lg"
  variant="outline"
  className="text-base h-12 px-8 gap-2"
  onClick={() =>
    setShowDemo(true)
  }
>
  <Play className="h-4 w-4" />
  Watch Demo
</Button>
            </div>
            <div className="mt-8 text-xs text-muted-foreground flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Cancel anytime</span>
            </div>
          </motion.div>

          {/* AI illustration card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl border border-border bg-card/50 backdrop-blur p-6 shadow-elegant">
              <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-30 blur-xl -z-10" />
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Headphones, label: "Recording lecture…", value: "12:34", color: "from-purple-500 to-pink-500" },
                  { icon: FileText, label: "Notes generated", value: "1,247 words", color: "from-blue-500 to-cyan-500" },
                  { icon: GraduationCap, label: "Quiz ready", value: "15 questions", color: "from-emerald-500 to-teal-500" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="glass rounded-2xl p-5"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold mt-1">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to ace your exams</h2>
            <p className="mt-4 text-muted-foreground text-lg">A complete AI-powered study suite built for students.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-6 h-full hover:shadow-glow transition-all hover:-translate-y-1 border-border/60">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <f.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, student-friendly pricing</h2>
            <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((p) => (
              <Card
                key={p.name}
                className={`p-8 relative ${p.popular ? "border-primary shadow-glow scale-[1.02]" : ""}`}
              >
                {p.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary border-0">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
               <Button
  className={`w-full mt-6 ${
    p.popular
      ? "bg-gradient-primary"
      : ""
  }`}
  variant={
    p.popular
      ? "default"
      : "outline"
  }
>
  {p.cta}
</Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-xl px-5 border-0">
                <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-hero p-12 md:p-16 text-center relative overflow-hidden shadow-glow">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <Trophy className="h-12 w-12 mx-auto mb-6 text-white" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to study smarter?
              </h2>
              <p className="mt-4 text-white/90 text-lg max-w-xl mx-auto">
                Start your AI-powered learning journey today
              </p>
              <Button size="lg" asChild className="mt-8 h-12 px-8 bg-white text-primary hover:bg-white/90">
                <Link to="/register">Start Learning Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact + Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="mt-3 text-sm text-muted-foreground">Study smarter with AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><Link to="/app" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About StudyGenie</a></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@studygenie.in</li>
                <li>Ahmedabad, Gujarat, India</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 StudyGenie.
Built by Zeel Patel. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      {showDemo && (

<div
  className="
  fixed
  inset-0
  bg-black/80
  flex
  items-center
  justify-center
  z-[9999]
  "
>

  <div
    className="
    bg-card
    p-4
    rounded-xl
    w-[90%]
    max-w-4xl
    relative
    "
  >

    <button
      className="
      absolute
      top-3
      right-3
      text-xl
      "
      onClick={() =>
        setShowDemo(false)
      }
    >
      ✕
    </button>

    <div
  className="
  h-[500px]
  flex
  items-center
  justify-center
  text-center
  "
>
  <div>

    <Play className="h-16 w-16 mx-auto mb-4" />

    <h2 className="text-2xl font-bold">
      Demo Coming Soon
    </h2>

    <p className="text-muted-foreground">
      StudyGenie walkthrough video will be available soon.
    </p>

  </div>
</div>

  </div>

</div>

)}
    </div>
  );
}
