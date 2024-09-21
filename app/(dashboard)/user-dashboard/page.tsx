"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { BookOpen, FileQuestion, CheckCircle, Award } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DashboardData = {
  totalLearnings: number;
  totalQuizzes: number;
  doneQuizzes: number;
  totalPoints: number;
  userQuizzes: UserQuiz[];
  recentQuizzes: RecentQuiz[];
  leaderboard: LeaderboardUser[];
};

type UserQuiz = {
  id: string;
  title: string;
  totalQuestions: number;
  userScore: number;
};

type RecentQuiz = {
  id: string;
  title: string;
  totalQuestions: number;
};

type LeaderboardUser = {
  username: string;
  email: string;
  photo: string | null;
  points: number;
};

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/user/dashboard");
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
      label: "Completed Quizzes",
      amount: dashboardData.doneQuizzes.toString(),
      discription: "Quizzes you've finished",
      icon: CheckCircle,
    },
    {
      label: "Total Points",
      amount: dashboardData.totalPoints.toString(),
      discription: "Points you've earned",
      icon: Award,
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="User Dashboard" />
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
          <h2 className="text-xl font-semibold">Recent Quizzes</h2>
          <p className="text-sm text-gray-400 mb-4">
            Recently added quizzes you can take.
          </p>
          <div className="space-y-4">
            {dashboardData.recentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <FileQuestion className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-sm text-gray-500">{quiz.totalQuestions} questions</p>
                </div>
                <Button onClick={() => router.push(`/user-dashboard/take-quiz/${quiz.id}`)}>
                  Take Quiz
                </Button>
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
              <div key={index} className="flex items-center justify-between gap-3 space-y-2">
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