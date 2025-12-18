import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan belum pernah dicoba refresh sebelumnya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Panggil endpoint refresh token backend
        await api.post("/auth/refresh");
        
        // Jika berhasil refresh, ulangi request awal
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh juga gagal (token expired banget), logout user
        // Opsi: window.location.href = "/login"; atau biarkan error bubble up
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);