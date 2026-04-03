import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, MapPin, User, Search, FileText, ClipboardList, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import axios from 'axios';

const DoctorVisitsPage = ({ showToast }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    visitDate: format(new Date(), 'yyyy-MM-dd'),
    doctorName: '',
    summary: '',
    recommendations: '',
    location: ''
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/visits');
      setVisits(res.data || []);
    } catch (err) {
      showToast('Failed to load visits', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleLogVisit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/visits', formData);
      showToast('Visit record saved successfully');
      setFormData({
        title: '',
        visitDate: format(new Date(), 'yyyy-MM-dd'),
        doctorName: '',
        summary: '',
        recommendations: '',
        location: ''
      });
      fetchVisits();
    } catch (err) {
      showToast('Failed to save visit record', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/visits/${id}`);
      showToast('Visit record deleted');
      fetchVisits();
    } catch (err) {
      showToast('Failed to delete visit record', 'danger');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Visits" subtitle="Timeline of your past medical appointments and summaries" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Log Past Visit</h3>
          <form onSubmit={handleLogVisit} className="space-y-4">
            <Input 
              label="Visit Title" 
              placeholder="e.g. Regular Check-up" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Date" 
                type="date" 
                required
                value={formData.visitDate}
                onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
              />
              <Input 
                label="Doctor" 
                placeholder="Dr. Smith"
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
              />
            </div>
            <Input 
              label="Location" 
              icon={<MapPin className="w-4 h-4" />}
              placeholder="Medi-Clinic"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Summary</label>
              <textarea 
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                rows={3}
                placeholder="What happened during the visit?"
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary text-accent">Recommendations</label>
              <textarea 
                className="w-full border border-accent/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-accent/5"
                rows={2}
                placeholder="Doctor's advice..."
                value={formData.recommendations}
                onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full" icon={<Plus className="w-4 h-4" />}>
              Save Visit
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              Visit Timeline
            </h3>
            
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50">
              {visits.length === 0 && !loading && (
                <div className="ml-10 py-10 bg-background/30 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
                  <p className="text-text-secondary text-sm">Your visit timeline is empty. Start by logging a visit.</p>
                </div>
              )}

              {visits.map((visit) => (
                <div key={visit.id} className="relative ml-10 group bg-white border border-border rounded-xl p-5 hover:border-accent hover:shadow-md transition-all">
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white bg-accent flex items-center justify-center shadow-sm">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-text-primary text-base uppercase">{visit.title}</h4>
                    <span className="text-xs font-bold text-accent bg-accent/5 px-2 py-1 rounded-full">
                      {format(new Date(visit.visitDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary mb-3 pb-3 border-b border-border/10">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{visit.doctorName || 'Dr. Not specified'}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{visit.location || 'Anywhere'}</span>
                  </div>

                  {visit.summary && (
                    <div className="mb-3">
                      <p className="text-sm text-text-primary leading-relaxed">{visit.summary}</p>
                    </div>
                  )}

                  {visit.recommendations && (
                    <div className="bg-accent/5 border-l-4 border-l-accent p-3 rounded-r-lg">
                      <h5 className="text-[10px] font-bold text-accent uppercase mb-1 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Recommendations
                      </h5>
                      <p className="text-sm text-text-primary italic">"{visit.recommendations}"</p>
                    </div>
                  )}

                  <button 
                    onClick={() => handleDelete(visit.id)}
                    className="absolute bottom-4 right-4 p-1.5 text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVisitsPage;
