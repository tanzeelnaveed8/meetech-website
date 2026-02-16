interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  progress,
  showLabel = true,
  height = 'md',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getProgressColor = () => {
    if (clampedProgress < 30) return 'bg-red-500';
    if (clampedProgress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full rounded-full overflow-hidden bg-bg-subtle border border-border-subtle ${heightClasses[height]}`}>
        <div
          className={`${getProgressColor()} ${heightClasses[height]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-muted mt-1">{clampedProgress}% complete</p>
      )}
    </div>
  );
}
