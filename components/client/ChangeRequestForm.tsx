'use client';

import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
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
  const [priority, setPriority] = useState('MEDIUM');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [complexity, setComplexity] = useState('LOW');

  const complexityMultiplier = complexity === 'HIGH' ? 1.8 : complexity === 'MEDIUM' ? 1.35 : 1;
  const estimatedCost = Math.round(estimatedHours * 35 * complexityMultiplier);
  const timelineDays = Math.max(1, Math.ceil((estimatedHours * complexityMultiplier) / 6));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/change-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, priority, estimatedHours, complexity }),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess('Change request submitted successfully');
        setTitle('');
        setMessage('');
        setPriority('MEDIUM');
        setEstimatedHours(8);
        setComplexity('LOW');
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="change-priority"
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ]}
            disabled={isLoading}
          />
          <Select
            id="change-complexity"
            label="Complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
            disabled={isLoading}
          />
        </div>

        <Input
          id="change-estimated-hours"
          label="Estimated Effort (hours)"
          type="number"
          min={1}
          max={500}
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(Number(e.target.value || 1))}
          disabled={isLoading}
        />

        <div className="rounded-lg border border-border-default bg-bg-subtle p-3 text-sm text-text-muted">
          <p className="font-medium text-text-primary mb-1">Impact Preview</p>
          <p>Estimated cost impact: <span className="font-semibold text-text-primary">${estimatedCost}</span></p>
          <p>Estimated timeline impact: <span className="font-semibold text-text-primary">+{timelineDays} day(s)</span></p>
        </div>

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
