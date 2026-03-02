'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { Task } from '@/types';

export default function NewTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast('Title is required', 'warning');
      return;
    }
    setLoading(true);
    const { data, error } = await api.post<{ task: Task }>('/api/tasks', {
      title,
      description: description || undefined
    });
    setLoading(false);
    if (error || !data) {
      toast(error || 'Failed to create task', 'error');
      return;
    }
    toast('Task created', 'success');
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Create Task</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmit} loading={loading}>
                Create
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
