import React from "react";
import { useLocation } from "react-router-dom";

export const AdminContentPage: React.FC = () => {
    const location = useLocation();
    
    // Mengambil kata terakhir dari URL untuk dijadikan Judul (contoh: /admin/flights -> flights)
    const contentName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Content";

    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 capitalize mb-2">{contentName} Data</h2>
                <p className="text-gray-500">Modul ini sedang dalam tahap pengembangan (Work in Progress).</p>
                <p className="text-sm text-gray-400 mt-4">Path: {location.pathname}</p>
            </div>
        </div>
    );
};