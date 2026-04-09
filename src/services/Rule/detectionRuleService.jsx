import axios from "axios";
 
const API_URL = "https://localhost:7181/api/DetectionRule";
 
// POST create rule
export const createDetectionRule = async (rule) => {
  const response = await axios.post(API_URL, rule);
  return response.data;
};
 
// GET all rules
export const getAllDetectionRules = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
 
// detectionRuleService.js
export const updateDetectionRule = async (ruleId, payload) => {
  const response = await axios.put(`${API_URL}/${ruleId}`, {
    ...payload,
    ruleId, // include RuleId in body
  });
  return response.data;
};
 
 
// DELETE rule
export const deleteDetectionRule = async (ruleId) => {
  const response = await axios.delete(`${API_URL}/${ruleId}`);
  return response.data;
};