import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-tracker-34yx.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401
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

/* ================= AUTH ================= */

export const authAPI = {
  login: (email) =>
    API.post("/transactions/login", { email }),

  register: (name, email, password, role) =>
    API.post("/transactions/register", {
      name,
      email,
      password,
      role,
    }),
};

/* ================= TRANSACTIONS ================= */

export const transactionAPI = {
  getAll: () => API.get("/transactions"),

  create: (data) => API.post("/transactions", data),

  update: (id, data) => API.put(`/transactions/${id}`, data),

  delete: (id) => API.delete(`/transactions/${id}`),
};

/* ================= DASHBOARD ================= */

export const dashboardAPI = {
  getSummary: () => API.get("/dashboard/summary"),
  getRecent: () => API.get("/dashboard/recent"),
  getCategory: () => API.get("/dashboard/category"),
};

export default API;