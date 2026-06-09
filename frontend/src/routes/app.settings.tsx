import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(true);

  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

  useEffect(() => {

    setName(
      localStorage.getItem(
        "user_name"
      ) || ""
    );

    setEmail(
      localStorage.getItem(
        "user_email"
      ) || ""
    );

    const saved =
      localStorage.getItem(
        "notifications"
      );

    if (saved !== null) {

      setNotifications(
        saved === "true"
      );

    }

  }, []);

  const handleNotification =
    (value: boolean) => {

      setNotifications(value);

      localStorage.setItem(
        "notifications",
        value.toString()
      );

    };

  const logout = () => {

    localStorage.clear();

    navigate({
      to: "/login"
    });

  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      {/* Account */}

      <Card className="p-6">

        <h2 className="text-xl font-semibold mb-4">
          Account
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Name:</strong> {name}
          </p>

          <p>
            <strong>Email:</strong> {email}
          </p>

        </div>

      </Card>

      {/* Notifications */}

      <Card className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <Label>
              Notifications
            </Label>

            <p className="text-sm text-muted-foreground">
              Receive study reminders
            </p>

          </div>

          <Switch
            checked={notifications}
            onCheckedChange={
              handleNotification
            }
          />

        </div>

      </Card>

      {/* Security */}

      <Card className="p-6">

        <h2 className="text-xl font-semibold mb-4">
          Security
        </h2>

        <Button
          onClick={() =>
            navigate({
              to: "/forgot-password"
            })
          }
        >
          Change Password
        </Button>

      </Card>

      {/* Logout */}

      <Card className="p-6">

        <h2 className="text-xl font-semibold mb-4">
          Account Actions
        </h2>

        <Button
          variant="destructive"
          onClick={logout}
        >
          Logout
        </Button>

      </Card>

    </div>
  );
}