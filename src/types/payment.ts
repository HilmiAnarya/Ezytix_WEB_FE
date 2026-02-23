export type PaymentType = 'bank_transfer' | 'echannel' | 'qris' | 'gopay';

export type InstructionSteps = Record<string, string>;

export interface InstructionGroup {
  title: string;
  steps: InstructionSteps;
  is_unordered?: boolean;
}

export type PaymentInstructions = 
  | Record<string, InstructionGroup[]> 
  | InstructionGroup[];

export interface InitiatePaymentRequest {
    order_id: string;
    payment_type: PaymentType;
    bank?: string; 
}

export interface InitiatePaymentResponse {
    order_id: string;
    transaction_id: string;
    payment_type: string;
    amount: number;
    transaction_status: string;
    expiry_time: string;
    virtual_account?: {
        bank: string;
        va_number: string;
    };

    mandiri_bill?: {
        bill_key: string;
        biller_code: string;
    };

    qris?: {
        qr_url: string;
    };

    gopay?: {
        deeplink: string;
    };
}