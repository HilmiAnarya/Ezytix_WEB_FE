/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';
import { ApiResponse } from '../types/api';
import { InitiatePaymentRequest, InitiatePaymentResponse } from '../types/payment';

export const paymentService = {
    initiatePayment: async (payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
        try {
            console.log("🚀 Initiating Payment...");
            console.log("📤 Payload:", JSON.stringify(payload, null, 2));
            const response = await api.post<ApiResponse<InitiatePaymentResponse>>('/payments/initiate', payload);
            
            console.log("✅ Payment Initiated:", response.data.data);
            return response.data.data;
        } catch (error: any) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            console.error(`❌ Payment Initiation Failed (${status}):`, message);

            throw error;
        }
    },

    getPaymentByOrderId: async (orderId: string): Promise<ApiResponse<InitiatePaymentResponse>> => {
        const response = await api.get<ApiResponse<InitiatePaymentResponse>>(`/payments/orders/${orderId}`);
        return response.data;
    },

    cancelPayment: async (orderId: string): Promise<any> => {
        try {
            console.log(`⚠️ Requesting cancellation for Order ID: ${orderId}`);
            const response = await api.post(`/payments/orders/${orderId}/cancel`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.warn("⚠️ Transaction not found, maybe already cleared.");
                return { status: "success" };
            }
            console.error(`❌ Cancel Payment Failed:`, error.response?.data?.message || error.message);
            throw error;
        }
    }
};