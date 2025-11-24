// src/components/ui/FeatureCard.tsx
import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
}) => {
    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <div className="w-14 h-14 flex items-center justify-center bg-red-500 text-white rounded-xl mb-4 text-2xl">
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
                {title}
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-[250px]">
                {description}
            </p>
        </div>
    );
};
