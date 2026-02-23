/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';

export interface DashboardStats {
    customers_registered: number;
    flights_booked_today: number;
    revenue_today: number;
}

export const adminService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return response.data.data;
        } catch (error: any) {
            console.error("❌ Failed to fetch dashboard stats:", error);
            throw error;
        }
    }
};