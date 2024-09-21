"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWindowWidth } from "@react-hook/window-size";
import { Nav, NavLink } from "./ui/nav";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  ChevronRight,
  BookText,
  DraftingCompass,
  UserPlus,
  Command,
  Shapes,
  Undo2,
} from "lucide-react";

export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const onlyWidth = useWindowWidth();
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileWidth(onlyWidth < 768);
    setIsMounted(true);
    fetch("/api/getUserRole")
      .then((res) => res.json())
      .then((data) => setUserRole(data.role));
  }, [onlyWidth]);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const isAdminDashboard = pathname?.startsWith("/admin-dashboard");

  const adminLinks: NavLink[] = [
    {
      title: "Dashboard",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
      variant: "default",
    },
    {
      title: "Users",
      href: "/admin-dashboard/users",
      icon: Users,
      variant: "ghost",
    },
    {
      title: "Job Roles",
      href: "/admin-dashboard/job-roles",
      icon: UserPlus,
      variant: "ghost",
    },
    {
      title: "Learning",
      href: "/admin-dashboard/learning",
      icon: BookText,
      variant: "ghost",
    },
    {
      title: "Quiz",
      href: "/admin-dashboard/quiz",
      icon: DraftingCompass,
      variant: "ghost",
    },
    {
      title: "User Dashboard",
      href: "/user-dashboard",
      icon: Command,
      variant: "ghost",
    },
    {
      title: "Profile Settings",
      href: "/admin-dashboard/settings",
      icon: Settings,
      variant: "ghost",
    },
  ];

  const userLinks: NavLink[] = [
    {
      title: "Dashboard",
      href: "/user-dashboard",
      icon: LayoutDashboard,
      variant: "default",
    },
    {
      title: "Learning Materials",
      href: "/user-dashboard/learning-materials",
      icon: FileText,
      variant: "ghost",
    },
    {
      title: "Take a Quiz",
      href: "/user-dashboard/take-quiz",
      icon: Shapes,
      variant: "ghost",
    },
    {
      title: "Profile Settings",
      href: "/user-dashboard/settings",
      icon: Settings,
      variant: "ghost",
    },
  ];

  if (!isMounted) {
    return (
      <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24"></div>
    );
  }

  if (userRole === "ADMIN") {
    userLinks.push({
      title: "Admin Dashboard",
      href: "/admin-dashboard/",
      icon: Undo2,
      variant: "ghost",
    });
  }

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
      {!isMobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={isMobileWidth ? true : isCollapsed}
        links={isAdminDashboard ? adminLinks : userLinks}
      />
    </div>
  );
}
