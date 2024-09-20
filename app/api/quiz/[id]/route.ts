// app/api/quiz/[id]/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { Prisma } from "@prisma/client";

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const quiz = await db.quiz.findUnique({
//       where: { id: params.id },
//       include: {
//         jobRole: true,
//         questions: {
//           include: {
//             answers: true,
//           },
//         },
//       },
//     });
//     if (!quiz) {
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
//     }
//     return NextResponse.json(quiz);
//   } catch (error) {
//     console.error("Error fetching quiz:", error);
//     return NextResponse.json({ error: `Failed to fetch quiz: ${error}` }, { status: 500 });
//   }
// }

// const MAX_RETRIES = 3;

// async function updateQuizWithRetry(params: { id: string }, data: any, retryCount = 0): Promise<any> {
//   try {
//     const { title, jobRoleId, questions } = data;

//     const updatedQuiz = await db.$transaction(async (prisma) => {
//       // 1. Update the quiz title and job role
//       const quiz = await prisma.quiz.update({
//         where: { id: params.id },
//         data: {
//           title,
//           jobRole: jobRoleId ? { connect: { id: jobRoleId } } : { disconnect: true },
//         },
//       });

//       // 2. Delete all existing questions and answers
//       await prisma.answer.deleteMany({
//         where: {
//           question: {
//             quizId: params.id
//           }
//         }
//       });
//       await prisma.question.deleteMany({
//         where: {
//           quizId: params.id
//         }
//       });

//       // 3. Create new questions and answers
//       for (const question of questions) {
//         await prisma.question.create({
//           data: {
//             title: question.title,
//             quizId: params.id,
//             answers: {
//               create: question.answers.map((a: any) => ({
//                 text: a.text,
//                 isCorrect: a.isCorrect,
//               })),
//             },
//           },
//         });
//       }

//       // 4. Fetch and return the updated quiz with all relations
//       return prisma.quiz.findUnique({
//         where: { id: params.id },
//         include: {
//           jobRole: true,
//           questions: {
//             include: {
//               answers: true,
//             },
//           },
//         },
//       });
//     }, {
//       maxWait: 10000, // 10 seconds
//       timeout: 30000, // 30 seconds
//     });

//     return updatedQuiz;
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2028') {
//       if (retryCount < MAX_RETRIES) {
//         console.log(`Transaction timed out, retrying... (Attempt ${retryCount + 1})`);
//         // Wait for a short time before retrying (exponential backoff)
//         await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
//         return updateQuizWithRetry(params, data, retryCount + 1);
//       }
//     }
//     throw error;
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const data = await request.json();
//     const updatedQuiz = await updateQuizWithRetry(params, data);

//     if (!updatedQuiz) {
//       return NextResponse.json({ error: "Failed to update quiz" }, { status: 404 });
//     }

//     return NextResponse.json(updatedQuiz);
//   } catch (error) {
//     console.error("Error updating quiz:", error);
//     return NextResponse.json({ error: `Failed to update quiz: ${error}` }, { status: 500 });
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const { title, jobRoleId, questions } = await request.json();

//     const updatedQuiz = await db.$transaction(async (prisma) => {
//       // 1. Update the quiz title and job role
//       const quiz = await prisma.quiz.update({
//         where: { id: params.id },
//         data: {
//           title,
//           jobRole: jobRoleId ? { connect: { id: jobRoleId } } : { disconnect: true },
//         },
//       });

//       // 2. Delete all existing questions and answers
//       await prisma.answer.deleteMany({
//         where: {
//           question: {
//             quizId: params.id
//           }
//         }
//       });
//       await prisma.question.deleteMany({
//         where: {
//           quizId: params.id
//         }
//       });

//       // 3. Create new questions and answers
//       for (const question of questions) {
//         await prisma.question.create({
//           data: {
//             title: question.title,
//             quizId: params.id,
//             answers: {
//               create: question.answers.map((a: any) => ({
//                 text: a.text,
//                 isCorrect: a.isCorrect,
//               })),
//             },
//           },
//         });
//       }

//       // 4. Fetch and return the updated quiz with all relations
//       return prisma.quiz.findUnique({
//         where: { id: params.id },
//         include: {
//           jobRole: true,
//           questions: {
//             include: {
//               answers: true,
//             },
//           },
//         },
//       });
//     }, {
//       maxWait: 10000, // 10 seconds
//       timeout: 30000, // 30 seconds
//     });

//     if (!updatedQuiz) {
//       return NextResponse.json({ error: "Failed to update quiz" }, { status: 404 });
//     }

//     return NextResponse.json(updatedQuiz);
//   } catch (error) {
//     console.error("Error updating quiz:", error);
//     return NextResponse.json({ error: `Failed to update quiz: ${error}` }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
      include: {
        jobRole: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: `Failed to fetch quiz: ${error}` }, { status: 500 });
  }
}

const MAX_RETRIES = 3;

interface QuizData {
  title: string;
  jobRoleId: string | null;
  questions: {
    title: string;
    answers: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

async function updateQuizWithRetry(params: { id: string }, data: QuizData, retryCount = 0): Promise<Prisma.QuizGetPayload<{
  include: {
    jobRole: true;
    questions: {
      include: {
        answers: true;
      };
    };
  };
}> | null> {
  try {
    const { title, jobRoleId, questions } = data;

    const updatedQuiz = await db.$transaction(async (prisma) => {
      // 1. Update the quiz title and job role
      await prisma.quiz.update({
        where: { id: params.id },
        data: {
          title,
          jobRole: jobRoleId ? { connect: { id: jobRoleId } } : { disconnect: true },
        },
      });

      // 2. Delete all existing questions and answers
      await prisma.answer.deleteMany({
        where: {
          question: {
            quizId: params.id
          }
        }
      });
      await prisma.question.deleteMany({
        where: {
          quizId: params.id
        }
      });

      // 3. Create new questions and answers
      for (const question of questions) {
        await prisma.question.create({
          data: {
            title: question.title,
            quizId: params.id,
            answers: {
              create: question.answers.map((a) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          },
        });
      }

      // 4. Fetch and return the updated quiz with all relations
      return prisma.quiz.findUnique({
        where: { id: params.id },
        include: {
          jobRole: true,
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 30000, // 30 seconds
    });

    return updatedQuiz;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2028') {
      if (retryCount < MAX_RETRIES) {
        console.log(`Transaction timed out, retrying... (Attempt ${retryCount + 1})`);
        // Wait for a short time before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return updateQuizWithRetry(params, data, retryCount + 1);
      }
    }
    throw error;
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data: QuizData = await request.json();
    const updatedQuiz = await updateQuizWithRetry(params, data);

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Failed to update quiz" }, { status: 404 });
    }

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: `Failed to update quiz: ${error}` }, { status: 500 });
  }
}
