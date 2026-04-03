import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AppointmentWidget({ appointment }) {
  if (!appointment) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-3">📅</div>
        <h3 className="font-bold text-gray-900">No appointments</h3>
        <p className="text-gray-400 text-xs mt-1 mb-4">You have no upcoming medical visits.</p>
        <Link to="/appointments" className="text-blue-600 text-xs font-bold hover:underline">Schedule one →</Link>
      </div>
    );
  }

  const isUrgent = () => {
    const appDate = new Date(appointment.appointmentDate);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return isAfter(appDate, today) && isBefore(appDate, nextWeek);
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm border h-full transition-all ${
      isUrgent() ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-900">Next Appointment</h3>
        <Link to="/appointments" className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className={`p-3 rounded-xl flex flex-col items-center justify-center w-14 h-14 shrink-0 ${
          isUrgent() ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          <span className="text-[10px] font-bold uppercase leading-none">{format(new Date(appointment.appointmentDate), 'MMM')}</span>
          <span className="text-xl font-bold leading-none mt-1">{format(new Date(appointment.appointmentDate), 'dd')}</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{appointment.doctorName}</p>
          <p className="text-xs text-gray-500 truncate">{appointment.reason || 'Medical Checkup'}</p>
        </div>
      </div>
      
      {isUrgent() && (
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
          <span className="animate-ping w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Urgent: Next 7 Days
        </div>
      )}
    </div>
  );
}
