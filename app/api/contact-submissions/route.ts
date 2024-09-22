// app/api/contact-submissions/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const contactSubmissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contactSubmissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching contact submissions' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json();
    await db.contactSubmission.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while deleting the contact submission' }, { status: 500 });
  }
}