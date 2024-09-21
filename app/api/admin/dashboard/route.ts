import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalUsers, totalLearnings, totalQuizzes, totalJobRoles, recentUsers, quizAttempts] = await Promise.all([
      db.user.count(),
      db.learning.count(),
      db.quiz.count(),
      db.jobRole.count(),
      db.user.findMany({
        take: 7,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          photo: true,
          role: true,
        },
      }),
      db.quizAttempt.findMany({
        select: {
          userId: true,
          score: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              photo: true,
            },
          },
        },
      }),
    ]);

    // Calculate total points for each user
    const userPoints = quizAttempts.reduce((acc, attempt) => {
      if (!acc[attempt.userId]) {
        acc[attempt.userId] = {
          ...attempt.user,
          points: 0,
        };
      }
      acc[attempt.userId].points += attempt.score;
      return acc;
    }, {} as Record<string, { id: string; username: string; email: string; photo: string | null; points: number }>);

    // Convert to array and sort by points
    const leaderboard = Object.values(userPoints)
      .sort((a, b) => b.points - a.points)
      .slice(0, 7);

    return NextResponse.json({
      totalUsers,
      totalLearnings,
      totalQuizzes,
      totalJobRoles,
      recentUsers,
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching dashboard data" },
      { status: 500 }
    );
  }
}
