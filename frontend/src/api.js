import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true
});

export const detectProducts = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting products:', error);
    throw error;
  }
};
