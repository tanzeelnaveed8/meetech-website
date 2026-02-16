import { FiFile, FiDownload, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  createdAt: Date | string;
  uploadedBy?: {
    name: string;
  };
}

interface FileListProps {
  files: FileItem[];
  onDownload: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  showDelete?: boolean;
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  showDelete = false,
}: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-bg-subtle rounded-lg border border-border-default">
        <FiFile className="w-12 h-12 text-text-disabled mx-auto mb-3" />
        <p className="text-sm text-text-muted">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 bg-bg-surface border border-border-default rounded-lg hover:border-border-strong transition-colors duration-200"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FiFile className="w-5 h-5 text-text-disabled flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {file.fileName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-text-muted mt-0.5">
                <span>{formatFileSize(file.fileSize)}</span>
                <span className="text-text-disabled">•</span>
                <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
                {file.uploadedBy && (
                  <>
                    <span className="text-text-disabled">•</span>
                    <span>{file.uploadedBy.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onDownload(file.id)}
              className="p-2 text-text-muted hover:text-accent hover:bg-accent-muted rounded-md transition-colors duration-200"
              title="Download file"
            >
              <FiDownload className="w-4 h-4" />
            </button>
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors duration-200"
                title="Delete file"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
