import React from "react";
import { useAuth } from "../../../context/AuthContext";

export const AdminHeader: React.FC = () => {
    const { user } = useAuth();
    
    // Ambil nama dari context, fallback ke "Super Admin" kalau belum load
    const userName = user?.full_name || "Super Admin";
    // Logic inisial: "Anton Maraton" -> "AM"
    const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                </div>
                <span className="text-sm font-medium text-gray-900">{userName}</span>
            </div>
        </header>
    );
};