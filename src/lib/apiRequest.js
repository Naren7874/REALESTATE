import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://estatebackend-20h4.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;