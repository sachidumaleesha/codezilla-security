// app/api/learning/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const learning = await db.learning.findUnique({
      where: { id: params.id },
      include: {
        jobRoles: {
          include: {
            jobRole: true
          }
        },
        videoContent: true,
        textContent: true
      },
    });
    if (!learning) {
      return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
    }
    return NextResponse.json(learning);
  } catch (error) {
    console.error('Error fetching learning:', error);
    return NextResponse.json({ error: 'Failed to fetch learning' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, jobRoles, type, videoUrl, videoTitle, content } = await request.json();

    // First, fetch the current learning to check its type
    const currentLearning = await db.learning.findUnique({
      where: { id: params.id },
      include: { videoContent: true, textContent: true }
    });

    if (!currentLearning) {
      return NextResponse.json({ error: 'Learning not found' }, { status: 404 });
    }

    type UpdateData = {
      title: string;
      type: "VIDEO" | "TEXT";
      jobRoles: {
        deleteMany: Record<string, never>;
        create: Array<{ jobRole: { connect: { id: string } } }>;
      };
      videoContent?: {
        upsert: {
          create: { videoUrl: string; videoTitle?: string; content: string };
          update: { videoUrl: string; videoTitle?: string; content: string };
        };
      } | {
        delete: true;
      };
      textContent?: {
        upsert: {
          create: { content: string };
          update: { content: string };
        };
      } | {
        delete: true;
      };
    };

    // Prepare the update data
    const updateData: UpdateData = {
      title,
      type,
      jobRoles: {
        deleteMany: {},
        create: jobRoles.map((jobRoleId: string) => ({
          jobRole: { connect: { id: jobRoleId } }
        }))
      }
    };

    // Handle content update based on new type
    if (type === 'VIDEO') {
      updateData.videoContent = {
        upsert: {
          create: { videoUrl, videoTitle, content },
          update: { videoUrl, videoTitle, content },
        },
      };
      // Only delete textContent if it exists
      if (currentLearning.textContent) {
        updateData.textContent = { delete: true };
      }
    } else {
      updateData.textContent = {
        upsert: {
          create: { content },
          update: { content },
        },
      };
      // Only delete videoContent if it exists
      if (currentLearning.videoContent) {
        updateData.videoContent = { delete: true };
      }
    }

    const updatedLearning = await db.learning.update({
      where: { id: params.id },
      data: updateData,
      include: {
        jobRoles: {
          include: {
            jobRole: true
          }
        },
        videoContent: true,
        textContent: true
      },
    });

    return NextResponse.json(updatedLearning);
  } catch (error) {
    console.error('Error updating learning:', error);
    return NextResponse.json({ error: 'Failed to update learning' }, { status: 500 });
  }
}
