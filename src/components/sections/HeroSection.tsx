// src/components/sections/HeroSection.tsx
import React from "react";
import { SearchBox } from "./SearchBox";

export const HeroSection: React.FC = () => {
    return (
        <section
            className="relative w-full h-[500px] flex items-center justify-center text-center"
            style={{
                backgroundImage: "url('../../assets/images/hero-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* TEXT */}
            <div className="relative z-10 text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold">
                    BUTUH TIKET PESAWAT?
                </h1>
                <h1 className="text-3xl md:text-5xl font-bold mt-2">
                    EZYTIX AJA
                </h1>
            </div>

            {/* SEARCHBOX FLOATING */}
            <div className="absolute bottom-[-70px] w-full px-4">
                <SearchBox />
            </div>
        </section>
    );
};
