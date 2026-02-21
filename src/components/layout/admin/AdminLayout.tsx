// src/components/layout/admin/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export const AdminLayout: React.FC = () => {
    // Logic Proteksi (if !user dll) SUDAH DIHAPUS karena sudah ditangani oleh AdminRoute.tsx
    
    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar Kiri (Fixed width 280px) */}
            <AdminSidebar />
            
            {/* Konten Kanan (Margin left 280px agar tidak tertutup sidebar) */}
            <div className="flex-1 flex flex-col ml-[280px]">
                <AdminHeader />
                
                {/* <Outlet /> akan me-render AdminDashboardPage atau AdminContentPage */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};