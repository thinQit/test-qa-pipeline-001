import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200).transform((value) => value.trim()),
  description: z.string().max(1000).optional().nullable()
});

const listQuerySchema = z.object({
  completed: z.boolean().optional(),
  q: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const completedParam = searchParams.get('completed');
    const completed = completedParam === null ? undefined : completedParam === 'true';
    const q = searchParams.get('q') || undefined;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const parsed = listQuerySchema.safeParse({
      completed,
      q,
      limit: limitParam ? Number(limitParam) : undefined,
      offset: offsetParam ? Number(offsetParam) : undefined
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
    }

    const where: { completed?: boolean; title?: { contains: string; mode: 'insensitive' } } = {};
    if (parsed.data.completed !== undefined) {
      where.completed = parsed.data.completed;
    }
    if (parsed.data.q) {
      where.title = { contains: parsed.data.q, mode: 'insensitive' };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parsed.data.offset,
        take: parsed.data.limit
      }),
      prisma.task.count({ where })
    ]);

    return NextResponse.json({ success: true, data: { tasks, total } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid task data' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null
      }
    });

    return NextResponse.json({ success: true, data: { task } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}
