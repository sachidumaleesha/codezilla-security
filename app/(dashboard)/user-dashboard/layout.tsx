import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import SideNavbar from "@/components/SideNavbar";
import { UserProfile } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
      <div
        className={cn(
          "min-h-screen w-full bg-white text-black flex",
          inter.className,
          {
            "debug-screens": process.env.NODE_ENV === "development"
          }
        )}
      >
        <SideNavbar />
        <div className="p-8 w-full">
          <div className="absolute top-7 right-8">
            <UserProfile/>
          </div>
          {children}
        </div>
      </div>
  );
}