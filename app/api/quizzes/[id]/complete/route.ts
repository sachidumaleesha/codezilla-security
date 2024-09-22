import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { score, totalQuestions, passed, attemptNumber } = await request.json()

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create a new attempt
    const quizAttempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: params.id,
        score,
        totalQuestions,
        completed: passed,
        attemptNumber,
      },
    })

    return NextResponse.json({ message: 'Quiz completion recorded', quizAttempt })
  } catch (error) {
    console.error('Error recording quiz completion:', error)
    return NextResponse.json({ error: 'Failed to record quiz completion' }, { status: 500 })
  }
}
