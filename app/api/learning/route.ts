// app/api/learning/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const learnings = await db.learning.findMany({
      include: {
        jobRoles: {
          include: {
            jobRole: true,
          },
        },
      },
    });
    return NextResponse.json(learnings);
  } catch (error) {
    console.error("Error fetching learnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch learnings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, type } = await request.json();
    const learning = await db.learning.create({
      data: { title, type },
    });
    return NextResponse.json(learning);
  } catch (error) {
    console.error("Error creating learning:", error);
    return NextResponse.json(
      { error: "Failed to create learning" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, visibility } = await request.json();
    const updatedLearning = await db.learning.update({
      where: { id },
      data: { visibility },
    });
    return NextResponse.json(updatedLearning);
  } catch (error) {
    console.error("Error updating learning:", error);
    return NextResponse.json(
      { error: "Failed to update learning" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Use a transaction to ensure all operations succeed or fail together
    await db.$transaction(async (prisma) => {
      // Delete all associated LearningToJobRole records
      await prisma.learningToJobRole.deleteMany({
        where: { learningId: id },
      });

      // Delete associated VideoContent if it exists
      await prisma.videoContent.deleteMany({
        where: { learningId: id },
      });

      // Delete associated TextContent if it exists
      await prisma.textContent.deleteMany({
        where: { learningId: id },
      });

      // Finally, delete the Learning record
      await prisma.learning.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning:", error);
    return NextResponse.json(
      { error: "Failed to delete learning" },
      { status: 500 }
    );
  }
}
