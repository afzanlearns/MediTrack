import React, { useEffect } from 'react';
import { X, Bell, CheckCircle, Clock } from 'lucide-react';
import { isPast } from 'date-fns';

const NotificationDrawer = ({ isOpen, onClose, pendingDoses, onTakeDose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#080B0F] animate-in slide-in-from-bottom duration-300">
      
      {/* Full Page Container */}
      <div className="relative w-full max-w-md h-full flex flex-col">
        {/* Header matching dashboard */}
        <div className="px-5 pt-14 pb-5 flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="font-sans text-2xl font-semibold text-[#F0F4F8]">Notifications</h1>
            <p className="font-sans text-sm text-[#3D5166] mt-0.5">Today's Schedule</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#0E1318] border border-[#1C2530] flex items-center justify-center text-[#8A9BAE] hover:text-[#F0F4F8] transition-colors press"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 custom-scrollbar">
          {pendingDoses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00C89610] flex items-center justify-center mb-2">
                <CheckCircle size={32} strokeWidth={1.5} className="text-[#00C896]" />
              </div>
              <div>
                <p className="font-sans text-lg font-semibold text-[#F0F4F8]">You're all caught up!</p>
                <p className="font-sans text-sm text-[#8A9BAE] mt-1 max-w-[250px]">
                  No pending or overdue medications for today. Enjoy your day!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#3D5166] mb-4 mt-2">
                Pending Actions ({pendingDoses.length})
              </p>
              {pendingDoses.map(dose => {
                const isOverdue = !isNaN(new Date(dose.scheduledAt).getTime()) && isPast(new Date(dose.scheduledAt));
                
                return (
                  <div key={dose.id} className="card p-4 bg-[#0E1318] border border-[#1C2530] flex flex-col gap-3 relative overflow-hidden">
                    {isOverdue && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#E8A838]" />
                    )}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={12} className={isOverdue ? "text-[#E8A838]" : "text-[#8A9BAE]"} />
                          <p className={`font-mono text-[11px] ${isOverdue ? "text-[#E8A838]" : "text-[#8A9BAE]"}`}>
                            {dose.timeLabel} {isOverdue ? '(Overdue)' : ''}
                          </p>
                        </div>
                        <p className="font-sans text-[15px] font-semibold text-[#F0F4F8] truncate tracking-tight">
                          {dose.medication}
                        </p>
                        <p className="font-sans text-xs text-[#3D5166]">{dose.dosageLabel}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onTakeDose(dose)}
                      className="w-full mt-1 font-sans text-xs font-bold text-[#00C896] bg-[#00C89610] hover:bg-[#00C89620] py-2.5 rounded-lg border border-[#00C89630] transition-colors"
                    >
                      Take Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
