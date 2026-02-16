import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, isRequired, id, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-text-primary"
          >
            {label}
            {isRequired && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            w-full rounded-lg border bg-bg-surface px-4 py-3 text-sm text-text-primary
            placeholder:text-text-disabled resize-none
            transition-all duration-200
            focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-subtle
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-border-default hover:border-border-strong'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

