import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/otp")({
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const email =
  localStorage.getItem(
    "pending_email"
  );

  const resendOTP = async () => {

  try {

    const response =
      await fetch(
        "https://studygenie-backend-w9am.onrender.com/auth/resend-otp",
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

    toast.success(
      "New OTP Sent"
    );

  } catch (error:any) {

    toast.error(
      error.message
    );

  }

};

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      footer={
  <>
    Didn't get it?

    <button
      type="button"
      onClick={resendOTP}
      className="
      text-primary
      font-medium
      hover:underline
      ml-1
      "
    >
      Resend OTP
    </button>
  </>
}
    >
      <form
        onSubmit={async (e) => {

  e.preventDefault();

  if (!code) {

    toast.error(
      "Please enter OTP"
    );

    return;

  }

  try {

    const response =
      await fetch(
        "https://studygenie-backend-w9am.onrender.com/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            otp: code
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
      "Email Verified Successfully"
    );

    localStorage.removeItem(
      "pending_email"
    );

    navigate({
      to: "/login"
    });

  } catch (error:any) {

    toast.error(
      error.message
    );

  }

}}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-glow">Verify OTP</Button>
      </form>
    </AuthLayout>
  );
}