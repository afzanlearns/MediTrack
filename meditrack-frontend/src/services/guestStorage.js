export const guestStorage = {
  getCollection: (key) => JSON.parse(localStorage.getItem(`meditrack_guest_${key}`)) || [],

  saveItem: (key, data) => {
    const items = guestStorage.getCollection(key)
    const newItem = {
      ...data,
      id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    items.push(newItem)
    localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(items))
    return newItem
  },

  updateItem: (key, id, data) => {
    const items = guestStorage.getCollection(key)
    const index = items.findIndex((item) => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...data }
      localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(items))
      return items[index]
    }
    return null
  },

  deleteItem: (key, id) => {
    const items = guestStorage.getCollection(key)
    const filtered = items.filter((item) => item.id !== id)
    localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(filtered))
  },

  getMedications: () => guestStorage.getCollection('medications'),
  saveMedication: (data) => guestStorage.saveItem('medications', data),
  updateMedication: (id, data) => guestStorage.updateItem('medications', id, data),
  deleteMedication: (id) => guestStorage.deleteItem('medications', id),

  getDoses: () => guestStorage.getCollection('doses'),
  saveDose: (data) => guestStorage.saveItem('doses', data),
  updateDose: (id, data) => guestStorage.updateItem('doses', id, data),
  deleteDose: (id) => guestStorage.deleteItem('doses', id),

  getVitals: () => guestStorage.getCollection('vitals'),
  saveVitals: (data) => guestStorage.saveItem('vitals', data),
  deleteVitals: (id) => guestStorage.deleteItem('vitals', id),

  getSymptoms: () => guestStorage.getCollection('symptoms'),
  saveSymptom: (data) => guestStorage.saveItem('symptoms', data),
  deleteSymptom: (id) => guestStorage.deleteItem('symptoms', id),

  getVisits: () => guestStorage.getCollection('visits'),
  saveVisit: (data) => guestStorage.saveItem('visits', data),
  updateVisit: (id, data) => guestStorage.updateItem('visits', id, data),
  deleteVisit: (id) => guestStorage.deleteItem('visits', id),

  getSummary: () => {
    const meds = guestStorage.getMedications()
    const doses = guestStorage.getDoses()
    const symptoms = guestStorage.getSymptoms()
    const vitals = guestStorage.getVitals()
    // Use local date (YYYY-MM-DD) instead of UTC to avoid shifting dates near midnight
    const today = new Date().toLocaleDateString('en-CA') // en-CA gives YYYY-MM-DD

    const todaysDoses = doses.filter((dose) => {
      const doseDate = dose.date || (dose.scheduledTime ? String(dose.scheduledTime).slice(0, 10) : null)
      return doseDate === today
    })

    const taken = doses.filter((dose) => dose.status === 'TAKEN' || dose.status === 'taken').length
    const considered = doses.filter((dose) => 
      dose.status === 'TAKEN' || dose.status === 'taken' || 
      dose.status === 'MISSED' || dose.status === 'missed'
    ).length
    const adherencePercentage = considered === 0 ? 100 : Number(((taken / considered) * 100).toFixed(1))

    const recentSymptoms = [...symptoms]
      .sort((a, b) => new Date(b.symptomDate || b.createdAt) - new Date(a.symptomDate || a.createdAt))
      .slice(0, 5)

    const latestVitals = [...vitals].sort(
      (a, b) => new Date(b.recordedDate || b.createdAt) - new Date(a.recordedDate || a.createdAt),
    )[0]

    return {
      adherencePercentage,
      // Standardize on med.isActive (viewMapper handles undefined -> true)
      activeMedicationCount: meds.filter((m) => {
        const active = m.isActive !== false && m.active !== false
        const started = !m.startDate || m.startDate <= today
        const notEnded = !m.endDate || m.endDate >= today
        return active && started && notEnded
      }).length,
      todaysDoses,
      recentSymptoms,
      nextAppointment: null,
      latestVitals: latestVitals || null,
    }
  },

  clearAll: () => {
    const keys = [
      'meditrack_guest_medications',
      'meditrack_guest_doses',
      'meditrack_guest_vitals',
      'meditrack_guest_symptoms',
      'meditrack_guest_visits',
      'meditrack_guest',
    ]
    keys.forEach((k) => localStorage.removeItem(k))
  },
}
