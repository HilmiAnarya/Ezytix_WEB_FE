import { api } from "../lib/axios";
import { ApiResponse, Airport } from "../types/api";

export const airportService = {
  getAirports: async (): Promise<Airport[]> => {
    try {
      const response = await api.get<ApiResponse<Airport[]>>(
        "/airports"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch airports:", error);
      throw error;
    }
  },
};
