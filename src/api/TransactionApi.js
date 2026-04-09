import API from "./filename"; // Importing your central axios instance

export const checkTransactionPattern = (customerId) => {
  return API.get(`/TransactionPattern/${customerId}`);
};