// src/components/sections/WhyEzytixSection.tsx
import React from "react";
import { FeatureCard } from "../ui/FeatureCard";
import { FiCheckCircle } from "react-icons/fi";

export const WhyEzytixSection: React.FC = () => {
    const features = [
        {
            icon: <FiCheckCircle />,
            title: "Diversity in choice",
            description:
                "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
        },
        {
            icon: <FiCheckCircle />,
            title: "Diversity in choice",
            description:
                "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
        },
        {
            icon: <FiCheckCircle />,
            title: "Diversity in choice",
            description:
                "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
        },
        {
            icon: <FiCheckCircle />,
            title: "Diversity in choice",
            description:
                "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
        },
    ];

    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                {/* TITLE */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-900">
                    Kenapa Harus Ezytix?
                </h2>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((item, idx) => (
                        <FeatureCard
                            key={idx}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
