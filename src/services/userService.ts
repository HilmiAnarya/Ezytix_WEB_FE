/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';
import { User, UpdateProfileRequest } from '../types/user';

export const userService = {
    getProfile: async (): Promise<User> => {
        try {
            const response = await api.get<User>('/auth/me');
            return response.data;
        } catch (error: any) {
            console.error("❌ Failed to fetch profile:", error.response?.data?.error || error.message);
            throw error;
        }
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        try {
            const response = await api.put<{ message: string; user: User }>('/auth/profile', data);
            return response.data.user;
        } catch (error: any) {
            console.error("❌ Failed to update profile:", error.response?.data?.error || error.message);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error: any) {
            console.error("❌ Logout failed:", error.response?.data?.error || error.message);
            throw error;
        }
    }
};