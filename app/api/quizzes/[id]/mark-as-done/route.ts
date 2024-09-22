// /api/quizzes/[id]/mark-as-done/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    const latestAttempt = await db.quizAttempt.findFirst({
      where: {
        userId: user.id,
        quizId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latestAttempt || !latestAttempt.completed) {
      return NextResponse.json({ error: 'Cannot mark incomplete quiz as done' }, { status: 400 })
    }

    await db.quizAttempt.update({
      where: { id: latestAttempt.id },
      data: { completed: true },
    })

    return NextResponse.json({ message: 'Quiz marked as done' })
  } catch (error) {
    console.error('Error marking quiz as done:', error)
    return NextResponse.json({ error: 'Failed to mark quiz as done' }, { status: 500 })
  }
}