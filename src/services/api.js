import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-tracker-34yx.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => API.post("/transactions/login", { email, password }),
  register: (email, password, name, role) =>
    API.post("/transactions/register", { email, password, name, role }),
};

// Transaction APIs
export const transactionAPI = {
  getAll: () => API.get("/transactions"),
  create: (data) => API.post("/transactions", data),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => API.get("/dashboard/summary"),
};

export default API;