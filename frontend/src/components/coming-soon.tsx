import { motion } from "motion/react";
import { Sparkles, type LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function ComingSoon({ title, description, icon: Icon = Sparkles, features = [] }: {
  title: string; description: string; icon?: LucideIcon; features?: string[];
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Icon className="h-6 w-6 text-primary" /> {title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-10 text-center bg-gradient-card glass">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <Badge className="bg-gradient-primary border-0">Premium · Coming soon</Badge>
          <h2 className="text-xl font-semibold mt-4">{title}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{description}</p>
          {features.length > 0 && (
            <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-md mx-auto text-left text-sm">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                  <Sparkles className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />{f}
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-6 bg-gradient-primary shadow-glow">Join the waitlist</Button>
        </Card>
      </motion.div>
    </div>
  );
}