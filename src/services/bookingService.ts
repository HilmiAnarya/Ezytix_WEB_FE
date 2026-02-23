/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';
import { CreateBookingRequest, CreateBookingResponse, Booking } from '../types/booking';
import { ApiResponse } from '../types/api';

export const bookingService = {
    createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
        try {
            console.log("📤 Sending Booking Payload:", JSON.stringify(payload, null, 2));
            const response = await api.post<ApiResponse<CreateBookingResponse>>('/bookings', payload);
            console.log("📥 Booking Success Response:", response.data);
            return response.data.data;
        } catch (error: any) {
            console.error("❌ Booking Failed:", error.response?.data || error.message);
            throw error;
        }
    },

    getMyBookings: async (): Promise<Booking[]> => {
        try {
            console.log("📤 Fetching Booking History...");
            const response = await api.get<ApiResponse<Booking[]>>('/bookings/history');
            console.log("📥 History Response:", response.data);
            return response.data.data;
        } catch (error: any) {
            console.error("❌ Fetch History Failed:", error.response?.data || error.message);
            throw error; 
        }
    },

    getBookingByOrderId: async (orderId: string): Promise<Booking> => {
        try {
            const response = await api.get<ApiResponse<Booking>>(`/bookings/${orderId}`);
            return response.data.data;
        } catch (error: any) {
            console.error(`❌ Fetch Booking ${orderId} Failed:`, error.response?.data || error.message);
            throw error;
        }
    },

    downloadInvoice: async (orderId: string): Promise<Blob> => {
    const response = await api.get(`/bookings/${orderId}/invoice`, {
        responseType: 'blob',
    });
    return response.data;
    },

    downloadEticket: async (bookingCode: string): Promise<Blob> => {
    const response = await api.get(`/bookings/${bookingCode}/eticket`, {
        responseType: 'blob',
    });
    return response.data;
    }
};