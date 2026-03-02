import { z } from 'zod';

export const taskCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable()
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  completed: z.boolean().optional()
});

export const taskCompleteSchema = z.object({
  completed: z.boolean()
});

const listQuerySchema = z.object({
  completed: z.boolean().optional(),
  q: z.string().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0)
});

export function parseTaskListQuery(params: URLSearchParams) {
  const completedParam = params.get('completed');
  const completed = completedParam === null ? undefined : completedParam === 'true';
  const q = params.get('q') || undefined;
  const limit = params.get('limit') ? Number(params.get('limit')) : undefined;
  const offset = params.get('offset') ? Number(params.get('offset')) : undefined;

  const parsed = listQuerySchema.safeParse({ completed, q, limit, offset });
  if (!parsed.success) {
    return { completed: undefined, q: undefined, limit: 50, offset: 0 };
  }
  return parsed.data;
}
