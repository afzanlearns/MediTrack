import { format } from 'date-fns'

export const formatApiDate = (value, fallback = '—') => {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : format(date, 'MMM d, yyyy')
}

export const formatApiTime = (value, fallback = '--:--') => {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : format(date, 'hh:mm a')
}

export const medFrequencyLabel = (frequency = '') => {
  const map = {
    ONCE_DAILY: 'Daily',
    TWICE_DAILY: 'Twice daily',
    THREE_TIMES_DAILY: '3x daily',
    EVERY_8_HOURS: 'Every 8 hours',
    WEEKLY: 'Weekly',
  }
  return map[frequency] || frequency || '—'
}

export const mapMedicationView = (med) => ({
  id: med.id,
  name: med.name,
  dosage: med.dosage,
  frequency: med.frequency,
  frequencyLabel: medFrequencyLabel(med.frequency),
  startDate: med.startDate,
  startDateLabel: formatApiDate(med.startDate),
  isActive: med.isActive !== false,
})

export const mapDoseView = (dose) => {
  const scheduledAt = dose.scheduledTime || dose.createdAt || null
  return {
    ...dose,
    scheduledAt,
    medication: dose.medicationName || dose.medication || 'Medication',
    dosage: dose.medicationDosage || dose.dosage || '—',
    timeLabel: dose.time || formatApiTime(scheduledAt),
    dateKey: dose.date || (scheduledAt ? format(new Date(scheduledAt), 'yyyy-MM-dd') : null),
  }
}

export const mapSymptomView = (symptom) => ({
  ...symptom,
  name: symptom.symptomName || symptom.name,
  dateLabel: formatApiDate(symptom.symptomDate || symptom.date),
  trendDate:
    symptom.symptomDate || symptom.date || format(new Date(symptom.createdAt || Date.now()), 'yyyy-MM-dd'),
})

export const mapVisitView = (visit) => ({
  ...visit,
  title: visit.doctorName,
  dateLabel: formatApiDate(visit.visitDate),
  medications:
    visit.medications ||
    visit.linkedMedications ||
    visit.medicationIds?.map((id) => ({ id, name: `Medication #${id}` })) ||
    [],
})

export const mapVitalsView = (vitals) => ({
  ...vitals,
  recordedDateLabel: formatApiDate(vitals.recordedDate),
  bloodPressureLabel:
    vitals.systolic && vitals.diastolic ? `${vitals.systolic}/${vitals.diastolic}` : '—',
})
