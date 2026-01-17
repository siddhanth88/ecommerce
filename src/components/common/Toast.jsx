import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * @param {Object} props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type: 'success', 'error', 'info'
 * @param {Function} props.onClose - Close handler
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 3000)
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`fixed top-20 right-4 z-50 animate-slide-in-right`}>
      <div className={`flex items-center gap-3 ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors ${config.textColor}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toasts
 */
export const ToastContainer = ({ toast }) => {
  if (!toast) return null;

  return <Toast {...toast} />;
};

export default Toast;
