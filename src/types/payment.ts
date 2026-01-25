// src/types/payment.ts

export type PaymentType = 'bank_transfer' | 'echannel' | 'qris' | 'gopay';

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
    
    // Tipe pembayaran wajib
    payment_type: PaymentType;
    
    // Opsional: Hanya diisi jika payment_type = 'bank_transfer'
    // Value: 'bca', 'bni', 'bri', 'permata'
    bank?: string; 
}

export interface InitiatePaymentResponse {
    order_id: string;
    transaction_id: string;
    payment_type: string;
    amount: number;
    transaction_status: string;
    expiry_time: string; // Format: "2026-01-25 15:00:00 -0700"

    // [FIELD DINAMIS] 
    // Backend hanya akan mengisi salah satu object di bawah ini
    // tergantung metode yang dipilih user.
    
    // Case: BCA, BNI, BRI, Permata
    virtual_account?: {
        bank: string;
        va_number: string;
    };

    // Case: Mandiri Bill
    mandiri_bill?: {
        bill_key: string;
        biller_code: string;
    };

    // Case: QRIS
    qris?: {
        qr_url: string;
    };

    // Case: GoPay (DeepLink)
    gopay?: {
        deeplink: string;
    };
}