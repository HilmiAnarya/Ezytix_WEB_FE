// src/components/sections/AboutSection.tsx
import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* LEFT IMAGE */}
        <div className="w-full">
          <img
            src="/assets/images/about-plane.jpg"
            alt="Pesawat"
            className="w-full h-auto rounded-3xl shadow-lg object-cover"
          />
        </div>

        {/* RIGHT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tentang Ezytix
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Pulvinar vivamus fringilla lacus nec metus bibendum egestas. lacus
            massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
            semper vel class eget praesent. Auctor id tortor torquent per conubia
            nostra inceptos himenaeos.
          </p>
        </div>

      </div>
    </section>
  );
};
