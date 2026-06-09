import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { SocialAuth } from "@/components/social-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const [name, setName] =
  useState("");

const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

const [loading, setLoading] =
  useState(false);
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start studying smarter — it's free"
      footer={<>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
    >
      <form
        onSubmit={async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const response =
      await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.detail
      );

    }

    toast.success(
  "OTP Sent To Your Email"
);

localStorage.setItem(
  "pending_email",
  email
);

navigate({
  to: "/otp"
});

  } catch (error:any) {

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
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
  id="name"
  placeholder="Your Name"
  required
  className="pl-9"
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
/>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
  id="email"
  type="email"
  required
  className="pl-9"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
  id="password"
  type={showPw ? "text" : "password"}
  required
  className="pl-9 pr-9"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      <Button
  type="submit"
  disabled={loading}
  className="w-full ..."
>
  {loading
    ? "Creating..."
    : "Create Account"}
</Button>
      </form>
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or sign up with</span>
      </div>
      <SocialAuth />
    </AuthLayout>
  );
}