import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ezyRed from "../../assets/images/ezyred.png"; // Logo Merah (Wajib untuk background putih)
import { FiMenu, FiX } from "react-icons/fi";

export const SearchResultsNavbar: React.FC = () => {
    const [openMobile, setOpenMobile] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const getInitial = (name?: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Jadi Partner", href: "/partner" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={ezyRed}
                        alt="Ezytix Logo"
                        className="h-8 md:h-9 w-auto hover:opacity-80 transition"
                    />
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="hover:text-red-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user && (
                        <Link to="/riwayat" className="hover:text-red-600 transition-colors">
                            Riwayat Pemesanan
                        </Link>
                    )}
                </nav>
                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:border-red-600 hover:text-red-600 transition"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-md shadow-red-100 transition"
                            >
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                            >
                                <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-red-600 transition-colors">
                                    {getInitial(user.full_name)}
                                </div>
                                <span className="text-sm font-bold text-gray-700 group-hover:text-red-600 transition-colors max-w-[120px] truncate">
                                    {user.full_name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="md:hidden text-2xl text-gray-700 hover:text-red-600 transition"
                    onClick={() => setOpenMobile(!openMobile)}
                >
                    {openMobile ? <FiX /> : <FiMenu />}
                </button>
            </div>
            {openMobile && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg p-4 flex flex-col gap-4 animate-fadeIn">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-red-600"
                            onClick={() => setOpenMobile(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/riwayat" className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-red-600" onClick={() => setOpenMobile(false)}>
                                Riwayat Pemesanan
                            </Link>
                            <Link to="/profile" className="flex items-center gap-3 py-2 mt-2" onClick={() => setOpenMobile(false)}>
                                <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                                    {getInitial(user.full_name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800">{user.full_name}</span>
                                    <span className="text-xs text-gray-500">Lihat Profil</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => { logout(); setOpenMobile(false); }}
                                className="text-left text-red-600 font-bold text-sm mt-2"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link to="/login" className="w-full py-2.5 text-center border border-gray-300 rounded-lg font-bold text-gray-700 hover:border-red-600 hover:text-red-600" onClick={() => setOpenMobile(false)}>
                                Masuk
                            </Link>
                            <Link to="/register" className="w-full py-2.5 text-center bg-red-600 text-white rounded-lg font-bold hover:bg-red-700" onClick={() => setOpenMobile(false)}>
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};