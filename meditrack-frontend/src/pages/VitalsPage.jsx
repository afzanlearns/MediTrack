import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Activity, Droplets, HeartPulse, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import vitalsApi from '../api/vitalsApi';

const VitalsPage = ({ showToast }) => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    recordedDate: format(new Date(), 'yyyy-MM-dd'),
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    heartRate: '',
    notes: '',
  });

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const res = await vitalsApi.getVitals();
      const data = Array.isArray(res) ? res : (res?.data || []);
      setVitals(data);
    } catch {
      showToast('Failed to load vitals', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (e) => {
    e.preventDefault();
    try {
      await vitalsApi.logVitals(formData);
      showToast('Vitals recorded');
      setModalOpen(false);
      setFormData({
        recordedDate: format(new Date(), 'yyyy-MM-dd'),
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        heartRate: '',
        notes: '',
      });
      fetchVitals();
    } catch {
      showToast('Failed to record vitals', 'danger');
    }
  };

  const latest = vitals[0] || {};
  const metrics = [
    { label: 'Blood Pressure', value: latest.systolic && latest.diastolic ? `${latest.systolic}/${latest.diastolic}` : '--/--', unit: 'mmHg', icon: HeartPulse },
    { label: 'Blood Sugar', value: latest.bloodSugar || '--', unit: 'mg/dL', icon: Droplets },
    { label: 'Heart Rate', value: latest.heartRate || '--', unit: 'bpm', icon: Activity },
  ];

  const chartData = useMemo(
    () =>
      [...vitals]
        .reverse()
        .slice(-12)
        .map((v) => ({
          date: format(new Date(v.recordedDate || v.date), 'MMM d'),
          systolic: Number(v.systolic || 0),
          sugar: Number(v.bloodSugar || 0),
          heart: Number(v.heartRate || 0),
        })),
    [vitals]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vitals"
        subtitle="Monitor blood pressure, sugar, and heart rate trends"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Log Vitals
          </Button>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">{metric.label}</p>
              <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/35 flex items-center justify-center">
                <metric.icon className="w-4 h-4 text-[#4B7A4B]" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{metric.value}</p>
            <p className="text-xs text-text-secondary mt-1">{metric.unit}</p>
          </Card>
        ))}
      </section>

      <Card className="p-5">
        <h2 className="text-[20px] font-semibold text-text-primary mb-4">Trend Overview</h2>
        <div className="h-[280px]">
          {chartData.length === 0 ? (
            <EmptyState icon={HeartPulse} title="No trend data" description="Log daily vitals to unlock trend analysis." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#7FBF7F" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="heart" stroke="#1F2937" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table
          loading={loading}
          data={vitals}
          columns={[
            { key: 'recordedDate', label: 'Date', render: (v) => format(new Date(v.recordedDate || v.date), 'MMM d, yyyy') },
            { key: 'bp', label: 'Blood Pressure', render: (v) => `${v.systolic || '--'}/${v.diastolic || '--'} mmHg` },
            { key: 'sugar', label: 'Blood Sugar', render: (v) => (v.bloodSugar ? `${v.bloodSugar} mg/dL` : '--') },
            { key: 'heart', label: 'Heart Rate', render: (v) => (v.heartRate ? `${v.heartRate} bpm` : '--') },
            {
              key: 'status',
              label: 'Status',
              render: (v) => {
                const highBp = Number(v.systolic) > 140 || Number(v.diastolic) > 90;
                const highSugar = Number(v.bloodSugar) > 140;
                if (highBp || highSugar) return <Badge variant="warning">Monitor</Badge>;
                return <Badge variant="success">Stable</Badge>;
              },
            },
          ]}
          emptyMessage="No vitals logged yet"
        />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Vitals">
        <form onSubmit={handleLog} className="space-y-4">
          <Input
            label="Date"
            type="date"
            required
            value={formData.recordedDate}
            onChange={(e) => setFormData({ ...formData, recordedDate: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Systolic" type="number" value={formData.systolic} onChange={(e) => setFormData({ ...formData, systolic: e.target.value })} />
            <Input label="Diastolic" type="number" value={formData.diastolic} onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Blood Sugar" type="number" value={formData.bloodSugar} onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })} />
            <Input label="Heart Rate" type="number" value={formData.heartRate} onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-primary">Notes</label>
            <textarea
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white min-h-[90px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save vitals</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VitalsPage;
