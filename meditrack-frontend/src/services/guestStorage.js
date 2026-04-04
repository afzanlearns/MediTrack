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
    const today = new Date().toISOString().slice(0, 10)

    const todaysDoses = doses.filter((dose) => {
      if (dose.date) return dose.date === today
      if (dose.scheduledTime) return String(dose.scheduledTime).slice(0, 10) === today
      return false
    })

    const taken = doses.filter((dose) => dose.status === 'TAKEN').length
    const considered = doses.filter((dose) => dose.status === 'TAKEN' || dose.status === 'MISSED').length
    const adherencePercentage = considered === 0 ? 100 : Number(((taken / considered) * 100).toFixed(1))

    const recentSymptoms = [...symptoms]
      .sort((a, b) => new Date(b.symptomDate || b.createdAt) - new Date(a.symptomDate || a.createdAt))
      .slice(0, 5)

    const latestVitals = [...vitals].sort(
      (a, b) => new Date(b.recordedDate || b.createdAt) - new Date(a.recordedDate || a.createdAt),
    )[0]

    return {
      adherencePercentage,
      activeMedicationCount: meds.filter((med) => med.isActive !== false).length,
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
