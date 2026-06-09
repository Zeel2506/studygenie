import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { SocialAuth } from "@/components/social-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your learning journey"
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link></>}
    >
      <form
        onSubmit={async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Login failed"
      );
    }

  localStorage.setItem(
  "token",
  data.access_token
);

const userRes = await fetch(
  "http://127.0.0.1:8000/auth/me",
  {
    headers: {
      Authorization: `Bearer ${data.access_token}`
    }
  }
);

const user = await userRes.json();
console.log(user);

localStorage.setItem(
  "user_name",
  user.name || ""
);

localStorage.setItem(
  "user_email",
  user.email || ""
);

localStorage.setItem(
  "user_picture",
  user.picture || ""
);

    toast.success("Login Successful");

    navigate({
      to: "/app",
    });

  } catch (error: any) {

    toast.error(
      error.message
    );

  } finally {

    setLoading(false);

  }
}}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
  id="email"
  type="email"
  placeholder="you@university.edu"
  required
  className="pl-9"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
  id="password"
  type={showPw ? "text" : "password"}
  placeholder="••••••••"
  required
  className="pl-9 pr-9"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox id="remember" /> <span className="text-muted-foreground">Remember me for 30 days</span>
        </label>
        <Button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
>
 {loading ? "Logging in..." : "Log in"}
</Button>
      </form>
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or continue with</span>
      </div>
      <SocialAuth />
    </AuthLayout>
  );
}