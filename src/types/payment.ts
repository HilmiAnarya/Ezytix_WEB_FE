// src/types/payment.ts

export type BackendPaymentType = "VIRTUAL_ACCOUNT" | "QR_CODE" | "E_WALLET" | "RETAIL_OUTLET";

// ==========================================
// 1. INSTRUCTION TYPES (Complex Structure)
// ==========================================

// Langkah individual (Key-Value Pair)
export type InstructionSteps = Record<string, string>;

// Group Instruksi (Title + Steps)
export interface InstructionGroup {
  title: string;
  steps: InstructionSteps;
  is_unordered?: boolean; // Khusus Alfamart/Retail
}

// Container Instruksi: Union Type
// Bisa berupa Object (Bank: "atm", "mbanking") ATAU Array (Retail: List langsung)
export type PaymentInstructions = 
  | Record<string, InstructionGroup[]> 
  | InstructionGroup[];

// ==========================================
// 2. API DTOs
// ==========================================

export interface InitiatePaymentRequest {
  order_id: string;
  payment_method: string; // "BCA", "MANDIRI", "ALFAMART", dll
  payment_type: BackendPaymentType;
}

export interface InitiatePaymentResponse {
  order_id: string;
  payment_method: string;

  // Field dinamis dari Xendit
  payment_code?: string; // VA Number / Payment Code
  qr_string?: string;    // QR String
  deep_link?: string;    // E-Wallet Link

  amount: number;
  expiry_time: string;
  status: string; 
}