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
    expiry_time: string;       // Strict Expiry Time (ISO String)
    bookings: BookingDetailResponse[];
}

// ==========================================
// 3. BOOKING HISTORY TYPES (GET /my-bookings)
// ==========================================

// [NEW] Interface untuk Detail Penumpang di History
export interface PassengerDetail {
    full_name: string;
    type: string;           // "adult", "child", "infant"
    ticket_number: string;
    seat_class: string;
}

export interface BookingFlightDetail {
    flight_code: string;
    airline_name: string;
    airline_logo: string;
    origin: string;          // "Jakarta (CGK)"
    destination: string;     // "Bali (DPS)"
    departure_time: string;  // ISO String
    arrival_time: string;    // ISO String
    duration_minutes: number;
    seat_class: string;      // Contoh: "Economy"
    class_code: string;      // Contoh: "I9", "Y"

    // [NEW FIELDS] Sinkronisasi dengan Backend DTO Baru
    duration_formatted: string; // Contoh: "1j 30m"
    transit_info: string;       // Contoh: "Langsung", "1 Transit"
}

// Representasi satu kartu booking di history
export interface Booking {
    order_id: string;        
    booking_code: string;
    status: 'pending' | 'paid' | 'cancelled' | 'failed' | 'expired'; // Update status sesuai backend
    total_amount: string;
    created_at: string;
    expiry_time?: string;    
    flight: BookingFlightDetail;

    // [NEW FIELD] List Penumpang agar bisa ditampilkan di UI
    passengers: PassengerDetail[];
}