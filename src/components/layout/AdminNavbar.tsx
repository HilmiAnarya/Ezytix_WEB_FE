import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import RedLogo from "../../assets/images/ezyred.png";

const AdminNavbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);

    const getInitial = (name?: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src={RedLogo} alt="Ezytix Logo" className="h-9 w-auto" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-gray-800 hover:text-black">Home</Link>
                    <Link to="/tiket" className="text-gray-800 hover:text-black">Pesan Tiket</Link>
                    <Link to="/partner" className="text-gray-800 hover:text-black">Jadi Partner</Link>
                    <Link to="/riwayat" className="text-gray-800 hover:text-black">Riwayat Pemesanan</Link>
                </nav>

                {/* Right User Section */}
                <div className="hidden md:flex items-center relative">
                    {user && (
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="flex items-center gap-2"
                        >
                            <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                                {getInitial(user.full_name)}
                            </div>

                            <span className="text-sm text-gray-900">{user.full_name}</span>

                            <span className="text-xs text-gray-600">▾</span>
                        </button>
                    )}

                    {/* Dropdown */}
                    {openDropdown && (
                        <div className="absolute top-12 right-0 w-36 bg-white shadow-lg rounded-lg border">
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex flex-col gap-[4px]"
                    onClick={() => setOpenMobile(!openMobile)}
                >
                    <span className="block w-6 h-[3px] bg-black rounded"></span>
                    <span className="block w-6 h-[3px] bg-black rounded"></span>
                    <span className="block w-6 h-[3px] bg-black rounded"></span>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {openMobile && (
                <div className="md:hidden bg-white p-4 space-y-4 shadow">

                    <Link to="/" className="block text-gray-800 font-medium" onClick={() => setOpenMobile(false)}>
                        Home
                    </Link>

                    <Link to="/tiket" className="block text-gray-800 font-medium" onClick={() => setOpenMobile(false)}>
                        Pesan Tiket
                    </Link>

                    <Link to="/partner" className="block text-gray-800 font-medium" onClick={() => setOpenMobile(false)}>
                        Jadi Partner
                    </Link>

                    <Link to="/riwayat" className="block text-gray-800 font-medium" onClick={() => setOpenMobile(false)}>
                        Riwayat Pemesanan
                    </Link>

                    {/* Mobile User */}
                    {user && (
                        <button
                            onClick={logout}
                            className="w-full text-left py-2 text-red-600 font-medium hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default AdminNavbar;
