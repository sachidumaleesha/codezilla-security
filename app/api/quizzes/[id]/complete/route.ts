import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

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

    // Check if the user has already attempted this quiz
    const existingAttempt = await db.quizAttempt.findFirst({
      where: {
        userId: user.id,
        quizId: params.id,
      },
    })

    let quizAttempt

    if (existingAttempt) {
      // Update the existing attempt
      quizAttempt = await db.quizAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          score,
          totalQuestions,
          completed: passed,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create a new attempt if it's the user's first time
      quizAttempt = await db.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: params.id,
          score,
          totalQuestions,
          completed: passed,
        },
      })
    }

    return NextResponse.json({ message: 'Quiz completion recorded', quizAttempt })
  } catch (error) {
    console.error('Error recording quiz completion:', error)
    return NextResponse.json({ error: 'Failed to record quiz completion' }, { status: 500 })
  }
}