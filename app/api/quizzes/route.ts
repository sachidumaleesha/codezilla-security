import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')

  try {
    const quizzes = await db.quiz.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  {
                    jobRole: {
                      name: { contains: search, mode: 'insensitive' },
                    },
                  },
                ],
              }
            : {},
          { visibility: 'PUBLIC' },
        ],
      },
      select: {
        id: true,
        title: true,
        jobRole: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}
