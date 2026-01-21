/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/paymentService.ts

import { api } from '../lib/axios';
import { ApiResponse } from '../types/api';
import { InitiatePaymentRequest, InitiatePaymentResponse } from '../types/payment';

export const paymentService = {
    // 1. Initiate Payment (POST)
    // Request: Order ID & Payment Method
    // Response: Payment Code (VA/QR) & Expiry Time (Sync with Booking)
    initiatePayment: async (payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
        try {
            console.log("📤 Initiating Payment:", JSON.stringify(payload, null, 2));
            const response = await api.post<ApiResponse<InitiatePaymentResponse>>('/payments/initiate', payload);
            console.log("📥 Initiate Payment Success:", response.data);
            
            return response.data.data;
        } catch (error: any) {
            console.error("❌ Payment Initiation Failed:", error.response?.data || error.message);
            throw error;
        }
    }

    // Note: Tidak ada endpoint check status khusus di payment service backend.
    // Frontend disarankan menggunakan bookingService.getMyBookings() untuk polling status.
};