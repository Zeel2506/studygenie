import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Brain, Mic, Library, Zap, Target, Calendar,
  MessageSquare, BarChart3, User, Settings, GitBranch, FileText,
  ScanText, HelpCircle, Trophy, Flame,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";


const main = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "AI Study Buddy", url: "/app/study-buddy", icon: Brain },
  { title: "Voice Notes", url: "/app/voice-notes", icon: Mic },
  { title: "Notes Library", url: "/app/notes", icon: Library },
  { title: "Flashcards", url: "/app/flashcards", icon: Zap },
  { title: "Quiz Generator", url: "/app/quiz", icon: Target },
  { title: "Study Planner", url: "/app/planner", icon: Calendar },
  { title: "AI Chat", url: "/app/chat", icon: MessageSquare },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
];

const premium = [
  { title: "Mind Map", url: "/app/mind-map", icon: GitBranch },
  { title: "PDF Summarizer", url: "/app/pdf-summarizer", icon: FileText },

  { title: "Leaderboard", url: "/app/leaderboard", icon: Trophy },
  { title: "Challenges", url: "/app/challenges", icon: Flame },
];

const account = [
  { title: "Profile", url: "/app/profile", icon: User },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const [user, setUser] =
  useState<any>(null);
  const [userPicture, setUserPicture] =
  useState("");
  const [userName, setUserName] =
  useState("");
  const [userEmail, setUserEmail] =
  useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");
  const navigate = useNavigate();

  useEffect(() => {

  setUserPicture(
    localStorage.getItem(
      "user_picture"
    ) || ""
  );

  setUserEmail(
    localStorage.getItem(
      "user_email"
    ) || ""
  );

  setUserName(
  localStorage.getItem(
    "user_name"
  ) || ""
);

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) return;

  fetch(
    "https://studygenie-backend-w9am.onrender.com/auth/me",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )
    .then(res => res.json())
    .then(data =>
      setUser(data)
    );

}, []);
   const logout = () => {

 localStorage.removeItem("token");

localStorage.removeItem(
  "user_email"
);

localStorage.removeItem(
  "user_name"
);

localStorage.removeItem(
  "user_picture"
);

  navigate({
    to: "/login"
  });

};

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Premium</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {premium.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition">
          <Avatar className="h-9 w-9">
           <AvatarImage
  src={userPicture}
/>

<AvatarFallback>
  {user?.name?.charAt(0) || "U"}
</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">
  {user?.name || userName || "Loading..."}
</p>
           <p className="text-xs text-muted-foreground truncate">
  {user?.email || userEmail}
</p>
          </div>
        </div>
        <Button
  variant="outline"
  className="w-full mt-2"
  onClick={logout}
>

  <LogOut className="mr-2 h-4 w-4" />

  Logout

</Button>
      </SidebarFooter>
    </Sidebar>
  );
}