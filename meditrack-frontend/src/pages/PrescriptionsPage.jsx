import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Download, Trash2, UploadCloud, User, Calendar, Save, FileBox, Activity } from 'lucide-react';
import {
  getPrescriptions,
  uploadPrescription,
  downloadPrescription,
  deletePrescription,
} from '../api/prescriptionApi';
import { toast } from '../utils/toast';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    prescribedDate: format(new Date(), 'yyyy-MM-dd'),
    doctorName: '',
    notes: '',
    file: null,
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await getPrescriptions();
      setPrescriptions(res.data || []);
    } catch (err) {
      toast.error('Unable to synchronize prescription repository');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.info('Attach physical document or scan');
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append('prescribedDate', formData.prescribedDate);
    data.append('doctorName', formData.doctorName);
    data.append('notes', formData.notes);
    data.append('file', formData.file);

    try {
      await uploadPrescription(data);
      toast.success('Document committed to secure storage');
      setFormData({
        prescribedDate: format(new Date(), 'yyyy-MM-dd'),
        doctorName: '',
        notes: '',
        file: null,
      });
      fetchPrescriptions();
    } catch (err) {
      toast.error('Failed to upload document source');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrescription(id);
      toast.success('Document purged from repository');
      fetchPrescriptions();
    } catch (err) {
      toast.error('Purge operation failed');
    }
  };

  const handleDownload = async (id) => {
    try {
      const blobUrl = await downloadPrescription(id);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      toast.success('Source document retrieved');
    } catch (err) {
      toast.error('Retrieval operation failed');
    }
  };

  return (
    <div className="pb-16 max-w-6xl mx-auto px-5">
      {/* Header */}
      <div className="pt-14 pb-12">
        <h1 className="font-sans text-3xl font-semibold text-[#F0F4F8]">Prescriptions</h1>
        <p className="font-mono text-xs text-[#3D5166] mt-2 italic">Secure repository for medical documentation</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Upload Column */}
        <div className="xl:col-span-4 space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Initialize Document</p>
          <div className="card p-6">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Practitioner</label>
                <input 
                  type="text"
                  value={formData.doctorName}
                  onChange={e => setFormData({...formData, doctorName: e.target.value})}
                  className="w-full bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  placeholder="Dr. Identifier"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Issuance Date</label>
                <input 
                  type="date"
                  value={formData.prescribedDate}
                  onChange={e => setFormData({...formData, prescribedDate: e.target.value})}
                  className="w-full bg-transparent font-sans text-sm text-[#F0F4F8] outline-none border-b border-[#1C2530] pb-2 focus:border-[#00C896] transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Clinical Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-[#0E151C] border border-[#1C2530] rounded-lg p-3 font-sans text-sm text-[#F0F4F8] outline-none min-h-[80px] resize-none focus:border-[#00C89640]"
                  placeholder="Brief description of the prescription..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#3D5166]">Document Source</label>
                <label className="block border border-dashed border-[#1C2530] rounded-lg p-6 bg-[#0E151C] text-center cursor-pointer hover:border-[#00C89640] transition-colors group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud size={20} className="text-[#3D5166] group-hover:text-[#00C896]" />
                    <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-widest group-hover:text-[#F0F4F8]">
                      {formData.file ? formData.file.name : 'Select PDF/IMG Source'}
                    </p>
                  </div>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0A0E13] bg-[#00C896] rounded-lg press"
              >
                <Save size={14} />
                {saving ? 'Synchronizing...' : 'Commit Document'}
              </button>
            </form>
          </div>
        </div>

        {/* Repository Grid */}
        <div className="xl:col-span-8 space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3D5166]">Secure Records</p>
          
          {loading ? (
             <div className="flex justify-center py-20">
                <p className="font-mono text-[10px] text-[#3D5166] animate-pulse uppercase tracking-widest">Accessing repository...</p>
             </div>
          ) : prescriptions.length === 0 ? (
            <div className="card py-24 text-center border-dashed border-[#1C2530]">
               <FileBox className="mx-auto text-[#1C2530] mb-4" size={32} strokeWidth={1} />
               <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-[0.2em]">Repository state: empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((doc) => (
                <div key={doc.id} className="card p-5 group flex flex-col justify-between min-h-[160px]">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded bg-[#00C89605] border border-[#00C89620] text-[#00C896]">
                        <FileText size={18} strokeWidth={1.5} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="p-2 text-[#3D5166] hover:text-[#00C896] transition-colors press"
                          title="Download Source"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-[#3D5166] hover:text-[#D95B5B] transition-colors press"
                          title="Purge Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-sans text-sm font-medium text-[#F0F4F8] leading-tight line-clamp-1 mb-2">
                      {doc.originalName || doc.fileName}
                    </h3>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-[#1C2530]">
                    <div className="flex items-center gap-2">
                       <User size={10} className="text-[#3D5166]" />
                       <span className="font-mono text-[9px] text-[#3D5166] uppercase tracking-widest">DR. {doc.doctorName || 'UNIDENTIFIED'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={10} className="text-[#3D5166]" />
                       <span className="font-mono text-[9px] text-[#3D5166] uppercase tracking-widest">{format(new Date(doc.prescribedDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

