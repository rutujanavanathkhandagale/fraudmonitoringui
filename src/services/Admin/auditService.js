import axios from "axios";

const API_BASE = "https://localhost:7181/api/admin/audit";

export const getAllAuditLogs = async () => {
  const response = await axios.get(`${API_BASE}/all`);
  return response.data;
};

export const getRoleAuditLogs = async () => {
  const response = await axios.get(`${API_BASE}/roles`);
  return response.data;
};

export const getSystemUserAuditLogs = async () => {
  const response = await axios.get(`${API_BASE}/system-users`);
  return response.data;
};