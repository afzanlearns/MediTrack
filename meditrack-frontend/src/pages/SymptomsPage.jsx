import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Thermometer, Plus, Trash2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import axios from 'axios';

const SymptomsPage = ({ showToast }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    severity: 5,
    notes: '',
  });

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/symptoms');
      setSymptoms(res.data || []);
    } catch {
      showToast('Failed to load symptoms', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleLogSymptom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/symptoms', formData);
      showToast('Symptom logged');
      setFormData({
        name: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        severity: 5,
        notes: '',
      });
      fetchSymptoms();
    } catch {
      showToast('Failed to log symptom', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/symptoms/${id}`);
      showToast('Symptom removed');
      fetchSymptoms();
    } catch {
      showToast('Failed to delete symptom', 'danger');
    }
  };

  const trendData = useMemo(
    () =>
      [...symptoms]
        .reverse()
        .slice(-12)
        .map((s) => ({
          date: format(new Date(s.date), 'MMM d'),
          severity: Number(s.severity || 0),
        })),
    [symptoms]
  );

  const severityVariant = (value) => {
    if (value >= 7) return 'danger';
    if (value >= 4) return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Symptoms" subtitle="Log severity and monitor short-term symptom trends" />

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-4 p-5">
          <h2 className="text-[20px] font-semibold text-text-primary mb-4">Log Symptom</h2>
          <form onSubmit={handleLogSymptom} className="space-y-4">
            <Input
              label="Symptom"
              icon={<Thermometer className="w-4 h-4" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Headache, fatigue, nausea"
              required
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">Severity</label>
                <Badge variant={severityVariant(formData.severity)}>Level {formData.severity}</Badge>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Notes</label>
              <textarea
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white min-h-[90px]"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Triggers, duration, and context"
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Save symptom
            </Button>
          </form>
        </Card>

        <div className="xl:col-span-8 space-y-6">
          <Card className="p-5">
            <h2 className="text-[20px] font-semibold text-text-primary mb-4">Severity Trend</h2>
            <div className="h-[220px]">
              {trendData.length === 0 ? (
                <EmptyState icon={BarChart3} title="No trend yet" description="Add symptom entries to generate trend insights." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="severity" fill="#7FBF7F" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <Table
              loading={loading}
              data={symptoms}
              columns={[
                { key: 'date', label: 'Date', render: (s) => format(new Date(s.date), 'MMM d, yyyy') },
                { key: 'name', label: 'Symptom', render: (s) => <span className="font-medium text-text-primary">{s.name}</span> },
                {
                  key: 'severity',
                  label: 'Severity',
                  render: (s) => (
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          Number(s.severity) >= 7 ? 'bg-danger' : Number(s.severity) >= 4 ? 'bg-warning' : 'bg-success'
                        }`}
                      />
                      <Badge variant={severityVariant(Number(s.severity))}>Level {s.severity}</Badge>
                    </div>
                  ),
                },
                { key: 'notes', label: 'Notes', render: (s) => <span className="text-sm text-text-secondary truncate block max-w-[280px]">{s.notes || 'No note'}</span> },
                {
                  key: 'actions',
                  label: '',
                  render: (s) => (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-md border border-border text-text-secondary hover:text-danger hover:bg-danger-light"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ),
                },
              ]}
              emptyMessage="No symptom entries yet"
            />
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SymptomsPage;
