import axios from "axios";

// Updated to your active backend port: 44372
const API = axios.create({
  baseURL: "https://localhost:44372/api", 
});

// --- WATCHLIST API SECTION ---
// Fetches entries including ListType (PEP, Sanctions, Internal)
export const getWatchlistEntries = () => API.get("/Watchlist");
export const saveWatchlistEntry = (data) => API.post("/Watchlist", data);
export const updateWatchlistEntry = (data) => API.put(`/Watchlist/${data.entryId}`, data);
export const deleteWatchlistEntry = (id) => API.delete(`${id}`);

// --- CASE API SECTION ---
export const createCase = (data) => {
  return API.post(
    `/Case/create?primaryCustomerId=${data.primaryCustomerId}&caseType=${data.caseType}&priority=${data.priority}`
  );
};

export const getCases = () => API.get("/Case");

export default API;