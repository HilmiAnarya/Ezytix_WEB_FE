// src/components/ui/StatRedCard.tsx
import React from "react";

interface StatRedCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

export const StatRedCard: React.FC<StatRedCardProps> = ({
    icon,
    value,
    label,
}) => {
    return (
        <div className="bg-red-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition">
            <div className="text-3xl mb-3">
                {icon}
            </div>

            <p className="text-2xl font-bold">{value}</p>

            <p className="text-sm opacity-90 mt-1">{label}</p>
        </div>
    );
};
