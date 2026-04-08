import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Delete', 
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#D95B5B15] rounded-full text-[#D95B5B] border border-[#D95B5B30]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 mt-0.5">
            <h4 className="font-sans text-base font-semibold text-[#F0F4F8]">Are you sure?</h4>
            <p className="font-sans text-sm text-[#8A9BAE]">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 auto pt-4 border-t border-[#1C2530]">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="font-sans text-[12px] font-bold text-[#8A9BAE] hover:text-[#F0F4F8] bg-[#141B23] px-4 py-2.5 rounded-lg press transition-colors border border-[#1C2530]"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="font-sans text-[12px] font-bold text-[#D95B5B] bg-[#D95B5B10] border border-[#D95B5B30] hover:bg-[#D95B5B20] px-4 py-2.5 rounded-lg press transition-colors"
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
