import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contentType = searchParams.get('contentType')
  const search = searchParams.get('search')

  try {
    const learnings = await db.learning.findMany({
      where: {
        AND: [
          contentType && contentType !== 'ALL' ? { type: contentType as 'VIDEO' | 'TEXT' } : {},
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  {
                    jobRoles: {
                      some: {
                        jobRole: {
                          name: { contains: search, mode: 'insensitive' },
                        },
                      },
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
        type: true,
        jobRoles: {
          select: {
            jobRole: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(learnings)
  } catch (error) {
    console.error('Error fetching learnings:', error)
    return NextResponse.json({ error: 'Failed to fetch learnings' }, { status: 500 })
  }
}
