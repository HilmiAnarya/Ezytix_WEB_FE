// src/components/sections/CtaRedSection.tsx
import React from "react";

export const CtaRedSection: React.FC = () => {
    return (
        <section className="w-full bg-red-600 relative pt-20 pb-32 text-white overflow-hidden">

            {/* TOP CONTENT */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* LEFT: Laptop Mockup */}
                <div className="flex justify-center md:justify-start">
                    <img
                        src="/assets/images/laptop-mockup.png" // ← kamu ganti sendiri
                        alt="Laptop Mockup"
                        className="w-[90%] md:w-[420px] object-contain drop-shadow-2xl"
                    />
                </div>

                {/* RIGHT: Text Content */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest">CEPAT DAN AMAN</h3>

                    <h2 className="text-3xl md:text-4xl font-bold mt-2">
                        Lorem Ipsum
                    </h2>

                    <p className="text-white/90 leading-relaxed mt-4">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                        faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
                        pretium tellus duis convallis.
                    </p>

                    <p className="text-white/90 leading-relaxed mt-4">
                        Pulvinar vivamus fringilla lacus nec metus bibendum egestas. lacus
                        massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
                        semper vel class aptent taciti sociosqu.
                    </p>
                </div>
            </div>

            {/* PLANE IMAGE OVERLAPPING */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-[85%] md:w-[70%] lg:w-[55%] pointer-events-none">
                <img
                    src="/assets/images/your-plane.png" // ← kamu ganti sendiri
                    alt="Plane"
                    className="w-full object-contain drop-shadow-2xl"
                />
            </div>

            {/* WHITE ANGLE SLICE EFFECT */}
            <div className="absolute bottom-0 left-0 w-full h-[120px] bg-white rotate-[-4deg] origin-bottom-left"></div>

        </section>
    );
};
