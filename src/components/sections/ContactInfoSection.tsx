// src/components/sections/ContactInfoSection.tsx
import React from "react";
import { FiMapPin, FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";

export const ContactInfoSection: React.FC = () => {
    const infoList = [
        {
            icon: <FiMapPin />,
            title: "PT MEGA GAPURA PERKASA",
            value: "Business Park Kirana - Cawang",
        },
        {
            icon: <FiMail />,
            title: "Email",
            value: "info@ezytix.com",
        },
        {
            icon: <FiPhone />,
            title: "Telepon",
            value: "0853-6282-8239",
        },
        {
            icon: <FiMessageCircle />,
            title: "WhatsApp",
            value: "0853-6282-8239",
        },
    ];

    return (
        <section className="relative w-full bg-red-600 text-white pt-24 pb-32 overflow-hidden">

            {/* GRID UTAMA */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                {/* MAP */}
                <div className="w-full flex justify-center md:justify-start">
                    <img
                        src="/assets/images/map-placeholder.jpg"  // ganti dengan map milikmu sendiri
                        alt="Map"
                        className="rounded-2xl w-full max-w-md shadow-xl object-cover"
                    />
                </div>

                {/* TEXT CONTENT */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest">CEPAT DAN AMAN</h3>

                    <h2 className="text-3xl md:text-4xl font-bold mt-2">
                        Lorem Ipsum
                    </h2>

                    <p className="text-white/90 leading-relaxed mt-4">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                        faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
                        pretium tellus duis convallis. Tempus leo eu aenean sed diam urna.
                    </p>

                    <p className="text-white/90 leading-relaxed mt-4">
                        Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Massa
                        nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
                        vel class aptent taciti sociosqu.
                    </p>
                </div>

            </div>

            {/* INFO BOXES */}
            <div className="max-w-5xl mx-auto px-4 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                {infoList.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl py-6 px-4 text-center shadow-lg"
                    >
                        <div className="text-3xl mb-3 flex justify-center">
                            {item.icon}
                        </div>

                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-sm mt-1 opacity-90">{item.value}</p>
                    </div>
                ))}

            </div>

            {/* PUTIH BAWAH (WAVE / DIAGONAL) */}
            <div className="absolute bottom-0 left-0 w-full h-[110px] bg-white rotate-[3deg] origin-bottom-left"></div>
        </section>
    );
};
