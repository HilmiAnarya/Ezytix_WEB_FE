/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/userService.ts

import { api } from '../lib/axios'; // Sesuaikan import axios instance kamu
import { User, UpdateProfileRequest } from '../types/user';

export const userService = {
    // 1. Mengambil data profil user saat ini
    getProfile: async (): Promise<User> => {
        try {
            // Endpoint: GET /api/v1/auth/me
            const response = await api.get<User>('/auth/me');
            return response.data;
        } catch (error: any) {
            console.error("❌ Failed to fetch profile:", error.response?.data?.error || error.message);
            throw error;
        }
    },

    // 2. Memperbarui data profil
    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        try {
            // Endpoint: PUT /api/v1/auth/profile
            const response = await api.put<{ message: string; user: User }>('/auth/profile', data);
            return response.data.user;
        } catch (error: any) {
            console.error("❌ Failed to update profile:", error.response?.data?.error || error.message);
            throw error;
        }
    },

    // 3. Logout dari sistem
    logout: async (): Promise<void> => {
        try {
            // Endpoint: POST /api/v1/auth/logout
            await api.post('/auth/logout');
        } catch (error: any) {
            console.error("❌ Logout failed:", error.response?.data?.error || error.message);
            throw error;
        }
    }
};