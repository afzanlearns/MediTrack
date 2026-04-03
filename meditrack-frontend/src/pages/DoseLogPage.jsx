import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Pill,
  History
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import axios from 'axios';

const DoseLogPage = ({ showToast }) => {
  const [doses, setDoses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoses();
  }, [selectedDate]);

  const fetchDoses = async () => {
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const res = await axios.get(`http://localhost:8080/api/doses?date=${formattedDate}`);
      setDoses(res.data || []);
    } catch (err) {
      showToast('Failed to load doses', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/api/doses/${id}/status`, { status });
      showToast(`Dose marked as ${status.toLowerCase()}`);
      fetchDoses();
    } catch (err) {
      showToast('Failed to update dose status', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/doses/${id}`);
      showToast('Log entry deleted');
      fetchDoses();
    } catch (err) {
      showToast('Failed to delete dose', 'danger');
    }
  };

  const changeDate = (days) => {
    setSelectedDate(prev => days > 0 ? addDays(prev, 1) : subDays(prev, 1));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dose Log" 
        subtitle="Manage and track your medication intake history"
        action={
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1.5 shadow-sm">
            <button 
              onClick={() => changeDate(-1)} 
              className="p-1 hover:bg-white rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2 px-2">
              <CalendarIcon className="w-3.5 h-3.5 text-accent" />
              <span className="text-sm font-bold text-text-primary min-w-[120px] text-center uppercase tracking-tight">
                {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
              </span>
            </div>
            <button 
              onClick={() => changeDate(1)} 
              className="p-1 hover:bg-white rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Scheduled for {format(selectedDate, 'EEEE')}
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" /> Pending
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" /> Taken
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-danger" /> Missed
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse bg-background/50 h-[180px] border-border/50" />
            ))
          ) : doses.length === 0 ? (
            <div className="col-span-full py-20 bg-background/50 border-2 border-dashed border-border rounded-2xl">
              <EmptyState 
                icon={History} 
                title="No doses logged" 
                description="Recording dose intake helps maintain adherence."
              />
            </div>
          ) : (
            doses.map((dose) => (
              <DoseCard 
                key={dose.id} 
                dose={dose} 
                onUpdate={handleUpdateStatus} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const DoseCard = ({ dose, onUpdate, onDelete }) => {
  const getStatusInfo = (status) => {
    switch(status) {
      case 'TAKEN': return { variant: 'success', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Taken' };
      case 'MISSED': return { variant: 'danger', icon: <XCircle className="w-4 h-4" />, label: 'Missed' };
      default: return { variant: 'warning', icon: <Clock className="w-4 h-4" />, label: 'Pending' };
    }
  };

  const statusInfo = getStatusInfo(dose.status);

  return (
    <Card className={`group relative overflow-hidden transition-all border-l-4 ${
      dose.status === 'TAKEN' ? 'border-l-success' : 
      dose.status === 'MISSED' ? 'border-l-danger' : 'border-l-warning'
    } ${dose.status === 'PENDING' ? 'hover:shadow-md hover:scale-[1.02]' : 'opacity-80'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              dose.status === 'TAKEN' ? 'bg-success/10 text-success' : 
              dose.status === 'MISSED' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
            }`}>
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary uppercase tracking-tight">{dose.medicationName}</h4>
              <p className="font-medium text-xs text-text-secondary">{dose.timeOfDay} • {dose.dosage}</p>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1 text-[10px] uppercase font-bold">
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>

        {dose.status === 'PENDING' ? (
          <div className="mt-auto pt-4 border-t border-border/10 flex gap-2">
            <Button 
              className="flex-1 text-xs font-bold" 
              size="sm" 
              onClick={() => onUpdate(dose.id, 'TAKEN')}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              TAKE
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-xs font-bold text-danger border-danger/20 hover:bg-danger/5" 
              size="sm" 
              onClick={() => onUpdate(dose.id, 'MISSED')}
              icon={<XCircle className="w-3.5 h-3.5" />}
            >
              MISS
            </Button>
          </div>
        ) : (
          <div className="mt-auto pt-2 flex justify-between items-center bg-background p-2 rounded-lg">
             <span className="text-[10px] italic text-text-secondary">Logged at {format(new Date(), 'HH:mm')}</span>
             <button 
               onClick={() => onDelete(dose.id)} 
               className="p-1 px-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-md transition-all text-xs font-bold"
             >
               DELETE
             </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DoseLogPage;
