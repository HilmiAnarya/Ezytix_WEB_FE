export interface Airport {
  id: number;
  code: string;        
  city_name: string;   
  airport_name: string;
  country: string;   
}

export interface Airline {
  id: number;
  iata: string;
  name: string;   
  logo_url: string;
}
export interface FlightClass {
  seat_class: string;
  class_code: string; 
  price: string;     
  total_seats: number;
}

export interface FlightLeg {
  id: number;
  leg_order: number;
  airline: Airline;     
  origin: Airport;
  destination: Airport; 
  departure_time: string; 
  arrival_time: string;
  flight_number: string;
  transit_notes: string;
  duration_minutes: number;
  duration_formatted: string; 
  layover_duration_minutes?: number;   
  layover_duration_formatted?: string;
}

export interface Flight {
  id: number;
  flight_code: string;
  airline: Airline; 
  origin: Airport;
  destination: Airport;
  departure_time: string;
  arrival_time: string;
  total_duration_minutes: number;
  duration_formatted: string;
  transit_count: number;
  transit_info: string;
  flight_legs: FlightLeg[];
  flight_classes: FlightClass[];
}
export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data: T;
}

export interface FlightSearchParams {
  originAirportId: number | null;
  destinationAirportId: number | null;
  departureDate: Date | null;
  returnDate?: Date | null; 
  passengerCount: number;
  seatClass: 'economy' | 'business' | 'first_class';
  selectedOutboundFlightId?: number; 
}