"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Users, BookOpen, FileQuestion, Briefcase } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type DashboardData = {
  totalUsers: number;
  totalLearnings: number;
  totalQuizzes: number;
  totalJobRoles: number;
  recentUsers: User[];
  leaderboard: LeaderboardUser[];
};

type User = {
  id: string;
  username: string;
  email: string;
  photo: string | null;
  role: string;
};

type LeaderboardUser = {
  id: string;
  username: string;
  email: string;
  photo: string | null;
  points: number;
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const cardData: CardProps[] = [
    {
      label: "Total Users",
      amount: dashboardData.totalUsers.toString(),
      discription: "Active users in the system",
      icon: Users,
    },
    {
      label: "Total Learnings",
      amount: dashboardData.totalLearnings.toString(),
      discription: "Available learning materials",
      icon: BookOpen,
    },
    {
      label: "Total Quizzes",
      amount: dashboardData.totalQuizzes.toString(),
      discription: "Available quizzes",
      icon: FileQuestion,
    },
    {
      label: "Job Roles",
      amount: dashboardData.totalJobRoles.toString(),
      discription: "Defined job roles",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Admin Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <p className="text-sm text-gray-400 mb-4">
            Recent users who signed up to the platform.
          </p>
          <div className="space-y-4">
            {dashboardData.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 space-y-2">
                <Avatar>
                  <AvatarImage src={user.photo || undefined} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="ml-auto text-sm text-gray-500">{user.role}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardContent>
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <p className="text-sm text-gray-400 mb-4">
            Top users based on points earned from quizzes.
          </p>
          <div className="space-y-4">
            {dashboardData.leaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between gap-3 space-y-2">
                <span className="font-bold text-lg w-6">{index + 1}</span>
                <Avatar>
                  <AvatarImage src={user.photo || undefined} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="ml-auto font-semibold">{user.points} points</span>
              </div>
            ))}
          </div>
        </CardContent>
      </section>
    </div>
  );
}
