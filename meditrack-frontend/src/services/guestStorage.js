export const guestStorage = {
  getCollection: (key) => JSON.parse(localStorage.getItem(`meditrack_guest_${key}`)) || [],
  
  saveItem: (key, data) => {
    const items = guestStorage.getCollection(key);
    const newItem = {
      ...data,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(items));
    return newItem;
  },

  updateItem: (key, id, data) => {
    const items = guestStorage.getCollection(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  deleteItem: (key, id) => {
    const items = guestStorage.getCollection(key);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(`meditrack_guest_${key}`, JSON.stringify(filtered));
  },

  // Specific helpers to match API names
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
    const syms = guestStorage.getSymptoms().slice(-5);
    const vitals = guestStorage.getVitals().slice(-7);
    const doses = guestStorage.getDoses();
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysDoses = doses.filter(d => d.date === todayStr);
    
    return {
      adherence: 0,
      pendingDoses: todaysDoses.filter(d => d.status === 'PENDING').length,
      nextAppointment: null,
      recentBloodPressure: vitals.length > 0 ? (vitals[vitals.length-1].value || 'Not logged') : 'Not logged',
      topSymptoms: syms.map(s => ({ name: s.name, severity: s.severity || 'UNKNOWN' })),
      vitalsHistory: vitals.map(v => ({ date: v.date || v.createdAt, value: v.value }))
    };
  },

  clearAll: () => {
    const keys = [
      'meditrack_guest_medications',
      'meditrack_guest_doses',
      'meditrack_guest_vitals',
      'meditrack_guest_symptoms',
      'meditrack_guest_visits',
      'meditrack_guest'
    ];
    keys.forEach(k => localStorage.removeItem(k));
  }
};
