// app/api/quizzes/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        questions: {
          select: {
            id: true,
            title: true,
            answers: {
              select: {
                id: true,
                text: true,
                isCorrect: true,
              },
            },
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}