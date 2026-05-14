import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  status, 
  className = "", 
  showIcon = true 
}) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return { 
          bg: 'bg-green-50', 
          text: 'text-green-600', 
          border: 'border-green-200',
          icon: <CheckCircle2 size={14} />,
          label: 'Выполнено' 
        };
      case 'pending':
      case 'processing':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-600', 
          border: 'border-blue-200',
          icon: <Clock size={14} className="animate-pulse" />,
          label: 'В обработке' 
        };
      case 'failed':
      case 'error':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-600', 
          border: 'border-red-200',
          icon: <XCircle size={14} />,
          label: 'Ошибка' 
        };
      default:
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-600', 
          border: 'border-slate-200',
          icon: <AlertCircle size={14} />,
          label: status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : 'Неизвестно'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border} ${className}`}>
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
