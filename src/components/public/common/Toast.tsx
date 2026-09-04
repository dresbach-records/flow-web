import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  message,
  onClose,
}) => {
  return (
    <div id={id} className={`flow-toast flow-toast--${type}`} role="status">
      <div className="flow-toast__icon">
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        {type === 'info' && <Info size={18} />}
      </div>
      <span className="flow-toast__message">{message}</span>
      <button className="flow-toast__close" onClick={onClose} aria-label="Fechar notificação">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
