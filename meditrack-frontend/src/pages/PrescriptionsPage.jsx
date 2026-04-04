import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Download, Trash2, UploadCloud, User, CalendarDays } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import {
  getPrescriptions,
  uploadPrescription,
  downloadPrescription,
  deletePrescription,
} from '../api/prescriptionApi';

const PrescriptionsPage = ({ showToast }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
      showToast('Failed to load prescriptions', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      showToast('Please select a file to upload', 'warning');
      return;
    }

    const data = new FormData();
    data.append('prescribedDate', formData.prescribedDate);
    data.append('doctorName', formData.doctorName);
    data.append('notes', formData.notes);
    data.append('file', formData.file);

    try {
      await uploadPrescription(data);
      showToast('Prescription uploaded');
      setFormData({
        prescribedDate: format(new Date(), 'yyyy-MM-dd'),
        doctorName: '',
        notes: '',
        file: null,
      });
      fetchPrescriptions();
    } catch {
      showToast('Failed to upload prescription', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrescription(id);
      showToast('Prescription removed');
      fetchPrescriptions();
    } catch {
      showToast('Failed to delete prescription', 'danger');
    }
  };

  const handleDownload = async (id) => {
    try {
      const blobUrl = await downloadPrescription(id);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      showToast('Failed to download prescription', 'danger');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" subtitle="Store and review prescription files from your doctors" />

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-4 p-5">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <Input
              label="Doctor"
              icon={<User className="w-4 h-4" />}
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={formData.prescribedDate}
              onChange={(e) => setFormData({ ...formData, prescribedDate: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Notes</label>
              <textarea
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-bg-surface min-h-[90px]"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">File</label>
              <label className="block border border-dashed border-border rounded-lg p-5 bg-page-bg/45 text-center cursor-pointer hover:bg-page-bg transition-colors">
                <input
                  type="file"
                  className="hidden"
                  required
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
                <UploadCloud className="w-6 h-6 mx-auto text-text-secondary" />
                <p className="text-sm text-text-primary mt-2">{formData.file ? formData.file.name : 'Select file to upload'}</p>
                <p className="text-xs text-text-secondary mt-1">PDF, JPG, or PNG</p>
              </label>
            </div>

            <Button type="submit" className="w-full">Upload prescription</Button>
          </form>
        </Card>

        <div className="xl:col-span-8">
          {prescriptions.length === 0 && !loading ? (
            <Card className="p-10">
              <EmptyState icon={FileText} title="No prescriptions uploaded" description="Add your first prescription to keep records safe and searchable." />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-lg bg-accent-light border border-accent/35 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#4B7A4B]" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="w-8 h-8 rounded-md border border-border bg-bg-surface text-text-secondary hover:text-text-primary"
                      >
                        <Download className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="w-8 h-8 rounded-md border border-border bg-bg-surface text-text-secondary hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-text-primary truncate">{doc.originalName || doc.fileName}</h3>
                  <div className="mt-3 space-y-1 text-sm text-text-secondary">
                    <p className="flex items-center gap-2"><User className="w-4 h-4" />{doc.doctorName || 'Doctor not set'}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />{format(new Date(doc.prescribedDate), 'MMM d, yyyy')}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PrescriptionsPage;
