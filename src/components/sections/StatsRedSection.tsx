// src/components/sections/StatsRedSection.tsx
import React from "react";
import { StatRedCard } from "../ui/StatRedCard";
import { FiUsers, FiMap, FiAirplay, FiBookOpen } from "react-icons/fi";

export const StatsRedSection: React.FC = () => {
    const stats = [
        { icon: <FiUsers />, value: "15 Ribu+", label: "Klien Puas" },
        { icon: <FiAirplay />, value: "90+", label: "Destinasi" },
        { icon: <FiMap />, value: "10 Ribu+", label: "Pelanggan" },
        { icon: <FiBookOpen />, value: "10 Ribu+", label: "Tempat Wisata" },
    ];

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((item, idx) => (
                        <StatRedCard
                            key={idx}
                            icon={item.icon}
                            value={item.value}
                            label={item.label}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};
