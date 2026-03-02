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
    const optimistic: Task = {
      id: `temp-${Date.now()}`,
      title,
      description: null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: null
    };
    setTasks((prev) => [optimistic, ...prev]);
    setTitle('');
    const { data, error: createError } = await api.post<{ task: Task }>('/api/tasks', { title });
    if (createError || !data) {
      toast(createError || 'Failed to create task', 'error');
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? data.task : t)));
  };

  const toggleComplete = async (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
    const { data, error: toggleError } = await api.patch<{ task: Task }>(`/api/tasks/${task.id}/complete`, {
      completed: !task.completed
    });
    if (toggleError || !data) {
      toast(toggleError || 'Failed to update task', 'error');
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === task.id ? data.task : t)));
  };

  const handleDelete = async (task: Task) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    const { error: deleteError } = await api.delete<{ success: boolean }>(`/api/tasks/${task.id}`);
    if (deleteError) {
      toast(deleteError, 'error');
      setTasks(previous);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Task Dashboard</h1>
          <p className="text-sm text-secondary">Track your tasks and stay productive.</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-secondary">
            <span>Active: {stats.active}</span>
            <span>Completed: {stats.completed}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/tasks/new">
            <Button variant="secondary">Create Task</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Quick Create</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label="Task title"
              placeholder="Add a new task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreate} className="mt-1 md:mt-6">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Tasks</h2>
              <p className="text-sm text-secondary">{tasks.length} total</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Input
                placeholder="Search tasks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search tasks"
              />
              <div className="flex gap-2">
                {(['all', 'active', 'completed'] as const).map((value) => (
                  <Button
                    key={value}
                    variant={filter === value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-secondary">Loading tasks...</p>
          ) : error ? (
            <div className="space-y-3">
              <p className="text-sm text-error">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchTasks}>
                Try again
              </Button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <p className="text-sm text-secondary">No tasks found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                        onClick={() => toggleComplete(task)}
                        className={cn(
                          'h-5 w-5 rounded border border-border transition-colors',
                          task.completed ? 'bg-success' : 'bg-white'
                        )}
                      />
                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      <Badge variant={task.completed ? 'success' : 'secondary'}>
                        {task.completed ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary">
                      Created {task.createdAt ? formatDate(task.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tasks/${task.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(task)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-secondary">Tip: Use the filters to find tasks faster.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
