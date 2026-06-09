import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  User,
  Shield,
  BookOpen,
  Trophy,
  Flame,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {

  const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [picture, setPicture] = useState("");
const [editing, setEditing] = useState(false);
const [stats, setStats] = useState<any>(null);
const [quizStats, setQuizStats] = useState<any>(null);

useEffect(() => {

  setName(
    localStorage.getItem("user_name") || ""
  );

  setEmail(
    localStorage.getItem("user_email") || ""
  );

  setPicture(
    localStorage.getItem("user_picture") || ""
  );

  fetch(
    "http://127.0.0.1:8000/analytics/summary"
  )
    .then(res => res.json())
    .then(data => setStats(data));

  fetch(
    "http://127.0.0.1:8000/quiz-analytics/summary"
  )
    .then(res => res.json())
    .then(data => setQuizStats(data));

}, []);
  const saveProfile = async () => {
  try {

  const token =
    localStorage.getItem("token");

  await fetch(
    "http://127.0.0.1:8000/auth/update-profile",
    {
      method: "PUT",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        name
      })
    }
  );

  localStorage.setItem(
    "user_name",
    name
  );

  toast.success(
    "Profile Updated"
  );

  setEditing(false);

} catch {

  toast.error(
    "Update Failed"
  );

}

  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

     <h1 className="text-5xl font-bold">
        My Profile
      </h1>

      <Card
className="
p-8
border-white/10
bg-gradient-to-r
from-violet-500/10
via-purple-500/10
to-pink-500/10
backdrop-blur-xl
shadow-2xl
hover:shadow-purple-500/20
transition-all
duration-300
"
>

  <div className="flex flex-col lg:flex-row gap-8 items-center">

   <div
className=" relative
p-1
rounded-full
bg-gradient-to-r
from-violet-500
to-pink-500
shadow-lg
shadow-purple-500/30
"
>

<Avatar className="h-36 w-36">

      <AvatarImage src={picture} />

      <AvatarFallback className="text-3xl">
        {name?.charAt(0) || "U"}
      </AvatarFallback>

    </Avatar>
    <div
className="
absolute
bottom-3
right-3
h-4
w-4
rounded-full
bg-green-500
border-2
border-background
"
/>
    </div>

    <div className="flex-1">

      <div className="flex items-center gap-3">

        <h2 className="text-3xl font-bold">
          {name || "Unknown User"}
        </h2>

        

      </div>

      <div className="mt-4 space-y-3">

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {email}
        </div>

        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Verified Account
        </div>

      </div>

      {editing && (

  <div className="mt-4 flex gap-2">

    <Input
      value={name}
      onChange={(e) =>
        setName(e.target.value)
      }
    />

    <Button
      onClick={saveProfile}
    >
      Save
    </Button>

  </div>

)}

    </div>

    <Button
  onClick={() => setEditing(!editing)}
>
  <Pencil size={16} />
  {editing ? "Cancel" : "Edit Profile"}
</Button>

  </div>

</Card>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

  <Card className="p-5">
    <BookOpen className="mb-2 h-6 w-6" />
   <h3 className="text-3xl font-bold">
  {stats?.total_notes || 0}
</h3>
    <p className="text-muted-foreground">
      Notes Created
    </p>
  </Card>

 <Card
  className="
  p-5
  hover:scale-105
  transition-all
  duration-300
  cursor-pointer
  "
>
    <Trophy className="mb-2 h-6 w-6" />
   <h3 className="text-3xl font-bold">
  {quizStats?.quizzes || 0}
</h3>
    <p className="text-muted-foreground">
      Quizzes Taken
    </p>
  </Card>

  <Card
  className="
  p-5
  hover:scale-105
  transition-all
  duration-300
  cursor-pointer
  "
>
    <Flame className="mb-2 h-6 w-6" />
    <h3 className="text-3xl font-bold">
  {stats?.streak || 0}
</h3>
    <p className="text-muted-foreground">
      Day Streak
    </p>
  </Card>

 <Card
  className="
  p-5
  hover:scale-105
  transition-all
  duration-300
  cursor-pointer
  "
>
    <User className="mb-2 h-6 w-6" />
   <h3 className="text-3xl font-bold">
  {quizStats?.average || 0}%
</h3>
    <p className="text-muted-foreground">
      Average Score
    </p>
  </Card>

 



</div>

    </div>
  );
}