import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import WhiteLogo from "../../assets/images/ezywhite.png";
import RedLogo from "../../assets/images/ezyred.png";

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const { user } = useAuth();
    //const location = useLocation();

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
        { label: "Pesan Tiket", href: "/tiket" },
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
                    ? "bg-white shadow-md"
                    : "bg-transparent backdrop-blur-md"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={isScrolled ? RedLogo : WhiteLogo}
                        alt="Ezytix Logo"
                        className="h-9 w-auto transition-all"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`transition ${
                                isScrolled
                                    ? "text-gray-800 hover:text-black"
                                    : "text-white/90 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* If user logged in */}
                    {user && (
                        <Link
                            to="/riwayat"
                            className={`transition ${
                                isScrolled
                                    ? "text-gray-800 hover:text-black"
                                    : "text-white/90 hover:text-white"
                            }`}
                        >
                            Riwayat Pemesanan
                        </Link>
                    )}
                </nav>

                {/* Right Menu (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-lg border transition ${
                                    isScrolled
                                        ? "border-gray-600 text-gray-900 hover:bg-gray-200"
                                        : "border-white text-white hover:bg-white/20"
                                }`}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/profile"
                            className="flex items-center gap-2"
                        >
                            <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                                {getInitial(user.full_name)}
                            </div>
                            
                            <span
                                className={`text-sm ${
                                    isScrolled ? "text-black" : "text-white"
                                }`}
                            >
                                {user.full_name}
                            </span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex flex-col gap-[4px]"
                    onClick={() => setOpenMobile(!openMobile)}
                >
                    <span
                        className={`block w-6 h-[3px] rounded ${
                            isScrolled ? "bg-black" : "bg-white"
                        }`}
                    ></span>
                    <span
                        className={`block w-6 h-[3px] rounded ${
                            isScrolled ? "bg-black" : "bg-white"
                        }`}
                    ></span>
                    <span
                        className={`block w-6 h-[3px] rounded ${
                            isScrolled ? "bg-black" : "bg-white"
                        }`}
                    ></span>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {openMobile && (
                <div
                    className={`md:hidden p-4 space-y-4 transition ${
                        isScrolled
                            ? "bg-white shadow"
                            : "bg-white/80 backdrop-blur-md"
                    }`}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="block text-gray-800 font-medium"
                            onClick={() => setOpenMobile(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <Link
                                to="/riwayat"
                                className="block text-gray-800 font-medium"
                                onClick={() => setOpenMobile(false)}
                            >
                                Riwayat Pemesanan
                            </Link>

                            <Link
                                to="/profile"
                                onClick={() => setOpenMobile(false)}
                                className="flex items-center gap-3 mt-3"
                            >
                                <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                                    {getInitial(user.full_name)}
                                </div>
                                <span className="text-gray-800 font-medium">
                                    {user.full_name}
                                </span>
                            </Link>
                        </>
                    ) : (
                        <div className="flex gap-3 pt-2">
                            <Link
                                to="/login"
                                className="flex-1 px-4 py-2 border border-gray-400 rounded-lg text-center"
                                onClick={() => setOpenMobile(false)}
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/register"
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-center"
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
