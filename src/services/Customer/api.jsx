import axios from "axios";

const BASE_URL = "https://localhost:44372/api";

// Personal
export const savePersonalDetails = (payload) =>
  axios.post(`${BASE_URL}/PersonalDetails`, payload);

export const getPersonalDetails = (id) =>
  axios.get(`${BASE_URL}/PersonalDetails/${id}`);

export const updatePersonalDetails = (id, payload) =>
  axios.put(`${BASE_URL}/PersonalDetails/${id}`, payload);

// Account
export const saveAccountDetails = (data) =>
  axios.post(`${BASE_URL}/Account`, data, {
    headers: { "Content-Type": "application/json" }
  });

export const getAccountDetails = (id) =>
  axios.get(`${BASE_URL}/Account/by-customer/${id}`);

export const updateAccountDetails = (id, payload) =>
  axios.put(`${BASE_URL}/Account/${id}`, payload);

// KYC (plural everywhere)
export const saveKYCProfile = (formData) =>
  axios.post(`${BASE_URL}/KYCProfiles`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getKYCProfile = (customerId) =>
  axios.get(`${BASE_URL}/KYCProfiles/customer/${customerId}`);
export const getChatMessages = (customerId) =>
  axios.get(`https://localhost:44372/api/Chat/${customerId}`);

export const sendChatMessage = (payload) =>
  axios.post("https://localhost:44372/api/Chat/send", payload);

export const markMessageSeen = (messageId) =>
  axios.put(`https://localhost:44372/api/Chat/seen/${messageId}`)

// Watchlist
export const getWatchlistEntries = () =>
  axios.get(`${BASE_URL}/Watchlist`);

export const saveWatchlistEntry = (payload) =>
  axios.post(`${BASE_URL}/Watchlist`, payload, {
    headers: { "Content-Type": "application/json" }
  });

export const updateWatchlistEntry = (payload) =>
  axios.put(`${BASE_URL}/Watchlist`, payload, {
    headers: { "Content-Type": "application/json" }
  });

export const deleteWatchlistEntry = (id) =>
  axios.delete(`${BASE_URL}/Watchlist/${id}`);
