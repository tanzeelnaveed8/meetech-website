interface StatusBadgeProps {
  status: string
  type?: 'project' | 'milestone' | 'changeRequest' | 'payment' | 'approval'
}

export default function StatusBadge({ status, type = 'project' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    const upperStatus = status.toUpperCase()

    // Project statuses
    if (type === 'project') {
      switch (upperStatus) {
        case 'PLANNING':
          return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'IN_PROGRESS':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'ON_HOLD':
          return 'bg-orange-100 text-orange-800 border-orange-200'
        case 'COMPLETED':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'CANCELLED':
          return 'bg-red-100 text-red-800 border-red-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    // Milestone statuses
    if (type === 'milestone') {
      switch (upperStatus) {
        case 'PENDING':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'IN_PROGRESS':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'COMPLETED':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'BLOCKED':
          return 'bg-red-100 text-red-800 border-red-200'
        case 'APPROVED':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'CHANGES_REQUESTED':
          return 'bg-orange-100 text-orange-800 border-orange-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    // Change request statuses
    if (type === 'changeRequest') {
      switch (upperStatus) {
        case 'PENDING':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'IN_REVIEW':
          return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'APPROVED':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'REJECTED':
          return 'bg-red-100 text-red-800 border-red-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    // Payment statuses
    if (type === 'payment') {
      switch (upperStatus) {
        case 'PENDING':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'PAID':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'OVERDUE':
          return 'bg-red-100 text-red-800 border-red-200'
        case 'CANCELLED':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'LOCKED':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    if (type === 'approval') {
      switch (upperStatus) {
        case 'PENDING':
          return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'APPROVED':
          return 'bg-green-100 text-green-800 border-green-200'
        case 'CHANGES_REQUESTED':
          return 'bg-orange-100 text-orange-800 border-orange-200'
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      {formatStatus(status)}
    </span>
  )
}
