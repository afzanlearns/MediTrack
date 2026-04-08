import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const DoseNoteModal = ({ isOpen, onClose, onConfirm, dose }) => {
  const [note, setNote] = useState('');

  // Reset note when modal opens for a new dose
  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(dose, 'TAKEN', note || null);
    onClose();
  };

  const handleSkip = () => {
    onConfirm(dose, 'SKIPPED', note || null);
    onClose();
  };

  if (!dose) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Take Medication" size="sm">
      <div className="flex flex-col gap-5 text-[#F0F4F8]">
        <div>
          <p className="font-sans text-sm text-[#8A9BAE] mb-1">Medication</p>
          <p className="font-sans text-lg font-semibold tracking-tight">{dose.medication}</p>
          <p className="font-mono text-xs text-[#00C896] mt-1">{dose.dosageLabel} • {dose.timeLabel}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D5166] uppercase tracking-wider mb-2">
            Notes (Optional)
          </label>
          <textarea
            className="w-full bg-[#0E1318] border border-[#1C2530] rounded-xl px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#3D5166] focus:outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] resize-none"
            rows="3"
            placeholder="Feeling okay? Taken with food?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C2530]">
          <button 
            onClick={handleSkip}
            className="font-sans text-[11px] font-bold text-[#3D5166] bg-[#141B23] px-4 py-2.5 rounded-lg press"
          >
            Skip
          </button>
          <button 
            onClick={handleConfirm}
            className="font-sans text-[11px] font-bold text-[#00C896] bg-[#00C89615] px-4 py-2.5 rounded-lg press border border-[#00C89630]"
          >
            Confirm Details
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DoseNoteModal;
