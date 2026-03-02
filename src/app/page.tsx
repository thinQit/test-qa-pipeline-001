'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { Task } from '@/types';
import { cn, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed;
      return matchesQuery && matchesFilter;
    });
  }, [tasks, query, filter]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return { completed, active: tasks.length - completed };
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await api.get<{ tasks: Task[]; total: number }>('/api/tasks');
    if (fetchError) {
      setError(fetchError);
      toast(fetchError, 'error');
    } else if (data) {
      setTasks(data.tasks);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const { error: createError } = await api.post('/api/tasks', {
      title: title.trim(),
      description: description.trim() ? description.trim() : null
    });
    if (createError) {
      toast(createError, 'error');
      return;
    }
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const handleToggle = async (task: Task) => {
    const { error: updateError } = await api.patch(`/api/tasks/${task.id}`, {
      completed: !task.completed
    });
    if (updateError) {
      toast(updateError, 'error');
      return;
    }
    fetchTasks();
  };

  const handleDelete = async (task: Task) => {
    const { error: deleteError } = await api.delete(`/api/tasks/${task.id}`);
    if (deleteError) {
      toast(deleteError, 'error');
      return;
    }
    fetchTasks();
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Task Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your tasks and stay on top of upcoming work.
          </p>
        </div>
        <Link href="/profile" className="text-sm font-medium text-primary">
          View profile
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Create a task</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Keep it short and actionable.</p>
          <Button onClick={handleCreate}>Add task</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Your tasks</h2>
            <div className="flex items-center gap-2">
              <Badge>Active: {stats.active}</Badge>
              <Badge>Completed: {stats.completed}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search tasks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'completed'] as const).map((value) => (
              <Button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  'px-3 py-1 text-sm',
                  filter === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {loading && <p className="text-sm text-muted-foreground">Loading tasks…</p>}
          {!loading && error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && !error && filteredTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">No tasks match the current filter.</p>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                </div>
                <Badge>{task.completed ? 'Completed' : 'Active'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={() => handleToggle(task)}>
                {task.completed ? 'Mark active' : 'Mark done'}
              </Button>
              <Button onClick={() => handleDelete(task)} className="bg-destructive text-white">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
