import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { toast } from "sonner";

export const Route =
createFileRoute("/reset-otp")({
  component: ResetOTPPage,
});

function ResetOTPPage() {

  const navigate =
    useNavigate();

  const [otp, setOtp] =
    useState("");

  const email =
    localStorage.getItem(
      "reset_email"
    );

  return (

    <AuthLayout
      title="Verify Reset OTP"
      subtitle={`Enter OTP sent to ${email}`}
    >

      <form
        onSubmit={async (e) => {

  e.preventDefault();

  if (!otp) {

    toast.error(
      "Please enter OTP"
    );

    return;

  }

  try {

    const response =
      await fetch(
        "http://127.0.0.1:8000/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            otp
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
      "OTP Verified"
    );

    localStorage.setItem(
      "reset_otp",
      otp
    );

    navigate({
      to:
      "/reset-password"
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

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >

            <InputOTPGroup>

              {[0,1,2,3,4,5].map(
                (i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                  />
                )
              )}

            </InputOTPGroup>

          </InputOTP>

        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Verify OTP
        </Button>

      </form>

    </AuthLayout>

  );

}