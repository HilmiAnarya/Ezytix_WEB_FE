/* eslint-disable @typescript-eslint/no-explicit-any */
import {api} from '../lib/axios';
import { ApiResponse, Flight, FlightSearchParams } from '../types/api';

export const flightService = {
  searchFlights: async (params: FlightSearchParams): Promise<Flight[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.originAirportId) queryParams.append('origin', params.originAirportId.toString());
      if (params.destinationAirportId) queryParams.append('destination', params.destinationAirportId.toString());
      if (params.departureDate) {
        const date = params.departureDate;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        queryParams.append('departure_date', dateString);
      }

      if (params.passengerCount) queryParams.append('passengers', params.passengerCount.toString());
      if (params.seatClass) queryParams.append('seat_class', params.seatClass);

      console.log("Fetching API:", `/flights?${queryParams.toString()}`);

      const response = await api.get<ApiResponse<any>>(`/flights?${queryParams.toString()}`);

      return response.data.data || []; 

    } catch (error) {
      console.error('Failed to search flights:', error);
      throw error;
    }
  },

  getFlightById: async (id: number): Promise<Flight> => {
    try {
      const response = await api.get<ApiResponse<Flight>>(`/flights/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch flight ${id}:`, error);
      throw error;
    }
  }
};