// alertCaseMappingApi.js
import api from "./axios";
 
export const getAlertCaseMappings = () =>
  api.get("/AlertCaseMappings/case-alert-ids");