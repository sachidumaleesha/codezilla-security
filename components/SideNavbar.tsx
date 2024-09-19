"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWindowWidth } from "@react-hook/window-size";
import { Nav, NavLink } from "./ui/nav";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  CreditCard,
  ChevronRight,
  BookText,
  DraftingCompass
} from "lucide-react";

export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const onlyWidth = useWindowWidth();
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileWidth(onlyWidth < 768);
    setIsMounted(true);
  }, [onlyWidth]);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const isAdminDashboard = pathname?.startsWith('/admin-dashboard');

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
      title: "Learning",
      href: "/admin-dashboard/learning",
      icon: BookText,
      variant: "ghost",
    },
    {
      title: "Training",
      href: "/admin-dashboard/training",
      icon: DraftingCompass,
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
      title: "Orders",
      href: "/user-dashboard/orders",
      icon: ShoppingCart,
      variant: "ghost",
    },
    {
      title: "Invoices",
      href: "/user-dashboard/invoices",
      icon: FileText,
      variant: "ghost",
    },
    {
      title: "Billing",
      href: "/user-dashboard/billing",
      icon: CreditCard,
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
    return <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24"></div>;
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
