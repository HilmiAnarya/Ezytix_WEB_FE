// src/components/layout/Navbar.tsx
import React, { useState } from "react";

export const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "#" },
        { label: "Pesan Tiket", href: "#" },
        { label: "Jadi Partner", href: "#" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* LOGO */}
                <div className="text-2xl font-semibold text-[#0D60FF]">
                    Ezy<span className="text-black">tix</span>
                </div>

                {/* NAV (DESKTOP) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navItems.map((item) => (
                        <a key={item.label} href={item.href} className="text-gray-800 hover:text-black">
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* ACTION BUTTONS */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200">
                        Masuk
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Daftar
                    </button>
                </div>

                {/* MOBILE BUTTON */}
                <button
                    className="md:hidden flex flex-col gap-[3px]"
                    onClick={() => setOpen(!open)}
                >
                    <span className="block w-6 h-[2px] bg-black"></span>
                    <span className="block w-6 h-[2px] bg-black"></span>
                    <span className="block w-6 h-[2px] bg-black"></span>
                </button>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden bg-white/80 backdrop-blur-md shadow-md p-4 space-y-4">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="block text-gray-800 font-medium"
                        >
                            {item.label}
                        </a>
                    ))}

                    <div className="flex gap-3 pt-2">
                        <button className="flex-1 px-4 py-2 border border-gray-400 rounded-lg">
                            Masuk
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg">
                            Daftar
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
