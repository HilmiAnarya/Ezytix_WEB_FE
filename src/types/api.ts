// ==========================================
// 1. MASTER DATA (Untuk Dropdown & Label)
// ==========================================

export interface Airport {
  id: number;
  code: string;        // Contoh: "CGK"
  city_name: string;   // Contoh: "Jakarta"
  airport_name: string;// Contoh: "Soekarno-Hatta International Airport"
  country: string;     // Contoh: "Indonesia"
}

export interface Airline {
  id: number;
  iata: string;    // "GA"
  name: string;    // "Garuda Indonesia"
  logo_url: string;// URL gambar dari Cloudinary/Server
}

// ==========================================
// 2. FLIGHT COMPONENTS (Detail Penerbangan)
// ==========================================

export interface FlightClass {
  seat_class: string; // "economy", "business", "first_class"
  price: string;      // PENTING: Backend Decimal dikirim sebagai String di JSON untuk presisi
  total_seats: number;
}

export interface FlightLeg {
  id: number;
  leg_order: number;
  
  // Nested Objects (Relasi)
  airline: Airline;      // Logo maskapai per transit (Operating Carrier)
  origin: Airport;
  destination: Airport;  // Kota tujuan transit

  departure_time: string; // ISO 8601 String ("2025-12-25T08:00:00Z")
  arrival_time: string;
  
  flight_number: string;
  transit_notes: string;

  // Durasi Terbang
  duration_minutes: number;
  duration_formatted: string; // "1j 30m"

  // --- SMART BACKEND FEATURE: TRANSIT INFO ---
  // Field ini hanya ada jika backend mengirimkannya (saat transit)
  layover_duration_minutes?: number;   
  layover_duration_formatted?: string; // "2j 15m" (Render Bar Transit jika ada ini)
}

// ==========================================
// 3. MAIN FLIGHT RESPONSE (Untuk Card Utama)
// ==========================================

export interface Flight {
  id: number;
  flight_code: string;
  
  // Validating Carrier (Maskapai Utama/Penjual Tiket)
  airline: Airline; 

  origin: Airport;
  destination: Airport;

  departure_time: string;
  arrival_time: string;

  // Rangkuman Header
  total_duration_minutes: number;
  duration_formatted: string; // "4j 30m" (Siap render di Header Card)
  
  transit_count: number;
  transit_info: string;       // "1 Transit" atau "Direct"

  // Detail untuk Accordion/Modal
  flight_legs: FlightLeg[];
  
  // Opsi Harga
  flight_classes: FlightClass[];
}

// ==========================================
// 4. API RESPONSE WRAPPER
// ==========================================
// Standarisasi response Fiber: { status, message, data }

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data: T;
}

// Helper Type untuk Search Query (State Lokal Frontend)
export interface FlightSearchParams {
  originAirportId: number | null;
  destinationAirportId: number | null;
  departureDate: Date | null; // Object Date JS
  
  // --- [NEW] UPDATE UNTUK ROUND TRIP ---
  returnDate?: Date | null;   // Optional, hanya terisi jika user pilih PP
  
  passengerCount: number;
  seatClass: 'economy' | 'business' | 'first_class';

  // --- [NEW] CONTEXT STATE ---
  // Menyimpan ID penerbangan pergi yang sudah dipilih user
  selectedOutboundFlightId?: number; 
}