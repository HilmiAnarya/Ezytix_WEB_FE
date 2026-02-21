import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Monitor, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

import RedLogo from "../../../assets/images/ezyred.png";

// Contoh Menu CMS yang sebenarnya
const cmsItems = [
    { title: "Flights Data", url: "/admin/flights" },
    { title: "Bookings Data", url: "/admin/bookings" },
    { title: "Users Data", url: "/admin/users" },
];

export const AdminSidebar: React.FC = () => {
    const [cmsOpen, setCmsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Deteksi menu aktif
    const isActive = (path: string) => location.pathname === path;
    const isCmsActive = cmsItems.some((item) => isActive(item.url));

    // Handle Logout
    const handleLogout = async () => {
        if (window.confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
            await logout();
            navigate("/login");
        }
    };

    return (
        <aside className="w-[280px] min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
            {/* Logo */}
            <Link 
                to="/" 
                className="flex items-center justify-center h-16 border-b border-gray-200/50 hover:bg-gray-100/50 transition-colors"
            >
                <img src={RedLogo} alt="Ezytix Logo" className="h-12 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {/* Dashboard */}
                <NavLink
                    to="/admin"
                    end
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive("/admin")
                            ? "bg-red-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <Home className="h-5 w-5" />
                    Dashboard
                </NavLink>

                {/* CMS Dropdown */}
                <div className="pt-2">
                    <button
                        onClick={() => setCmsOpen(!cmsOpen)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isCmsActive && !cmsOpen
                                ? "text-red-600"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <Monitor className="h-5 w-5" />
                        <span className="flex-1 text-left">Data Management</span>
                        {cmsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {cmsOpen && (
                        <div className="ml-9 mt-1 space-y-1">
                            {cmsItems.map((item) => (
                                <NavLink
                                    key={item.url}
                                    to={item.url}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 rounded-lg text-sm transition-colors ${
                                            isActive
                                                ? "bg-red-100 text-red-700 font-semibold"
                                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                        }`
                                    }
                                >
                                    {item.title}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout */}
            <div className="px-4 pb-6 mt-auto">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};