import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import WhiteLogo from "../../assets/images/ezywhite.png";
import RedLogo from "../../assets/images/ezyred.png";

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const { user } = useAuth();

    // scroll logic
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Jadi Partner", href: "/partner" },
    ];

    // get initial letter from name
    const getInitial = (name?: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white shadow-md py-2" // Sedikit padding saat scroll agar elegan
                    : "bg-transparent backdrop-blur-sm py-4" // Padding lebih lega saat transparan
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={isScrolled ? RedLogo : WhiteLogo}
                        alt="Ezytix Logo"
                        className="h-8 md:h-9 w-auto transition-all transform hover:scale-105"
                    />
                </Link>

                {/* Desktop Navigation - GAYA BARU (Berjarak & Pill Shape) */}
                <nav className="hidden md:flex items-center gap-4"> 
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                isScrolled
                                    ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                    : "text-white/90 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* If user logged in */}
                    {user && (
                        <Link
                            to="/history"
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                isScrolled
                                    ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                    : "text-white/90 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            Riwayat Pemesanan
                        </Link>
                    )}
                </nav>

                {/* Right Menu (Desktop) - Berjarak Tegas */}
                <div className="hidden md:flex items-center gap-5">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                                    isScrolled
                                        ? "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
                                        : "border-white/40 text-white hover:bg-white/10 hover:border-white"
                                }`}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 rounded-full text-sm font-bold bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <Link
                            // [DIUBAH DISINI] Jika role admin, arahkan ke /admin
                            to={user.role === "admin" ? "/admin" : "/profile"}
                            className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-300 group ${
                                isScrolled 
                                    ? "border-gray-200 bg-gray-50 hover:border-red-200" 
                                    : "border-white/20 bg-black/10 hover:bg-black/20 text-white"
                            }`}
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                                {getInitial(user.full_name)}
                            </div>
                            <span className={`text-sm font-semibold max-w-[100px] truncate ${isScrolled ? "text-gray-700 group-hover:text-red-600" : "text-white"}`}>
                                {user.full_name}
                            </span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setOpenMobile(!openMobile)}
                >
                    <span className={`block w-6 h-0.5 rounded-full transition-all ${isScrolled ? "bg-gray-800" : "bg-white"}`}></span>
                    <span className={`block w-6 h-0.5 rounded-full transition-all ${isScrolled ? "bg-gray-800" : "bg-white"}`}></span>
                    <span className={`block w-6 h-0.5 rounded-full transition-all ${isScrolled ? "bg-gray-800" : "bg-white"}`}></span>
                </button>
            </div>

            {/* Mobile Dropdown - Tampilan lebih bersih */}
            {openMobile && (
                <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 fade-in duration-200">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="block text-gray-600 font-semibold text-lg hover:text-red-600 transition-colors border-b border-gray-100 pb-2"
                            onClick={() => setOpenMobile(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <Link
                                to="/history"
                                className="block text-gray-600 font-semibold text-lg hover:text-red-600 transition-colors border-b border-gray-100 pb-2"
                                onClick={() => setOpenMobile(false)}
                            >
                                Riwayat Pemesanan
                            </Link>

                            <Link
                                // [DIUBAH DISINI] Jika role admin, arahkan ke /admin
                                to={user.role === "admin" ? "/admin" : "/profile"}
                                onClick={() => setOpenMobile(false)}
                                className="flex items-center gap-4 mt-4 p-3 bg-gray-50 rounded-xl"
                            >
                                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                    {getInitial(user.full_name)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-bold">{user.full_name}</span>
                                    {/* [DIUBAH DISINI] Teks keterangan menyesuaikan role */}
                                    <span className="text-xs text-gray-500">
                                        {user.role === "admin" ? "Buka Admin Panel" : "Lihat Profil"}
                                    </span>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Link
                                to="/login"
                                className="px-4 py-3 rounded-xl border border-gray-300 text-center font-bold text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenMobile(false)}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-3 rounded-xl bg-red-600 text-center font-bold text-white hover:bg-red-700 shadow-md"
                                onClick={() => setOpenMobile(false)}
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};