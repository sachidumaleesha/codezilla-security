// app/api/job-roles/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const jobRoles = await db.jobRole.findMany();
    return NextResponse.json(jobRoles);
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return NextResponse.json({ error: 'Failed to fetch job roles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const jobRole = await db.jobRole.create({
      data: { name },
    });
    return NextResponse.json(jobRole);
  } catch (error) {
    console.error('Error creating job role:', error);
    return NextResponse.json({ error: 'Failed to create job role' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    const updatedJobRole = await db.jobRole.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedJobRole);
  } catch (error) {
    console.error('Error updating job role:', error);
    return NextResponse.json({ error: 'Failed to update job role' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.jobRole.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job role:', error);
    return NextResponse.json({ error: 'Failed to delete job role' }, { status: 500 });
  }
}