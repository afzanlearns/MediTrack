import { guestStorage } from './guestStorage';
import medicationApi from '../api/medicationApi';
import doseApi from '../api/doseApi';
import vitalsApi from '../api/vitalsApi';
import symptomApi from '../api/symptomApi';
import visitApi from '../api/visitApi';

export const syncService = {
  syncGuestDataToServer: async (token) => {
    // 1. Read all guest data
    const meds = guestStorage.getMedications();
    const doses = guestStorage.getDoses();
    const vitals = guestStorage.getVitals();
    const symptoms = guestStorage.getSymptoms();
    const visits = guestStorage.getVisits();

    let successCount = 0;
    let failCount = 0;

    const syncCollection = async (items, syncFn) => {
      for (const item of items) {
        try {
          // Strip guest prefix
          const { id, ...data } = item;
          await syncFn(data);
          successCount++;
        } catch (error) {
          console.error(`Sync failed for item:`, item, error);
          failCount++;
        }
      }
    };

    // 2. Sync each collection
    await syncCollection(meds, medicationApi.createMedication);
    await syncCollection(doses, doseApi.createDose);
    await syncCollection(vitals, vitalsApi.saveVitals);
    await syncCollection(symptoms, symptomApi.saveSymptom);
    await syncCollection(visits, visitApi.saveVisit);

    // 3. Cleanup
    guestStorage.clearAll();

    return {
      success: true,
      successCount,
      failCount
    };
  }
};
