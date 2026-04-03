import React, { useEffect, useState } from 'react';
import { Plus, Search, Pill, Clock3, CalendarDays, Package, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import medicationApi from '../api/medicationApi';

const MedicationsPage = ({ showToast }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    timeOfDay: 'Morning',
    instructions: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const res = await medicationApi.getMedications();
      setMedications(Array.isArray(res) ? res : (res?.data || []));
    } catch {
      showToast('Failed to load medications', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicationApi.createMedication(formData);
      showToast('Medication added');
      setModalOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        timeOfDay: 'Morning',
        instructions: '',
        startDate: '',
        endDate: '',
      });
      fetchMedications();
    } catch {
      showToast('Failed to add medication', 'danger');
    }
  };

  const filtered = medications.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.dosage?.toLowerCase().includes(term) ||
      m.frequency?.toLowerCase().includes(term)
    );
  });

  const getStatus = (item) => {
    if (!item.endDate) return { label: 'Active', variant: 'success' };
    const ended = new Date(item.endDate) < new Date();
    return ended ? { label: 'Completed', variant: 'default' } : { label: 'Active', variant: 'success' };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medications"
        subtitle="Track active prescriptions and dosage schedules"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="w-full md:max-w-md">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Search medication, dosage, or frequency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Badge variant="secondary">Total medications: {filtered.length}</Badge>
        </div>
      </Card>

      {filtered.length === 0 && !loading ? (
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 border-b md:border-b-0 md:border-r border-border bg-page-bg/45">
              <svg viewBox="0 0 240 180" className="w-full h-44" aria-hidden="true">
                <rect x="40" y="35" width="160" height="110" rx="14" fill="#ECF3ED" />
                <rect x="60" y="55" width="120" height="18" rx="6" fill="#D6EAD6" />
                <rect x="60" y="83" width="88" height="14" rx="5" fill="#FFFFFF" />
                <rect x="60" y="105" width="104" height="14" rx="5" fill="#FFFFFF" />
                <rect x="172" y="82" width="20" height="38" rx="6" fill="#7FBF7F" />
                <rect x="180" y="70" width="4" height="62" rx="2" fill="#7FBF7F" />
              </svg>
            </div>
            <div className="p-8">
              <EmptyState
                icon={Pill}
                title="No medications yet"
                description="Add your first medication to start a clean daily treatment plan."
                action={<Button onClick={() => setModalOpen(true)}>Add medication</Button>}
              />
            </div>
          </div>
        </Card>
      ) : (
        <Table
          loading={loading}
          data={filtered}
          columns={[
            {
              key: 'name',
              label: 'Medication',
              render: (m) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-light border border-accent/35 flex items-center justify-center">
                    <Pill className="w-4 h-4 text-[#4B7A4B]" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{m.name}</p>
                    <p className="text-xs text-text-secondary">{m.dosage}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'schedule',
              label: 'Schedule',
              render: (m) => (
                <div className="space-y-1">
                  <p className="text-sm text-text-primary flex items-center gap-1.5"><Clock3 className="w-4 h-4 text-text-secondary" />{m.frequency}</p>
                  <p className="text-xs text-text-secondary">{m.timeOfDay}</p>
                </div>
              ),
            },
            {
              key: 'dates',
              label: 'Course',
              render: (m) => (
                <div className="space-y-1 text-xs text-text-secondary">
                  <p className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />Start: {m.startDate || 'Not set'}</p>
                  <p>End: {m.endDate || 'Ongoing'}</p>
                </div>
              ),
            },
            {
              key: 'instructions',
              label: 'Instructions',
              render: (m) => <p className="text-sm text-text-secondary max-w-xs truncate">{m.instructions || 'No special instruction'}</p>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (m) => {
                const status = getStatus(m);
                return <Badge variant={status.variant}>{status.label}</Badge>;
              },
            },
          ]}
          emptyMessage="No medications found"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Medication">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Medication"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              icon={<Package className="w-4 h-4" />}
            />
            <Input
              label="Dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Frequency</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>Every 4-6 hours</option>
                <option>As needed (PRN)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Time of day</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white"
                value={formData.timeOfDay}
                onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
              >
                <option>Morning</option>
                <option>Noon</option>
                <option>Evening</option>
                <option>Night</option>
                <option>Anytime</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-primary">Instructions</label>
            <textarea
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white min-h-[90px]"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Take after food, avoid caffeine, etc."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" icon={<FileText className="w-4 h-4" />}>Save medication</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicationsPage;
