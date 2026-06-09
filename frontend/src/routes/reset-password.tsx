import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
});



function ResetPage() {

  const [show, setShow] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
  setConfirmPassword] =
    useState("");

  const [loading,
  setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const email =
    localStorage.getItem(
      "reset_email"
    );
  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you'll remember"
      footer={<Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link>}
    >
      <form
        onSubmit={async (e) => {

  e.preventDefault();

  if (password.length < 8) {

  toast.error(
    "Password must be at least 8 characters"
  );

  return;

}

  if (
    password !==
    confirmPassword
  ) {

    toast.error(
      "Passwords do not match"
    );

    return;

  }

  try {

    setLoading(true);

    const response =
      await fetch(
        "http://127.0.0.1:8000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
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
      "Password Updated"
    );

    localStorage.removeItem(
      "reset_email"
    );

    navigate({
      to: "/login"
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

  <Label>New Password</Label>

  <div className="relative">

    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

    <Input
      type={show ? "text" : "password"}
      required
      className="pl-9 pr-9"
      value={password}
      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }
    />

    <button
      type="button"
      onClick={() =>
        setShow((v) => !v)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {show
        ? <EyeOff className="h-4 w-4" />
        : <Eye className="h-4 w-4" />
      }
    </button>

  </div>

</div>

<div className="space-y-2">

  <Label>Confirm Password</Label>

  <div className="relative">

    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

    <Input
      type={show ? "text" : "password"}
      required
      className="pl-9 pr-9"
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(
          e.target.value
        )
      }
    />

    <button
      type="button"
      onClick={() =>
        setShow((v) => !v)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {show
        ? <EyeOff className="h-4 w-4" />
        : <Eye className="h-4 w-4" />
      }
    </button>

  </div>

</div>

        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-glow">{loading
 ? "Updating..."
 : "Update Password"}</Button>
      </form>
    </AuthLayout>
  );
}