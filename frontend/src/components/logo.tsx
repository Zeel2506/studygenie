import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity rounded-lg" />
        <div className="relative h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      {!compact && (
        <span className="font-bold text-lg tracking-tight">
          Study<span className="text-gradient">Genie</span>
        </span>
      )}
    </Link>
  );
}