import axiosInstance from './axiosInstance';

export const getPrescriptions = () => axiosInstance.get('/prescriptions');

export const uploadPrescription = (formData) => 
  axiosInstance.post('/prescriptions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const downloadPrescription = async (id) => {
  const response = await axiosInstance.get(`/prescriptions/${id}/file`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
};

export const deletePrescription = (id) => axiosInstance.delete(`/prescriptions/${id}`);
