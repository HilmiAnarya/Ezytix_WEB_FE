/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { StatCard } from "../../components/features/admin/StatCard";
import { adminService, DashboardStats } from "../../services/adminService";

export const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Gagal memuat data statistik dari server");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <FiLoader className="animate-spin text-3xl text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                <p className="font-semibold">Terjadi Kesalahan</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Customer Registered" 
                    value={stats?.customers_registered || 0} 
                />
                <StatCard 
                    title="Flights Booked Today" 
                    value={stats?.flights_booked_today || 0} 
                />
                <StatCard 
                    title="Revenue Today" 
                    value={formatRupiah(stats?.revenue_today || 0)} 
                />
            </div>
        </div>
    );
};