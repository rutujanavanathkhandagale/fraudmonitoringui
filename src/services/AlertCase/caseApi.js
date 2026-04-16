import api from "./axios";
 
// ✅ GET ALL CASES
export const getCases = () => {
  return api.get("/Case");
};
 
// ✅ UPDATE STATUS
export const updateCaseStatus = (id, status) => {
  return api.put(`/Case/${id}/status`, null, {
    params: { status }
  });
};
 
// ✅ CREATE CASE
export const createCase = (data) => {
  return api.post("/Case", data);
};
 