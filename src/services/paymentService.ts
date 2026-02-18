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
    },

    // 2. [BARU] Get Payment Status by Order ID
    // Digunakan untuk mengecek apakah order ini sedang memiliki transaksi pending
    getPaymentByOrderId: async (orderId: string): Promise<ApiResponse<InitiatePaymentResponse>> => {
        // Endpoint: GET /api/v1/payments/orders/:orderId
        // Backend kamu sudah punya route ini (h.GetPaymentStatus)
        const response = await api.get<ApiResponse<InitiatePaymentResponse>>(`/payments/orders/${orderId}`);
        return response.data;
    },

    // 3. [BARU] Cancel Payment
    // Digunakan saat user ingin mengganti metode pembayaran.
    // Kita harus cancel yang lama dulu sebelum initiate yang baru.
    cancelPayment: async (orderId: string): Promise<any> => {
        try {
            console.log(`⚠️ Requesting cancellation for Order ID: ${orderId}`);
            // [SYNCED] Endpoint sesuai Backend: POST /api/v1/payments/orders/:orderID/cancel
            const response = await api.post(`/payments/orders/${orderId}/cancel`);
            return response.data;
        } catch (error: any) {
            // Jika error 404 (sudah tidak ada record), kita anggap sukses saja karena tujuannya memang membersihkan
            if (error.response?.status === 404) {
                console.warn("⚠️ Transaction not found, maybe already cleared.");
                return { status: "success" };
            }
            console.error(`❌ Cancel Payment Failed:`, error.response?.data?.message || error.message);
            throw error;
        }
    }
};