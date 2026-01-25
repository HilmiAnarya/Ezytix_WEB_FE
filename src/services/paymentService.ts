/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/paymentService.ts

import { api } from '../lib/axios';
import { ApiResponse } from '../types/api';
import { InitiatePaymentRequest, InitiatePaymentResponse } from '../types/payment';

export const paymentService = {
    // 1. Initiate Payment (POST)
    // Request: Order ID & Payment Type (Sesuai DTO Backend)
    // Response: Data dinamis (VA/QR/BillKey) & Expiry Time
    initiatePayment: async (payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
        try {
            console.log("🚀 Initiating Payment...");
            console.log("📤 Payload:", JSON.stringify(payload, null, 2));
            
            // Endpoint ini mengarah ke: POST http://localhost:8080/api/v1/payments/initiate
            const response = await api.post<ApiResponse<InitiatePaymentResponse>>('/payments/initiate', payload);
            
            console.log("✅ Payment Initiated:", response.data.data);
            return response.data.data;
        } catch (error: any) {
            // Error Handling Spesifik Midtrans
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            console.error(`❌ Payment Initiation Failed (${status}):`, message);
            
            // Optional: Kita bisa throw error object yang lebih rapi jika mau
            throw error;
        }
    }

    // Catatan:
    // Tidak ada method checkStatus() di sini karena kita menggunakan 
    // bookingService.getBookingByOrderId() untuk Polling status pembayaran.
};