import axios from "axios";

const API_URL = "https://localhost:44372/api/Scenario";

export const getAllScenarios = async () => {
  const response = await axios.get(`${API_URL}/all`); // ✅ corrected
  return response.data;
};

export const createScenario = async (scenario) => {
  const response = await axios.post(`${API_URL}/create`, scenario);
  return response.data;
};

export const searchScenarios = async (keyword, status = "") => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { keyword, status }
  });
  return response.data;
};

export const updateScenario = async (id, scenario) => {
  const response = await axios.put(`${API_URL}/update/${id}`, scenario);
  return response.data;
};

export const deleteScenario = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};
