import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [
      totalLearnings,
      totalQuizzes,
      userQuizAttempts,
      recentQuizzes,
      leaderboard
    ] = await Promise.all([
      db.learning.count(),
      db.quiz.count(),
      db.quizAttempt.findMany({
        where: { userId: user.id },
        select: {
          score: true,
          totalQuestions: true,
          completed: true,
          quiz: {
            select: {
              id: true,
              title: true,
              questions: { select: { id: true } },
            },
          },
        },
      }),
      db.quiz.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          questions: { select: { id: true } },
        },
      }),
      db.quizAttempt.groupBy({
        by: ['userId'],
        _sum: {
          score: true,
        },
        orderBy: {
          _sum: {
            score: 'desc',
          },
        },
        take: 7,
      }),
    ]);

    const leaderboardWithUserDetails = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await db.user.findUnique({
          where: { id: entry.userId },
          select: {
            username: true,
            email: true,
            photo: true,
          },
        });
        return {
          ...user,
          points: entry._sum.score || 0,
        };
      })
    );

    const doneQuizzes = userQuizAttempts.filter(attempt => attempt.completed).length;
    const totalPoints = userQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);

    const userQuizzes = userQuizAttempts.map(attempt => ({
      id: attempt.quiz.id,
      title: attempt.quiz.title,
      totalQuestions: attempt.quiz.questions.length,
      userScore: attempt.score,
    }));

    return NextResponse.json({
      totalLearnings,
      totalQuizzes,
      doneQuizzes,
      totalPoints,
      userQuizzes,
      recentQuizzes: recentQuizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        totalQuestions: quiz.questions.length,
      })),
      leaderboard: leaderboardWithUserDetails,
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching dashboard data" },
      { status: 500 }
    );
  }
}