import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const learning = await db.learning.findUnique({
      where: { id: params.id },
      include: {
        videoContent: true,
        textContent: true,
      },
    })

    if (!learning) {
      return NextResponse.json({ error: 'Learning not found' }, { status: 404 })
    }

    return NextResponse.json(learning)
  } catch (error) {
    console.error('Error fetching learning:', error)
    return NextResponse.json({ error: 'Failed to fetch learning' }, { status: 500 })
  }
}
