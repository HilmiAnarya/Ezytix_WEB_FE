import { api } from "../lib/axios"; // Pastikan path ini sesuai dengan lokasi axios instance kamu
import { ApiResponse, Airport } from "../types/api";

export const airportService = {
  // Mengambil semua data bandara (GET /api/v1/airports)
  getAirports: async (): Promise<Airport[]> => {
    try {
      const response = await api.get<ApiResponse<Airport[]>>(
        "/airports"
      );
      return response.data.data; // Mengambil array Airport dari wrapper { data: [...] }
    } catch (error) {
      console.error("Failed to fetch airports:", error);
      throw error;
    }
  },
};
