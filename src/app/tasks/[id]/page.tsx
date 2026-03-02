'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { Task } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await api.get<{ task: Task }>(`/api/tasks/${id}`);
    if (fetchError || !data) {
      setError(fetchError || 'Task not found');
      setLoading(false);
      return;
    }
    setTask(data.task);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const handleSave = async () => {
    if (!task?.title.trim()) {
      toast('Title is required', 'warning');
      return;
    }
    setSaving(true);
    const { data, error: saveError } = await api.put<{ task: Task }>(`/api/tasks/${id}`, {
      title: task.title,
      description: task.description || undefined,
      completed: task.completed
    });
    setSaving(false);
    if (saveError || !data) {
      toast(saveError || 'Failed to update task', 'error');
      return;
    }
    toast('Task updated', 'success');
    setTask(data.task);
  };

  const handleToggle = async () => {
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    setTask(updated);
    const { data, error: toggleError } = await api.patch<{ task: Task }>(`/api/tasks/${id}/complete`, {
      completed: updated.completed
    });
    if (toggleError || !data) {
      toast(toggleError || 'Failed to update task', 'error');
      setTask(task);
      return;
    }
    setTask(data.task);
  };

  const handleDelete = async () => {
    const { error: deleteError } = await api.delete<{ success: boolean }>(`/api/tasks/${id}`);
    if (deleteError) {
      toast(deleteError, 'error');
      return;
    }
    toast('Task deleted', 'success');
    router.push('/');
  };

  if (loading) {
    return <div className="px-4 py-10 text-center text-secondary">Loading task...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <p className="text-sm text-error">{error}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={fetchTask}>
            Retry
          </Button>
          <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Task Details</h1>
            <Badge variant={task.completed ? 'success' : 'secondary'}>
              {task.completed ? 'Completed' : 'Active'}
            </Badge>
          </div>
          <div className="mt-2 text-xs text-secondary">
            <span>Created {task.createdAt ? formatDate(task.createdAt) : 'N/A'}</span>
            <span className="ml-3">Updated {task.updatedAt ? formatDate(task.updatedAt) : 'N/A'}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <Input
              label="Description"
              value={task.description || ''}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} loading={saving}>
                Save
              </Button>
              <Button variant="outline" onClick={handleToggle}>
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
