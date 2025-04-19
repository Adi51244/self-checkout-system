import axios from "axios";

const API_URL = "http://localhost:8000"; // or your FastAPI backend URL

export const detectProducts = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/detect`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // should include detected products
  } catch (error) {
    console.error("Error detecting products:", error);
    return null;
  }
};
