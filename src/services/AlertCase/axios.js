import axios from "axios";
//this crates a reusable instance of axios, you set the baseURL so that you dont have to type the full url in every single time you make a request
const api = axios.create({
  baseURL: "https://localhost:44372/api" // ✅ YOUR BACKEND
});
//this is an interceptor .think of it like a security gurad, everytime u send a req, this code automatically grabs you "security token" fromstorage and put it in the header. the backend uses this to verify u are a logged-in user
 
export default api;
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});