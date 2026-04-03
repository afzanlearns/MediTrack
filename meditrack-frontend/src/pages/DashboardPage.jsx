import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  ClipboardCheck,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  CalendarDays,
  Activity,
  HeartPulse,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import dashboardApi from '../api/dashboardApi';

const vitalsFallback = [
  { key: 'bloodPressure', label: 'Blood Pressure', value: '122/81', icon: HeartPulse },
  { key: 'sugar', label: 'Blood Sugar', value: '108 mg/dL', icon: Droplets },
  { key: 'heartRate', label: 'Heart Rate', value: '74 bpm', icon: Activity },
  { key: 'temperature', label: 'Body Temp', value: '98.4 F', icon: Thermometer },
];

const scheduleFallback = [
  { time: '08:00', medication: 'Metformin 500mg', status: 'TAKEN' },
  { time: '13:00', medication: 'Atorvastatin 20mg', status: 'PENDING' },
  { time: '20:00', medication: 'Vitamin D3', status: 'PENDING' },
];

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    adherence: 0,
    pendingDoses: 0,
    nextAppointment: null,
    topSymptoms: [],
    activeMedications: 4,
    todaysDoses: 6,
    takenToday: 4,
    schedule: scheduleFallback,
    recentVitals: vitalsFallback,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardApi.getDashboardSummary();
        setSummary((prev) => ({
          ...prev,
          ...data,
          activeMedications: data.activeMedications ?? prev.activeMedications,
          todaysDoses: data.todaysDoses ?? prev.todaysDoses,
          takenToday: data.takenToday ?? Math.max(0, (data.todaysDoses ?? prev.todaysDoses) - (data.pendingDoses ?? prev.pendingDoses)),
          schedule: data.schedule?.length ? data.schedule : prev.schedule,
          recentVitals: data.recentVitals?.length ? data.recentVitals : prev.recentVitals,
        }));
      } catch {
        // Keep fallback data for guest and offline render.
      }
    };
    load();
  }, []);

  const adherence = Math.max(0, Math.min(100, Number(summary.adherence || 0)));
  const ringData = useMemo(
    () => [
      { name: 'Adherent', value: adherence },
      { name: 'Remaining', value: 100 - adherence },
    ],
    [adherence]
  );

  const symptomTrend = useMemo(() => {
    if (!summary.topSymptoms?.length) {
      return [
        { name: 'Headache', severity: 2 },
        { name: 'Fatigue', severity: 3 },
        { name: 'Nausea', severity: 1 },
      ];
    }
    return summary.topSymptoms.slice(0, 5).map((s) => ({
      name: s.name,
      severity: Number(s.severity) || 1,
    }));
  }, [summary.topSymptoms]);

  const stats = [
    { label: 'Active Medications', value: summary.activeMedications, icon: Pill },
    { label: "Today's Doses", value: summary.todaysDoses, icon: ClipboardCheck },
    { label: 'Taken Today', value: summary.takenToday, icon: CheckCircle2 },
    { label: 'Adherence', value: `${adherence}%`, icon: ShieldCheck },
  ];

  const nextAppointmentDate = summary.nextAppointment?.date || 'Nov 10, 2025';
  const nextAppointmentDoctor = summary.nextAppointment?.doctorName || 'Dr. Sandra Perry';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[28px] font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Daily health summary with quick access to your critical records.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{item.label}</span>
              <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent/35 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-[#4B7A4B]" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-text-primary mt-2">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-semibold text-text-primary">Today&apos;s Schedule</h2>
              <Link to="/dose-log" className="text-sm text-[#4B7A4B] font-medium">View dose log</Link>
            </div>
            <div className="space-y-4">
              {summary.schedule.map((item, index) => (
                <div key={`${item.time}-${index}`} className="flex items-start gap-4">
                  <div className="w-16 text-sm font-medium text-text-secondary pt-1">{item.time}</div>
                  <div className="flex-1 rounded-lg border border-border bg-page-bg/45 p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.medication}</p>
                    </div>
                    <Badge variant={item.status === 'TAKEN' ? 'success' : item.status === 'SKIPPED' ? 'danger' : 'warning'}>
                      {item.status === 'TAKEN' ? 'Taken' : item.status === 'SKIPPED' ? 'Missed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[20px] font-semibold text-text-primary mb-4">Vitals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {summary.recentVitals.map((vital, index) => {
                const Icon = vital.icon || vitalsFallback[index % vitalsFallback.length].icon;
                return (
                  <div key={vital.key || index} className="rounded-lg border border-border bg-page-bg/50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-secondary uppercase tracking-[0.08em]">{vital.label}</p>
                      <Icon className="w-4 h-4 text-[#4B7A4B]" />
                    </div>
                    <p className="text-lg font-semibold text-text-primary mt-2">{vital.value}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[20px] font-semibold text-text-primary mb-4">Recent Symptoms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {symptomTrend.map((symptom) => (
                <div key={symptom.name} className="border border-border rounded-lg p-3 bg-page-bg/45">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary">{symptom.name}</p>
                    <span className="text-xs text-text-secondary">Severity {symptom.severity}/10</span>
                  </div>
                  <div className="mt-2 w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full ${symptom.severity >= 7 ? 'bg-danger' : symptom.severity >= 4 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${Math.min(100, symptom.severity * 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Adherence</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ringData} innerRadius={52} outerRadius={72} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                    <Cell fill="#7FBF7F" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-2xl font-semibold text-text-primary -mt-28 mb-16">{adherence}%</p>
            <p className="text-sm text-text-secondary text-center">Medication adherence for the current cycle.</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Upcoming Appointment</h3>
              <CalendarDays className="w-4 h-4 text-text-secondary" />
            </div>
            <p className="text-sm text-text-secondary mt-2">{nextAppointmentDate}</p>
            <p className="text-base font-medium text-text-primary mt-1">{nextAppointmentDoctor}</p>
            <Link to="/appointments" className="block mt-4">
              <Button className="w-full">Open appointments</Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Symptom Pattern</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={symptomTrend} outerRadius="70%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Radar name="Severity" dataKey="severity" stroke="#7FBF7F" fill="#7FBF7F" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-text-secondary">Compact weekly view of symptom intensity.</p>
          </Card>
        </div>
      </section>

      <footer className="rounded-xl border border-border bg-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <Clock3 className="w-4 h-4" />
          Last sync completed a few moments ago.
        </div>
        <Link to="/medications">
          <Button variant="outline">Review medications</Button>
        </Link>
      </footer>
    </div>
  );
};

export default DashboardPage;
