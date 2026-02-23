export interface PassengerPayload {
    title: string;          
    full_name: string;       
    dob: string;           
    nationality: string;
    passport_number?: string; 
    issuing_country?: string; 
    valid_until?: string;  
}

export interface BookingItemPayload {
    flight_id: number;
    seat_class: string;   
    passengers: PassengerPayload[];
}

export interface CreateBookingRequest {
    items: BookingItemPayload[];
}

export interface BookingDetailResponse {
    booking_code: string;
    flight_code: string;
    origin: string;
    destination: string;
    departure_time: string;
    total_passengers: number;
    total_price: string;
}

export interface CreateBookingResponse {
    order_id: string;
    total_amount: string;
    status: string;
    transaction_time: string;
    expiry_time: string;    
    bookings: BookingDetailResponse[];
}
export interface PassengerDetail {
    full_name: string;
    type: string; 
    ticket_number: string;
    seat_class: string;
}

export interface BookingFlightDetail {
    flight_code: string;
    airline_name: string;
    airline_logo: string;
    origin: string;         
    destination: string;   
    departure_time: string; 
    arrival_time: string;   
    duration_minutes: number;
    seat_class: string;    
    class_code: string;   
    duration_formatted: string; 
    transit_info: string;    
}

export interface Booking {
    order_id: string;        
    booking_code: string;
    status: 'pending' | 'paid' | 'cancelled' | 'failed' | 'expired';
    total_amount: string;
    created_at: string;
    expiry_time?: string;    
    flight: BookingFlightDetail;
    passengers: PassengerDetail[];
}