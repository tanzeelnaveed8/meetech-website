'use client';

import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface ChangeRequestFormProps {
  projectId: string;
  onSuccess: () => void;
}

export default function ChangeRequestForm({ projectId, onSuccess }: ChangeRequestFormProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/change-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess('Change request submitted successfully');
        setTitle('');
        setMessage('');
        onSuccess();
      } else {
        toastError(data.error || 'Failed to submit change request');
      }
    } catch {
      toastError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Submit Change Request
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="change-title"
          label="Title"
          isRequired
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of the change"
          disabled={isLoading}
        />

        <Textarea
          id="change-message"
          label="Message"
          isRequired
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Detailed description of what you'd like to change..."
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          leftIcon={<FiSend className="w-4 h-4" />}
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Card>
  );
}
