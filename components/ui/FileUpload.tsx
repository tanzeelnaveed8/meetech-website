"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

export function FileUpload({ onFileChange, error }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "File type not supported. Allowed types: PDF, DOC, DOCX, TXT";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileName(null);
      setFileError(null);
      onFileChange(null);
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setFileError(validationError);
      setFileName(null);
      onFileChange(null);
      return;
    }

    setFileError(null);
    setFileName(file.name);
    onFileChange(file);
  };

  const handleRemove = () => {
    setFileName(null);
    setFileError(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const displayError = error || fileError;

  return (
    <div className="space-y-2">
      <label
        htmlFor="file-upload"
        className="block text-sm font-medium text-text-primary"
      >
        Attach Document (Optional)
      </label>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            onChange={handleFileChange}
            className="sr-only"
            aria-describedby={displayError ? "file-upload-error" : undefined}
            aria-invalid={!!displayError}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg border-2 border-border-default bg-bg-surface px-6 py-3 text-base font-medium text-text-body transition-colors hover:border-accent hover:bg-bg-card focus-within:outline-none focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            Choose File
          </label>
        </div>

        {fileName && (
          <div className="flex items-center justify-between rounded-lg border border-border-default bg-bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm text-text-body">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded p-1 text-text-muted transition-colors hover:bg-bg-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label="Remove file"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {displayError && (
          <p id="file-upload-error" className="text-sm text-red-600" role="alert">
            {displayError}
          </p>
        )}

        <p className="text-xs text-text-muted">
          Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
        </p>
      </div>
    </div>
  );
}
