// app/api/quiz/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const quizzes = await db.quiz.findMany({
      include: {
        jobRole: true,
        questions: true,
      },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: `Failed to fetch quizzes: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const quiz = await db.quiz.create({
      data: {
        title,
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: `Failed to create quiz: ${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, visibility } = await request.json();
    const quiz = await db.quiz.update({
      where: { id },
      data: { visibility },
      include: {
        jobRole: true,
        questions: true,
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: `Failed to update quiz: ${error}` }, { status: 500 });
  }
}

// export async function DELETE(request: Request) {
//   try {
//     const { id } = await request.json();
//     await db.$transaction(async (prisma) => {
//       // Delete all answers related to the quiz's questions
//       await prisma.answer.deleteMany({
//         where: {
//           question: {
//             quizId: id
//           }
//         }
//       });

//       // Delete all questions related to the quiz
//       await prisma.question.deleteMany({
//         where: {
//           quizId: id
//         }
//       });

//       // Delete the quiz
//       await prisma.quiz.delete({
//         where: { id },
//       });
//     });
//     return NextResponse.json({ message: "Quiz deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting quiz:", error);
//     return NextResponse.json({ error: `Failed to delete quiz: ${error}` }, { status: 500 });
//   }
// }

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.$transaction(async (prisma) => {
      // Delete all QuizAttempt records associated with this quiz
      await prisma.quizAttempt.deleteMany({
        where: {
          quizId: id
        }
      });

      // Delete all answers related to the quiz's questions
      await prisma.answer.deleteMany({
        where: {
          question: {
            quizId: id
          }
        }
      });

      // Delete all questions related to the quiz
      await prisma.question.deleteMany({
        where: {
          quizId: id
        }
      });

      // Delete the quiz
      await prisma.quiz.delete({
        where: { id },
      });
    });
    return NextResponse.json({ message: "Quiz and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: `Failed to delete quiz: ${error}` }, { status: 500 });
  }
}
