// src/components/layout/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#111] text-white py-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT TEXT */}
                <p className="text-sm text-gray-400 max-w-xs">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                </p>

                {/* CENTER LOGO */}
                <div className="text-3xl font-semibold text-white text-center">
                    Ezy<span className="text-gray-300">tix</span>
                </div>

                {/* RIGHT TEXT */}
                <p className="text-sm text-gray-400 max-w-xs text-right md:text-right">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                    faucibus ex sapien vitae pellentesque sem placerat.
                </p>

            </div>
        </footer>
    );
};
