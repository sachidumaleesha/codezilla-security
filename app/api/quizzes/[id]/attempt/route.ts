// /api/quizzes/[id]/attempt/route.ts
// import { NextResponse } from 'next/server'
// import { db } from '@/lib/db'
// import { auth } from '@clerk/nextjs/server'

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const { userId } = auth()
//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const attempt = await db.quizAttempt.findFirst({
//       where: {
//         userId: user.id,
//         quizId: params.id,
//       },
//       orderBy: {
//         attemptNumber: 'desc',
//       },
//     })

//     return NextResponse.json({ attempt })
//   } catch (error) {
//     console.error('Error fetching quiz attempt:', error)
//     return NextResponse.json({ error: 'Failed to fetch quiz attempt' }, { status: 500 })
//   }
// }

// export async function POST(request: Request, { params }: { params: { id: string } }) {
//   const { userId } = auth()
//   if (!userId) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const { score, totalQuestions, passed } = await request.json()

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     // Find the existing attempt or create a new one
//     let quizAttempt = await db.quizAttempt.findFirst({
//       where: {
//         userId: user.id,
//         quizId: params.id,
//       },
//       orderBy: {
//         attemptNumber: 'desc',
//       },
//     })

//     if (quizAttempt) {
//       // Update the existing attempt
//       quizAttempt = await db.quizAttempt.update({
//         where: { id: quizAttempt.id },
//         data: {
//           score,
//           totalQuestions,
//           completed: passed,
//           attemptNumber: quizAttempt.attemptNumber + 1,
//         },
//       })
//     } else {
//       // Create a new attempt
//       quizAttempt = await db.quizAttempt.create({
//         data: {
//           userId: user.id,
//           quizId: params.id,
//           score,
//           totalQuestions,
//           completed: passed,
//           attemptNumber: 1,
//         },
//       })
//     }

//     return NextResponse.json({ message: 'Quiz completion recorded', quizAttempt })
//   } catch (error) {
//     console.error('Error recording quiz completion:', error)
//     return NextResponse.json({ error: 'Failed to record quiz completion' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const attempts = await db.quizAttempt.findMany({
      where: {
        userId: user.id,
        quizId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const latestAttempt = attempts[0]
    const attemptsLeft = Math.max(0, 2 - attempts.length)

    return NextResponse.json({ latestAttempt, attemptsLeft })
  } catch (error) {
    console.error('Error fetching quiz attempt:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz attempt' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { score, totalQuestions, passed } = await request.json()

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const attempts = await db.quizAttempt.findMany({
      where: {
        userId: user.id,
        quizId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (attempts.length >= 2) {
      return NextResponse.json({ error: 'Maximum attempts reached' }, { status: 403 })
    }

    const newAttemptNumber = attempts.length + 1

    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: params.id,
        score,
        totalQuestions,
        completed: passed,
        attemptNumber: newAttemptNumber,
      },
    })

    const attemptsLeft = Math.max(0, 2 - newAttemptNumber)

    return NextResponse.json({ message: 'Quiz completion recorded', quizAttempt, attemptsLeft })
  } catch (error) {
    console.error('Error recording quiz completion:', error)
    return NextResponse.json({ error: 'Failed to record quiz completion' }, { status: 500 })
  }
}