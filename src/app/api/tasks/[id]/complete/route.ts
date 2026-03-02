import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const completeSchema = z.object({
  completed: z.boolean()
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = completeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid completion data' }, { status: 400 });
    }

    const existing = await prisma.task.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: { completed: parsed.data.completed }
    });

    return NextResponse.json({ success: true, data: { task } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}
