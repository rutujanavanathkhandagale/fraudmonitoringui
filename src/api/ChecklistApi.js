import API from "./aapp"; // This imports your existing axios instance

// The endpoint path based on your .NET Controller
const PATH = "/ControlChecklist";

export const getAllChecklist = () => {
  return API.get(PATH);
};

export const getChecklistByStatus = (status) => {
  return API.get(`${PATH}/status/${status}`);
};

export const createChecklist = (data) => {
  return API.post(PATH, data);
};

export const updateChecklist = (id, data) => {
  return API.put(`${PATH}/${id}`, data);
};

export const deleteChecklist = (id) => {
  return API.delete(`${PATH}/${id}`);
};