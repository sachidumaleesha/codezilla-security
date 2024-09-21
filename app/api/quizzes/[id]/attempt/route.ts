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

    const attempt = await db.quizAttempt.findFirst({
      where: {
        userId: user.id,
        quizId: params.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ attempt })
  } catch (error) {
    console.error('Error fetching quiz attempt:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz attempt' }, { status: 500 })
  }
}
