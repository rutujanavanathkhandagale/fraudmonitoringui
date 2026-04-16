import api from "./axios";
 
// ✅ GET ALL ALERTS
export const getAllAlerts = () => {
  return api.get("/Alerts");
};
 
// ✅ GENERATE CASES FROM ALERTS
export const generateCases = () => {
  return api.post("/Alerts/generate-cases");
};
 
// ✅ UPDATE ALERT STATUS
export const updateAlertStatus = (id, status) => {
  return api.put(`/Alerts/${id}/status`, null, {
    params: { status },
  });
};
 
// ✅ DELETE ALERT
export const deleteAlert = (id) => {
  return api.delete(`/Alerts/${id}`);
};