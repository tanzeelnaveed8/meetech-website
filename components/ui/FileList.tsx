import { FiFile, FiDownload, FiTrash2 } from 'react-icons/fi'
import { format } from 'date-fns'

interface FileItem {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  category: string
  createdAt: Date | string
  uploadedBy?: {
    name: string
  }
}

interface FileListProps {
  files: FileItem[]
  onDownload: (fileId: string) => void
  onDelete?: (fileId: string) => void
  showDelete?: boolean
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  showDelete = false
}: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    return <FiFile className="w-5 h-5 text-gray-400" />
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <FiFile className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(file.fileType)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.fileName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                <span>{formatFileSize(file.fileSize)}</span>
                <span>•</span>
                <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
                {file.uploadedBy && (
                  <>
                    <span>•</span>
                    <span>{file.uploadedBy.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onDownload(file.id)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Download file"
            >
              <FiDownload className="w-4 h-4" />
            </button>
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(file.id)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="Delete file"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
