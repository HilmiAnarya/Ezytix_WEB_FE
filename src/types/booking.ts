// src/types/booking.ts

// ==========================================
// 1. REQUEST PAYLOAD (Dikirim ke Backend)
// ==========================================

export interface PassengerPayload {
    title: string;            // "tuan", "nyonya", "nona", "mr", "ms", "mrs"
    full_name: string;        // Gabungan First + Last Name
    dob: string;              // Format: YYYY-MM-DD
    nationality: string;
    passport_number?: string; // Optional
    issuing_country?: string; // Optional
    valid_until?: string;     // Optional
}

export interface BookingItemPayload {
    flight_id: number;
    seat_class: string;       // "economy", "business", "first_class"
    passengers: PassengerPayload[];
}

export interface CreateBookingRequest {
    items: BookingItemPayload[];
}

// ==========================================
// 2. RESPONSE PAYLOAD (Create Booking)
// ==========================================

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
    payment_url: string;
    expiry_date: string;
    bookings: BookingDetailResponse[];
}

// ==========================================
// 3. BOOKING HISTORY TYPES (GET /my-bookings)
// ==========================================

export interface BookingFlightDetail {
    flight_code: string;
    airline_name: string;
    airline_logo: string;
    origin: string;          // "Jakarta (CGK)"
    destination: string;     // "Bali (DPS)"
    departure_time: string;  // ISO String
    arrival_time: string;    // ISO String
    duration_minutes: number;

    // [BARU] Tambahan Data Kelas dari Backend
    seat_class: string;      // Contoh: "Economy"
    class_code: string;      // Contoh: "I9", "Y"
}

// Representasi satu kartu booking di history
export interface Booking {
    booking_code: string;
    status: 'pending' | 'paid' | 'cancelled' | 'expired'; // Enum status dari backend
    total_amount: string;    // Decimal string
    created_at: string;      // ISO String
    
    // Field Opsional (Khusus Pending)
    payment_url?: string; 
    expiry_time?: string; 
    
    flight: BookingFlightDetail;
}