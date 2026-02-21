import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white rounded-lg p-6 min-w-[200px] border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};