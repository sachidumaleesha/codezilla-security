import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface CompletedQuiz {
  id: string;
  title: string;
  totalQuestions: number;
  userScore: number;
}

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
        where: {
          userId: user.id,
          completed: true
        },
        select: {
          score: true,
          totalQuestions: true,
          quizId: true,
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
        where: { completed: true },
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

    const completedQuizzes = userQuizAttempts.reduce<Record<string, CompletedQuiz>>((acc, attempt) => {
      if (!acc[attempt.quizId]) {
        acc[attempt.quizId] = {
          id: attempt.quiz.id,
          title: attempt.quiz.title,
          totalQuestions: attempt.quiz.questions.length,
          userScore: attempt.score,
        };
      }
      return acc;
    }, {});

    const doneQuizzes = Object.keys(completedQuizzes).length;
    const totalPoints = Object.values(completedQuizzes).reduce((sum, quiz) => sum + quiz.userScore, 0);

    return NextResponse.json({
      totalLearnings,
      totalQuizzes,
      doneQuizzes,
      totalPoints,
      userQuizzes: Object.values(completedQuizzes),
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
