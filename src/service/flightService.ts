import { api } from "../lib/axios";
import { ApiResponse, Flight, FlightSearchParams } from '../types/api';

export const flightService = {
  // Mencari penerbangan (GET /api/v1/flights?origin=...&destination=...)
  searchFlights: async (params: FlightSearchParams): Promise<Flight[]> => {
    try {
      // Mapping parameter frontend ke parameter backend query string
      const queryParams = new URLSearchParams();

      if (params.originAirportId) queryParams.append('origin', params.originAirportId.toString());
      if (params.destinationAirportId) queryParams.append('destination', params.destinationAirportId.toString());
      
      // Format tanggal ke YYYY-MM-DD (PENTING!)
      if (params.departureDate) {
        // Trik timezone safe sederhana untuk format YYYY-MM-DD
        const offset = params.departureDate.getTimezoneOffset();
        const localDate = new Date(params.departureDate.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];
        queryParams.append('date', dateString);
      }

      if (params.passengerCount) queryParams.append('passengers', params.passengerCount.toString());
      if (params.seatClass) queryParams.append('seat_class', params.seatClass);

      // Call API
      const response = await api.get<ApiResponse<Flight[]>>(`/api/v1/flights?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to search flights:', error);
      throw error;
    }
  },

  // Mendapatkan detail satu flight (GET /api/v1/flights/:id)
  getFlightById: async (id: number): Promise<Flight> => {
    try {
      const response = await api.get<ApiResponse<Flight>>(`/api/v1/flights/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch flight ${id}:`, error);
      throw error;
    }
  }
};