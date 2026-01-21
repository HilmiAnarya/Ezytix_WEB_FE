/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/bookingService.ts

import { api } from '../lib/axios';
import { CreateBookingRequest, CreateBookingResponse, Booking } from '../types/booking';
import { ApiResponse } from '../types/api';

export const bookingService = {
    // 1. Create Booking (POST)
    // Response: Order ID & Expiry Time (Strict Expiry)
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

    // 2. Get Booking History (GET)
    // Response: List Booking dengan status & expiry
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
    }
};