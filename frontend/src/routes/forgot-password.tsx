import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  const [email, setEmail] =
  useState("");

const [loading, setLoading] =
  useState(false);
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="We'll send a reset code to your email"
      footer={<>Remember it? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
    >
      <form
        onSubmit={async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const response =
      await fetch(
        "https://studygenie-backend-w9am.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email
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

    localStorage.setItem(
      "reset_email",
      email
    );

    toast.success(
      "Reset OTP Sent"
    );

    navigate({
  to: "/reset-otp"
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
        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-glow">{loading
 ? "Sending..."
 : "Send Reset Code"}</Button>
      </form>
    </AuthLayout>
  );
}